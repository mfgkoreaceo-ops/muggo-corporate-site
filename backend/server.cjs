const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { Auth } = require('./auth.cjs');
const { publish, ApiError } = require('./publish.cjs');
const { createRateStore } = require('./rate-store.cjs');
const ROOT = path.resolve(__dirname, '..');
function createApp({ env = process.env, fetchImpl = (...args) => fetch(...args), now = Date.now, rateStore } = {}) {
const persistentRates = rateStore || (env.CMS_STATE_DIRECTORY ? createRateStore(env.CMS_STATE_DIRECTORY, ROOT) : null);
const auth = new Auth({now,rateStore:persistentRates});
const ORIGIN = env.ADMIN_ORIGIN || 'http://localhost:4173';
const configured = !!(persistentRates && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && ORIGIN.startsWith('https://'));
const enabled = configured && env.CMS_PUBLISH_ENABLED === 'true';
const roles = JSON.parse(env.CMS_GITHUB_USER_ROLES || '{}');
const branch = env.CMS_BRANCH || 'main';
const repo = 'mfgkoreaceo-ops/muggo-corporate-site';
const sourceHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
function cookie(req, name) { return (req.headers.cookie || '').split('; ').find(v => v.startsWith(name + '='))?.slice(name.length + 1); }
function sessionCookie(id, maxAge = 28800) { return `__Host-muggo-session=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`; }
async function github(token, endpoint, method = 'GET', body) {
  let r;
  try {
    r = await fetchImpl(`https://api.github.com/${endpoint}`, { method,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  } catch { throw new ApiError(502, 'GitHub 네트워크 오류. 반영 여부를 확인한 후 재시도하세요.'); }
  if (!r.ok) throw new ApiError(r.status === 422 ? 409 : r.status,
    ({401:'GitHub 인증 만료',403:'GitHub 권한 부족 또는 API 요청 제한',404:'저장소 또는 기준 버전 없음',409:'동시 변경 충돌',422:'동시 변경 또는 잘못된 요청'})[r.status] || `GitHub HTTP ${r.status}`);
  return r.json();
}
async function readJson(req) {
  let body = '';
  for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 6000000) throw new ApiError(413, '요청이 너무 큽니다.'); }
  try { return JSON.parse(body); } catch { throw new ApiError(400, '잘못된 JSON입니다.'); }
}
const server = http.createServer(async (req, res) => {
  const json = (status, value) => { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(value)); };
  try {
    const url = new URL(req.url, ORIGIN), ip = req.socket.remoteAddress;
    const sid = cookie(req, '__Host-muggo-session'), s = auth.get(sid);
    if (url.pathname === '/auth/github' && req.method === 'GET') {
      if (!configured) return json(503, { error:'서버 인증이 아직 설정되지 않았습니다.' });
      const state = auth.begin(ip);
      if (!state) return json(429, { error:'15분 동안 로그인 시도가 제한됩니다.' });
      res.setHeader('Set-Cookie', `__Host-muggo-oauth=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=300`);
      res.writeHead(302, { Location:`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(env.GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(ORIGIN + '/auth/callback')}&scope=public_repo&state=${state}` }); return res.end();
    }
    if (url.pathname === '/auth/callback' && req.method === 'GET') {
      const state = url.searchParams.get('state');
      if (!configured || !state || state !== cookie(req, '__Host-muggo-oauth') || !auth.consume(state, ip) || !url.searchParams.get('code')) throw new ApiError(401, '로그인 요청 만료 또는 검증 실패');
      const exchange = await fetchImpl('https://github.com/login/oauth/access_token', {
        method:'POST', headers:{ Accept:'application/json', 'Content-Type':'application/json' }, signal:AbortSignal.timeout(15000),
        body:JSON.stringify({ client_id:env.GITHUB_CLIENT_ID, client_secret:env.GITHUB_CLIENT_SECRET, code:url.searchParams.get('code'), redirect_uri:ORIGIN + '/auth/callback' }) });
      if (!exchange.ok) throw new ApiError(401, 'GitHub 인증 교환 실패');
      const result = await exchange.json();
      if (!result.access_token) throw new ApiError(401, 'GitHub 로그인 거절');
      const profile = await github(result.access_token, 'user'), role = roles[String(profile.id)];
      if (!['editor','super_admin'].includes(role)) throw new ApiError(403, '서버에서 승인되지 않은 계정');
      const id = auth.create({ id:profile.login, githubId:profile.id, role }, result.access_token, ip);
      persistentRates?.audit?.({event:'login_success',actor:profile.id,role});
      res.setHeader('Set-Cookie', [sessionCookie(id), '__Host-muggo-oauth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0']);
      res.writeHead(302, { Location:'/admin/', 'Referrer-Policy':'no-referrer' }); return res.end();
    }
    if (url.pathname.startsWith('/api/')) {
      if (!s || roles[String(s.user.githubId)] !== s.user.role) return json(401, { error:'서버 로그인 필요 또는 세션 만료' });
      if (req.method === 'POST' && (req.headers.origin !== ORIGIN || req.headers['x-csrf-token'] !== s.csrf)) throw new ApiError(403, '요청 출처 검증 실패');
      if (url.pathname === '/api/session' && req.method === 'GET') return json(200, { user:s.user, csrf:s.csrf, expiresAt:s.idle, absoluteExpiresAt:s.absolute, canPublish:enabled && s.user.role === 'super_admin', head:sourceHead });
      if (url.pathname === '/api/session/extend' && req.method === 'POST') { auth.touch(s); return json(200, { expiresAt:s.idle }); }
      if (url.pathname === '/api/logout' && req.method === 'POST') { auth.sessions.delete(sid); res.setHeader('Set-Cookie', sessionCookie('',0)); return json(200,{ok:true}); }
      if (url.pathname === '/api/publish' && req.method === 'POST') {
        if (!enabled || s.user.role !== 'super_admin') throw new ApiError(403,'서버 게시 비활성화 또는 게시 권한 없음');
        const permission = await github(s.token, `repos/${repo}`);
        if (!permission.permissions?.push) throw new ApiError(403,'GitHub 저장소 쓰기 권한 없음');
        const body = await readJson(req);
        const result = await publish({ api:(p,m,b) => github(s.token, `repos/${repo}/${p}`,m,b), branch, expectedHead:body.expectedHead, files:body.files });
        persistentRates?.audit?.({event:'commit_verified',actor:s.user.githubId,commit:result.commit,paths:result.files.map(f=>f.path)});
        console.info(JSON.stringify({event:'cms_commit_verified',actor:s.user.githubId,commit:result.commit,paths:result.files.map(f=>f.path),at:new Date().toISOString()}));
        return json(200,result);
      }
      return json(404,{error:'지원하지 않는 API'});
    }
    if (!['GET','HEAD'].includes(req.method)) return json(405,{error:'Method not allowed'});
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    if (!/^\/(index\.html|site\.config\.js|(?:admin|scripts|styles|data|assets|templates)\/[\w./-]+)$/.test(pathname) || pathname.split('/').includes('..') || pathname.includes('/.')) return json(404,{error:'Not found'});
    const filename = path.resolve(ROOT,'.' + pathname);
    if (!filename.startsWith(ROOT + path.sep)) return json(403,{error:'Forbidden'});
    const content = await fs.readFile(filename);
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (e) {
    if (e.status === 401 || e.status === 403) {
      try { persistentRates?.audit?.({event:'access_denied',status:e.status}); } catch {}
    }
    json(e.status || (e.code === 'ENOENT' ? 404 : 500),{error:e instanceof ApiError ? e.message : '서버 요청 실패. 원격 반영 여부를 확인하세요.'});
  }
});
return { server, github, auth };
}
module.exports = { ...createApp(), createApp };
