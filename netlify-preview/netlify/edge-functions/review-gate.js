const COOKIE = '__Host-session';
const SESSION_SECONDS = 12 * 60 * 60;
const encoder = new TextEncoder();

function protect(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('Cache-Control', 'private, no-store');
  headers.set('CDN-Cache-Control', 'no-store');
  headers.set('Netlify-CDN-Cache-Control', 'no-store');
  // no-referrer makes native form POSTs send Origin: null.
  // Preserve the origin for our own login without sharing referrers off-site.
  headers.set('Referrer-Policy', 'same-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, { status: response.status, headers });
}

function text(message, status) {
  return protect(new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function destination(value, origin) {
  try {
    if (!value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return '/';
    const url = new URL(value, origin);
    if (url.origin !== origin || url.pathname.startsWith('/__review/')) return '/';
    return url.pathname + url.search + url.hash;
  } catch { return '/'; }
}

function loginPage(returnTo, error = '') {
  const page = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive"><meta name="color-scheme" content="light">
<title>Password required</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f5f4;color:#292929;font:16px/1.5 system-ui,sans-serif;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px}
main{width:100%;max-width:320px}label{display:block;margin-bottom:8px}input,button{width:100%;min-height:48px;border:1px solid #777;border-radius:4px;padding:12px;font:inherit}input{background:#fff;color:#292929}button{margin-top:16px;background:#292929;color:#fff;cursor:pointer}input:focus-visible,button:focus-visible{outline:2px solid #292929;outline-offset:3px}.error{color:#9b2424;font-size:14px;margin:12px 0 0}
</style></head><body><main>
<form method="post" action="/__review/login">
<input type="hidden" name="returnTo" value="${escapeHTML(returnTo)}">
<label for="password">Password</label>
<input id="password" name="password" type="password" autocomplete="current-password" maxlength="256" required${error ? ' aria-invalid="true" aria-describedby="login-error"' : ''}>
${error ? `<p id="login-error" class="error" role="alert">${escapeHTML(error)}</p>` : ''}
<button type="submit">Unlock</button></form>
</main><script>
if (!location.pathname.startsWith('/__review/')) {
  document.querySelector('[name="returnTo"]').value = location.pathname + location.search + location.hash;
}
</script></body></html>`;
  return protect(new Response(page, { status:401, headers:{'Content-Type':'text/html; charset=utf-8'} }));
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}

function unbase64url(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Invalid token');
  const raw = value.replaceAll('-','+').replaceAll('_','/');
  return Uint8Array.from(atob(raw + '='.repeat((4 - raw.length % 4) % 4)), c => c.charCodeAt(0));
}

async function signingKey(password) {
  return crypto.subtle.importKey('raw', encoder.encode('vga-private-review-session-v1:' + password), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']);
}

async function passwordMatches(given, expected) {
  // Compare fixed-size digests; do not embed the password or a verifier in client files.
  const [a,b] = await Promise.all([given,expected].map(value => crypto.subtle.digest('SHA-256',encoder.encode(value))));
  const aa=new Uint8Array(a), bb=new Uint8Array(b);
  let difference=0;
  for (let i=0;i<aa.length;i++) difference |= aa[i] ^ bb[i];
  return difference===0;
}

async function session(password, audience) {
  const payload = base64url(encoder.encode(JSON.stringify({exp:Math.floor(Date.now()/1000)+SESSION_SECONDS,aud:audience})));
  const signature = await crypto.subtle.sign('HMAC',await signingKey(password),encoder.encode(payload));
  return payload+'.'+base64url(signature);
}

async function validSession(token, password, audience) {
  try {
    if (!token || token.length>1024) return false;
    const parts=token.split('.');
    if (parts.length!==2) return false;
    const [payload,signature]=parts;
    if (!await crypto.subtle.verify('HMAC',await signingKey(password),unbase64url(signature),encoder.encode(payload))) return false;
    const data=JSON.parse(new TextDecoder().decode(unbase64url(payload)));
    const now=Math.floor(Date.now()/1000);
    return data.aud===audience && Number.isSafeInteger(data.exp) && data.exp>now && data.exp<=now+SESSION_SECONDS;
  } catch { return false; }
}

function getCookie(request) {
  return (request.headers.get('cookie')||'').split(';').map(item=>item.trim()).find(item=>item.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
}

export default async function reviewGate(request, context) {
  try {
    const url=new URL(request.url);
    const password=Netlify.env.get('PREVIEW_PASSWORD');
    // Missing configuration never falls through to the unprotected site.
    if (!password || password.length>256) return text('Unavailable.',503);
    if (request.method==='POST' && url.pathname==='/__review/login') {
      if (request.headers.get('origin')!==url.origin) return text('Invalid sign-in request.',403);
      if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return text('Invalid sign-in request.',400);
      // Bound the body even if Content-Length is absent or untrusted.
      const reader=request.body?.getReader();
      if (!reader) return text('Invalid sign-in request.',400);
      let body='',size=0;
      const decoder=new TextDecoder();
      while (true) {
        const {done,value}=await reader.read();
        if (done) break;
        size+=value.byteLength;
        if (size>4096) { await reader.cancel(); return text('Sign-in request is too large.',413); }
        body+=decoder.decode(value,{stream:true});
      }
      body+=decoder.decode();
      const form=new URLSearchParams(body);
      const returnTo=destination(form.get('returnTo')||'/',url.origin);
      const given=form.get('password')||'';
      if (given.length>256 || !await passwordMatches(given,password)) return loginPage(returnTo,'That password didn’t match. Please try again.');
      return protect(new Response(null,{status:303,headers:{
        'Location':returnTo,
        'Set-Cookie':`${COOKIE}=${await session(password,url.host)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}`,
      }}));
    }
    if (!['GET','HEAD'].includes(request.method)) return text('Method not allowed.',405);
    if (url.pathname==='/__review/logout') return protect(new Response(null,{status:303,headers:{'Location':'/','Set-Cookie':`${COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`}}));
    if (!await validSession(getCookie(request),password,url.host)) {
      if (request.method==='GET' && (request.headers.get('accept')||'').includes('text/html')) return loginPage(destination(url.pathname+url.search,url.origin));
      return text('Password required.',401);
    }
    return protect(await context.next());
  } catch {
    // Runtime failures must not expose files or return cacheable responses.
    return text('Unavailable.',503);
  }
}

export const config = { path:'/*', onError:'fail' };
