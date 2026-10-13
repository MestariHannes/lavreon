'use strict';
// LAVREON app: network first, cached copy when offline. Scope is app/ only.
const CACHE = 'lavreon-app-1';
const ASSETS = [
  './', './index.html', './app.css?v=app-1', './app.js?v=app-1', './data.js?v=app-1', './i18n.js?v=app-1',
  './manifest.webmanifest', './icons/icon-192.png', './icons/apple-touch-icon.png',
  '../translations-fi.js?v=app-1', '../assets/lavreon-symbol.svg', '../assets/favicon.svg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('lavreon-app-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
  }).catch(() => caches.match(request, {ignoreSearch: request.mode === 'navigate'}).then(hit => hit || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
