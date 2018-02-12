const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';
const cdn_root = 'https://cdn.jsdelivr.net/npm/';
const PRECACHE_URLS = [
    cdn_root + 'xtal-fetch@0.0.20/build/ES6/xtal-fetch.js',
    cdn_root + 'xtal-decorator@0.0.12/build/ES6/xtal-decorator.js',
];
// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event['waitUntil'](caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self['skipWaiting']()));
});
//The fetch handler serves responses for same-origin resources from a cache.
//If no response is found, it populates the runtime cache with the response
//from the network before returning it to the page.
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event['request'].url.startsWith(self.location.origin) || event['request'].url.startsWith('https://cdn.jsdelivr.net')) {
        event['respondWith'](caches.match(event['request']).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            //return caches.open(RUNTIME).then(cache => {
            return fetch(event['request']).then(response => {
                // Put a copy of the response in the runtime cache.
                //return cache.put(event.request, response.clone()).then(() => {
                return response;
                //});
            });
            //});
        }));
    }
});
//# sourceMappingURL=service-worker.js.map