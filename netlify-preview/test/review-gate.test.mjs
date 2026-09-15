import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import gate, { config } from '../netlify/edge-functions/review-gate.js';

const PASSWORD='local-test-only-4b732f915a09837c';
const ORIGIN='https://private-review.example';
let configured=PASSWORD;
beforeEach(()=>{
  configured=PASSWORD;
  globalThis.Netlify={env:{get:()=>configured}};
});

async function invoke(path='/', options={}) {
  let served=false;
  const response=await gate(new Request(ORIGIN+path,options),{
    next:async()=>{served=true;return new Response('PRIVATE FILE',{headers:{'Content-Type':'text/plain','Cache-Control':'public, max-age=3600'}});},
  });
  assert.match(response.headers.get('X-Robots-Tag'),/noindex/);
  assert.equal(response.headers.get('Cache-Control'),'private, no-store');
  assert.equal(response.headers.get('Referrer-Policy'),'same-origin');
  return {response,served};
}

const signIn=(password=PASSWORD, returnTo='/?gallery=10#/concept/files', headers={})=>invoke('/__review/login',{
  method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',Origin:ORIGIN,...headers},
  body:new URLSearchParams({password,returnTo}),
});
async function cookie() {
  const {response}=await signIn();
  return response.headers.get('Set-Cookie').split(';')[0];
}

test('gate is declared on every site path and fails closed on platform errors',()=>{
  assert.equal(config.path,'/*'); assert.equal(config.onError,'fail');
});
test('page prompts for the password without leaking the app or secret',async()=>{
  const {response,served}=await invoke('/',{headers:{Accept:'text/html'}});
  assert.equal(response.status,401); assert.equal(served,false);
  const html=await response.text();
  assert.match(html,/type="password"/); assert.match(html,/name="robots" content="noindex/);
  assert.doesNotMatch(html,/PRIVATE FILE|local-test-only|main\.[\da-f]+\.js/);
  assert.doesNotMatch(html,/Very Good Apps|Billy|Collins|Rafa[lł]|Truszkowski|company|ten directions|gallery|design review|preview/i);
  assert.match(html,/<title>Password required<\/title>/);
  assert.match(html,/>Unlock<\/button>/);
});
test('pages, JavaScript, images, nested routes, and HEAD requests are denied before login',async()=>{
  for (const path of ['/','/index.html','/static/js/main.js','/concepts/office-miniature-v3.webp','/privacy/','/missing/path','/.netlify/images?url=/concepts/office-miniature-v3.webp']) {
    const {response,served}=await invoke(path);
    assert.equal(response.status,401,path); assert.equal(served,false,path);
  }
  const {response,served}=await invoke('/index.html',{method:'HEAD'});
  assert.equal(response.status,401); assert.equal(served,false);
});
test('missing or excessively long configuration never exposes files',async()=>{
  for (const value of [undefined,'','x'.repeat(257)]) {
    configured=value;
    const {response,served}=await invoke('/concepts/office-miniature-v3.webp');
    assert.equal(response.status,503); assert.equal(served,false);
  }
});
test('wrong password returns an accessible error and no session',async()=>{
  const {response,served}=await signIn('wrong');
  assert.equal(response.status,401); assert.equal(served,false);
  assert.equal(response.headers.get('Set-Cookie'),null);
  const html=await response.text();
  assert.match(html,/aria-invalid="true"/); assert.match(html,/role="alert"/);
  assert.doesNotMatch(html,/Very Good Apps|Billy|Collins|Rafa[lł]|Truszkowski|company|ten directions|design review|preview/i);
});
test('login sets a protected session and preserves a gallery deep link',async()=>{
  const {response}=await signIn();
  assert.equal(response.status,303);
  assert.equal(response.headers.get('Location'),'/?gallery=10#/concept/files');
  const setCookie=response.headers.get('Set-Cookie');
  for (const value of ['__Host-session=','Path=/','Secure','HttpOnly','SameSite=Lax','Max-Age=43200']) assert.ok(setCookie.includes(value));
  assert.ok(!setCookie.includes(PASSWORD));
  const {response:asset,served}=await invoke('/concepts/office-miniature-v3.webp',{headers:{Cookie:setCookie.split(';')[0]}});
  assert.equal(served,true); assert.equal(await asset.text(),'PRIVATE FILE');
});
test('invalid, forged, and changed-password sessions are rejected',async()=>{
  const valid=await cookie();
  for (const value of ['__Host-session=garbage',valid+'x','__Host-session=abc.def.extra']) {
    const {response,served}=await invoke('/',{headers:{Cookie:value}});
    assert.equal(response.status,401); assert.equal(served,false);
  }
  configured='a-different-password-49b83d0c';
  const {response,served}=await invoke('/',{headers:{Cookie:valid}});
  assert.equal(response.status,401); assert.equal(served,false);
});
test('expired sessions and sessions copied to another host are rejected',async()=>{
  const valid=await cookie();
  const realNow=Date.now;
  try {
    Date.now=()=>realNow()+13*60*60*1000;
    assert.equal((await invoke('/',{headers:{Cookie:valid}})).response.status,401);
  } finally { Date.now=realNow; }
  let served=false;
  const response=await gate(new Request('https://another-review.example/',{headers:{Cookie:valid}}),{next:()=>{served=true;return new Response('private');}});
  assert.equal(response.status,401); assert.equal(served,false);
});
test('cross-site and malformed login submissions are rejected',async()=>{
  assert.equal((await signIn(PASSWORD,'/',{Origin:'https://elsewhere.example'})).response.status,403);
  assert.equal((await signIn(PASSWORD,'/',{Origin:''})).response.status,403);
  assert.equal((await signIn(PASSWORD,'/',{Origin:'null'})).response.status,403);
  assert.equal((await signIn(PASSWORD,'/',{'Content-Type':'text/plain'})).response.status,400);
  const huge=await signIn(PASSWORD,'/'+ 'x'.repeat(5000));
  assert.equal(huge.response.status,413);
});
test('return addresses cannot redirect off-site or inject markup',async()=>{
  for (const value of ['https://elsewhere.example/','//elsewhere.example/','/\\elsewhere.example/','/\r\nInjected: yes','/__review/login']) {
    assert.equal((await signIn(PASSWORD,value)).response.headers.get('Location'),'/');
  }
  const {response}=await signIn('wrong','/" onmouseover="alert(1)');
  const html=await response.text();
  assert.ok(!html.includes('value="/" onmouseover='));
});
test('logout clears the session with matching cookie attributes',async()=>{
  const {response}=await invoke('/__review/logout');
  assert.equal(response.status,303);
  assert.match(response.headers.get('Set-Cookie'),/Max-Age=0/);
  assert.match(response.headers.get('Set-Cookie'),/Secure; HttpOnly; SameSite=Lax/);
});
test('downstream errors and unsupported methods stay closed',async()=>{
  const valid=await cookie();
  const response=await gate(new Request(ORIGIN+'/',{headers:{Cookie:valid}}),{next:()=>{throw new Error('test error');}});
  assert.equal(response.status,503); assert.match(response.headers.get('X-Robots-Tag'),/noindex/);
  assert.equal((await invoke('/',{method:'PUT'})).response.status,405);
});

test('accepts the owner-configured short password without exposing it',async()=>{
  configured='abcde';
  const {response}=await signIn(configured);
  assert.equal(response.status,303);
  assert.ok(response.headers.get('Set-Cookie'));
  assert.ok(!response.headers.get('Set-Cookie').includes(configured));
});
