const C='nexus-ai-fund-v5-1';
const A=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nexus-ai-fund')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  const isDoc=req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('.html');
  if(isDoc){e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put('./index.html',cp))}return r}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));return}
  e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r}).catch(()=>hit);return hit||net}));
});
