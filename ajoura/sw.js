// AJOURA moved to https://mestarihannes.github.io/Ajoura/ - this worker removes itself and reloads open pages,
// which then redirect. Caches are left alone: they share the origin with the new app, whose worker cleans old ones.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(self.registration.unregister()
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(clients => clients.forEach(c => c.navigate(c.url))));
});
