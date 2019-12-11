self.addEventListener('install', event => {
  console.log('service worker installed', event);

  // waitUntill takes a promise
  event.waitUntil(
    caches
      .open('static')
      .then(staticCache => {
        console.log('service worker, precaching app shell');
        staticCache.add('/src/js/app.js');
      })
      .catch(err => {
        console.log('service worker, precaching failed', err);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('service worker activated', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
