'use strict';
// Offline support for the installed AJOURA demo. Scope is the ajoura/ folder only.
// Network first so updates appear as soon as the phone is online; the cache is the offline fallback.
const CACHE = 'ajoura-pwa-30';
const FILES = ['app.html', 'app.css', 'ajoura.css', 'app.js', 'car-render.js','car-shapes.js','car-images.js','car-models.js','video.js','i18n.js','tutorial.js','share.js', 'install.js', 'index.html', 'logo.svg', 'mark.svg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('ajoura-pwa-') && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  // Let the browser stream large media (range requests) straight from the network.
  if (new URL(request.url).pathname.includes('/media/')) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(new URL(request.url).pathname, copy));
    }
    return response;
  }).catch(() => caches.match(new URL(request.url).pathname, { ignoreSearch: true })
    .then(hit => hit || (request.mode === 'navigate' ? caches.match('app.html') : undefined))
    .then(hit => hit || Response.error())));
});
