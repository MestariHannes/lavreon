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
  const copy = document.getElementById('install-copy');
  const link = 'https://mestarihannes.github.io/lavreon/ajoura/app.html';
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(link); copy.textContent = 'Linkki kopioitu'; }
    catch (e) { window.prompt('Kopioi linkki:', link); }
  });
  // Where the browser allows it (Chrome on Android, desktop Chrome/Edge) the button asks to install straight away; iPhone has no such prompt, so it shows the steps.
  // The landing page links to app.html?asenna=1 to open the install steps straight away.
  if (/[?&]asenna=1/.test(location.search) && !document.documentElement.classList.contains('standalone')) dialog.showModal();
  document.querySelectorAll('[data-install-open]').forEach(button => button.addEventListener('click', async () => {
    if (!deferred) { dialog.showModal(); return; }
    const prompt = deferred;
    deferred = null;
    now.hidden = true;
    prompt.prompt();
    const choice = await prompt.userChoice.catch(() => null);
    if (!choice || choice.outcome !== 'accepted') dialog.showModal();
  }));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
