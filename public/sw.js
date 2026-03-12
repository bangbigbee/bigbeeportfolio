const CACHE_NAME = 'bigbee-image-cache-v5';
const CACHE_TIMESTAMP_KEY = 'cache-created-at';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

async function cleanOldCache() {
  const cache = await caches.open(CACHE_NAME);
  const timestampResponse = await cache.match(CACHE_TIMESTAMP_KEY);
  
  if (timestampResponse) {
    const timestamp = await timestampResponse.json();
    if (Date.now() - timestamp > TWENTY_FOUR_HOURS) {
      await caches.delete(CACHE_NAME);
      return true;
    }
  } else {
    await cache.put(CACHE_TIMESTAMP_KEY, new Response(JSON.stringify(Date.now())));
  }
  return false;
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      cleanOldCache(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        );
      })
    ]).then(() => self.clients.claim())
  );
});

// Use a Map to track in-flight requests and avoid redundant fetches
const inFlightRequests = new Map();

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.method !== 'GET') return;

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url.pathname) || 
                  url.hostname === 'wsrv.nl' || 
                  url.hostname === 'raw.githubusercontent.com' ||
                  url.hostname === 'cdn.jsdelivr.net' ||
                  url.hostname === 'images.unsplash.com';

  if (isImage) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // 1. CACHE FIRST
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. DEDUPLICATE IN-FLIGHT REQUESTS
        const requestUrl = event.request.url;
        if (inFlightRequests.has(requestUrl)) {
          return inFlightRequests.get(requestUrl).then(res => res.clone());
        }

        // 3. NETWORK FALLBACK
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          inFlightRequests.delete(requestUrl);
          return networkResponse;
        }).catch(err => {
          inFlightRequests.delete(requestUrl);
          throw err;
        });

        inFlightRequests.set(requestUrl, fetchPromise);
        return fetchPromise;
      })
    );
  }
});
