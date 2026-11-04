const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { Auth } = require('../backend/auth.cjs');
const { publish, FILES, ApiError } = require('../backend/publish.cjs');
const head = 'a'.repeat(40), commit = 'b'.repeat(40);
const files = FILES.map(path => ({path,content:'test-only'}));
function mockApi({failAt, conflict=false, verify=false}={}) {
  const calls=[];
  let ref=head;
  return { calls, get ref(){return ref;}, api:async (p,m='GET',body) => {
    calls.push({p,m,body});
    if (p === failAt) throw new ApiError(403,'denied');
    if (p.startsWith('git/refs/') || p.startsWith('git/ref/')) {
      if (m === 'PATCH') { assert.equal(body.force,false); if(conflict) throw new ApiError(409,'conflict'); ref=body.sha; }
      return {object:{sha:ref}};
    }
    if (p === 'git/commits/'+head) return {tree:{sha:'base'}};
    if (p === 'git/trees') return {sha:'tree'};
    if (p === 'git/commits') { assert.deepEqual(body.parents,[head]); return {sha:commit}; }
    if (p.startsWith('git/trees/')) return {tree:verify ? [] : FILES.map(path=>({path,sha:'blob'}))};
    throw Error(p);
  }};
}
test('server lockout: five attempts / fifteen minutes, no browser clock trust',()=>{
  let now=1000; const a=new Auth({now:()=>now});
  for(let i=0;i<5;i++) assert.ok(a.begin('ip'));
  assert.equal(a.begin('ip'),null);
  now+=15*60000; assert.ok(a.begin('ip'));
});
test('OAuth state expires, is one-time and IP-bound',()=>{
  let now=1000;const a=new Auth({now:()=>now});
  let state=a.begin('ip');assert.equal(a.consume(state,'other'),false);assert.equal(a.consume(state,'ip'),false);
  state=a.begin('ip');now+=5*60000;assert.equal(a.consume(state,'ip'),false);
});
test('idle expiration and absolute expiration are server enforced',()=>{
  let now=1000;const a=new Auth({now:()=>now});
  const id=a.create({role:'editor'},'FAKE_TEST_TOKEN','ip');
  now+=30*60000;assert.equal(a.get(id),null);
  const other=a.create({},'FAKE_TEST_TOKEN','ip');const s=a.get(other);
  for(let i=0;i<16;i++){now+=29*60000;a.touch(s);}
  now+=29*60000;assert.equal(a.get(other),null);
});
test('four files use one commit and one non-force branch update, verified file SHAs returned',async()=>{
  const m=mockApi();const r=await publish({api:m.api,branch:'main',expectedHead:head,files});
  assert.equal(r.commit,commit);assert.equal(r.files.length,4);assert.equal(r.deployment,'pending');
  assert.equal(m.calls.filter(c=>c.m==='PATCH').length,1);
});
test('stale baseline refuses any write',async()=>{
  const m=mockApi();await assert.rejects(publish({api:m.api,branch:'main',expectedHead:'c'.repeat(40),files}),e=>e.status===409);
  assert.equal(m.calls.filter(c=>c.m!=='GET').length,0);
});
test('concurrent writer rejects branch update',async()=>{
  const m=mockApi({conflict:true});await assert.rejects(publish({api:m.api,branch:'main',expectedHead:head,files}),e=>e.status===409);assert.equal(m.ref,head);
});
test('tree failure leaves visible branch untouched',async()=>{
  const m=mockApi({failAt:'git/trees'});await assert.rejects(publish({api:m.api,branch:'main',expectedHead:head,files}));assert.equal(m.ref,head);
});
test('failed verification cannot return publication success',async()=>{
  const m=mockApi({verify:true});await assert.rejects(publish({api:m.api,branch:'main',expectedHead:head,files}),e=>e.status===502);assert.equal(m.ref,commit);
});
test('duplicate or unauthorized file rejects without API calls',async()=>{
  for(const input of [[...files.slice(0,3),files[0]],[...files.slice(0,3),{path:'admin/admin.js',content:'x'}]]) {
    const m=mockApi();await assert.rejects(publish({api:m.api,branch:'main',expectedHead:head,files:input}),e=>e.status===400);assert.equal(m.calls.length,0);
  }
});
test('HTTP: static preview works, missing auth fails closed, server and metadata are not served',async()=>{
  const {server}=require('../backend/server.cjs');await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin='http://127.0.0.1:'+server.address().port;
  try {
    for(const [p,status] of [['/admin/',200],['/api/session',401],['/auth/github',503],['/server.js',404],['/backend/auth.cjs',404],['/.git/config',404]]) assert.equal((await fetch(origin+p)).status,status,p);
    assert.equal((await fetch(origin+'/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'super_admin'})})).status,401);
  }finally{await new Promise(r=>server.close(r));}
});
function harness(storage={}) {
  const values=new Map(Object.entries(storage));const elements=new Map();
  const elem=id=>{if(!elements.has(id)) elements.set(id,{id,hidden:false,textContent:'',innerHTML:'',value:'',style:{},classList:{toggle(){},add(){},remove(){}},addEventListener(){},getAttribute(){return null;}});return elements.get(id);};
  const localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
  const context={window:{},document:{documentElement:{},getElementById:elem,querySelectorAll:()=>[],addEventListener(){},querySelector:()=>null},localStorage,sessionStorage:{removeItem(){},getItem:()=>null},setInterval:()=>1,clearInterval(){},setTimeout:()=>1,clearTimeout(){},console,URL,Blob,AbortSignal,confirm:()=>true,alert(){},fetch:async()=>({ok:false,status:401,json:async()=>({error:'expired'})})};
  context.addEventListener=()=>{};context.window=context;vm.createContext(context);
  for(const f of ['site.config.js','data/i18n.js','data/site-data.js','data/catalog-data.js','admin/admin-i18n.js','admin/admin.js'])vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'..',f),'utf8'),context,{filename:f});
  return {context,values,elem};
}
test('all seven panels render with production data in isolated VM; preview language and viewport switch',()=>{
  const h=harness();const cms=h.context.AdminCMS;cms.handleLogin();
  for(let i=1;i<=7;i++){cms.switchMenu('menu'+i);assert.ok(h.elem('panel-menu'+i).innerHTML.length>0);}
  h.elem('preview-lang-select').value='ko';cms.reloadPreviewFrame();assert.match(h.elem('cms-preview-iframe').src,/lang=ko/);
  cms.setPreviewViewport('mobile');assert.match(h.elem('preview-stage').className,/mobile/);
  cms.setPreviewViewport('desktop');assert.match(h.elem('preview-stage').className,/desktop/);
});
test('draft, legacy vault/account/history survive opening; empty rollback never deletes them',()=>{
  const old={'muggo-cms-aes-vault-v1':'encrypted-test','muggo-cms-accounts-v1':'legacy-test','muggo-cms-published':'legacy-published-test','muggo-cms-audit-log-v1':'[]'};
  const h=harness(old);h.context.AdminCMS.handleLogin();h.context.AdminCMS.rollbackLatest();
  for(const [k,v]of Object.entries(old))assert.equal(h.values.get(k),v);
});
test('unauthenticated publication creates no fake local publication success',async()=>{
  const h=harness();h.context.AdminCMS.handleLogin();await h.context.AdminCMS.publishChanges();
  assert.equal(h.values.has('muggo-cms-published'),false);assert.match(h.elem('publication-status').textContent,/미리보기 전용/);
});
test('GitHub HTTP authentication, permission, conflict, and network errors remain failures',async()=>{
  const {github}=require('../backend/server.cjs');const original=global.fetch;
  try{
    for(const [status,expected] of [[401,401],[403,403],[409,409],[422,409],[500,500]]){
      global.fetch=async()=>({ok:false,status});await assert.rejects(github('FAKE_TEST_TOKEN','user'),e=>e.status===expected);
    }
    global.fetch=async()=>{throw Error('test transport failure');};await assert.rejects(github('FAKE_TEST_TOKEN','user'),e=>e.status===502);
  }finally{global.fetch=original;}
});
test('company, copy, job, article, metric, brand and menu edits survive draft save and reload',()=>{
  const h=harness();const cms=h.context.AdminCMS;cms.handleLogin();
  cms.updateConfigField('brandName','TEST ONLY');cms.updateI18nPath('en','hero.appComingSoon','TEST COPY');
  cms.updateJobField(0,'titleEn','TEST JOB');cms.updateArticleField(0,'titleKo','테스트 공지');cms.updateMetricField(0,'labelEn','TEST METRIC');
  cms.updateBrandField(0,'name_en','TEST BRAND');cms.updateMenuField(0,0,'name_en','TEST MENU');cms.saveDraft();
  const data=JSON.parse(h.values.get('muggo-cms-draft'));
  assert.equal(data.config.brandName,'TEST ONLY');assert.equal(data.i18n.en.hero.appComingSoon,'TEST COPY');assert.equal(data.siteData.jobs[0].titleEn,'TEST JOB');
  assert.equal(data.siteData.articles[0].titleKo,'테스트 공지');assert.equal(data.siteData.metrics[0].labelEn,'TEST METRIC');assert.equal(data.catalog[0].menus[0].name_en,'TEST MENU');
  const reloaded=harness(Object.fromEntries(h.values));reloaded.context.AdminCMS.handleLogin();
  assert.match(reloaded.elem('panel-menu2').innerHTML,/TEST ONLY/);assert.match(reloaded.elem('panel-menu4').innerHTML,/TEST JOB/);
});
test('brand search and category filter operate independently in isolated data',()=>{
  const h=harness();const cms=h.context.AdminCMS;cms.handleLogin();cms.setBrandSearch('zz-no-match-test');
  assert.doesNotMatch(h.elem('panel-menu6').innerHTML,/AdminCMS.toggleExpandBrand/);
  cms.setBrandSearch('');cms.setBrandFilterCat('Chicken');
  assert.match(h.elem('panel-menu6').innerHTML,/SOTDAK/);
});
test('local rollback preserves previous draft and legacy history snapshots',()=>{
  const h=harness();h.context.AdminCMS.handleLogin();h.context.AdminCMS.saveDraft();const original=JSON.parse(h.values.get('muggo-cms-draft'));
  const logs=[{timestamp:'2026-01-01',action:'TEST',summary:'TEST',snapshot:original}];h.values.set('muggo-cms-audit-log-v1',JSON.stringify(logs));
  h.context.AdminCMS.updateConfigField('brandName','TEST CHANGED');h.context.AdminCMS.saveDraft();h.context.AdminCMS.rollbackToLog(0);
  assert.equal(JSON.parse(h.values.get('muggo-cms-draft')).config.brandName,original.config.brandName);
  assert.ok([...h.values.keys()].some(k=>k.startsWith('muggo-cms-preserved-')));
  assert.ok(JSON.parse(h.values.get('muggo-cms-audit-log-v1')).some(l=>l.action==='TEST' && l.snapshot));
});
test('CSV export/import preserves EN/KO translations; no synthetic translations from ID',()=>{
  const h=harness();const cms=h.context.AdminCMS;cms.handleLogin();let downloaded='';
  h.context.Blob=class {constructor(parts){downloaded=parts.join('');}};
  h.context.URL={createObjectURL:()=> 'blob:test',revokeObjectURL(){}};
  h.context.document.createElement=()=>({click(){}});h.context.document.body={appendChild(){},removeChild(){}};
  h.context.FileReader=class {readAsText(file){this.result=file.text;this.onload();}};
  cms.exportJobsCsv();assert.match(downloaded,/titleEn,titleKo,deptEn,deptKo,typeId,typeEn,typeKo,descEn,descKo/);
  const csv=downloaded;cms.importJobsCsv({target:{files:[{text:csv}]}});cms.saveDraft();
  const jobs=JSON.parse(h.values.get('muggo-cms-draft')).siteData.jobs;
  assert.equal(jobs.length,11);assert.notEqual(jobs[0].titleEn,jobs[0].titleId);assert.match(jobs[0].titleKo,/[가-힣]/);
  cms.importJobsCsv({target:{files:[{text:'id,title,description\nTEST,Judul uji,Deskripsi uji'}]}});cms.saveDraft();
  const item=JSON.parse(h.values.get('muggo-cms-draft')).siteData.jobs[0];assert.equal(item.titleEn,'');assert.equal(item.titleKo,'');
});
test('JSON restore backs up local state and only replaces content; preserved snapshot is recoverable',()=>{
  const h=harness();const cms=h.context.AdminCMS;cms.handleLogin();cms.saveDraft();
  const data=JSON.parse(h.values.get('muggo-cms-draft'));data.config.brandName='TEST RESTORED';
  h.context.FileReader=class {readAsText(file){this.result=file.text;this.onload();}};
  cms.restoreFromJsonBackup({target:{files:[{name:'test.json',text:JSON.stringify({data,storage:{'muggo-cms-accounts-v1':'MUST NOT IMPORT'}})}]}});
  assert.equal(JSON.parse(h.values.get('muggo-cms-draft')).config.brandName,'TEST RESTORED');
  assert.equal(h.values.has('muggo-cms-accounts-v1'),false);
  assert.ok([...h.values.keys()].some(k=>k.startsWith('muggo-cms-preserved-')));
});
test('HTTP authorization: editor, spoofed role, missing CSRF, wrong origin, expired session all denied',async()=>{
  let now=1000;let apiCalls=0;
  const {createApp}=require('../backend/server.cjs');
  const app=createApp({now:()=>now,rateStore:{load:()=>[],save(){}},env:{ADMIN_ORIGIN:'https://test.invalid',GITHUB_CLIENT_ID:'TEST_CLIENT',GITHUB_CLIENT_SECRET:'TEST_SECRET',CMS_PUBLISH_ENABLED:'true',CMS_GITHUB_USER_ROLES:'{"1":"super_admin","2":"editor"}'},fetchImpl:async()=>{apiCalls++;return {ok:true,json:async()=>({permissions:{push:false}})};}});
  await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+app.server.address().port;
  const editor=app.auth.create({githubId:2,id:'test-editor',role:'editor'},'FAKE_TEST_TOKEN','ip');
  const admin=app.auth.create({githubId:1,id:'test-admin',role:'super_admin'},'FAKE_TEST_TOKEN','ip');
  const post=(id,csrf,source='https://test.invalid')=>fetch(origin+'/api/publish',{method:'POST',headers:{Cookie:'__Host-muggo-session='+id,'X-CSRF-Token':csrf,Origin:source,'Content-Type':'application/json'},body:JSON.stringify({role:'super_admin',expectedHead:head,files})});
  try{
    assert.equal((await post(editor,app.auth.get(editor).csrf)).status,403);
    assert.equal((await post(admin,'wrong')).status,403);
    assert.equal((await post(admin,app.auth.get(admin).csrf,'https://attacker.invalid')).status,403);
    assert.equal(apiCalls,0);
    assert.equal((await post(admin,app.auth.get(admin).csrf)).status,403);assert.equal(apiCalls,1); // GitHub permission independently enforced.
    app.auth.get(editor).user.role='super_admin';assert.equal((await post(editor,app.auth.get(editor).csrf)).status,401);
    const csrf=app.auth.get(admin).csrf;now+=30*60000;assert.equal((await post(admin,csrf)).status,401);
  }finally{await new Promise(r=>app.server.close(r));}
});
test('login rate limit persists across server restarts through the rate store',()=>{
  let saved=[];const rateStore={load:()=>saved,save:rows=>{saved=JSON.parse(JSON.stringify(rows));}};
  const first=new Auth({rateStore});for(let i=0;i<5;i++)assert.ok(first.begin('ip'));
  const restarted=new Auth({rateStore});assert.equal(restarted.begin('ip'),null);
});
