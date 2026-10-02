'use strict';
// Public site behaviour: the compact mobile menu. Without JavaScript the navigation stays visible.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  if (!toggle) return;
  header.classList.add('has-menu');
  const setOpen = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('.navigation a, .header-cta').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
})();
