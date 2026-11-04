// ==========================================================================
// MUGGO Official Corporate & Recruitment Site — Integrated Admin CMS (admin.js)
// Implements 100% of the 17-page CMS Specification:
// - PBKDF2-SHA256 (100,000 iterations + Salt) & AES-256-GCM Encrypted Vault
// - Zero plaintext password in source code
// - 5-Attempt / 15-Minute Brute-Force Lockout with live countdown
// - 30-Minute Idle Session Timeout (3-min warning modal + auto draft save)
// - Zero-Reload Instant KO ↔ ID UI Switcher (localStorage: muggo-admin-ui-lang)
// - 7 Admin Modules mapping 100% of site.config.js, data/i18n.js, data/site-data.js, data/catalog-data.js
// ==========================================================================

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. CRYPTOGRAPHIC CONSTANTS & STORAGE KEYS (NO PLAINTEXT PASSWORD)
  // --------------------------------------------------------------------------
  const PBKDF2_ITERATIONS = 100000;
  const DEFAULT_ADMIN_SALT = "muggo-admin-vault-salt-2026-v1";
  // Derived via PBKDF2-SHA256(password, DEFAULT_ADMIN_SALT, 100000, 32 bytes)
  const DEFAULT_ADMIN_HASH = "5e18b16407d4625e0a443daf128d3d7244586ea72c11e22d7b242ac795575c1c";

  const STORAGE_KEYS = {
    uiLang: "muggo-admin-ui-lang",
    accounts: "muggo-cms-accounts-v1",
    lockout: "muggo-cms-lockout-v1",
    session: "muggo-cms-session-v1",
    vault: "muggo-cms-aes-vault-v1",
    draft: "muggo-cms-draft",
    published: "muggo-cms-published",
    auditLog: "muggo-cms-audit-log-v1"
  };

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  const SESSION_IDLE_MS = 30 * 60 * 1000;     // 30 minutes
  const SESSION_WARN_MS = 3 * 60 * 1000;      // 3 minutes before expiry

  // --------------------------------------------------------------------------
  // 2. RUNTIME STATE
  // --------------------------------------------------------------------------
  const cmsState = {
    uiLang: "ko",
    currentUser: null, // { id, role: "super_admin" | "editor" }
    derivedAesKey: null,
    decryptedGithubToken: "",
    activeMenu: "menu1",
    activeMenu3Tab: "tab1",
    activeMenu5Tab: "articles",
    activeBrandCat: "all",
    brandSearch: "",
    expandedBrandId: null,
    lastFocusedInput: null,
    idleRemainingSec: 1800,
    idleIntervalId: null,
    lockoutIntervalId: null,
    baselineSnapshot: null,
    workingData: {
      config: null,
      i18n: null,
      siteData: null,
      catalog: null
    }
  };

  // --------------------------------------------------------------------------
  // 3. DEEP CLONE & SANITIZATION HELPERS
  // --------------------------------------------------------------------------
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function sanitizeText(val) {
    if (typeof val !== "string") return val;
    return val
      .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
      .replace(/<\s*\/?\s*(script|iframe|object|embed|style|link|meta)[^>]*>/gi, "")
      .replace(/on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
      .replace(/javascript\s*:/gi, "");
  }

  function isValidEmail(str) {
    if (!str || String(str).trim() === "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str).trim());
  }

  function isValidSafeUrlOrAsset(str) {
    if (!str || String(str).trim() === "") return true;
    const s = String(str).trim();
    if (/^javascript:/i.test(s) || /^data:/i.test(s) || /^vbscript:/i.test(s)) return false;
    return /^https?:\/\//i.test(s) || /^assets\//i.test(s) || /^\.\.\/assets\//i.test(s);
  }

  function getUiDict() {
    return (window.ADMIN_UI_I18N && window.ADMIN_UI_I18N[cmsState.uiLang]) || window.ADMIN_UI_I18N.ko;
  }

  function uiText(key) {
    const d = getUiDict();
    return d[key] || (window.ADMIN_UI_I18N.ko && window.ADMIN_UI_I18N.ko[key]) || key;
  }

  function showToast(msg) {
    const el = document.getElementById("admin-toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      el.hidden = true;
    }, 4200);
  }

  // --------------------------------------------------------------------------
  // 4. WEB CRYPTO API: PBKDF2-SHA256 (100,000 ITERATIONS) & AES-256-GCM VAULT
  // --------------------------------------------------------------------------
  function bufToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function hexToBuf(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes.buffer;
  }

  async function derivePbkdf2Hex(password, saltStr) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(saltStr),
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    return bufToHex(bits);
  }

  async function deriveAesGcmKey(password, saltStr) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode(saltStr + "-aes-vault"),
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptVaultToken(plainToken, aesKey) {
    if (!aesKey) return null;
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const cipherBuf = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      enc.encode(plainToken || "")
    );
    const payload = {
      iv: bufToHex(iv.buffer),
      cipher: bufToHex(cipherBuf),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.vault, JSON.stringify(payload));
    return payload;
  }

  async function decryptVaultToken(aesKey) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.vault);
      if (!raw || !aesKey) return "";
      const parsed = JSON.parse(raw);
      if (!parsed.iv || !parsed.cipher) return "";
      const plainBuf = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(hexToBuf(parsed.iv)) },
        aesKey,
        hexToBuf(parsed.cipher)
      );
      return new TextDecoder().decode(plainBuf);
    } catch (e) {
      return "";
    }
  }

  // --------------------------------------------------------------------------
  // 5. ACCOUNTS & BRUTE-FORCE LOCKOUT MANAGEMENT
  // --------------------------------------------------------------------------
  function loadAccounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.accounts);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.some((a) => a.id === "admin")) {
          return list;
        }
      }
    } catch (e) {}
    const initial = [
      {
        id: "admin",
        role: "super_admin",
        salt: DEFAULT_ADMIN_SALT,
        hash: DEFAULT_ADMIN_HASH,
        createdAt: "2026-11-04T00:00:00Z"
      }
    ];
    localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(initial));
    return initial;
  }

  function saveAccounts(list) {
    localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(list));
  }

  function getLockoutState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.lockout);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { fails: 0, lockedUntil: 0 };
  }

  function setLockoutState(st) {
    localStorage.setItem(STORAGE_KEYS.lockout, JSON.stringify(st));
  }

  function updateLockoutBannerUI() {
    const box = document.getElementById("login-lockout-box");
    const submitBtn = document.getElementById("login-submit-btn");
    if (!box) return;
    const st = getLockoutState();
    const now = Date.now();
    if (st.lockedUntil && st.lockedUntil > now) {
      const remSec = Math.ceil((st.lockedUntil - now) / 1000);
      const mm = String(Math.floor(remSec / 60)).padStart(2, "0");
      const ss = String(remSec % 60).padStart(2, "0");
      box.textContent = `${uiText("lockoutPrefix")}${mm}:${ss}`;
      box.hidden = false;
      if (submitBtn) submitBtn.disabled = true;
    } else {
      if (st.lockedUntil && st.lockedUntil <= now) {
        setLockoutState({ fails: 0, lockedUntil: 0 });
      }
      box.hidden = true;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  async function handleLogin(e) {
    if (e) e.preventDefault();
    const errBox = document.getElementById("login-error-box");
    if (errBox) errBox.hidden = true;

    const lock = getLockoutState();
    if (lock.lockedUntil && lock.lockedUntil > Date.now()) {
      updateLockoutBannerUI();
      return;
    }

    const idInput = document.getElementById("login-id-input");
    const pwInput = document.getElementById("login-pw-input");
    const userId = (idInput ? idInput.value : "").trim();
    const pw = pwInput ? pwInput.value : "";

    const accounts = loadAccounts();
    const acc = accounts.find((a) => a.id.toLowerCase() === userId.toLowerCase());

    let verified = false;
    if (acc) {
      const computedHash = await derivePbkdf2Hex(pw, acc.salt);
      if (computedHash === acc.hash) {
        verified = true;
      }
    }

    if (!verified) {
      const nextFails = (lock.fails || 0) + 1;
      const lockedUntil = nextFails >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : 0;
      setLockoutState({ fails: nextFails, lockedUntil });
      if (errBox) {
        errBox.textContent = `${uiText("loginErrorMsg")} (${nextFails}/${MAX_LOGIN_ATTEMPTS})`;
        errBox.hidden = false;
      }
      updateLockoutBannerUI();
      appendAuditLog(userId || "unknown", "LOGIN_FAILED", `Failed attempt ${nextFails}/${MAX_LOGIN_ATTEMPTS}`, null);
      return;
    }

    // Success! Reset lockout, derive AES-GCM key in memory, unlock Vault
    setLockoutState({ fails: 0, lockedUntil: 0 });
    cmsState.currentUser = { id: acc.id, role: acc.role };
    cmsState.derivedAesKey = await deriveAesGcmKey(pw, acc.salt);
    cmsState.decryptedGithubToken = await decryptVaultToken(cmsState.derivedAesKey);
    if (pwInput) pwInput.value = "";

    sessionStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({ id: acc.id, role: acc.role, loginAt: Date.now() })
    );

    appendAuditLog(acc.id, "LOGIN_SUCCESS", `Authenticated (${acc.role})`, null);
    enterAdminPortal();
  }

  function togglePasswordVisibility() {
    const pwInput = document.getElementById("login-pw-input");
    if (!pwInput) return;
    pwInput.type = pwInput.type === "password" ? "text" : "password";
  }

  // --------------------------------------------------------------------------
  // 6. 30-MINUTE IDLE SESSION TIMER & 3-MINUTE WARNING MODAL
  // --------------------------------------------------------------------------
  function resetIdleTimer() {
    cmsState.idleRemainingSec = Math.floor(SESSION_IDLE_MS / 1000);
    const modal = document.getElementById("session-warning-modal");
    if (modal && !modal.hidden) {
      modal.hidden = true;
    }
  }

  function extendSession() {
    resetIdleTimer();
    updateSessionTimerDOM();
    showToast(cmsState.uiLang === "ko" ? "보안 세션이 30분으로 연장되었습니다." : "Sesi keamanan diperpanjang 30 menit.");
  }

  function updateSessionTimerDOM() {
    const clock = document.getElementById("session-timer-clock");
    if (!clock) return;
    const rem = Math.max(0, cmsState.idleRemainingSec);
    const mm = String(Math.floor(rem / 60)).padStart(2, "0");
    const ss = String(rem % 60).padStart(2, "0");
    clock.textContent = `${mm}:${ss}`;

    const warnModal = document.getElementById("session-warning-modal");
    if (rem <= Math.floor(SESSION_WARN_MS / 1000) && rem > 0) {
      if (warnModal && warnModal.hidden) {
        saveDraft(false); // Auto-protect in-progress data into local draft
        warnModal.hidden = false;
      }
    }
    if (rem <= 0) {
      saveDraft(false);
      logout(true);
    }
  }

  function startSessionTicker() {
    clearInterval(cmsState.idleIntervalId);
    resetIdleTimer();
    updateSessionTimerDOM();
    cmsState.idleIntervalId = setInterval(() => {
      cmsState.idleRemainingSec -= 1;
      updateSessionTimerDOM();
    }, 1000);

    ["mousemove", "keydown", "mousedown", "touchstart"].forEach((evt) => {
      window.addEventListener(
        evt,
        () => {
          if (cmsState.idleRemainingSec > Math.floor(SESSION_WARN_MS / 1000)) {
            cmsState.idleRemainingSec = Math.floor(SESSION_IDLE_MS / 1000);
          }
        },
        { passive: true }
      );
    });
  }

  function logout(isAutoTimeout) {
    clearInterval(cmsState.idleIntervalId);
    cmsState.currentUser = null;
    cmsState.derivedAesKey = null;
    cmsState.decryptedGithubToken = "";
    sessionStorage.removeItem(STORAGE_KEYS.session);

    const warnModal = document.getElementById("session-warning-modal");
    if (warnModal) warnModal.hidden = true;

    const appScreen = document.getElementById("admin-app-screen");
    const loginScreen = document.getElementById("admin-login-screen");
    if (appScreen) appScreen.hidden = true;
    if (loginScreen) loginScreen.hidden = false;

    if (isAutoTimeout) {
      const errBox = document.getElementById("login-error-box");
      if (errBox) {
        errBox.textContent =
          cmsState.uiLang === "ko"
            ? "30분 동안 입력이 없어 보안 세션이 자동 종료되었습니다. 작성 중이던 데이터는 임시저장되었습니다."
            : "Sesi berakhir otomatis setelah 30 menit tanpa aktivitas. Draf Anda telah disimpan.";
        errBox.hidden = false;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. ZERO-RELOAD INSTANT KO ↔ ID UI SWITCHER
  // --------------------------------------------------------------------------
  function setUiLang(lang) {
    const normalized = lang === "id" ? "id" : "ko";
    cmsState.uiLang = normalized;
    localStorage.setItem(STORAGE_KEYS.uiLang, normalized);
    document.documentElement.lang = normalized;

    // Update language toggle active states
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === normalized);
    });

    // Update all static data-ui text nodes without touching any input values!
    document.querySelectorAll("[data-ui]").forEach((el) => {
      const key = el.getAttribute("data-ui");
      if (key) el.textContent = uiText(key);
    });

    document.querySelectorAll("[data-ui-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-ui-placeholder");
      if (key) el.setAttribute("placeholder", uiText(key));
    });

    // Update current menu header banner without reloading form inputs
    if (typeof window.updateMenuHeaderBanner === "function") {
      window.updateMenuHeaderBanner();
    }
    updateLockoutBannerUI();

    // Update dynamic bilingual labels (.bilingual-label[data-ko][data-id]) in place
    document.querySelectorAll(".bilingual-label[data-ko][data-id]").forEach((el) => {
      el.textContent = normalized === "id" ? el.getAttribute("data-id") : el.getAttribute("data-ko");
    });
  }

  function biLabel(koText, idText) {
    const current = cmsState.uiLang === "id" ? idText : koText;
    const escKo = String(koText).replace(/"/g, "&quot;");
    const escId = String(idText).replace(/"/g, "&quot;");
    return `<span class="bilingual-label" data-ko="${escKo}" data-id="${escId}">${current}</span>`;
  }

  // --------------------------------------------------------------------------
  // 8. WORKING DATA INITIALIZATION & DIFF / AUDIT LOG
  // --------------------------------------------------------------------------
  function loadInitialWorkingData() {
    const baseBundle = {
      config: deepClone(window.SITE_CONFIG || {}),
      i18n: deepClone(window.I18N_DICT || window.MUGGO_I18N || {}),
      siteData: deepClone(window.DEFAULT_SITE_DATA || window.SITE_DATA || {}),
      catalog: deepClone(window.MUGGO_CATALOG || window.BRAND_CATALOG || [])
    };

    // Check if there is a published or draft bundle in localStorage
    let activeBundle = deepClone(baseBundle);
    try {
      const pubRaw = localStorage.getItem(STORAGE_KEYS.published);
      if (pubRaw) {
        const pub = JSON.parse(pubRaw);
        if (pub && pub.config && pub.i18n && pub.i18n.id && pub.i18n.id.nav && pub.siteData && Array.isArray(pub.catalog) && pub.catalog.length > 0 && Array.isArray(pub.siteData.jobs) && pub.siteData.jobs.length > 0) {
          activeBundle = pub;
        }
      }
      const draftRaw = localStorage.getItem(STORAGE_KEYS.draft);
      if (draftRaw) {
        const dr = JSON.parse(draftRaw);
        if (dr && dr.config && dr.i18n && dr.i18n.id && dr.i18n.id.nav && dr.siteData && Array.isArray(dr.catalog) && dr.catalog.length > 0 && Array.isArray(dr.siteData.jobs) && dr.siteData.jobs.length > 0) {
          activeBundle = dr;
        }
      }
    } catch (e) {}

    cmsState.baselineSnapshot = deepClone(activeBundle);
    cmsState.workingData = deepClone(activeBundle);
  }

  function computeDiffSummary(oldBundle, newBundle) {
    const diffs = [];
    if (!oldBundle || !newBundle) return diffs;

    // 1. Compare site.config.js keys
    Object.keys(newBundle.config || {}).forEach((k) => {
      const beforeVal = oldBundle.config ? oldBundle.config[k] : undefined;
      const afterVal = newBundle.config[k];
      if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
        diffs.push({
          field: `site.config.js → ${k}`,
          before: String(beforeVal),
          after: String(afterVal)
        });
      }
    });

    // 2. Compare jobs count & visibility
    const oldJobs = (oldBundle.siteData && oldBundle.siteData.jobs) || [];
    const newJobs = (newBundle.siteData && newBundle.siteData.jobs) || [];
    if (oldJobs.length !== newJobs.length) {
      diffs.push({
        field: "site-data.js → jobs.length",
        before: `${oldJobs.length}개 직군`,
        after: `${newJobs.length}개 직군`
      });
    }
    newJobs.forEach((nj, idx) => {
      const oj = oldJobs[idx];
      if (oj && JSON.stringify(oj) !== JSON.stringify(nj)) {
        diffs.push({
          field: `jobs[${nj.id}] (${nj.titleId || nj.title})`,
          before: `visible=${oj.visible}, title=${oj.titleId || oj.title}`,
          after: `visible=${nj.visible}, title=${nj.titleId || nj.title}`
        });
      }
    });

    // 3. Compare i18n leaf strings (up to 12 summarized entries)
    function walkDiff(prefix, o1, o2) {
      if (diffs.length >= 15) return;
      if (typeof o2 === "string") {
        if (o1 !== o2) {
          diffs.push({
            field: `i18n → ${prefix}`,
            before: String(o1 || "").slice(0, 60),
            after: String(o2 || "").slice(0, 60)
          });
        }
        return;
      }
      if (Array.isArray(o2)) {
        o2.forEach((item, idx) => walkDiff(`${prefix}[${idx}]`, o1 ? o1[idx] : undefined, item));
      } else if (o2 && typeof o2 === "object") {
        Object.keys(o2).forEach((k) => walkDiff(prefix ? `${prefix}.${k}` : k, o1 ? o1[k] : undefined, o2[k]));
      }
    }
    walkDiff("", oldBundle.i18n, newBundle.i18n);

    // 4. Compare catalog count/edits
    if (JSON.stringify(oldBundle.catalog) !== JSON.stringify(newBundle.catalog)) {
      diffs.push({
        field: "data/catalog-data.js",
        before: `${(oldBundle.catalog || []).length} Brands`,
        after: `${(newBundle.catalog || []).length} Brands (Updated)`
      });
    }

    if (diffs.length === 0) {
      diffs.push({
        field: "전체 데이터 동기화 (Full Sync)",
        before: "기존 상태 유지",
        after: "저장 및 사이트 반영"
      });
    }
    return diffs;
  }

  function loadAuditLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.auditLog);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
      }
    } catch (e) {}
    return [];
  }

  function appendAuditLog(actorId, action, summaryText, snapshotBundle, diffs) {
    const logs = loadAuditLogs();
    const entry = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      actor: actorId || (cmsState.currentUser ? cmsState.currentUser.id : "admin"),
      action,
      summary: summaryText,
      diffs: diffs || [],
      snapshot: snapshotBundle ? deepClone(snapshotBundle) : null
    };
    logs.unshift(entry);
    // Keep most recent 25 audit entries with snapshots
    const trimmed = logs.slice(0, 25);
    try {
      localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(trimmed));
    } catch (e) {
      // If quota exceeded due to large snapshots, keep snapshot on latest 5 entries
      trimmed.forEach((item, idx) => {
        if (idx >= 5) item.snapshot = null;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(trimmed));
      } catch (e2) {}
    }
  }

  // --------------------------------------------------------------------------
  // OBJECT PATH GETTER / SETTER FOR NESTED I18N & DATA KEYS
  // --------------------------------------------------------------------------
  function getByPath(obj, pathStr) {
    return pathStr.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ""), obj);
  }

  function setByPath(obj, pathStr, val) {
    const parts = pathStr.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (cur[p] === undefined || cur[p] === null) {
        cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      }
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function escHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Extract {variable} tokens from a string
  function extractVars(str) {
    if (typeof str !== "string") return [];
    const matches = str.match(/\{[a-zA-Z0-9_]+\}/g);
    return matches ? Array.from(new Set(matches)) : [];
  }

  // --------------------------------------------------------------------------
  // PORTAL ENTRY & MENU SWITCHING
  // --------------------------------------------------------------------------
  function enterAdminPortal() {
    loadInitialWorkingData();

    const loginScreen = document.getElementById("admin-login-screen");
    const appScreen = document.getElementById("admin-app-screen");
    if (loginScreen) loginScreen.hidden = true;
    if (appScreen) appScreen.hidden = false;

    const userBadge = document.getElementById("admin-user-badge");
    if (userBadge && cmsState.currentUser) {
      const roleLabel =
        cmsState.currentUser.role === "super_admin"
          ? "Super Admin (최고 관리자)"
          : "Editor (실무자 계정)";
      userBadge.textContent = `${cmsState.currentUser.id} · ${roleLabel}`;
    }

    startSessionTicker();
    renderAllMenus();
    switchMenu(cmsState.activeMenu || "menu1");
    applyToPreview(true);
  }

  window.updateMenuHeaderBanner = function updateMenuHeaderBanner() {
    const h1 = document.getElementById("current-menu-heading");
    const p = document.getElementById("current-menu-guide");
    const m = cmsState.activeMenu || "menu1";
    const num = m.replace("menu", "");
    if (h1) h1.textContent = uiText(`menu${num}Title`);
    if (p) p.textContent = uiText(`menu${num}Guide`);
  };

  function switchMenu(menuId) {
    cmsState.activeMenu = menuId;
    document.querySelectorAll(".admin-nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-menu") === menuId);
    });
    ["menu1", "menu2", "menu3", "menu4", "menu5", "menu6", "menu7"].forEach((id) => {
      const panel = document.getElementById(`panel-${id}`);
      if (panel) panel.hidden = id !== menuId;
    });
    window.updateMenuHeaderBanner();
    if (menuId === "menu1") renderMenu1Dashboard();
    if (menuId === "menu7") renderMenu7Security();
  }

  function renderAllMenus() {
    renderMenu1Dashboard();
    renderMenu2Config();
    renderMenu3I18n();
    renderMenu4Jobs();
    renderMenu5Content();
    renderMenu6Catalog();
    renderMenu7Security();
  }

  // --------------------------------------------------------------------------
  // LIVE PREVIEW SPLIT VIEW (Desktop 1280px / Mobile 390px)
  // --------------------------------------------------------------------------
  function togglePreviewSplit() {
    const ws = document.getElementById("admin-workspace");
    if (ws) ws.classList.toggle("preview-hidden");
  }

  function setPreviewViewport(mode) {
    const stage = document.getElementById("preview-stage");
    const badge = document.getElementById("preview-size-badge");
    const btnDesk = document.getElementById("prev-btn-desktop");
    const btnMob = document.getElementById("prev-btn-mobile");
    if (!stage) return;
    if (mode === "mobile") {
      stage.className = "preview-stage viewport-mobile";
      if (badge) badge.textContent = "Mobile 390px";
      if (btnDesk) btnDesk.classList.remove("active");
      if (btnMob) btnMob.classList.add("active");
    } else {
      stage.className = "preview-stage viewport-desktop";
      if (badge) badge.textContent = "Desktop 1280px";
      if (btnDesk) btnDesk.classList.add("active");
      if (btnMob) btnMob.classList.remove("active");
    }
  }

  function reloadPreviewFrame() {
    const iframe = document.getElementById("cms-preview-iframe");
    const langSel = document.getElementById("preview-lang-select");
    if (!iframe) return;
    const lang = langSel ? langSel.value : "id";
    iframe.src = `../index.html?cms_preview=1&lang=${encodeURIComponent(lang)}&t=${Date.now()}`;
  }

  function applyToPreview(silent) {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(cmsState.workingData));
    reloadPreviewFrame();
    if (!silent) {
      showToast(uiText("msgDraftSaved"));
    }
  }

  function saveDraft(showFeedback) {
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(cmsState.workingData));
    reloadPreviewFrame();
    if (showFeedback) {
      appendAuditLog(
        cmsState.currentUser ? cmsState.currentUser.id : "admin",
        "SAVE_DRAFT",
        "Saved working draft & updated live preview",
        cmsState.workingData
      );
      showToast(uiText("msgDraftSaved"));
    }
  }

  // --------------------------------------------------------------------------
  // ONE-CLICK VARIABLE INSERTION BAR
  // --------------------------------------------------------------------------
  function renderVarInsertBarHtml() {
    const vars = [
      { key: "{legalName}", labelKey: "varLegalName" },
      { key: "{brandName}", labelKey: "varBrandName" },
      { key: "{contactEmail}", labelKey: "varContactEmail" },
      { key: "{address}", labelKey: "varAddress" },
      { key: "{brandCount}", labelKey: "varBrandCount" },
      { key: "{menuCount}", labelKey: "varMenuCount" }
    ];
    return `
      <div class="var-insert-bar">
        <strong data-ui="varBarLabel">${escHtml(uiText("varBarLabel"))}</strong>
        ${vars
          .map(
            (v) =>
              `<button type="button" class="var-chip" onclick="AdminCMS.insertVarAtCursor('${v.key}')" data-ui="${v.labelKey}">${escHtml(
                uiText(v.labelKey)
              )}</button>`
          )
          .join("")}
      </div>
    `;
  }

  function insertVarAtCursor(token) {
    const el = cmsState.lastFocusedInput;
    if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) {
      showToast(
        cmsState.uiLang === "ko"
          ? "먼저 변수를 삽입할 문구 입력창을 클릭해 주세요."
          : "Klik kolom teks terlebih dahulu sebelum menyisipkan variabel."
      );
      return;
    }
    const start = el.selectionStart || el.value.length;
    const end = el.selectionEnd || el.value.length;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    el.value = before + token + after;
    el.focus();
    el.selectionStart = el.selectionEnd = start + token.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Track last focused text input for variable chip insertion
  document.addEventListener("focusin", (e) => {
    const t = e.target;
    if (t && (t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && t.type === "text"))) {
      cmsState.lastFocusedInput = t;
    }
  });

  // --------------------------------------------------------------------------
  // [MENU 1] 📊 대시보드 & 실시간 미리보기 (Page 8)
  // --------------------------------------------------------------------------
  function renderMenu1Dashboard() {
    const panel = document.getElementById("panel-menu1");
    if (!panel) return;
    const c = cmsState.workingData.config || {};
    const jobs = (cmsState.workingData.siteData && cmsState.workingData.siteData.jobs) || [];
    const activeJobs = jobs.filter((j) => j.visible !== false && String(j.visible).toUpperCase() !== "FALSE").length;
    const catalog = cmsState.workingData.catalog || [];
    const totalMenus = catalog.reduce((sum, b) => sum + ((b.menus && b.menus.length) || 0), 0);
    const logs = loadAuditLogs().slice(0, 5);

    const recEmailStatus =
      c.recruitmentEmail && c.recruitmentEmail.trim() !== ""
        ? `${biLabel("분리 설정됨:", "Terpisah:")} ${escHtml(c.recruitmentEmail)}`
        : biLabel("대표 이메일로 통합 운영 중", "Terintegrasi dengan Email Utama");

    const switchBadges = [
      { label: biLabel("한국 본사 블록", "Blok Korea HQ"), on: Boolean(c.showKoreaHqBlock) },
      { label: biLabel("한국 본사 근무 기회", "Kerja di Korea HQ"), on: c.showKoreaHqWorkOpportunity !== false },
      { label: biLabel("단계별 로드맵", "Roadmap"), on: Boolean(c.showRegionalRoadmap) },
      { label: biLabel("다국어 스위치", "Sakelar Bahasa"), on: Boolean(c.languageSwitchVisible) },
      { label: biLabel("임직원 할인", "Diskon Brand"), on: Boolean(c.showEmployeeDiscountBenefit) },
      { label: biLabel("커리어 패스", "Jenjang Karir"), on: Boolean(c.showCareerPathBenefit) }
    ];

    panel.innerHTML = `
      <div class="widget-grid-4">
        <div class="summary-widget">
          <div>
            <small class="cms-hint">${biLabel("1. 현재 공식 이메일", "1. Email Resmi Saat Ini")}</small>
            <strong style="margin-top:6px; color:var(--cms-brand);">${escHtml(c.contactEmail || "-")}</strong>
            <p class="cms-hint">${recEmailStatus}</p>
          </div>
          <button type="button" class="btn btn-outline" onclick="AdminCMS.switchMenu('menu2')">
            ${biLabel("즉시 변경 →", "Ubah Sekarang →")}
          </button>
        </div>

        <div class="summary-widget">
          <div>
            <small class="cms-hint">${biLabel("2. 채용 공고 현황", "2. Status Lowongan Kerja")}</small>
            <strong style="margin-top:6px;">${activeJobs} / ${jobs.length} ${biLabel("직군 노출 중", "Posisi Aktif")}</strong>
            <p class="cms-hint">${biLabel("visible: TRUE 기준 실시간 노출", "Ditampilkan di halaman Karir (visible: TRUE)")}</p>
          </div>
          <button type="button" class="btn btn-outline" onclick="AdminCMS.switchMenu('menu4')">
            ${biLabel("채용 직군 관리 →", "Kelola Lowongan →")}
          </button>
        </div>

        <div class="summary-widget">
          <div>
            <small class="cms-hint">${biLabel("3. 브랜드 & 메뉴 현황", "3. Status Brand & Menu")}</small>
            <strong style="margin-top:6px;">${c.brandCount || catalog.length}${biLabel("개 브랜드", " Brand")} · ${totalMenus}${biLabel("개 메뉴", " Menu")}</strong>
            <p class="cms-hint">${biLabel("자동 치환: {brandCount} / {menuCount}", "Variabel otomatis: {brandCount} / {menuCount}")}</p>
          </div>
          <button type="button" class="btn btn-outline" onclick="AdminCMS.switchMenu('menu6')">
            ${biLabel("브랜드/메뉴 관리 →", "Kelola Brand & Menu →")}
          </button>
        </div>

        <div class="summary-widget">
          <div>
            <small class="cms-hint">${biLabel("4. 기능 스위치 요약", "4. Ringkasan Sakelar Fitur")}</small>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
              ${switchBadges
                .map(
                  (s) =>
                    `<span class="role-pill" style="background:${s.on ? "#DEF7EC" : "#F3F4F6"}; color:${
                      s.on ? "#03543F" : "#4B5563"
                    };">${s.label}: ${s.on ? "ON" : "OFF"}</span>`
                )
                .join("")}
            </div>
          </div>
          <button type="button" class="btn btn-outline" onclick="AdminCMS.switchMenu('menu2')">
            ${biLabel("스위치 제어 →", "Atur Sakelar →")}
          </button>
        </div>
      </div>

      <div class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <h2>${biLabel("최근 수정 및 접속 이력 (Audit Log 요약)", "Riwayat Perubahan & Akses Terbaru")}</h2>
          <button type="button" class="btn btn-secondary" onclick="AdminCMS.switchMenu('menu7')">
            ${biLabel("전체 감사 로그 & 롤백 보기 →", "Lihat Semua Log & Rollback →")}
          </button>
        </div>
        ${
          logs.length === 0
            ? `<p class="cms-hint">${biLabel("아직 기록된 변경 이력이 없습니다.", "Belum ada riwayat perubahan.")}</p>`
            : `<table class="audit-table">
                <thead>
                  <tr>
                    <th>${biLabel("시각", "Waktu")}</th>
                    <th>${biLabel("작업자", "Akun")}</th>
                    <th>${biLabel("작업 유형", "Aksi")}</th>
                    <th>${biLabel("변경 요약", "Ringkasan")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs
                    .map(
                      (l) => `
                    <tr>
                      <td>${escHtml(new Date(l.timestamp).toLocaleString())}</td>
                      <td><strong>${escHtml(l.actor)}</strong></td>
                      <td><span class="role-pill">${escHtml(l.action)}</span></td>
                      <td>${escHtml(l.summary)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>`
        }
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // [MENU 2] 🏢 회사 기본정보 · 이메일 · 연락처 · 노출 스위치 관리 (Pages 9–11)
  // --------------------------------------------------------------------------
  function renderMenu2Config() {
    const panel = document.getElementById("panel-menu2");
    if (!panel) return;
    const c = cmsState.workingData.config || {};
    const isStaffRestricted = cmsState.currentUser && cmsState.currentUser.role !== "super_admin";

    const switches = [
      {
        key: "showKoreaHqBlock",
        ko: "홈 화면 '한국 본사 (MUGGO Korea HQ)' 블록 노출 (showKoreaHqBlock)",
        id: "Tampilkan blok 'Kantor Pusat Korea (MUGGO Korea HQ)' di Beranda (showKoreaHqBlock)"
      },
      {
        key: "showKoreaHqWorkOpportunity",
        ko: "채용 페이지 '05 · 한국 본사 근무 기회 부여' 복지 카드 노출 (showKoreaHqWorkOpportunity)",
        id: "Tampilkan kartu manfaat '05 · Kesempatan Bekerja di Kantor Pusat Korea' (showKoreaHqWorkOpportunity)"
      },
      {
        key: "showRegionalRoadmap",
        ko: "홈 화면 '단계별 준비 로드맵' 노출 (showRegionalRoadmap)",
        id: "Tampilkan 'Roadmap Persiapan Bertahap' di Beranda (showRegionalRoadmap)"
      },
      {
        key: "languageSwitchVisible",
        ko: "상단 헤더 '다국어 전환 버튼 (ID / EN / KO)' 노출 (languageSwitchVisible)",
        id: "Tampilkan tombol bahasa (ID / EN / KO) di Header (languageSwitchVisible)"
      },
      {
        key: "showEmployeeDiscountBenefit",
        ko: "채용 복지 03번 '임직원 브랜드 할인 (Diskon Brand)' 문구 확장 (showEmployeeDiscountBenefit)",
        id: "Perluas teks manfaat 03 'Diskon Brand Karyawan' (showEmployeeDiscountBenefit)"
      },
      {
        key: "showCareerPathBenefit",
        ko: "채용 복지 04번 'Part Leader ~ Branch Manager 커리어 패스' 문구 확장 (showCareerPathBenefit)",
        id: "Perluas teks manfaat 04 'Jenjang Karir Part Leader ~ Branch Manager' (showCareerPathBenefit)"
      }
    ];

    panel.innerHTML = `
      <!-- ① 공식 이메일 및 입사지원 수신 채널 -->
      <div class="cms-card">
        <h2>${biLabel("① 공식 이메일 및 입사지원 수신 채널 (실무자 최우선 관리 항목)", "① Email Resmi & Saluran Penerimaan Lamaran")}</h2>
        <p class="cms-hint" style="margin-bottom:16px;">
          ${biLabel(
            "변경 시 홈 법인카드, 채용 안내, 문의 페이지, 푸터, 개인정보처리방침, 입사지원 모달의 수신처가 한 번에 모두 변경됩니다.",
            "Perubahan di sini otomatis memperbarui Kartu Identitas, Karir, Kontak, Footer, Kebijakan Privasi, dan Modal Lamaran."
          )}
        </p>

        <div class="form-group">
          <label>${biLabel("대표 공식 이메일 (Email Resmi Utama — contactEmail)", "Email Resmi Utama (contactEmail)")}</label>
          <input type="email" value="${escHtml(c.contactEmail)}" oninput="AdminCMS.updateConfigField('contactEmail', this.value)" />
          <p class="cms-hint">${biLabel("예: barasustainable@gmail.com 또는 추후 도메인 메일", "Contoh: barasustainable@gmail.com")}</p>
        </div>

        <div class="form-group">
          <label>${biLabel("채용 전용 이메일 (선택 — recruitmentEmail / Email Khusus Rekrutmen)", "Email Khusus Rekrutmen (Opsional — recruitmentEmail)")}</label>
          <input type="email" value="${escHtml(c.recruitmentEmail)}" placeholder="비워두면 대표 공식 이메일(contactEmail) 1개로 통합 표시됨" oninput="AdminCMS.updateConfigField('recruitmentEmail', this.value)" />
          <p class="cms-hint">${biLabel("비워두면 contactEmail 하나로 통합 표시되며, 입력 시 '일반·제휴 이메일'과 '공식 채용 이메일'이 자동 분리 노출됩니다.", "Jika dikosongkan, situs hanya menampilkan contactEmail satu kali.")}</p>
        </div>

        <div class="form-group">
          <label>${biLabel("공식 WhatsApp 번호 (Nomor WhatsApp Resmi — whatsappNumber)", "Nomor WhatsApp Resmi (whatsappNumber)")}</label>
          <input type="text" value="${escHtml(c.whatsappNumber)}" placeholder="비워두면 사이트 전체에서 모든 WhatsApp 버튼이 자동 숨겨짐 (예: 6281234567890)" oninput="AdminCMS.updateConfigField('whatsappNumber', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("웹 지원서 수신 URL (URL Endpoint Formulir Web — applyFormEndpoint)", "URL Endpoint Formulir Web (applyFormEndpoint)")}</label>
          <input type="url" value="${escHtml(c.applyFormEndpoint)}" placeholder="비워두면 웹 폼 버튼 숨김 (Google Forms 등 URL 입력 시 자동 활성화)" oninput="AdminCMS.updateConfigField('applyFormEndpoint', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("입사지원 창 개인정보 안내문 (Catatan Privasi Lamaran — applyPrivacyNotice)", "Catatan Privasi Modal Lamaran (applyPrivacyNotice)")}</label>
          <textarea rows="2" placeholder="비워두면 입사지원 모달 하단 안내문이 숨겨집니다." oninput="AdminCMS.updateConfigField('applyPrivacyNotice', this.value)">${escHtml(c.applyPrivacyNotice)}</textarea>
        </div>
      </div>

      <!-- ② 법인 정체성 · 주소 · 대표자 정보 · 브랜드 수 -->
      <div class="cms-card">
        <h2>${biLabel("② 법인 정체성 · 주소 · 대표자 정보 · 브랜드 수", "② Identitas Badan Hukum, Alamat, Pimpinan & Jumlah Brand")}</h2>
        ${
          isStaffRestricted
            ? `<div class="alert-box alert-warning">${biLabel("실무자(Editor) 계정은 법인명 및 공식 등록 주소 임의 삭제가 제한됩니다.", "Akun Staf (Editor) dibatasi untuk mengubah nama PT dan alamat hukum.")}</div>`
            : ""
        }

        <div class="form-group">
          <label>${biLabel("공식 법인명 (legalName)", "Nama Badan Hukum Resmi (legalName)")}</label>
          <input type="text" value="${escHtml(c.legalName)}" ${isStaffRestricted ? "disabled" : ""} oninput="AdminCMS.updateConfigField('legalName', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("공식 브랜드명 (brandName)", "Nama Merek Usaha (brandName)")}</label>
          <input type="text" value="${escHtml(c.brandName)}" ${isStaffRestricted ? "disabled" : ""} oninput="AdminCMS.updateConfigField('brandName', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("공식 등록 주소 (address)", "Alamat Terdaftar Resmi (address)")}</label>
          <input type="text" value="${escHtml(c.address)}" ${isStaffRestricted ? "disabled" : ""} oninput="AdminCMS.updateConfigField('address', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("총 브랜드 수 (brandCount — 변경 시 {brandCount} 및 {menuCount} 자동 재계산)", "Total Jumlah Brand (brandCount — otomatis menghitung {menuCount})")}</label>
          <input type="number" min="1" max="100" value="${Number(c.brandCount || 30)}" oninput="AdminCMS.updateConfigField('brandCount', Number(this.value || 30))" />
          <p class="cms-hint" id="brand-count-calc-hint">현재 {brandCount} = ${Number(c.brandCount || 30)} / 자동 계산 {menuCount} = ${Number(c.brandCount || 30) * 10}</p>
        </div>

        <div class="form-group">
          <label>${biLabel("대표이사(Direktur Utama) 성명 (ceoName — 비워두면 직함만 표시)", "Nama Direktur Utama (ceoName — kosongkan untuk menampilkan jabatan saja)")}</label>
          <input type="text" value="${escHtml(c.ceoName)}" placeholder="비워두면 성명 없이 Direktur Utama 직함만 깔끔하게 표시" oninput="AdminCMS.updateConfigField('ceoName', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("대표이사 프로필 이미지 URL (ceoPortraitUrl — 1:1 600x600, 비워두면 영역 숨김)", "URL Foto Profil Direktur Utama (ceoPortraitUrl — kosongkan untuk menyembunyikan slot)")}</label>
          <input type="text" value="${escHtml(c.ceoPortraitUrl)}" placeholder="비워두면 프로필 슬롯 숨김 (https:// 또는 assets/... 경로)" oninput="AdminCMS.updateConfigField('ceoPortraitUrl', this.value)" />
        </div>
      </div>

      <!-- ③ 소셜 미디어 · 외부 링크 · 외부 시트 연동 -->
      <div class="cms-card">
        <h2>${biLabel("③ 소셜 미디어 · 외부 링크 · Google Sheets CSV 연동", "③ Media Sosial, Tautan Eksternal & Google Sheets CSV")}</h2>

        <div class="form-group">
          <label>${biLabel("공식 Instagram URL (instagramUrl — 본문 내 @아이디 자동 추출)", "URL Instagram Resmi (instagramUrl)")}</label>
          <input type="url" value="${escHtml(c.instagramUrl)}" oninput="AdminCMS.updateConfigField('instagramUrl', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("공식 TikTok URL (tiktokUrl — 본문 내 @아이디 자동 추출)", "URL TikTok Resmi (tiktokUrl)")}</label>
          <input type="url" value="${escHtml(c.tiktokUrl)}" oninput="AdminCMS.updateConfigField('tiktokUrl', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("한국 본사 웹사이트 URL (koreaHqUrl — 비워두면 외부 링크 버튼 숨김)", "URL Situs Kantor Pusat Korea (koreaHqUrl)")}</label>
          <input type="url" value="${escHtml(c.koreaHqUrl)}" placeholder="비워두면 한국 본사 외부 링크 버튼 숨김" oninput="AdminCMS.updateConfigField('koreaHqUrl', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("배달 앱 출시 상태 (deliveryAppMode) 및 스토어 링크 (deliveryAppUrl)", "Status Aplikasi Delivery (deliveryAppMode & deliveryAppUrl)")}</label>
          <div style="display:flex; gap:16px; margin-bottom:8px;">
            <label style="display:inline-flex; align-items:center; gap:6px; font-weight:600;">
              <input type="radio" name="deliveryAppModeRadio" value="coming_soon" ${c.deliveryAppMode !== "active" ? "checked" : ""} onchange="AdminCMS.updateConfigField('deliveryAppMode', 'coming_soon')" />
              ${biLabel("오픈 준비중 (Segera Hadir 비활성 표시)", "Segera Hadir (Nonaktif)")}
            </label>
            <label style="display:inline-flex; align-items:center; gap:6px; font-weight:600;">
              <input type="radio" name="deliveryAppModeRadio" value="active" ${c.deliveryAppMode === "active" ? "checked" : ""} onchange="AdminCMS.updateConfigField('deliveryAppMode', 'active')" />
              ${biLabel("앱 다운로드 활성 (active)", "Aktifkan Unduhan Aplikasi")}
            </label>
          </div>
          <input type="url" value="${escHtml(c.deliveryAppUrl)}" placeholder="앱 스토어 URL (deliveryAppUrl)" oninput="AdminCMS.updateConfigField('deliveryAppUrl', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("Google Sheets 소식/공지 CSV URL (newsSheetCsvUrl)", "URL CSV Google Sheets Berita (newsSheetCsvUrl)")}</label>
          <input type="url" value="${escHtml(c.newsSheetCsvUrl)}" placeholder="비워두면 관리자 페이지의 자체 소식(articles) 데이터를 표시합니다." oninput="AdminCMS.updateConfigField('newsSheetCsvUrl', this.value)" />
        </div>

        <div class="form-group">
          <label>${biLabel("Google Sheets 채용 공고 CSV URL (jobsSheetCsvUrl)", "URL CSV Google Sheets Lowongan Kerja (jobsSheetCsvUrl)")}</label>
          <input type="url" value="${escHtml(c.jobsSheetCsvUrl)}" placeholder="비워두면 관리자 페이지의 자체 11개 채용(jobs) 데이터를 표시합니다." oninput="AdminCMS.updateConfigField('jobsSheetCsvUrl', this.value)" />
        </div>
      </div>

      <!-- ④ 기능 노출 ON / OFF 스위치 (토글 버튼 6종) -->
      <div class="cms-card">
        <h2>${biLabel("④ 기능 노출 ON / OFF 스위치 (토글 버튼 6종)", "④ Sakelar Fitur ON / OFF (6 Sakelar Utama)")}</h2>
        <p class="cms-hint" style="margin-bottom:14px;">
          ${biLabel("실무자가 코드 수정 없이 스위치 클릭 한 번으로 사이트 섹션을 켜고 끌 수 있는 제어판입니다.", "Aktifkan atau sembunyikan bagian situs dengan satu klik tanpa menyentuh kode.")}
        </p>

        ${switches
          .map((sw) => {
            const isOn = sw.key === "showKoreaHqWorkOpportunity" ? c[sw.key] !== false : Boolean(c[sw.key]);
            return `
              <div class="switch-row">
                <div>
                  <strong>${biLabel(sw.ko, sw.id)}</strong>
                </div>
                <button type="button" class="switch-toggle-btn ${isOn ? "on" : "off"}" onclick="AdminCMS.toggleConfigSwitch('${sw.key}')">
                  ${isOn ? "🟢 ON" : "⚪ OFF"}
                </button>
              </div>
            `;
          })
          .join("")}

        <div class="form-group" style="margin-top:14px;">
          <label>${biLabel("출시 기본 표시 언어 (defaultLanguage — 기본값 id 인도네시아어)", "Bahasa Default Situs (defaultLanguage)")}</label>
          <select onchange="AdminCMS.updateConfigField('defaultLanguage', this.value)">
            <option value="id" ${(c.defaultLanguage || "id") === "id" ? "selected" : ""}>id — Bahasa Indonesia (인도네시아어 기본)</option>
            <option value="ko" ${c.defaultLanguage === "ko" ? "selected" : ""}>ko — 한국어</option>
            <option value="en" ${c.defaultLanguage === "en" ? "selected" : ""}>en — English</option>
          </select>
        </div>
      </div>
    `;
  }

  function updateConfigField(key, rawVal) {
    const val = typeof rawVal === "string" ? sanitizeText(rawVal) : rawVal;
    cmsState.workingData.config[key] = val;
    if (key === "brandCount") {
      const hint = document.getElementById("brand-count-calc-hint");
      if (hint) {
        hint.textContent = `현재 {brandCount} = ${Number(val || 30)} / 자동 계산 {menuCount} = ${Number(val || 30) * 10}`;
      }
    }
  }

  function toggleConfigSwitch(key) {
    const cur = key === "showKoreaHqWorkOpportunity" ? cmsState.workingData.config[key] !== false : Boolean(cmsState.workingData.config[key]);
    cmsState.workingData.config[key] = !cur;
    renderMenu2Config();
    renderMenu1Dashboard();
  }

  // --------------------------------------------------------------------------
  // [MENU 3] 📝 전 페이지 문구 통합 관리 (data/i18n.js 8 Page Tabs, Pages 12–14)
  // --------------------------------------------------------------------------
  function collectLeafPaths(obj, prefix, out) {
    if (typeof obj === "string") {
      out.push(prefix);
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => collectLeafPaths(item, `${prefix}.${idx}`, out));
      return;
    }
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((k) => {
        if (k === "id" || k === "route" || k === "icon" || k === "flag" || k === "visibleFlag" || k === "visualType") return;
        collectLeafPaths(obj[k], prefix ? `${prefix}.${k}` : k, out);
      });
    }
  }

  function renderMenu3I18n() {
    const panel = document.getElementById("panel-menu3");
    if (!panel) return;
    const tabs = window.ADMIN_I18N_TABS_SCHEMA || [];
    const activeTabObj = tabs.find((t) => t.id === cmsState.activeMenu3Tab) || tabs[0];

    const idDict = (cmsState.workingData.i18n && cmsState.workingData.i18n.id) || {};
    const enDict = (cmsState.workingData.i18n && cmsState.workingData.i18n.en) || {};
    const koDict = (cmsState.workingData.i18n && cmsState.workingData.i18n.ko) || {};

    const leafPaths = [];
    if (activeTabObj) {
      activeTabObj.prefixes.forEach((pref) => {
        if (idDict[pref] !== undefined) {
          collectLeafPaths(idDict[pref], pref, leafPaths);
        }
      });
    }

    panel.innerHTML = `
      <div class="subtab-bar">
        ${tabs
          .map(
            (t) => `
          <button type="button" class="subtab-btn ${t.id === activeTabObj.id ? "active" : ""}" onclick="AdminCMS.switchMenu3Tab('${t.id}')">
            ${biLabel(t.labelKo, t.labelId)}
          </button>
        `
          )
          .join("")}
      </div>

      ${renderVarInsertBarHtml()}

      <div class="cms-card">
        <h2>${biLabel(activeTabObj.labelKo, activeTabObj.labelId)}</h2>
        <p class="cms-hint" style="margin-bottom:16px;">
          ${biLabel(
            "인도네시아어(ID) · 영어(EN) · 한국어(KO) 문구를 한 화면에서 비교·수정합니다. 기존 문구에 있던 {legalName} 등 치환 변수가 삭제되면 저장 시 보호 알림이 작동합니다.",
            "Bandingkan dan edit teks Bahasa Indonesia (ID), Inggris (EN), dan Korea (KO) secara berdampingan."
          )}
        </p>

        ${leafPaths
          .map((pathStr) => {
            const valId = String(getByPath(idDict, pathStr) || "");
            const valEn = String(getByPath(enDict, pathStr) || "");
            const valKo = String(getByPath(koDict, pathStr) || "");
            const isLong = Math.max(valId.length, valEn.length, valKo.length) > 70;
            return `
              <div class="trilang-row">
                <div class="trilang-row-header">
                  <code>data/i18n.js → ${escHtml(pathStr)}</code>
                </div>
                <div class="trilang-grid">
                  <div>
                    <span class="lang-col-label">ID · Bahasa Indonesia (기본 노출)</span>
                    ${
                      isLong
                        ? `<textarea rows="3" oninput="AdminCMS.updateI18nPath('id', '${pathStr}', this.value)">${escHtml(valId)}</textarea>`
                        : `<input type="text" value="${escHtml(valId)}" oninput="AdminCMS.updateI18nPath('id', '${pathStr}', this.value)" />`
                    }
                  </div>
                  <div>
                    <span class="lang-col-label">EN · English</span>
                    ${
                      isLong
                        ? `<textarea rows="3" oninput="AdminCMS.updateI18nPath('en', '${pathStr}', this.value)">${escHtml(valEn)}</textarea>`
                        : `<input type="text" value="${escHtml(valEn)}" oninput="AdminCMS.updateI18nPath('en', '${pathStr}', this.value)" />`
                    }
                  </div>
                  <div>
                    <span class="lang-col-label">KO · 한국어</span>
                    ${
                      isLong
                        ? `<textarea rows="3" oninput="AdminCMS.updateI18nPath('ko', '${pathStr}', this.value)">${escHtml(valKo)}</textarea>`
                        : `<input type="text" value="${escHtml(valKo)}" oninput="AdminCMS.updateI18nPath('ko', '${pathStr}', this.value)" />`
                    }
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function switchMenu3Tab(tabId) {
    cmsState.activeMenu3Tab = tabId;
    renderMenu3I18n();
  }

  function updateI18nPath(lang, pathStr, rawVal) {
    const clean = sanitizeText(rawVal);
    if (!cmsState.workingData.i18n[lang]) cmsState.workingData.i18n[lang] = {};
    setByPath(cmsState.workingData.i18n[lang], pathStr, clean);
  }

  // --------------------------------------------------------------------------
  // [MENU 4] 👥 채용 공고 관리 (data/site-data.js → jobs 11개 직군+, Pages 14–15)
  // --------------------------------------------------------------------------
  function renderMenu4Jobs() {
    const panel = document.getElementById("panel-menu4");
    if (!panel) return;
    const jobs = (cmsState.workingData.siteData && cmsState.workingData.siteData.jobs) || [];

    panel.innerHTML = `
      <div class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h2>${biLabel("모집 직군 관리 (현재 총 " + jobs.length + "개 직군)", "Kelola Posisi Lowongan Kerja (Total " + jobs.length + " Posisi)")}</h2>
            <p class="cms-hint">${biLabel("구직자가 Lamar 버튼 클릭 시 입사지원서 제목(Lamaran: <직군명>)에 자동 반영됩니다.", "Nama posisi otomatis terisi saat pelamar menekan tombol Lamar Posisi Ini.")}</p>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <button type="button" class="btn btn-primary" onclick="AdminCMS.addJobItem()">
              ${biLabel("+ 신규 직군 추가", "+ Tambah Posisi Baru")}
            </button>
            <button type="button" class="btn btn-secondary" onclick="AdminCMS.exportJobsCsv()">
              ${biLabel("📥 jobs.csv 내보내기", "📥 Ekspor jobs.csv")}
            </button>
            <label class="btn btn-secondary" style="margin:0; cursor:pointer;">
              ${biLabel("📤 jobs.csv 가져오기", "📤 Impor jobs.csv")}
              <input type="file" accept=".csv,text/csv" hidden onchange="AdminCMS.importJobsCsv(event)" />
            </label>
          </div>
        </div>

        ${jobs
          .map((j, idx) => {
            const isVis = j.visible !== false && String(j.visible).toUpperCase() !== "FALSE";
            return `
              <div class="trilang-row" style="border-left:4px solid ${isVis ? "var(--cms-brand)" : "#9CA3AF"};">
                <div class="trilang-row-header" style="flex-wrap:wrap; gap:10px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="role-pill">#${idx + 1} · ${escHtml(j.id)}</span>
                    <strong>${escHtml(j.titleId || j.title)}</strong>
                  </div>
                  <div style="display:flex; align-items:center; gap:6px;">
                    <button type="button" class="switch-toggle-btn ${isVis ? "on" : "off"}" onclick="AdminCMS.toggleJobVisible(${idx})">
                      ${isVis ? "🟢 모집중 (TRUE)" : "⚪ 마감/숨김 (FALSE)"}
                    </button>
                    <button type="button" class="btn-mini" onclick="AdminCMS.moveJob(${idx}, -1)" ${idx === 0 ? "disabled" : ""}>▲</button>
                    <button type="button" class="btn-mini" onclick="AdminCMS.moveJob(${idx}, 1)" ${idx === jobs.length - 1 ? "disabled" : ""}>▼</button>
                    ${
                      idx >= 11
                        ? `<button type="button" class="btn-mini btn-mini-danger" onclick="AdminCMS.removeJob(${idx})">${biLabel("삭제", "Hapus")}</button>`
                        : ""
                    }
                  </div>
                </div>

                <!-- 3-Language Job Title -->
                <div class="trilang-grid" style="margin-bottom:10px;">
                  <div>
                    <span class="lang-col-label">직군명 (ID · 인도네시아어 / 기본 title)</span>
                    <input type="text" value="${escHtml(j.titleId || j.title || "")}" oninput="AdminCMS.updateJobField(${idx}, 'titleId', this.value); AdminCMS.updateJobField(${idx}, 'title', this.value);" />
                  </div>
                  <div>
                    <span class="lang-col-label">직군명 (EN · 영어 titleEn)</span>
                    <input type="text" value="${escHtml(j.titleEn || "")}" oninput="AdminCMS.updateJobField(${idx}, 'titleEn', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">직군명 (KO · 한국어 titleKo)</span>
                    <input type="text" value="${escHtml(j.titleKo || "")}" oninput="AdminCMS.updateJobField(${idx}, 'titleKo', this.value)" />
                  </div>
                </div>

                <!-- 3-Language Department & Employment Type / Location -->
                <div class="trilang-grid" style="margin-bottom:10px;">
                  <div>
                    <span class="lang-col-label">부서명 (ID · deptId / department)</span>
                    <input type="text" value="${escHtml(j.deptId || j.department || "")}" oninput="AdminCMS.updateJobField(${idx}, 'deptId', this.value); AdminCMS.updateJobField(${idx}, 'department', this.value);" />
                  </div>
                  <div>
                    <span class="lang-col-label">부서명 (EN · deptEn)</span>
                    <input type="text" value="${escHtml(j.deptEn || "")}" oninput="AdminCMS.updateJobField(${idx}, 'deptEn', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">부서명 (KO · deptKo)</span>
                    <input type="text" value="${escHtml(j.deptKo || "")}" oninput="AdminCMS.updateJobField(${idx}, 'deptKo', this.value)" />
                  </div>
                </div>

                <div class="trilang-grid" style="margin-bottom:10px;">
                  <div>
                    <span class="lang-col-label">고용형태·경력 (ID · typeId)</span>
                    <input type="text" value="${escHtml(j.typeId || j.employmentType || "")}" oninput="AdminCMS.updateJobField(${idx}, 'typeId', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">고용형태·경력 (EN · typeEn)</span>
                    <input type="text" value="${escHtml(j.typeEn || "")}" oninput="AdminCMS.updateJobField(${idx}, 'typeEn', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">고용형태·경력 (KO · typeKo) &amp; 근무지 (location)</span>
                    <div style="display:flex; gap:6px;">
                      <input type="text" value="${escHtml(j.typeKo || "")}" placeholder="정규직 · 경력" oninput="AdminCMS.updateJobField(${idx}, 'typeKo', this.value)" />
                      <input type="text" value="${escHtml(j.location || "Jakarta Selatan")}" placeholder="Jakarta Selatan" oninput="AdminCMS.updateJobField(${idx}, 'location', this.value)" />
                    </div>
                  </div>
                </div>

                <!-- 3-Language Job Description & Requirements -->
                <div class="trilang-grid">
                  <div>
                    <span class="lang-col-label">직무 상세 설명 (ID · descId / description)</span>
                    <textarea rows="3" oninput="AdminCMS.updateJobField(${idx}, 'descId', this.value); AdminCMS.updateJobField(${idx}, 'description', this.value);">${escHtml(j.descId || j.description || "")}</textarea>
                    <span class="lang-col-label" style="margin-top:6px;">자격 요건 (requirements — 선택)</span>
                    <input type="text" value="${escHtml(j.requirements || "")}" oninput="AdminCMS.updateJobField(${idx}, 'requirements', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">직무 상세 설명 (EN · descEn)</span>
                    <textarea rows="4" oninput="AdminCMS.updateJobField(${idx}, 'descEn', this.value)">${escHtml(j.descEn || "")}</textarea>
                  </div>
                  <div>
                    <span class="lang-col-label">직무 상세 설명 (KO · descKo)</span>
                    <textarea rows="4" oninput="AdminCMS.updateJobField(${idx}, 'descKo', this.value)">${escHtml(j.descKo || "")}</textarea>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function updateJobField(idx, field, rawVal) {
    const jobs = cmsState.workingData.siteData.jobs;
    if (!jobs || !jobs[idx]) return;
    jobs[idx][field] = sanitizeText(rawVal);
  }

  function toggleJobVisible(idx) {
    const jobs = cmsState.workingData.siteData.jobs;
    if (!jobs || !jobs[idx]) return;
    const cur = jobs[idx].visible !== false && String(jobs[idx].visible).toUpperCase() !== "FALSE";
    jobs[idx].visible = !cur;
    renderMenu4Jobs();
    renderMenu1Dashboard();
  }

  function moveJob(idx, dir) {
    const jobs = cmsState.workingData.siteData.jobs;
    const target = idx + dir;
    if (!jobs || target < 0 || target >= jobs.length) return;
    const temp = jobs[idx];
    jobs[idx] = jobs[target];
    jobs[target] = temp;
    renderMenu4Jobs();
  }

  function addJobItem() {
    const jobs = cmsState.workingData.siteData.jobs;
    const nextNum = jobs.length + 1;
    jobs.push({
      id: `job-${nextNum}`,
      visible: true,
      title: `${nextNum}. Staf Operasional Baru (Posisi Baru)`,
      department: "Operasional",
      employmentType: "Penuh Waktu (Full-Time)",
      experience: "Terbuka untuk berpengalaman",
      location: "Jakarta Selatan",
      description: "Deskripsi tugas operasional dan kualifikasi pelamar.",
      requirements: "Pengalaman di bidang terkait dan sikap kerja yang baik.",
      titleId: `${nextNum}. Staf Operasional Baru (Posisi Baru)`,
      titleEn: `${nextNum}. New Operations Specialist`,
      titleKo: `${nextNum}. 신규 채용 직군 (${nextNum}번 직군)`,
      deptId: "Operasional",
      deptEn: "Operations",
      deptKo: "운영팀",
      typeId: "Penuh Waktu · Jakarta Selatan",
      typeEn: "Full-Time · South Jakarta",
      typeKo: "정규직 · 자카르타 남부",
      descId: "Deskripsi tugas operasional dan kualifikasi pelamar.",
      descEn: "Operational responsibilities and applicant qualifications.",
      descKo: "담당 직무 상세 설명 및 지원 자격 요건입니다."
    });
    renderMenu4Jobs();
    renderMenu1Dashboard();
  }

  function removeJob(idx) {
    const jobs = cmsState.workingData.siteData.jobs;
    if (!jobs || idx < 11) return;
    jobs.splice(idx, 1);
    renderMenu4Jobs();
    renderMenu1Dashboard();
  }

  function csvEscape(val) {
    const s = String(val == null ? "" : val);
    if (/[",\r\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  function exportJobsCsv() {
    const jobs = cmsState.workingData.siteData.jobs || [];
    const header = ["id", "title", "department", "employmentType", "experience", "location", "description", "requirements", "visible"];
    const rows = [header.join(",")];
    jobs.forEach((j) => {
      rows.push(
        [
          j.id,
          j.titleId || j.title,
          j.deptId || j.department,
          j.employmentType || "Penuh Waktu (Full-Time)",
          j.experience || "",
          j.location || "Jakarta Selatan",
          j.descId || j.description,
          j.requirements || "",
          j.visible !== false ? "TRUE" : "FALSE"
        ]
          .map(csvEscape)
          .join(",")
      );
    });
    downloadBlob(rows.join("\r\n"), "jobs.csv", "text/csv;charset=utf-8");
  }

  function parseCsvSimple(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    const src = String(text || "").replace(/^\uFEFF/, "");
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      const next = src[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\r" && next === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
      } else if (ch === "\n" || ch === "\r") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function importJobsCsv(e) {
    const file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      const rows = parseCsvSimple(reader.result);
      if (rows.length < 2) return;
      const headers = rows[0].map((h) => h.trim());
      const imported = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (r.every((c) => !c.trim())) continue;
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = sanitizeText((r[idx] || "").trim());
        });
        if (!obj.title) continue;
        imported.push({
          id: obj.id || `job-${i}`,
          visible: String(obj.visible || "TRUE").toUpperCase() === "TRUE",
          title: obj.title,
          department: obj.department || "",
          employmentType: obj.employmentType || "Penuh Waktu",
          experience: obj.experience || "",
          location: obj.location || "Jakarta Selatan",
          description: obj.description || "",
          requirements: obj.requirements || "",
          titleId: obj.title,
          titleEn: obj.title,
          titleKo: obj.title,
          deptId: obj.department || "",
          deptEn: obj.department || "",
          deptKo: obj.department || "",
          typeId: [obj.employmentType, obj.experience, obj.location].filter(Boolean).join(" · "),
          typeEn: [obj.employmentType, obj.experience, obj.location].filter(Boolean).join(" · "),
          typeKo: [obj.employmentType, obj.experience, obj.location].filter(Boolean).join(" · "),
          descId: obj.description || "",
          descEn: obj.description || "",
          descKo: obj.description || ""
        });
      }
      if (imported.length > 0) {
        cmsState.workingData.siteData.jobs = imported;
        renderMenu4Jobs();
        renderMenu1Dashboard();
        showToast(`CSV에서 ${imported.length}개 채용 직군을 가져왔습니다.`);
      }
    };
    reader.readAsText(file);
  }

  // --------------------------------------------------------------------------
  // [MENU 5] 📰 소식/공지 (articles) · 핵심 지표 (metrics) · 법적 각주 (footnotes) (Page 15)
  // --------------------------------------------------------------------------
  function renderMenu5Content() {
    const panel = document.getElementById("panel-menu5");
    if (!panel) return;
    const sd = cmsState.workingData.siteData || {};
    const articles = sd.articles || [];
    const metrics = sd.metrics || [];
    const footnotes = sd.footnotes || [];
    const tab = cmsState.activeMenu5Tab || "articles";

    let bodyHtml = "";
    if (tab === "articles") {
      bodyHtml = `
        <div class="cms-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
            <div>
              <h2>${biLabel("1. 소식 및 공지사항 관리 (articles)", "1. Kelola Berita & Pengumuman (articles)")}</h2>
              <p class="cms-hint">${biLabel("upcoming 선택 시 'Akan Datang' 예정 배지가 표시되며, published 선택 시 입력한 날짜(YYYY-MM-DD)가 표시됩니다.", "Status upcoming menampilkan label 'Akan Datang'; status published menampilkan tanggal.")}</p>
            </div>
            <button type="button" class="btn btn-primary" onclick="AdminCMS.addArticleItem()">
              ${biLabel("+ 새 공지사항 추가", "+ Tambah Berita Baru")}
            </button>
          </div>

          ${articles
            .map((art, idx) => {
              const isVis = art.visible !== false && String(art.visible).toUpperCase() !== "FALSE";
              return `
                <div class="trilang-row">
                  <div class="trilang-row-header" style="flex-wrap:wrap; gap:8px;">
                    <strong>${escHtml(art.id)} · ${escHtml(art.titleId || art.title)}</strong>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <button type="button" class="switch-toggle-btn ${isVis ? "on" : "off"}" onclick="AdminCMS.toggleArticleVisible(${idx})">
                        ${isVis ? "🟢 노출 (TRUE)" : "⚪ 숨김 (FALSE)"}
                      </button>
                      <button type="button" class="btn-mini btn-mini-danger" onclick="AdminCMS.removeArticle(${idx})">${biLabel("삭제", "Hapus")}</button>
                    </div>
                  </div>

                  <div class="trilang-grid" style="margin-bottom:10px;">
                    <div>
                      <span class="lang-col-label">게시 상태 (status: upcoming vs published)</span>
                      <select onchange="AdminCMS.updateArticleField(${idx}, 'status', this.value)">
                        <option value="upcoming" ${art.status !== "published" ? "selected" : ""}>upcoming (Akan Datang 예정 배지 표시)</option>
                        <option value="published" ${art.status === "published" ? "selected" : ""}>published (실제 게시 날짜 표시)</option>
                      </select>
                    </div>
                    <div>
                      <span class="lang-col-label">게시일 (date: YYYY-MM-DD, published일 때 표시)</span>
                      <input type="text" value="${escHtml(art.date || "")}" placeholder="예: 2026-11-15" oninput="AdminCMS.updateArticleField(${idx}, 'date', this.value)" />
                    </div>
                    <div>
                      <span class="lang-col-label">썸네일 경로 (image / imageUrl) &amp; 대체 텍스트 (altId)</span>
                      <input type="text" value="${escHtml(art.imageUrl || art.image || "")}" placeholder="assets/slots/news-1.jpg 또는 https://..." oninput="AdminCMS.updateArticleField(${idx}, 'image', this.value); AdminCMS.updateArticleField(${idx}, 'imageUrl', this.value);" />
                    </div>
                  </div>

                  <div class="trilang-grid" style="margin-bottom:10px;">
                    <div>
                      <span class="lang-col-label">카테고리 &amp; 제목 (ID · 인도네시아어)</span>
                      <input type="text" value="${escHtml(art.categoryId || "")}" placeholder="카테고리 (ID)" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'categoryId', this.value)" />
                      <input type="text" value="${escHtml(art.titleId || art.title || "")}" placeholder="제목 (ID)" oninput="AdminCMS.updateArticleField(${idx}, 'titleId', this.value); AdminCMS.updateArticleField(${idx}, 'title', this.value);" />
                    </div>
                    <div>
                      <span class="lang-col-label">카테고리 &amp; 제목 (EN · 영어)</span>
                      <input type="text" value="${escHtml(art.categoryEn || "")}" placeholder="Category (EN)" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'categoryEn', this.value)" />
                      <input type="text" value="${escHtml(art.titleEn || "")}" placeholder="Title (EN)" oninput="AdminCMS.updateArticleField(${idx}, 'titleEn', this.value)" />
                    </div>
                    <div>
                      <span class="lang-col-label">카테고리 &amp; 제목 (KO · 한국어)</span>
                      <input type="text" value="${escHtml(art.categoryKo || "")}" placeholder="카테고리 (KO)" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'categoryKo', this.value)" />
                      <input type="text" value="${escHtml(art.titleKo || "")}" placeholder="제목 (KO)" oninput="AdminCMS.updateArticleField(${idx}, 'titleKo', this.value)" />
                    </div>
                  </div>

                  <div class="trilang-grid">
                    <div>
                      <span class="lang-col-label">요약문 &amp; 본문 (ID · summaryId / contentId)</span>
                      <textarea rows="2" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'summaryId', this.value); AdminCMS.updateArticleField(${idx}, 'summary', this.value);">${escHtml(art.summaryId || art.summary || "")}</textarea>
                      <textarea rows="4" oninput="AdminCMS.updateArticleField(${idx}, 'contentId', this.value)">${escHtml(art.contentId || "")}</textarea>
                    </div>
                    <div>
                      <span class="lang-col-label">요약문 &amp; 본문 (EN · summaryEn / contentEn)</span>
                      <textarea rows="2" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'summaryEn', this.value)">${escHtml(art.summaryEn || "")}</textarea>
                      <textarea rows="4" oninput="AdminCMS.updateArticleField(${idx}, 'contentEn', this.value)">${escHtml(art.contentEn || "")}</textarea>
                    </div>
                    <div>
                      <span class="lang-col-label">요약문 &amp; 본문 (KO · summaryKo / contentKo)</span>
                      <textarea rows="2" style="margin-bottom:6px;" oninput="AdminCMS.updateArticleField(${idx}, 'summaryKo', this.value)">${escHtml(art.summaryKo || "")}</textarea>
                      <textarea rows="4" oninput="AdminCMS.updateArticleField(${idx}, 'contentKo', this.value)">${escHtml(art.contentKo || "")}</textarea>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    } else if (tab === "metrics") {
      bodyHtml = `
        <div class="cms-card">
          <h2>${biLabel("2. 홈 핵심 지표 카드 6종 관리 (metrics — m1 ~ m6)", "2. Kelola 6 Kartu Metrik Target Beranda (metrics — m1 ~ m6)")}</h2>
          ${renderVarInsertBarHtml()}
          ${metrics
            .map(
              (m, idx) => `
              <div class="trilang-row">
                <div class="trilang-row-header">
                  <strong>${escHtml(m.id)} · ${escHtml(m.numberId)} (${escHtml(m.labelKo)})</strong>
                </div>
                <div class="trilang-grid">
                  <div>
                    <span class="lang-col-label">ID · 인도네시아어 (숫자 / 라벨 / 배지 / 설명)</span>
                    <input type="text" value="${escHtml(m.numberId)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'numberId', this.value)" />
                    <input type="text" value="${escHtml(m.labelId)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'labelId', this.value)" />
                    <input type="text" value="${escHtml(m.badgeId)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'badgeId', this.value)" />
                    <textarea rows="2" oninput="AdminCMS.updateMetricField(${idx}, 'descId', this.value)">${escHtml(m.descId)}</textarea>
                  </div>
                  <div>
                    <span class="lang-col-label">EN · 영어 (Number / Label / Badge / Desc)</span>
                    <input type="text" value="${escHtml(m.numberEn)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'numberEn', this.value)" />
                    <input type="text" value="${escHtml(m.labelEn)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'labelEn', this.value)" />
                    <input type="text" value="${escHtml(m.badgeEn)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'badgeEn', this.value)" />
                    <textarea rows="2" oninput="AdminCMS.updateMetricField(${idx}, 'descEn', this.value)">${escHtml(m.descEn)}</textarea>
                  </div>
                  <div>
                    <span class="lang-col-label">KO · 한국어 (숫자 / 라벨 / 배지 / 설명)</span>
                    <input type="text" value="${escHtml(m.numberKo)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'numberKo', this.value)" />
                    <input type="text" value="${escHtml(m.labelKo)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'labelKo', this.value)" />
                    <input type="text" value="${escHtml(m.badgeKo)}" style="margin-bottom:5px;" oninput="AdminCMS.updateMetricField(${idx}, 'badgeKo', this.value)" />
                    <textarea rows="2" oninput="AdminCMS.updateMetricField(${idx}, 'descKo', this.value)">${escHtml(m.descKo)}</textarea>
                  </div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="cms-card">
          <h2>${biLabel("3. 하단 법적 고지 각주 4종 관리 (footnotes — fn-1 ~ fn-4)", "3. Kelola 4 Catatan Kaki Hukum (footnotes — fn-1 ~ fn-4)")}</h2>
          ${renderVarInsertBarHtml()}
          ${footnotes
            .map(
              (fn, idx) => `
              <div class="trilang-row">
                <div class="trilang-row-header">
                  <strong>${escHtml(fn.id)} · ${escHtml(fn.titleKo)}</strong>
                </div>
                <div class="trilang-grid">
                  <div>
                    <span class="lang-col-label">ID · 인도네시아어 (titleId / descId)</span>
                    <input type="text" value="${escHtml(fn.titleId)}" style="margin-bottom:6px;" oninput="AdminCMS.updateFootnoteField(${idx}, 'titleId', this.value)" />
                    <textarea rows="3" oninput="AdminCMS.updateFootnoteField(${idx}, 'descId', this.value)">${escHtml(fn.descId)}</textarea>
                  </div>
                  <div>
                    <span class="lang-col-label">EN · 영어 (titleEn / descEn)</span>
                    <input type="text" value="${escHtml(fn.titleEn)}" style="margin-bottom:6px;" oninput="AdminCMS.updateFootnoteField(${idx}, 'titleEn', this.value)" />
                    <textarea rows="3" oninput="AdminCMS.updateFootnoteField(${idx}, 'descEn', this.value)">${escHtml(fn.descEn)}</textarea>
                  </div>
                  <div>
                    <span class="lang-col-label">KO · 한국어 (titleKo / descKo)</span>
                    <input type="text" value="${escHtml(fn.titleKo)}" style="margin-bottom:6px;" oninput="AdminCMS.updateFootnoteField(${idx}, 'titleKo', this.value)" />
                    <textarea rows="3" oninput="AdminCMS.updateFootnoteField(${idx}, 'descKo', this.value)">${escHtml(fn.descKo)}</textarea>
                  </div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }

    panel.innerHTML = `
      <div class="subtab-bar">
        <button type="button" class="subtab-btn ${tab === "articles" ? "active" : ""}" onclick="AdminCMS.switchMenu5Tab('articles')">
          ${biLabel("📰 1. 소식 및 공지사항 (articles)", "📰 1. Berita & Pengumuman (articles)")}
        </button>
        <button type="button" class="subtab-btn ${tab === "metrics" ? "active" : ""}" onclick="AdminCMS.switchMenu5Tab('metrics')">
          ${biLabel("📊 2. 홈 핵심 지표 6종 (metrics)", "📊 2. 6 Kartu Metrik Target (metrics)")}
        </button>
        <button type="button" class="subtab-btn ${tab === "footnotes" ? "active" : ""}" onclick="AdminCMS.switchMenu5Tab('footnotes')">
          ${biLabel("⚖️ 3. 하단 법적 각주 4종 (footnotes)", "⚖️ 3. 4 Catatan Kaki Hukum (footnotes)")}
        </button>
      </div>
      ${bodyHtml}
    `;
  }

  function switchMenu5Tab(tab) {
    cmsState.activeMenu5Tab = tab;
    renderMenu5Content();
  }

  function updateArticleField(idx, field, val) {
    const list = cmsState.workingData.siteData.articles;
    if (!list || !list[idx]) return;
    list[idx][field] = sanitizeText(val);
  }

  function toggleArticleVisible(idx) {
    const list = cmsState.workingData.siteData.articles;
    if (!list || !list[idx]) return;
    const cur = list[idx].visible !== false && String(list[idx].visible).toUpperCase() !== "FALSE";
    list[idx].visible = !cur;
    renderMenu5Content();
  }

  function addArticleItem() {
    const list = cmsState.workingData.siteData.articles;
    const nextNum = list.length + 1;
    list.push({
      id: `art-${nextNum}`,
      visible: true,
      status: "upcoming",
      date: "",
      image: "assets/slots/news-1.jpg",
      imageUrl: "",
      altId: "Ilustrasi pengumuman resmi MUGGO",
      title: "Pengumuman Resmi Baru",
      summary: "Ringkasan pengumuman resmi.",
      categoryId: "Pengumuman",
      categoryEn: "Announcement",
      categoryKo: "공지사항",
      titleId: "Pengumuman Resmi Baru",
      titleEn: "New Official Announcement",
      titleKo: "신규 공식 안내문",
      summaryId: "Ringkasan pengumuman resmi.",
      summaryEn: "Summary of the official announcement.",
      summaryKo: "신규 공지사항 요약문입니다.",
      contentId: "Isi lengkap pengumuman resmi.",
      contentEn: "Full content of the announcement.",
      contentKo: "신규 공지사항 본문입니다."
    });
    renderMenu5Content();
  }

  function removeArticle(idx) {
    const list = cmsState.workingData.siteData.articles;
    if (!list) return;
    list.splice(idx, 1);
    renderMenu5Content();
  }

  function updateMetricField(idx, field, val) {
    const list = cmsState.workingData.siteData.metrics;
    if (!list || !list[idx]) return;
    list[idx][field] = sanitizeText(val);
  }

  function updateFootnoteField(idx, field, val) {
    const list = cmsState.workingData.siteData.footnotes;
    if (!list || !list[idx]) return;
    list[idx][field] = sanitizeText(val);
  }

  // --------------------------------------------------------------------------
  // [MENU 6] 🍗 30개 브랜드 & 300개 메뉴 카탈로그 관리 (Page 16)
  // --------------------------------------------------------------------------
  function renderMenu6Catalog() {
    const panel = document.getElementById("panel-menu6");
    if (!panel) return;
    const catalog = cmsState.workingData.catalog || [];
    const cats = ["all", "Chicken", "Korean", "Western", "Salad", "Dessert"];
    const q = (cmsState.brandSearch || "").trim().toLowerCase();

    const filtered = catalog.filter((b) => {
      if (cmsState.activeBrandCat !== "all" && b.category !== cmsState.activeBrandCat) return false;
      if (!q) return true;
      return (
        (b.name_ko || "").toLowerCase().includes(q) ||
        (b.name_id || "").toLowerCase().includes(q) ||
        (b.name_en || "").toLowerCase().includes(q) ||
        (b.id || "").toLowerCase().includes(q)
      );
    });

    panel.innerHTML = `
      <div class="cms-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
          <div>
            <h2>${biLabel(`브랜드 마스터 (${catalog.length}개 브랜드) & 소속 메뉴 관리`, `Kelola Master Brand (${catalog.length} Brand) & Menu`)}</h2>
            <p class="cms-hint">${biLabel("브랜드 카드를 클릭하면 하위 10개 메뉴 편집창이 펼쳐집니다.", "Klik tombol Kelola Menu pada brand untuk mengedit 10 menu di bawahnya.")}</p>
          </div>
          <button type="button" class="btn btn-primary" onclick="AdminCMS.addBrandItem()">
            ${biLabel("+ 신규 브랜드 추가 (30→32 확장 등)", "+ Tambah Brand Baru")}
          </button>
        </div>

        <div class="subtab-bar">
          ${cats
            .map((cat) => {
              const cnt = cat === "all" ? catalog.length : catalog.filter((b) => b.category === cat).length;
              return `
                <button type="button" class="subtab-btn ${cmsState.activeBrandCat === cat ? "active" : ""}" onclick="AdminCMS.setBrandFilterCat('${cat}')">
                  ${cat === "all" ? biLabel(`전체 (${cnt})`, `Semua (${cnt})`) : `${cat} (${cnt})`}
                </button>
              `;
            })
            .join("")}
        </div>

        <div class="form-group">
          <input type="text" value="${escHtml(cmsState.brandSearch)}" placeholder="브랜드명 또는 ID 검색 (예: SOTDAK, 솥닭, Burger)..." oninput="AdminCMS.setBrandSearch(this.value)" />
        </div>

        ${filtered
          .map((b) => {
            const realIdx = catalog.findIndex((x) => x.id === b.id);
            const isExp = cmsState.expandedBrandId === b.id;
            const menus = b.menus || [];
            return `
              <div class="trilang-row">
                <div class="trilang-row-header" style="flex-wrap:wrap; gap:10px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <img src="../${escHtml(b.logo)}" alt="${escHtml(b.name_id)}" style="width:42px; height:42px; border-radius:8px; object-fit:cover; border:1px solid var(--cms-border);" />
                    <div>
                      <span class="role-pill">#${b.no} · ${escHtml(b.category)} · ID: ${escHtml(b.id)}</span>
                      <strong style="display:block; margin-top:3px;">${escHtml(b.name_ko)} / ${escHtml(b.name_id)}</strong>
                    </div>
                  </div>
                  <button type="button" class="btn ${isExp ? "btn-primary" : "btn-outline"}" onclick="AdminCMS.toggleExpandBrand('${b.id}')">
                    ${isExp ? biLabel(`▲ 소속 메뉴(${menus.length}개) 접기`, `▲ Tutup Menu (${menus.length})`) : biLabel(`▼ 소속 메뉴(${menus.length}개) 편집 열기`, `▼ Edit Menu (${menus.length})`)}
                  </button>
                </div>

                <!-- Brand Master Fields -->
                <div class="trilang-grid" style="margin-bottom:8px;">
                  <div>
                    <span class="lang-col-label">브랜드명 &amp; 소개 (ID · name_id / desc_id)</span>
                    <input type="text" value="${escHtml(b.name_id)}" style="margin-bottom:5px;" oninput="AdminCMS.updateBrandField(${realIdx}, 'name_id', this.value)" />
                    <input type="text" value="${escHtml(b.desc_id)}" oninput="AdminCMS.updateBrandField(${realIdx}, 'desc_id', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">브랜드명 &amp; 소개 (EN · name_en / desc_en)</span>
                    <input type="text" value="${escHtml(b.name_en)}" style="margin-bottom:5px;" oninput="AdminCMS.updateBrandField(${realIdx}, 'name_en', this.value)" />
                    <input type="text" value="${escHtml(b.desc_en)}" oninput="AdminCMS.updateBrandField(${realIdx}, 'desc_en', this.value)" />
                  </div>
                  <div>
                    <span class="lang-col-label">브랜드명 &amp; 소개 (KO · name_ko / desc_ko)</span>
                    <input type="text" value="${escHtml(b.name_ko)}" style="margin-bottom:5px;" oninput="AdminCMS.updateBrandField(${realIdx}, 'name_ko', this.value)" />
                    <input type="text" value="${escHtml(b.desc_ko)}" oninput="AdminCMS.updateBrandField(${realIdx}, 'desc_ko', this.value)" />
                  </div>
                </div>

                <div class="trilang-grid">
                  <div>
                    <span class="lang-col-label">카테고리 (category)</span>
                    <select onchange="AdminCMS.updateBrandField(${realIdx}, 'category', this.value)">
                      ${["Chicken", "Korean", "Western", "Salad", "Dessert"]
                        .map((cName) => `<option value="${cName}" ${b.category === cName ? "selected" : ""}>${cName}</option>`)
                        .join("")}
                    </select>
                  </div>
                  <div style="grid-column: span 2;">
                    <span class="lang-col-label">대표 로고/썸네일 이미지 경로 (logo)</span>
                    <input type="text" value="${escHtml(b.logo)}" oninput="AdminCMS.updateBrandField(${realIdx}, 'logo', this.value)" />
                  </div>
                </div>

                ${
                  isExp
                    ? `<div style="margin-top:14px; padding-top:14px; border-top:2px dashed var(--cms-border);">
                        <h3 style="margin-bottom:10px;">🍽️ ${escHtml(b.name_ko)} — 하위 메뉴 ${menus.length}개 상세 편집</h3>
                        ${menus
                          .map(
                            (m, mIdx) => `
                            <div style="background:var(--cms-surface-muted); border:1px solid var(--cms-border); border-radius:8px; padding:12px; margin-bottom:10px;">
                              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                                <strong>Menu #${mIdx + 1} (${escHtml(m.id)})</strong>
                                <div style="display:flex; gap:8px; align-items:center;">
                                  <label style="font-size:12px; font-weight:700;">
                                    <input type="checkbox" ${m.popular ? "checked" : ""} onchange="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'popular', this.checked)" />
                                    인기 메뉴 (popular)
                                  </label>
                                  <input type="text" value="${escHtml(m.stationId || "")}" placeholder="STATION-GRILL" style="width:150px; padding:4px 8px; font-size:12px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'stationId', this.value)" />
                                  <input type="text" value="${escHtml(m.portion || "")}" placeholder="1인분 / 350g" style="width:120px; padding:4px 8px; font-size:12px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'portion', this.value)" />
                                </div>
                              </div>
                              <div class="trilang-grid">
                                <div>
                                  <span class="lang-col-label">ID · 메뉴명 &amp; 설명 (name_id / desc_id)</span>
                                  <input type="text" value="${escHtml(m.name_id || "")}" style="margin-bottom:4px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'name_id', this.value)" />
                                  <input type="text" value="${escHtml(m.desc_id || "")}" placeholder="메뉴 설명 (ID)" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'desc_id', this.value)" />
                                </div>
                                <div>
                                  <span class="lang-col-label">EN · 메뉴명 &amp; 설명 (name_en / desc_en)</span>
                                  <input type="text" value="${escHtml(m.name_en || "")}" style="margin-bottom:4px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'name_en', this.value)" />
                                  <input type="text" value="${escHtml(m.desc_en || "")}" placeholder="Menu desc (EN)" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'desc_en', this.value)" />
                                </div>
                                <div>
                                  <span class="lang-col-label">KO · 메뉴명 &amp; 이미지 (name_ko / desc_ko / image)</span>
                                  <input type="text" value="${escHtml(m.name_ko || "")}" style="margin-bottom:4px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'name_ko', this.value)" />
                                  <input type="text" value="${escHtml(m.desc_ko || "")}" placeholder="메뉴 설명 (KO)" style="margin-bottom:4px;" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'desc_ko', this.value)" />
                                  <input type="text" value="${escHtml(m.image || "")}" placeholder="메뉴 이미지 URL (image)" oninput="AdminCMS.updateMenuField(${realIdx}, ${mIdx}, 'image', this.value)" />
                                </div>
                              </div>
                            </div>
                          `
                          )
                          .join("")}
                      </div>`
                    : ""
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function setBrandFilterCat(cat) {
    cmsState.activeBrandCat = cat;
    renderMenu6Catalog();
  }

  function setBrandSearch(q) {
    cmsState.brandSearch = q;
    renderMenu6Catalog();
  }

  function toggleExpandBrand(brandId) {
    cmsState.expandedBrandId = cmsState.expandedBrandId === brandId ? null : brandId;
    renderMenu6Catalog();
  }

  function updateBrandField(bIdx, field, val) {
    const cat = cmsState.workingData.catalog;
    if (!cat || !cat[bIdx]) return;
    cat[bIdx][field] = sanitizeText(val);
  }

  function updateMenuField(bIdx, mIdx, field, val) {
    const cat = cmsState.workingData.catalog;
    if (!cat || !cat[bIdx] || !cat[bIdx].menus || !cat[bIdx].menus[mIdx]) return;
    cat[bIdx].menus[mIdx][field] = typeof val === "string" ? sanitizeText(val) : val;
  }

  function addBrandItem() {
    const cat = cmsState.workingData.catalog;
    const nextNo = cat.length + 1;
    const newId = `brand-${nextNo}`;
    const newMenus = [];
    for (let i = 1; i <= 10; i++) {
      newMenus.push({
        id: `${newId}-m${i}`,
        name_ko: `신규 메뉴 ${i}`,
        name_en: `New Menu ${i}`,
        name_id: `Menu Baru ${i}`,
        desc_ko: "",
        desc_en: "",
        desc_id: "",
        stationId: "STATION-ASSEMBLY",
        popular: i <= 2,
        portion: "1 Porsi",
        image: ""
      });
    }
    cat.push({
      no: nextNo,
      id: newId,
      category: "Korean",
      name_ko: `신규 브랜드 ${nextNo}`,
      name_en: `NEW BRAND ${nextNo}`,
      name_id: `BRAND BARU ${nextNo}`,
      logo: "assets/logos/b01.jpg",
      desc_ko: "신규 브랜드 한 줄 소개",
      desc_en: "New brand short description",
      desc_id: "Deskripsi singkat brand baru",
      menus: newMenus
    });
    cmsState.workingData.config.brandCount = cat.length;
    cmsState.expandedBrandId = newId;
    renderMenu6Catalog();
    renderMenu1Dashboard();
  }

  // --------------------------------------------------------------------------
  // [MENU 7] 🛡️ 보안 설정 · 배포 연동 · 변경 이력(Audit Log) & 백업 (Page 16)
  // --------------------------------------------------------------------------
  function renderMenu7Security() {
    const panel = document.getElementById("panel-menu7");
    if (!panel) return;
    const isSuper = cmsState.currentUser && cmsState.currentUser.role === "super_admin";
    const accounts = loadAccounts();
    const logs = loadAuditLogs();
    const hasVaultToken = Boolean(cmsState.decryptedGithubToken && cmsState.decryptedGithubToken.trim() !== "");

    panel.innerHTML = `
      <!-- 1. 관리자 계정 및 비밀번호 관리 -->
      <div class="cms-card">
        <h2>${biLabel("1. 관리자 계정 및 비밀번호 관리 (PBKDF2 100,000회 해시 + Salt 보호)", "1. Kelola Akun Admin & Kata Sandi (PBKDF2 100.000 Iterasi + Salt)")}</h2>
        <p class="cms-hint" style="margin-bottom:14px;">
          ${biLabel(
            "비밀번호는 평문으로 저장되지 않으며 PBKDF2-SHA256(100,000회 반복 해시)로 검증됩니다.",
            "Kata sandi tidak pernah disimpan dalam teks biasa dan diverifikasi dengan PBKDF2-SHA256."
          )}
        </p>

        <div class="trilang-grid" style="margin-bottom:14px;">
          <div>
            <span class="lang-col-label">${biLabel("현재 로그인 계정 비밀번호 변경", "Ubah Kata Sandi Akun Saat Ini")} (${escHtml(cmsState.currentUser ? cmsState.currentUser.id : "admin")})</span>
            <input type="password" id="new-admin-pw" placeholder="새 비밀번호 입력 (8자 이상 권장)" style="margin-bottom:6px;" />
            <button type="button" class="btn btn-primary" onclick="AdminCMS.changeOwnPassword()">
              ${biLabel("🔐 비밀번호 즉시 변경", "🔐 Ubah Kata Sandi")}
            </button>
          </div>

          ${
            isSuper
              ? `
            <div style="grid-column: span 2;">
              <span class="lang-col-label">${biLabel("실무자 서브 계정 추가 / 비밀번호 재발급 (최고 관리자 전용)", "Tambah / Reset Akun Staf (Khusus Super Admin)")}</span>
              <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                <input type="text" id="staff-id-input" placeholder="실무자 ID (예: hr_staff)" style="width:180px;" />
                <input type="password" id="staff-pw-input" placeholder="초기/재발급 비밀번호" style="width:180px;" />
                <select id="staff-role-input" style="width:220px;">
                  <option value="editor">Editor (문구/채용 편집 전용)</option>
                  <option value="super_admin">Super Admin (전체 관리 권한)</option>
                </select>
                <button type="button" class="btn btn-secondary" onclick="AdminCMS.upsertStaffAccount()">
                  ${biLabel("+ 실무자 계정 생성 / 비밀번호 변경", "+ Buat / Perbarui Akun Staf")}
                </button>
              </div>
              <div>
                ${accounts
                  .map(
                    (a) => `
                  <span class="role-pill" style="margin-right:6px;">
                    👤 ${escHtml(a.id)} (${a.role === "super_admin" ? "Super Admin" : "Editor"})
                    ${
                      a.id !== "admin"
                        ? `<button type="button" style="border:none; background:transparent; color:var(--cms-danger); font-weight:800; cursor:pointer;" onclick="AdminCMS.deleteStaffAccount('${escHtml(a.id)}')">×</button>`
                        : ""
                    }
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- 2. 사이트 반영(저장 및 배포) 방식 이중 지원 -->
      <div class="cms-card">
        <h2>${biLabel("2. 사이트 반영(저장 및 배포) 방식 이중 지원 (AES-256-GCM 암호화 볼트 & 패키지 다운로드)", "2. Dukungan Ganda Penerapan Situs (Vault AES-256-GCM & Paket File)")}</h2>
        <p class="cms-hint" style="margin-bottom:14px;">
          ${biLabel(
            "① GitHub API 토큰을 암호화 볼트(Vault)에 등록하면 [변경사항 저장 및 사이트 즉시 반영] 클릭 시 레포지토리의 4대 데이터 파일과 캐시 버전(?v=YYYYMMDD-N)을 자동 커밋합니다. ② 토큰 없이도 4개 설정 파일 또는 전체 JSON 백업본을 1초 만에 다운로드/복원할 수 있습니다.",
            "Simpan token GitHub dengan enkripsi AES-256-GCM untuk komit otomatis, atau unduh/pulihkan 4 file data secara instan."
          )}
        </p>

        <div class="trilang-row" style="margin-bottom:14px;">
          <div class="trilang-row-header">
            <strong>🔒 원클릭 실시간 사이트 배포 설정 (GitHub API AES-256-GCM Encrypted Vault)</strong>
            <span class="role-pill">${hasVaultToken ? "🟢 암호화 볼트 토큰 등록됨" : "⚪ 볼트 미설정 (로컬 즉시 반영 + 파일 다운로드 모드)"}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <input type="password" id="vault-github-token-input" value="${escHtml(cmsState.decryptedGithubToken || "")}" placeholder="GitHub Personal Access Token (ghp_... 또는 github_pat_...)" style="flex:1; min-width:260px;" />
            <button type="button" class="btn btn-primary" onclick="AdminCMS.saveGithubTokenToVault()">
              ${biLabel("🛡️ AES-256-GCM 볼트에 암호화 저장", "🛡️ Enkripsi & Simpan ke Vault")}
            </button>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="AdminCMS.downloadSingleDataFile('site.config.js')">
            📥 site.config.js 다운로드
          </button>
          <button type="button" class="btn btn-secondary" onclick="AdminCMS.downloadSingleDataFile('i18n.js')">
            📥 data/i18n.js 다운로드
          </button>
          <button type="button" class="btn btn-secondary" onclick="AdminCMS.downloadSingleDataFile('site-data.js')">
            📥 data/site-data.js 다운로드
          </button>
          <button type="button" class="btn btn-secondary" onclick="AdminCMS.downloadSingleDataFile('catalog-data.js')">
            📥 data/catalog-data.js 다운로드
          </button>
          <button type="button" class="btn btn-outline" onclick="AdminCMS.downloadFullJsonBackup()">
            📦 전체 JSON 백업본 다운로드
          </button>
          <label class="btn btn-outline" style="margin:0; cursor:pointer;">
            📂 JSON 백업본 업로드 복원
            <input type="file" accept=".json,application/json" hidden onchange="AdminCMS.restoreFromJsonBackup(event)" />
          </label>
        </div>
      </div>

      <!-- 3. 변경 이력 감사 로그(Audit Log) 및 원클릭 롤백(Rollback) -->
      <div class="cms-card">
        <h2>${biLabel("3. 변경 이력 감사 로그(Audit Log) 및 원클릭 롤백(Rollback)", "3. Log Audit Perubahan & Rollback Satu Klik")}</h2>
        <p class="cms-hint" style="margin-bottom:14px;">
          ${biLabel(
            "누가, 언제, 어떤 항목을 수정했는지 변경 전/후 비교표를 자동 기록하며, 실수 발생 시 [이 버전으로 되돌리기] 버튼 하나로 즉시 복구합니다.",
            "Mencatat siapa, kapan, dan apa yang diubah beserta tabel perbandingan sebelum/sesudah."
          )}
        </p>

        ${
          logs.length === 0
            ? `<p class="cms-hint">기록된 감사 로그가 없습니다.</p>`
            : `<table class="audit-table">
                <thead>
                  <tr>
                    <th>${biLabel("시각", "Waktu")}</th>
                    <th>${biLabel("계정", "Akun")}</th>
                    <th>${biLabel("구분", "Aksi")}</th>
                    <th>${biLabel("변경 전/후 비교 (Before → After)", "Perbandingan Sebelum → Sesudah")}</th>
                    <th>${biLabel("원클릭 복구", "Pulihkan")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs
                    .map(
                      (l, idx) => `
                    <tr>
                      <td style="white-space:nowrap;">${escHtml(new Date(l.timestamp).toLocaleString())}</td>
                      <td><strong>${escHtml(l.actor)}</strong></td>
                      <td><span class="role-pill">${escHtml(l.action)}</span></td>
                      <td>
                        <div style="font-weight:700; margin-bottom:4px;">${escHtml(l.summary)}</div>
                        ${
                          Array.isArray(l.diffs) && l.diffs.length > 0
                            ? `<ul style="margin:0; padding-left:16px; font-size:12px; color:var(--cms-muted);">
                                ${l.diffs
                                  .map(
                                    (d) =>
                                      `<li><code>${escHtml(d.field)}</code>: <del>${escHtml(d.before)}</del> → <strong>${escHtml(d.after)}</strong></li>`
                                  )
                                  .join("")}
                              </ul>`
                            : ""
                        }
                      </td>
                      <td style="white-space:nowrap;">
                        ${
                          l.snapshot
                            ? `<button type="button" class="btn-mini" onclick="AdminCMS.rollbackToLog(${idx})">
                                ↩️ ${biLabel("이 버전으로 되돌리기", "Kembalikan ke Versi Ini")}
                              </button>`
                            : "-"
                        }
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>`
        }
      </div>
    `;
  }

  async function changeOwnPassword() {
    const input = document.getElementById("new-admin-pw");
    const newPw = input ? input.value : "";
    if (!newPw || newPw.length < 6) {
      showToast("비밀번호는 최소 6자 이상 입력해 주세요.");
      return;
    }
    const accounts = loadAccounts();
    const curId = cmsState.currentUser ? cmsState.currentUser.id : "admin";
    const acc = accounts.find((a) => a.id === curId);
    if (!acc) return;

    const newSalt = "muggo-salt-" + Date.now();
    acc.salt = newSalt;
    acc.hash = await derivePbkdf2Hex(newPw, newSalt);
    saveAccounts(accounts);

    // Re-encrypt AES-256-GCM vault with new password key
    cmsState.derivedAesKey = await deriveAesGcmKey(newPw, newSalt);
    if (cmsState.decryptedGithubToken) {
      await encryptVaultToken(cmsState.decryptedGithubToken, cmsState.derivedAesKey);
    }
    if (input) input.value = "";
    appendAuditLog(curId, "PASSWORD_CHANGED", `Changed password for ${curId}`, null);
    renderMenu7Security();
    showToast("비밀번호가 안전하게 변경되었으며 볼트가 재암호화되었습니다.");
  }

  async function upsertStaffAccount() {
    const idEl = document.getElementById("staff-id-input");
    const pwEl = document.getElementById("staff-pw-input");
    const roleEl = document.getElementById("staff-role-input");
    const staffId = (idEl ? idEl.value : "").trim();
    const staffPw = pwEl ? pwEl.value : "";
    const staffRole = roleEl ? roleEl.value : "editor";

    if (!staffId || !staffPw) {
      showToast("실무자 아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    const accounts = loadAccounts();
    const salt = "muggo-staff-salt-" + Date.now();
    const hash = await derivePbkdf2Hex(staffPw, salt);
    const existing = accounts.find((a) => a.id.toLowerCase() === staffId.toLowerCase());
    if (existing) {
      existing.salt = salt;
      existing.hash = hash;
      existing.role = existing.id === "admin" ? "super_admin" : staffRole;
    } else {
      accounts.push({
        id: staffId,
        role: staffRole,
        salt,
        hash,
        createdAt: new Date().toISOString()
      });
    }
    saveAccounts(accounts);
    appendAuditLog("admin", "STAFF_ACCOUNT_UPSERT", `Configured account ${staffId} (${staffRole})`, null);
    renderMenu7Security();
    showToast(`실무자 계정(${staffId})이 저장되었습니다.`);
  }

  function deleteStaffAccount(staffId) {
    if (staffId === "admin") return;
    const accounts = loadAccounts().filter((a) => a.id !== staffId);
    saveAccounts(accounts);
    appendAuditLog("admin", "STAFF_ACCOUNT_DELETED", `Removed staff account ${staffId}`, null);
    renderMenu7Security();
  }

  async function saveGithubTokenToVault() {
    const input = document.getElementById("vault-github-token-input");
    const token = (input ? input.value : "").trim();
    cmsState.decryptedGithubToken = token;
    if (cmsState.derivedAesKey) {
      await encryptVaultToken(token, cmsState.derivedAesKey);
    }
    appendAuditLog(
      cmsState.currentUser ? cmsState.currentUser.id : "admin",
      "VAULT_UPDATED",
      "Updated AES-256-GCM Encrypted GitHub Deployment Vault",
      null
    );
    renderMenu7Security();
    showToast("GitHub 배포 토큰이 AES-256-GCM 볼트에 암호화 저장되었습니다.");
  }

  // --------------------------------------------------------------------------
  // VALIDATION, MISSING VARIABLE PROTECTION & PUBLISH / DEPLOY
  // --------------------------------------------------------------------------
  function validateBeforeSave() {
    const c = cmsState.workingData.config || {};
    if (!isValidEmail(c.contactEmail) || !isValidEmail(c.recruitmentEmail)) {
      alert(uiText("errInvalidEmail"));
      return false;
    }
    const urlFields = [
      c.applyFormEndpoint,
      c.ceoPortraitUrl,
      c.instagramUrl,
      c.tiktokUrl,
      c.koreaHqUrl,
      c.deliveryAppUrl,
      c.newsSheetCsvUrl,
      c.jobsSheetCsvUrl
    ];
    for (let i = 0; i < urlFields.length; i++) {
      if (!isValidSafeUrlOrAsset(urlFields[i])) {
        alert(uiText("errInvalidUrl"));
        return false;
      }
    }

    // Check if any {variable} token present in baselineSnapshot.i18n was accidentally deleted
    const missingVars = [];
    function checkVarsWalk(oldObj, newObj) {
      if (typeof oldObj === "string" && typeof newObj === "string") {
        const oldTokens = extractVars(oldObj);
        oldTokens.forEach((tok) => {
          if (!newObj.includes(tok) && !missingVars.includes(tok)) {
            missingVars.push(tok);
          }
        });
        return;
      }
      if (Array.isArray(oldObj) && Array.isArray(newObj)) {
        oldObj.forEach((item, idx) => checkVarsWalk(item, newObj[idx]));
      } else if (oldObj && typeof oldObj === "object" && newObj && typeof newObj === "object") {
        Object.keys(oldObj).forEach((k) => checkVarsWalk(oldObj[k], newObj[k]));
      }
    }
    if (cmsState.baselineSnapshot && cmsState.baselineSnapshot.i18n) {
      checkVarsWalk(cmsState.baselineSnapshot.i18n, cmsState.workingData.i18n);
    }
    if (missingVars.length > 0) {
      const msg = uiText("warnMissingVar").replace("{varName}", missingVars.join(", "));
      if (!window.confirm(msg)) {
        return false;
      }
    }
    return true;
  }

  function generateJsFileContent(fileName) {
    const wd = cmsState.workingData;
    if (fileName === "site.config.js") {
      return `// ==========================================================================\n// SINGLE-SOURCE CONFIGURATION (site.config.js)\n// ==========================================================================\n\nconst SITE_CONFIG = ${JSON.stringify(
        wd.config,
        null,
        2
      )};\n\nif (typeof window !== "undefined") {\n  window.SITE_CONFIG = SITE_CONFIG;\n}\n\nif (typeof module !== "undefined" && module.exports) {\n  module.exports = SITE_CONFIG;\n}\n`;
    }
    if (fileName === "i18n.js") {
      return `// ==========================================================================\n// MUGGO Corporate & Recruitment Portal — Multilingual Dictionary (ID / EN / KO)\n// ==========================================================================\n\nwindow.I18N_DICT = ${JSON.stringify(
        wd.i18n,
        null,
        2
      )};\n`;
    }
    if (fileName === "site-data.js") {
      return `// ==========================================================================\n// MUGGO Corporate & Recruitment Portal — Structured Site Data\n// ==========================================================================\n\nwindow.DEFAULT_SITE_DATA = ${JSON.stringify(
        wd.siteData,
        null,
        2
      )};\n`;
    }
    if (fileName === "catalog-data.js") {
      return `// MUGGO Official 30 Brands & 300 Menus Catalog\nwindow.MUGGO_CATALOG = ${JSON.stringify(
        wd.catalog,
        null,
        2
      )};\n`;
    }
    return "";
  }

  async function pushToGithubRepoIfConfigured() {
    const token = (cmsState.decryptedGithubToken || "").trim();
    if (!token) return false;
    const repo = "mfgkoreaceo-ops/muggo-corporate-site";
    const filesToCommit = [
      { path: "site.config.js", content: generateJsFileContent("site.config.js") },
      { path: "data/i18n.js", content: generateJsFileContent("i18n.js") },
      { path: "data/site-data.js", content: generateJsFileContent("site-data.js") },
      { path: "data/catalog-data.js", content: generateJsFileContent("catalog-data.js") }
    ];

    try {
      for (const f of filesToCommit) {
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${f.path}`;
        const getRes = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
        });
        let sha = undefined;
        if (getRes.ok) {
          const meta = await getRes.json();
          sha = meta.sha;
        }
        const b64 = btoa(unescape(encodeURIComponent(f.content)));
        await fetch(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `CMS Update: ${f.path} by ${cmsState.currentUser ? cmsState.currentUser.id : "admin"}`,
            content: b64,
            sha
          })
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async function publishChanges() {
    if (!validateBeforeSave()) return;

    const diffs = computeDiffSummary(cmsState.baselineSnapshot, cmsState.workingData);
    const summaryText = diffs.map((d) => `${d.field}`).slice(0, 3).join(", ");

    // Save previous baseline snapshot into Audit Log for 1-click rollback, plus current published state
    appendAuditLog(
      cmsState.currentUser ? cmsState.currentUser.id : "admin",
      "PUBLISH",
      `Published changes (${summaryText || "Sync"})`,
      cmsState.baselineSnapshot,
      diffs
    );

    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(cmsState.workingData));
    localStorage.setItem(STORAGE_KEYS.published, JSON.stringify(cmsState.workingData));
    cmsState.baselineSnapshot = deepClone(cmsState.workingData);

    reloadPreviewFrame();
    renderMenu1Dashboard();
    if (cmsState.activeMenu === "menu7") renderMenu7Security();

    const deployedRemote = await pushToGithubRepoIfConfigured();
    showToast(
      deployedRemote
        ? `${uiText("msgPublished")} (GitHub Pages 원격 커밋 완료)`
        : uiText("msgPublished")
    );
  }

  function rollbackToLog(logIdx) {
    const logs = loadAuditLogs();
    const entry = logs[logIdx];
    if (!entry || !entry.snapshot) {
      showToast("복구 가능한 스냅샷이 없는 항목입니다.");
      return;
    }
    cmsState.workingData = deepClone(entry.snapshot);
    cmsState.baselineSnapshot = deepClone(entry.snapshot);
    localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(cmsState.workingData));
    localStorage.setItem(STORAGE_KEYS.published, JSON.stringify(cmsState.workingData));

    appendAuditLog(
      cmsState.currentUser ? cmsState.currentUser.id : "admin",
      "ROLLBACK",
      `Rolled back to version from ${new Date(entry.timestamp).toLocaleString()}`,
      cmsState.workingData
    );

    renderAllMenus();
    reloadPreviewFrame();
    showToast(uiText("msgRolledBack"));
  }

  function rollbackLatest() {
    const logs = loadAuditLogs();
    const idx = logs.findIndex((l) => Boolean(l.snapshot));
    if (idx === -1) {
      // Restore to original repo files if no snapshot log yet
      localStorage.removeItem(STORAGE_KEYS.draft);
      localStorage.removeItem(STORAGE_KEYS.published);
      loadInitialWorkingData();
      renderAllMenus();
      reloadPreviewFrame();
      showToast(uiText("msgRolledBack"));
      return;
    }
    rollbackToLog(idx);
  }

  // --------------------------------------------------------------------------
  // DOWNLOAD & RESTORE HELPERS
  // --------------------------------------------------------------------------
  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadSingleDataFile(fileName) {
    const content = generateJsFileContent(fileName);
    downloadBlob(content, fileName, "application/javascript;charset=utf-8");
  }

  function downloadFullJsonBackup() {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: cmsState.currentUser ? cmsState.currentUser.id : "admin",
      data: cmsState.workingData
    };
    downloadBlob(
      JSON.stringify(payload, null, 2),
      `muggo-cms-backup-${new Date().toISOString().slice(0, 10)}.json`,
      "application/json;charset=utf-8"
    );
  }

  function restoreFromJsonBackup(e) {
    const file = e.target && e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(reader.result);
        const bundle = parsed.data || parsed;
        if (bundle && bundle.config && bundle.i18n && bundle.siteData && bundle.catalog) {
          cmsState.workingData = deepClone(bundle);
          localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(cmsState.workingData));
          localStorage.setItem(STORAGE_KEYS.published, JSON.stringify(cmsState.workingData));
          appendAuditLog(
            cmsState.currentUser ? cmsState.currentUser.id : "admin",
            "BACKUP_RESTORED",
            `Restored full JSON backup (${file.name})`,
            cmsState.workingData
          );
          renderAllMenus();
          reloadPreviewFrame();
          showToast("JSON 백업본이 성공적으로 복원되었습니다.");
        }
      } catch (err) {
        alert("올바른 MUGGO CMS 백업 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
  }

  // --------------------------------------------------------------------------
  // INITIALIZE ADMIN CMS ON DOM READY
  // --------------------------------------------------------------------------
  function initAdminApp() {
    // 1. Load saved Admin UI language (default: 'ko' per Page 6)
    const savedLang = localStorage.getItem(STORAGE_KEYS.uiLang);
    setUiLang(savedLang === "id" ? "id" : "ko");

    // 2. Bind Caps Lock detector on password input
    const pwInput = document.getElementById("login-pw-input");
    const capsWarn = document.getElementById("capslock-warning");
    if (pwInput && capsWarn) {
      ["keydown", "keyup"].forEach((evt) => {
        pwInput.addEventListener(evt, (e) => {
          if (e.getModifierState) {
            capsWarn.hidden = !e.getModifierState("CapsLock");
          }
        });
      });
    }

    // 3. Start lockout ticker on login screen
    updateLockoutBannerUI();
    setInterval(updateLockoutBannerUI, 1000);

    // 4. Restore active session if still valid in sessionStorage
    try {
      const sessRaw = sessionStorage.getItem(STORAGE_KEYS.session);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (sess && sess.id) {
          cmsState.currentUser = { id: sess.id, role: sess.role || "super_admin" };
          enterAdminPortal();
        }
      }
    } catch (e) {}
  }

  // Expose Public API on window.AdminCMS
  window.AdminCMS = {
    setUiLang,
    handleLogin,
    togglePasswordVisibility,
    extendSession,
    logout,
    switchMenu,
    switchMenu3Tab,
    switchMenu5Tab,
    togglePreviewSplit,
    setPreviewViewport,
    reloadPreviewFrame,
    applyToPreview,
    saveDraft,
    publishChanges,
    rollbackLatest,
    rollbackToLog,
    insertVarAtCursor,
    updateConfigField,
    toggleConfigSwitch,
    updateI18nPath,
    updateJobField,
    toggleJobVisible,
    moveJob,
    addJobItem,
    removeJob,
    exportJobsCsv,
    importJobsCsv,
    updateArticleField,
    toggleArticleVisible,
    addArticleItem,
    removeArticle,
    updateMetricField,
    updateFootnoteField,
    setBrandFilterCat,
    setBrandSearch,
    toggleExpandBrand,
    updateBrandField,
    updateMenuField,
    addBrandItem,
    changeOwnPassword,
    upsertStaffAccount,
    deleteStaffAccount,
    saveGithubTokenToVault,
    downloadSingleDataFile,
    downloadFullJsonBackup,
    restoreFromJsonBackup
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminApp);
  } else {
    initAdminApp();
  }
})();
