const CACHE_NAME = 'soundloop-v2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

// Install: cache all static assets including CDN scripts
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .catch(err => {
                console.log('SW cache partial fail (CDN may block):', err);
                // At minimum cache local files
                return caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(['./', './index.html', './manifest.json']));
            })
    );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline: serve from cache
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    // Fallback to index for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});
