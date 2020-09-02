// Files to be cached for saving later
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/styles.css',
  '/db.js',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// Adds the files on an install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cacheData) => cacheData.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const mainCachesNames = [PRECACHE, RUNTIME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => cacheNames.filter(
        (cachedName) => !mainCachesNames.includes(cachedName),
      ))
      .then((deleteCaches) => Promise.all(
        deleteCaches.map((deleteThisCache) => caches.delete(deleteThisCache)),
      ))
      .then(() => self.clients.claim()),
  );
});

// Gets the files after running
self.addEventListener('fetch', (data) => {
  if (data.request.url.includes('/api/')) {
    data.respondWith(
      caches
        .open(RUNTIME)
        .then((cache) => fetch(data.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(data.request, response.clone());
            }
            return response;
          })
          .catch((err) => cache.match(data.request)))
        .catch((err) => {
          console.log(err);
        }),
    );
  }
});
