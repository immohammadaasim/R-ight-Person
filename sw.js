// =====================================================================
// ===>> BLOCK JS 1: Service Worker (Offline Engine) <<===
// =====================================================================

const CACHE_NAME = 'right-person-v1';
const ASSETS_TO_CACHE = [
  './1-login/login.html',
  './1-login/login.css',
  './1-login/login.js',
  './0-Theme/Theme.css',
  './0-Theme/Theme.js',
  './manifest.json'
];

// 1. Install Event: Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network first, then Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// =====================================================================
// ===>> END OF BLOCK JS 1 file : sw.js <<===
// =====================================================================