const staticCache_v1 = [
  '/',
  '/index.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  '/src/images/logo.png',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.blue_grey-pink.min.css'
];

self.addEventListener('install', event => {
  console.log('service worker installed', event);

  // waitUntill takes a promise
  event.waitUntil(
    caches
      .open('static-v1')
      .then(cache => {
        console.log('service worker, precaching app shell');
        cache
          .addAll(staticCache_v1)
          .then(_ => console.log('service worker, precached app shell'))
          .catch(err => console.log('service worker, precaching failed', err));
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
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        // even thought the response is not found on cache it still executes
        // the then block instead of catch block by response as a undefined bcz, technically
        // undefined is not ana error.
        return response ? response : fetch(event.request);
      })
      .catch(err => console.log('fetching cache error', err))
  );
});
