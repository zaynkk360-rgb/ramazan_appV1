const CACHE_NAME = 'ramadan-companion-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Event: Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We try to cache what we can, but don't fail if one external resource fails
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup old caches
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

// Fetch Event: Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't cache Gemini API calls directly in SW as we want fresh data or app-level handling
  if (url.origin.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // Handle external CDNs (esm.sh, tailwind, fonts) and local files
  if (
    url.origin === 'https://esm.sh' || 
    url.origin === 'https://cdn.tailwindcss.com' || 
    url.origin === 'https://fonts.googleapis.com' || 
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin === self.location.origin
  ) {
     event.respondWith(
       caches.match(event.request).then((cachedResponse) => {
         const fetchPromise = fetch(event.request).then((networkResponse) => {
           // Check if we received a valid response
           if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
             return networkResponse;
           }

           // Clone response to cache it
           const responseToCache = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, responseToCache);
           });

           return networkResponse;
         }).catch(() => {
            // Network failure
            return cachedResponse;
         });

         return cachedResponse || fetchPromise;
       })
     );
  }
});