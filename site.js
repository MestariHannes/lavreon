'use strict';
// Retainer scope lists: open on wide screens, collapsed on phones so the section stays readable.
(() => {
  const scopes = document.querySelectorAll('.tier-scope');
  if (!scopes.length) return;
  const narrow = matchMedia('(max-width: 900px)');
  const sync = () => scopes.forEach(scope => {
    scope.open = !narrow.matches;
    scope.querySelector('summary').tabIndex = narrow.matches ? 0 : -1;
  });
  narrow.addEventListener('change', sync);
  sync();
})();

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

// App preview: scale the 390 x 844 app frame to the phone drawn around it.
(() => {
  const phone = document.querySelector('.app-phone');
  const frame = phone?.querySelector('iframe');
  if (!frame || !('ResizeObserver' in window)) return;
  new ResizeObserver(() => frame.style.setProperty('--scale-js', String((phone.clientWidth - 22) / 390))).observe(phone);
})();

// Sections ease in once as they enter the viewport. Skipped for reduced motion and old browsers.
(() => {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const inner = '.world-item, .pricing-card, .app-features li';
  const blocks = [...document.querySelectorAll('.public-site main > .section:not(.hero) > *')].filter(block => !block.querySelector(inner));
  const targets = [...blocks, ...document.querySelectorAll(inner)];
  if (!targets.length) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    target.classList.add('is-visible');
    observer.unobserve(target);
    // Hand the element back to its own hover transitions once it has arrived.
    setTimeout(() => target.classList.remove('reveal', 'is-visible'), 1400);
  }), {rootMargin: '0px 0px -8% 0px', threshold: .08});
  targets.forEach(target => {
    target.classList.add('reveal');
    const siblings = [...target.parentElement.children].filter(child => child.classList.contains('reveal'));
    target.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(target), 4) * 90}ms`);
    observer.observe(target);
  });
  document.documentElement.classList.add('reveal-ready');
})();
