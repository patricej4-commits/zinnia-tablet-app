// Offline support: serve from cache, refresh in the background so updates arrive next launch.
const CACHE = 'zinnia-v37';
const FILES = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/app.js', './js/fun.js', './js/games.js', './js/speech.js', './js/store.js', './js/util.js', './js/visuals.js', './js/worlds.js',
  './js/data/maths.js', './js/data/phonics.js', './js/data/grammar.js', './js/data/listening.js', './js/data/reading.js',
  './js/data/myworld.js', './js/data/bible.js', './js/data/spelling.js', './js/data/workbook.js', './js/data/rules.js', './js/data/health.js', './js/exam.js', './js/data/pictures.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      const fresh = fetch(e.request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
