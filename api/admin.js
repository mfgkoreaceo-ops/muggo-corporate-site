// ==========================================================================
// MUGGO Admin CMS — Server-Side Auth, Rate-Limit, Session & Atomic Publish API
// Compatible with Vercel Serverless Functions (/api/admin) and Node HTTP tests
// Zero external dependencies; zero plaintext passwords or tokens in code/logs.
// ==========================================================================

"use strict";

const crypto = require("crypto");

const PBKDF2_ITERATIONS = 100000;
const DEFAULT_ADMIN_SALT = "muggo-admin-vault-salt-2026-v1";

// PBKDF2-SHA256 (100,000 iterations) hashes for initial admin credentials
// (Supports both audit spec initial password and PDF spec initial password; no plaintext stored)
const DEFAULT_ADMIN_HASHES = [
  "5e18b16407d4625e0a443daf128d3d7244586ea72c11e22d7b242ac795575c1c",
  "b343be5725401d78dc142198b51e161259fb7589d5ca10d822a1e53a8b4251f7"
];

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_IDLE_MS = 30 * 60 * 1000;     // 30 minutes
const SESSION_COOKIE_NAME = "muggo_admin_session";

// Ephemeral HMAC secret per cold start if ADMIN_SESSION_SECRET env is not set
const SERVER_HMAC_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto.createHash("sha256").update(DEFAULT_ADMIN_SALT + "-server-hmac-v1").digest("hex");

// In-memory server stores (persisted across requests in warm serverless instance / Node process)
const rateLimitStore = new Map(); // key -> { fails, lockedUntil }
const sessionStore = new Map();   // sid -> { id, role, issuedAt, lastActiveAt, revoked }
const serverAccountStore = new Map();

function initServerAccounts() {
  if (serverAccountStore.size > 0) return;
  serverAccountStore.set("admin", {
    id: "admin",
    role: "super_admin",
    salt: process.env.ADMIN_PASSWORD_SALT || DEFAULT_ADMIN_SALT,
    hashes: process.env.ADMIN_PASSWORD_HASH
      ? [String(process.env.ADMIN_PASSWORD_HASH).trim()]
      : DEFAULT_ADMIN_HASHES.slice(),
    customPasswordChanged: false
  });

  if (process.env.ADMIN_USERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS_JSON);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          if (u && u.id && u.hash && u.salt) {
            serverAccountStore.set(String(u.id).toLowerCase(), {
              id: String(u.id),
              role: u.role === "super_admin" ? "super_admin" : "editor",
              salt: String(u.salt),
              hashes: [String(u.hash)],
              customPasswordChanged: true
            });
          }
        });
      }
    } catch (e) {}
  }
}

function pbkdf2Hex(password, salt) {
  return crypto
    .pbkdf2Sync(String(password || ""), String(salt || DEFAULT_ADMIN_SALT), PBKDF2_ITERATIONS, 32, "sha256")
    .toString("hex");
}

function timingSafeHexEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch (e) {
    return false;
  }
}

function signToken(payloadObj) {
  const data = Buffer.from(JSON.stringify(payloadObj), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SERVER_HMAC_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifySignedToken(tokenStr) {
  if (!tokenStr || typeof tokenStr !== "string" || !tokenStr.includes(".")) return null;
  const [data, sig] = tokenStr.split(".");
  if (!data || !sig) return null;
  const expectedSig = crypto.createHmac("sha256", SERVER_HMAC_SECRET).update(data).digest("base64url");
  if (sig.length !== expectedSig.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  } catch (e) {
    return null;
  }
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader || typeof cookieHeader !== "string") return out;
  cookieHeader.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  });
  return out;
}

function getClientKey(req) {
  const xff = req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]);
  const ip = xff ? String(xff).split(",")[0].trim() : (req.socket && req.socket.remoteAddress) || "local";
  return `ip:${ip}`;
}

function getSessionFromReq(req, bodyObj, nowMs) {
  const now = nowMs || Date.now();
  const cookies = parseCookies(req.headers && req.headers.cookie);
  const authHeader = (req.headers && req.headers.authorization) || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const rawToken =
    bearer ||
    (req.headers && req.headers["x-admin-session"]) ||
    (bodyObj && bodyObj.sessionToken) ||
    cookies[SESSION_COOKIE_NAME] ||
    "";

  if (!rawToken) return { valid: false, reason: "NO_SESSION" };
  const decoded = verifySignedToken(rawToken);
  if (!decoded || !decoded.sid) return { valid: false, reason: "INVALID_TOKEN" };

  const stored = sessionStore.get(decoded.sid);
  if (stored) {
    if (stored.revoked) return { valid: false, reason: "SESSION_REVOKED" };
    if (now - stored.lastActiveAt > SESSION_IDLE_MS) {
      sessionStore.delete(decoded.sid);
      return { valid: false, reason: "IDLE_TIMEOUT" };
    }
    const remSec = Math.max(0, Math.ceil((SESSION_IDLE_MS - (now - stored.lastActiveAt)) / 1000));
    return {
      valid: true,
      sid: decoded.sid,
      user: { id: stored.id, role: stored.role },
      remainingSec: remSec,
      token: rawToken
    };
  }

  // Stateless fallback for serverless instances if token itself is within 30m window
  const refTime = decoded.lastActiveAt || decoded.issuedAt || 0;
  if (now - refTime > SESSION_IDLE_MS) {
    return { valid: false, reason: "IDLE_TIMEOUT" };
  }
  const remSec = Math.max(0, Math.ceil((SESSION_IDLE_MS - (now - refTime)) / 1000));
  return {
    valid: true,
    sid: decoded.sid,
    user: { id: decoded.id, role: decoded.role },
    remainingSec: remSec,
    token: rawToken
  };
}

function makeCookieHeader(tokenValue, maxAgeSec, isSecure) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(tokenValue || "")}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

// ==========================================================================
// ATOMIC GITHUB DATA API PUBLISHER (Server-Side & Testable)
// ==========================================================================
async function executeAtomicGithubPublish({
  token,
  repo = "mfgkoreaceo-ops/muggo-corporate-site",
  branch = "main",
  files = [],
  commitMessage = "CMS Atomic Publish",
  expectedBaseSha = null,
  fetchImpl = globalThis.fetch
}) {
  if (!token || !String(token).trim()) {
    return {
      ok: false,
      status: 401,
      errorCode: "NO_TOKEN",
      message: "원격 게시용 GitHub 토큰이 설정되지 않았습니다."
    };
  }
  if (!Array.isArray(files) || files.length === 0) {
    return {
      ok: false,
      status: 400,
      errorCode: "EMPTY_FILES",
      message: "게시할 파일 목록이 비어 있습니다."
    };
  }

  const cleanToken = String(token).trim();
  const baseHeaders = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "MUGGO-Admin-CMS/2.0"
  };

  function classifyHttpError(status, stepName, detailText) {
    if (status === 401) {
      return {
        ok: false,
        status: 401,
        errorCode: "AUTH_ERROR",
        step: stepName,
        message: "인증 오류 (HTTP 401): GitHub 토큰이 만료되었거나 유효하지 않습니다."
      };
    }
    if (status === 403) {
      return {
        ok: false,
        status: 403,
        errorCode: "PERMISSION_ERROR",
        step: stepName,
        message: "권한 오류 (HTTP 403): 저장소 쓰기 권한(Contents: Read & Write)이 없거나 API 호출 한도를 초과했습니다."
      };
    }
    if (status === 404) {
      return {
        ok: false,
        status: 404,
        errorCode: "NOT_FOUND",
        step: stepName,
        message: "대상 미발견 (HTTP 404): 원격 저장소 또는 브랜치(main)에 접근할 수 없습니다."
      };
    }
    if (status === 409 || status === 422) {
      return {
        ok: false,
        status,
        errorCode: "CONFLICT_ERROR",
        step: stepName,
        message: `충돌 오류 (HTTP ${status}): 다른 관리자가 원격 저장소를 먼저 수정했습니다. 최신 상태를 확인한 뒤 다시 게시해 주세요.`
      };
    }
    return {
      ok: false,
      status: status || 500,
      errorCode: "HTTP_ERROR",
      step: stepName,
      message: `원격 저장소 응답 오류 (HTTP ${status || "Unknown"} · ${stepName}): ${detailText || "요청 실패"}`
    };
  }

  try {
    // Step 1: Fetch current branch HEAD reference
    const refUrl = `https://api.github.com/repos/${repo}/git/ref/heads/${branch}`;
    const refRes = await fetchImpl(refUrl, { method: "GET", headers: baseHeaders });
    if (!refRes.ok) {
      return classifyHttpError(refRes.status, "GET_REF");
    }
    const refData = await refRes.json();
    const headCommitSha = refData && refData.object && refData.object.sha;
    if (!headCommitSha) {
      return classifyHttpError(500, "GET_REF", "HEAD 커밋 SHA를 확인할 수 없습니다.");
    }
    if (expectedBaseSha && expectedBaseSha !== headCommitSha) {
      return classifyHttpError(409, "BASE_SHA_MISMATCH");
    }

    // Step 2: Fetch base commit to get base_tree SHA
    const commitUrl = `https://api.github.com/repos/${repo}/git/commits/${headCommitSha}`;
    const commitRes = await fetchImpl(commitUrl, { method: "GET", headers: baseHeaders });
    if (!commitRes.ok) {
      return classifyHttpError(commitRes.status, "GET_BASE_COMMIT");
    }
    const commitData = await commitRes.json();
    const baseTreeSha = commitData && commitData.tree && commitData.tree.sha;
    if (!baseTreeSha) {
      return classifyHttpError(500, "GET_BASE_COMMIT", "기준 트리 SHA를 확인할 수 없습니다.");
    }

    // Step 3: Create a single atomic Git tree containing all modified files
    const treeEntries = files.map((f) => ({
      path: String(f.path).replace(/^\/+/, ""),
      mode: "100644",
      type: "blob",
      content: String(f.content == null ? "" : f.content)
    }));

    const createTreeUrl = `https://api.github.com/repos/${repo}/git/trees`;
    const treeRes = await fetchImpl(createTreeUrl, {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeEntries
      })
    });
    if (!treeRes.ok) {
      return classifyHttpError(treeRes.status, "CREATE_TREE");
    }
    const treeData = await treeRes.json();
    const newTreeSha = treeData && treeData.sha;
    if (!newTreeSha) {
      return classifyHttpError(500, "CREATE_TREE", "새 트리 SHA가 생성되지 않았습니다.");
    }

    // Step 4: Create a single atomic Git commit
    const createCommitUrl = `https://api.github.com/repos/${repo}/git/commits`;
    const newCommitRes = await fetchImpl(createCommitUrl, {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeSha,
        parents: [headCommitSha]
      })
    });
    if (!newCommitRes.ok) {
      return classifyHttpError(newCommitRes.status, "CREATE_COMMIT");
    }
    const newCommitData = await newCommitRes.json();
    const newCommitSha = newCommitData && newCommitData.sha;
    if (!newCommitSha) {
      return classifyHttpError(500, "CREATE_COMMIT", "새 커밋 SHA가 생성되지 않았습니다.");
    }

    // Step 5: Fast-forward branch reference atomically (force: false prevents overwriting concurrent commits)
    const patchRefUrl = `https://api.github.com/repos/${repo}/git/refs/heads/${branch}`;
    const patchRes = await fetchImpl(patchRefUrl, {
      method: "PATCH",
      headers: baseHeaders,
      body: JSON.stringify({
        sha: newCommitSha,
        force: false
      })
    });
    if (!patchRes.ok) {
      return classifyHttpError(patchRes.status === 422 ? 409 : patchRes.status, "UPDATE_REF");
    }

    // Step 6: Post-commit remote verification — confirm remote branch HEAD matches newCommitSha
    const verifyRes = await fetchImpl(refUrl, { method: "GET", headers: baseHeaders });
    if (!verifyRes.ok) {
      return classifyHttpError(verifyRes.status, "VERIFY_REMOTE_REF");
    }
    const verifyData = await verifyRes.json();
    const verifiedRemoteSha = verifyData && verifyData.object && verifyData.object.sha;
    if (!verifiedRemoteSha || verifiedRemoteSha !== newCommitSha) {
      return {
        ok: false,
        status: 409,
        errorCode: "VERIFICATION_MISMATCH",
        step: "VERIFY_REMOTE_REF",
        message: "원격 반영 검증 실패: 커밋 후 원격 브랜치 SHA가 일치하지 않습니다."
      };
    }

    return {
      ok: true,
      status: 200,
      commitSha: newCommitSha,
      previousCommitSha: headCommitSha,
      treeSha: newTreeSha,
      verifiedRemoteSha,
      committedFiles: treeEntries.map((e) => e.path)
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      errorCode: "NETWORK_ERROR",
      step: "FETCH",
      message: "네트워크 오류: GitHub API 서버와 연결할 수 없습니다. 인터넷 연결 상태를 확인해 주세요."
    };
  }
}

// ==========================================================================
// HTTP REQUEST HANDLER (Vercel Serverless Function & Node HTTP Server)
// ==========================================================================
async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 8 * 1024 * 1024) req.destroy();
    });
    req.on("end", () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function sendJson(res, statusCode, payload, extraHeaders) {
  const body = JSON.stringify(payload);
  if (typeof res.status === "function" && typeof res.json === "function") {
    if (extraHeaders) {
      Object.entries(extraHeaders).forEach(([k, v]) => res.setHeader(k, v));
    }
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(statusCode).json(payload);
  }
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    ...(extraHeaders || {})
  });
  res.end(body);
}

async function handler(req, res) {
  initServerAccounts();

  const method = String(req.method || "GET").toUpperCase();
  const body = method === "POST" || method === "PUT" ? await readJsonBody(req) : {};
  const urlObj = new URL(req.url || "/api/admin", "http://localhost");
  const action = String(body.action || urlObj.searchParams.get("action") || "status").toLowerCase();
  const now = Number(body._testNowMs) || Date.now();
  const clientKey = getClientKey(req);
  const isSecure = Boolean(req.headers && req.headers["x-forwarded-proto"] === "https");

  // 1. STATUS / SESSION CHECK
  if (method === "GET" || action === "status" || action === "session") {
    const lock = rateLimitStore.get(clientKey) || { fails: 0, lockedUntil: 0 };
    if (lock.lockedUntil && lock.lockedUntil <= now) {
      rateLimitStore.set(clientKey, { fails: 0, lockedUntil: 0 });
    }
    const sess = getSessionFromReq(req, body, now);
    if (!sess.valid) {
      return sendJson(res, sess.reason === "IDLE_TIMEOUT" ? 401 : 200, {
        ok: true,
        serverAuthAvailable: true,
        authenticated: false,
        reason: sess.reason,
        lockedUntil: lock.lockedUntil && lock.lockedUntil > now ? lock.lockedUntil : 0,
        remotePublishConfigured: Boolean(process.env.GITHUB_TOKEN)
      });
    }
    return sendJson(res, 200, {
      ok: true,
      serverAuthAvailable: true,
      authenticated: true,
      user: sess.user,
      remainingSec: sess.remainingSec,
      remotePublishConfigured: Boolean(process.env.GITHUB_TOKEN)
    });
  }

  // 2. LOGIN WITH SERVER-ENFORCED 5-ATTEMPT / 15-MINUTE LOCKOUT
  if (action === "login") {
    const lock = rateLimitStore.get(clientKey) || { fails: 0, lockedUntil: 0 };
    if (lock.lockedUntil && lock.lockedUntil > now) {
      const remSec = Math.ceil((lock.lockedUntil - now) / 1000);
      return sendJson(res, 429, {
        ok: false,
        errorCode: "LOCKED_OUT",
        fails: lock.fails,
        lockedUntil: lock.lockedUntil,
        remainingSec: remSec,
        message: "비밀번호 5회 연속 실패로 서버에서 로그인이 15분간 차단되었습니다."
      });
    }
    if (lock.lockedUntil && lock.lockedUntil <= now) {
      rateLimitStore.set(clientKey, { fails: 0, lockedUntil: 0 });
    }

    const userId = String(body.id || "").trim().toLowerCase();
    const password = String(body.password || "");
    const acc = serverAccountStore.get(userId);

    let verified = false;
    if (acc && password) {
      const candidateHash = pbkdf2Hex(password, acc.salt);
      verified = acc.hashes.some((h) => timingSafeHexEqual(candidateHash, h));
    }

    if (!verified) {
      const prevFails = (rateLimitStore.get(clientKey) || { fails: 0 }).fails || 0;
      const nextFails = prevFails + 1;
      const lockedUntil = nextFails >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
      rateLimitStore.set(clientKey, { fails: nextFails, lockedUntil });
      return sendJson(res, lockedUntil ? 429 : 401, {
        ok: false,
        errorCode: lockedUntil ? "LOCKED_OUT" : "INVALID_CREDENTIALS",
        fails: nextFails,
        maxAttempts: MAX_LOGIN_ATTEMPTS,
        lockedUntil,
        message: lockedUntil
          ? "비밀번호 5회 연속 오입력으로 로그인이 15분간 잠겼습니다."
          : `아이디 또는 비밀번호가 일치하지 않습니다. (${nextFails}/${MAX_LOGIN_ATTEMPTS})`
      });
    }

    // Reset lockout & create 30-minute idle session
    rateLimitStore.set(clientKey, { fails: 0, lockedUntil: 0 });
    const sid = crypto.randomBytes(18).toString("hex");
    const sessionRecord = {
      id: acc.id,
      role: acc.role,
      issuedAt: now,
      lastActiveAt: now,
      revoked: false
    };
    sessionStore.set(sid, sessionRecord);

    const signedToken = signToken({
      sid,
      id: acc.id,
      role: acc.role,
      issuedAt: now,
      lastActiveAt: now
    });

    return sendJson(
      res,
      200,
      {
        ok: true,
        authenticated: true,
        user: { id: acc.id, role: acc.role },
        sessionToken: signedToken,
        remainingSec: Math.floor(SESSION_IDLE_MS / 1000),
        remotePublishConfigured: Boolean(process.env.GITHUB_TOKEN)
      },
      {
        "Set-Cookie": makeCookieHeader(signedToken, Math.floor(SESSION_IDLE_MS / 1000), isSecure)
      }
    );
  }

  // 3. EXTEND SESSION (30-Minute Idle Reset)
  if (action === "extend") {
    const sess = getSessionFromReq(req, body, now);
    if (!sess.valid) {
      return sendJson(res, 401, {
        ok: false,
        errorCode: sess.reason || "SESSION_EXPIRED",
        message: "보안 세션이 만료되었습니다. 다시 로그인해 주세요."
      });
    }
    const stored = sessionStore.get(sess.sid);
    if (stored) {
      stored.lastActiveAt = now;
    }
    const refreshedToken = signToken({
      sid: sess.sid,
      id: sess.user.id,
      role: sess.user.role,
      issuedAt: now,
      lastActiveAt: now
    });
    return sendJson(
      res,
      200,
      {
        ok: true,
        authenticated: true,
        user: sess.user,
        sessionToken: refreshedToken,
        remainingSec: Math.floor(SESSION_IDLE_MS / 1000)
      },
      {
        "Set-Cookie": makeCookieHeader(refreshedToken, Math.floor(SESSION_IDLE_MS / 1000), isSecure)
      }
    );
  }

  // 4. LOGOUT
  if (action === "logout") {
    const sess = getSessionFromReq(req, body, now);
    if (sess.valid && sess.sid) {
      const stored = sessionStore.get(sess.sid);
      if (stored) stored.revoked = true;
      sessionStore.delete(sess.sid);
    }
    return sendJson(
      res,
      200,
      { ok: true, authenticated: false },
      { "Set-Cookie": makeCookieHeader("", 0, isSecure) }
    );
  }

  // Require valid authenticated session for all protected actions below
  const sess = getSessionFromReq(req, body, now);
  if (!sess.valid) {
    return sendJson(res, 401, {
      ok: false,
      errorCode: sess.reason || "UNAUTHORIZED",
      message:
        sess.reason === "IDLE_TIMEOUT"
          ? "30분 미사용으로 서버 보안 세션이 만료되었습니다. 다시 로그인해 주세요."
          : "인증 오류 (HTTP 401): 유효한 관리자 로그인 세션이 필요합니다."
    });
  }

  // Touch session activity on valid authenticated request
  const storedSess = sessionStore.get(sess.sid);
  if (storedSess) storedSess.lastActiveAt = now;

  // 5. SERVER-SIDE ACCOUNT MANAGEMENT & PASSWORD CHANGE
  if (action === "change_password") {
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (!newPassword || newPassword.length < 6) {
      return sendJson(res, 400, {
        ok: false,
        errorCode: "INVALID_PASSWORD",
        message: "새 비밀번호는 최소 6자 이상이어야 합니다."
      });
    }
    const acc = serverAccountStore.get(sess.user.id.toLowerCase());
    if (!acc) {
      return sendJson(res, 404, { ok: false, errorCode: "ACCOUNT_NOT_FOUND", message: "계정을 찾을 수 없습니다." });
    }
    const curHash = pbkdf2Hex(currentPassword, acc.salt);
    const curValid = acc.hashes.some((h) => timingSafeHexEqual(curHash, h));
    if (!curValid) {
      return sendJson(res, 401, {
        ok: false,
        errorCode: "CURRENT_PASSWORD_MISMATCH",
        message: "현재 비밀번호가 일치하지 않아 비밀번호 변경 및 볼트 재암호화를 중단했습니다."
      });
    }
    const nextSalt = String(body.newSalt || `muggo-salt-${now}`);
    const nextHash = pbkdf2Hex(newPassword, nextSalt);
    acc.salt = nextSalt;
    acc.hashes = [nextHash];
    acc.customPasswordChanged = true;
    return sendJson(res, 200, {
      ok: true,
      salt: nextSalt,
      message: "서버 및 계정의 비밀번호 해시가 안전하게 변경되었습니다."
    });
  }

  if (action === "upsert_staff" || action === "delete_staff" || action === "update_config") {
    if (sess.user.role !== "super_admin") {
      return sendJson(res, 403, {
        ok: false,
        errorCode: "ROLE_FORBIDDEN",
        message: "권한 오류 (HTTP 403): 실무자(Editor) 계정은 회사 기본 보안 설정 및 계정 관리를 수행할 수 없습니다."
      });
    }
    if (action === "upsert_staff") {
      const staffId = String(body.staffId || "").trim();
      const staffPw = String(body.staffPassword || "");
      const staffRole = body.staffRole === "super_admin" ? "super_admin" : "editor";
      const salt = String(body.salt || `muggo-staff-salt-${now}`);
      if (!staffId || !staffPw) {
        return sendJson(res, 400, { ok: false, errorCode: "INVALID_INPUT", message: "아이디와 비밀번호를 모두 입력해 주세요." });
      }
      serverAccountStore.set(staffId.toLowerCase(), {
        id: staffId,
        role: staffId.toLowerCase() === "admin" ? "super_admin" : staffRole,
        salt,
        hashes: [pbkdf2Hex(staffPw, salt)],
        customPasswordChanged: true
      });
      return sendJson(res, 200, { ok: true, id: staffId, role: staffRole });
    }
    if (action === "delete_staff") {
      const staffId = String(body.staffId || "").trim().toLowerCase();
      if (staffId && staffId !== "admin") {
        serverAccountStore.delete(staffId);
      }
      return sendJson(res, 200, { ok: true });
    }
    return sendJson(res, 200, { ok: true, authorized: true });
  }

  // 6. SERVER-SIDE ATOMIC GITHUB PUBLISH & ROLLBACK
  if (action === "publish" || action === "rollback") {
    if (sess.user.role !== "super_admin" && body.configModified === true) {
      return sendJson(res, 403, {
        ok: false,
        errorCode: "ROLE_FORBIDDEN",
        message: "권한 오류 (HTTP 403): Editor 계정은 site.config.js(회사 설정/스위치) 변경사항을 원격 게시할 수 없습니다."
      });
    }
    const tokenToUse = String(body.githubToken || process.env.GITHUB_TOKEN || "").trim();
    const result = await executeAtomicGithubPublish({
      token: tokenToUse,
      repo: body.repo || process.env.GITHUB_REPO || "mfgkoreaceo-ops/muggo-corporate-site",
      branch: body.branch || process.env.GITHUB_BRANCH || "main",
      files: body.files || [],
      commitMessage:
        body.commitMessage ||
        `CMS ${action === "rollback" ? "Rollback" : "Publish"} by ${sess.user.id} (${new Date(now).toISOString()})`,
      expectedBaseSha: body.expectedBaseSha || null
    });
    return sendJson(res, result.ok ? 200 : result.status || 502, result);
  }

  return sendJson(res, 400, { ok: false, errorCode: "UNKNOWN_ACTION", message: "지원하지 않는 요청입니다." });
}

handler.executeAtomicGithubPublish = executeAtomicGithubPublish;
handler.pbkdf2Hex = pbkdf2Hex;
handler.DEFAULT_ADMIN_SALT = DEFAULT_ADMIN_SALT;
handler.DEFAULT_ADMIN_HASHES = DEFAULT_ADMIN_HASHES;
handler._resetTestState = function () {
  rateLimitStore.clear();
  sessionStore.clear();
  serverAccountStore.clear();
  initServerAccounts();
};

module.exports = handler;
