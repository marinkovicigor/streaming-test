const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/broadcaster.html',
    '/viewer.html',
    '/styles.css',
    '/dist/broadcaster.bundle.js',
    '/dist/viewer.bundle.js',
    '/dist/webrtcHandler.bundle.js',
    '/dist/renderWorker.bundle.js',
    '/dist/streamHandler.bundle.js',
    '/dist/uiHandler.bundle.js',
    '/dist/backgroundHandler.bundle.js',
    // add other files as needed
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
