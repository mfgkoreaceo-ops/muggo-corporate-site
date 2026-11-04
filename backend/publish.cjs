const FILES = ['site.config.js', 'data/i18n.js', 'data/site-data.js', 'data/catalog-data.js'];
class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
// Git objects may be created on failure, but the visible branch changes exactly once.
async function publish({ api, branch, expectedHead, files }) {
  if (!/^[a-f0-9]{40}$/.test(expectedHead || '')) throw new ApiError(400, '기준 커밋이 필요합니다.');
  if (!Array.isArray(files) || files.length !== FILES.length || new Set(files.map(f => f.path)).size !== FILES.length ||
      files.some(f => !FILES.includes(f.path) || typeof f.content !== 'string' || f.content.length > 1500000)) {
    throw new ApiError(400, '허용된 데이터 파일 4개만 게시할 수 있습니다.');
  }
  const ref = `git/refs/heads/${encodeURIComponent(branch)}`;
  const readRef = `git/ref/heads/${encodeURIComponent(branch)}`;
  const head = await api(readRef);
  if (head.object.sha !== expectedHead) throw new ApiError(409, '다른 변경이 먼저 반영되었습니다. 기준 버전을 다시 확인하세요.');
  const base = await api(`git/commits/${expectedHead}`);
  const tree = await api('git/trees', 'POST', {
    base_tree: base.tree.sha,
    tree: files.map(f => ({ path: f.path, mode: '100644', type: 'blob', content: f.content }))
  });
  const commit = await api('git/commits', 'POST', {
    message: 'CMS: atomic content update', tree: tree.sha, parents: [expectedHead]
  });
  // force:false rejects concurrent updates: the new commit only descends from expectedHead.
  await api(ref, 'PATCH', { sha: commit.sha, force: false });
  const observed = await api(readRef);
  const verified = await api(`git/trees/${tree.sha}?recursive=1`);
  const result = files.map(f => ({ path: f.path, sha: verified.tree.find(t => t.path === f.path)?.sha }));
  if (observed.object.sha !== commit.sha || result.some(f => !f.sha)) {
    throw new ApiError(502, `반영 확인 불가. 재게시 전 커밋 ${commit.sha}을 확인하세요.`);
  }
  return { commit: commit.sha, files: result, deployment: 'pending' };
}
module.exports = { publish, ApiError, FILES };
