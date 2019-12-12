const staticCacheVerion = 'staticCache-v9';
const dynamicCacheVersion = 'dynamicCache-v6';
const staticCache = [
  '/',
  '/index.html',
  '/pages/fallback.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  '/src/images/logo.png',
  '/src/images/img-not-found.png',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.blue_grey-pink.min.css'
];

self.addEventListener('install', event => {
  console.log('service worker installed', event);

  // waitUntill takes a promise
  event.waitUntil(
    caches
      .open(staticCacheVerion)
      .then(cache => {
        console.log('service worker, precaching app shell');
        cache
          .addAll(staticCache)
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
  event.waitUntil(
    // caches.keys returns array of all caches
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== staticCacheVerion && key !== dynamicCacheVersion) {
            console.log('service worker deleting old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// // Strategy cache then network fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then(response => {
//         // even thought the response is not found on cache it still executes
//         // the then block instead of catch block by response as a undefined bcz, technically
//         // undefined is not ana error.
//         return response // if response is in cache return it, else fetch from network
//           ? response
//           : fetch(event.request)
//               .then((
//                 res // after fetch response, open dynamic cache
//               ) =>
//                 caches
//                   .open(dynamicCacheVersion)
//                   .then(cache => {
//                     // then put them into dynamic cache
//                     cache.put(event.request.url, res.clone()); // gottcha: res can be consumed once. so cloning it
//                     return res; // imp to send the res back to html page
//                   })
//                   .catch(err =>
//                     console.log(
//                       'service worker, storing dynamic cache error',
//                       err
//                     )
//                   )
//               )
//               .catch(err => {
//                 console.log(
//                   'service worker, fetching dynamic catch error',
//                   err
//                 );
//                 // serving fallback.html to avoid breaking application
//                 return caches
//                   .open(staticCacheVerion)
//                   .then(cache => cache.match('/fallback.html'))
//                   .catch(err => console.log('serving fallback error', err));
//               });
//       })
//       .catch(err => {
//         console.log('cache match error', err);
//       })
//   );
// });

// Strategy network then cache fallback
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (
          !staticCache
            .slice(1)
            .find(sCache => event.request.url.includes(sCache))
        ) {
          return caches
            .open(dynamicCacheVersion)
            .then(cache => {
              cache.put(event.request.url, res.clone());
              return res;
            })
            .catch(err =>
              console.log('service worker, storing dynamic cache error', err)
            );
        } else {
          return res;
        }
      })
      .catch(err => {
        console.log('fetch network error, trying cache', err);
        return caches
          .match(event.request)
          .then(res => {
            console.log(event.request.url);
            return res
              ? res
              : event.request.url.includes('.html')
              ? caches.match('/pages/fallback.html')
              : event.request.url.includes('.png') ||
                event.request.url.includes('.jpg')
              ? caches.match('/src/images/img-not-found.png')
              : null;
          })
          .catch(() =>
            console.log('strategy network then cache fallback failed')
          );
      })
  );
});
