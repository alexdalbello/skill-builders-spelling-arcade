const CACHE='four-list-spelling-arcade-v1';
const ASSETS=['./','./index.html','./spelling-words.json','./manifest.webmanifest','./icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/spelling-words.json')){
    e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(e.request.method==='GET'){let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r})));
});