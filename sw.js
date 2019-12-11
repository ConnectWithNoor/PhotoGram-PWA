self.addEventListener('install', event => {
  console.log('service worker installed', event);
});

self.addEventListener('activate', event => {
  console.log('service worker activated', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
