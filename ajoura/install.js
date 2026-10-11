'use strict';
// Home-screen install support: offline cache, the install dialog and Android's install prompt.
(() => {
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  const dialog = document.getElementById('install-dialog');
  const now = document.getElementById('install-now');
  let deferred = null;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferred = event;
    now.hidden = false;
  });
  now.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    now.hidden = true;
    dialog.close();
  });
  document.querySelectorAll('[data-install-open]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
