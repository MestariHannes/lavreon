'use strict';
// Website "share the link" button: the phone's own share sheet where available, otherwise copy to clipboard.
(() => {
  const url = 'https://mestarihannes.github.io/lavreon/ajoura/';
  document.addEventListener('click', async event => {
    const btn = event.target.closest('[data-share]');
    if (!btn) return;
    const note = btn.parentElement.querySelector('.share-note');
    if (navigator.share) { try { await navigator.share({ title: 'AJOURA', text: 'AJOURA – autosi oma huoltokirja.', url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(url); if (note) note.textContent = 'Linkki kopioitu leikepöydälle.'; }
    catch (e) { if (note) note.textContent = url; }
  });
})();
