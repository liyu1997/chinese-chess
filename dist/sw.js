const ART_CACHE='miaoqi-art-v1';
const ART_PATH=/^\/assets\/(fast-v1|mascot|benteng)\//;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{const response=await fetch(request);if(!response.ok)return response;const type=response.headers.get('content-type')||'';if(!type.includes('text/html'))return response;let html=await response.text();if(!html.includes('/online.js'))html=html.replace('</body>','<script src="/online.js?v=1"></script></body>');return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers})})());return;
 }
 if(!ART_PATH.test(url.pathname))return;
 event.respondWith((async()=>{let cache;try{cache=await caches.open(ART_CACHE);const hit=await cache.match(request);if(hit)return hit}catch{}const response=await fetch(request);if(response.ok&&cache){const copy=response.clone();event.waitUntil((async()=>{try{await cache.put(request,copy);const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-100)))await cache.delete(key)}catch{}})())}return response})());
});