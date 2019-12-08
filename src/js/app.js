// IFFY function to immediately register serviceWorker.
(async function() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('service worker registerd');
    } catch (e) {
      console.log('Error: Service worker not registered', e);
    }
  }
})();
