```javascript
self.addEventListener("install",e=>{

e.waitUntil(
caches.open("ledger-cache")
.then(cache=>cache.addAll([
"/",
"/index.html",
"/app.js",
"/db.js"
]))
)

})

self.addEventListener("fetch",e=>{

e.respondWith(
caches.match(e.request)
.then(res=>res||fetch(e.request))
)

})
