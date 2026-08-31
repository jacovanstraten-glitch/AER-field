/* AER Field App service worker — network-first for the app shell, cache-first for assets.
   Network-first HTML means: when online you always get the newest app; offline you get the cached copy. */
const CACHE = 'aer-field-v13';
const ASSETS = [
  'AER_Field_App.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://alcdn.msauth.net/browser/2.35.0/js/msal-browser.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

function isHtml(req){ return req.mode === 'navigate' || req.destination === 'document' || /AER_Field_App\.html($|\?)/.test(req.url); }

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  if (isHtml(req)) {
    // Network-first: fetch the freshest app shell when online, fall back to cache offline.
    e.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put('AER_Field_App.html', copy)).catch(()=>{});
        return resp;
      }).catch(() => caches.match(req).then(h => h || caches.match('AER_Field_App.html')))
    );
    return;
  }
  // Assets (SheetJS, MSAL, icons): cache-first for speed and offline.
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return resp;
      }).catch(() => caches.match('AER_Field_App.html'))
    )
  );
});
