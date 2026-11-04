const fs = require('node:fs');
const path = require('node:path');
function createRateStore(directory, sourceRoot) {
  const dir = path.resolve(directory);
  // Runtime state must never be inside the public Git repository or Pages artifact.
  if (dir === sourceRoot || dir.startsWith(sourceRoot + path.sep)) throw Error('CMS_STATE_DIRECTORY must be outside the checkout');
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, 'cms-login-attempts.json');
  return {
    load() { try { const rows = JSON.parse(fs.readFileSync(file,'utf8')); if (!Array.isArray(rows)) throw Error('Invalid rate state'); return rows; } catch(e) { if(e.code === 'ENOENT') return []; throw e; } },
    save(rows) { const temporary = file + '.tmp'; fs.writeFileSync(temporary,JSON.stringify(rows),{mode:0o600}); fs.renameSync(temporary,file); },
    audit(event) { fs.appendFileSync(path.join(dir, 'cms-audit.jsonl'), JSON.stringify({...event, at:new Date().toISOString()}) + '\n', {mode:0o600}); }
  };
}
module.exports = { createRateStore };
