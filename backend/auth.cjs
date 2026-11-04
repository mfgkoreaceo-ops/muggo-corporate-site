const crypto = require('node:crypto');
// Memory state deliberately invalidates sessions on restart. Run one process only.
class Auth {
  constructor({ now = Date.now, rateStore } = {}) { this.now = now; this.sessions = new Map(); this.rateStore = rateStore; this.attempts = new Map(rateStore ? rateStore.load() : []); this.flows = new Map(); }
  random() { return crypto.randomBytes(32).toString('base64url'); }
  begin(ip) {
    const now = this.now();
    const attempt = this.attempts.get(ip);
    if (attempt && attempt.until > now && attempt.count >= 5) return null;
    const next = attempt && attempt.until > now ? attempt : { count: 0, until: now + 15 * 60000 };
    next.count++; this.attempts.set(ip, next);
    if (this.rateStore) this.rateStore.save([...this.attempts]);
    const state = this.random(); this.flows.set(state, { ip, expires: now + 5 * 60000 });
    this.prune(); return state;
  }
  consume(state, ip) {
    const flow = this.flows.get(state); this.flows.delete(state);
    return !!flow && flow.ip === ip && flow.expires > this.now();
  }
  create(user, token, ip, tokenLifetimeSeconds = 8 * 3600) {
    this.attempts.delete(ip);
    if (this.rateStore) this.rateStore.save([...this.attempts]);
    const id = this.random();
    const absolute = this.now() + Math.min(8 * 3600, tokenLifetimeSeconds) * 1000;
    this.sessions.set(id, { user, token, csrf: this.random(), idle: Math.min(this.now() + 30 * 60000, absolute), absolute });
    return id;
  }
  get(id) {
    const s = this.sessions.get(id);
    if (!s || s.idle <= this.now() || s.absolute <= this.now()) { this.sessions.delete(id); return null; }
    return s;
  }
  touch(s) { s.idle = Math.min(this.now() + 30 * 60000, s.absolute); }
  prune() {
    for (const [id, s] of this.sessions) if (Math.min(s.idle, s.absolute) <= this.now()) this.sessions.delete(id);
    for (const [id, f] of this.flows) if (f.expires <= this.now()) this.flows.delete(id);
    for (const [id, a] of this.attempts) if (a.until <= this.now()) this.attempts.delete(id);
  }
}
module.exports = { Auth };
