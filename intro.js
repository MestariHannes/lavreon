'use strict';
(() => {
  const overlay = document.querySelector('.page-entry');
  const mark = overlay.querySelector('.entry-symbol');
  const destination = document.querySelector('.hero-emblem img');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || location.hash || !mark.animate) { overlay.remove(); return; }
  let animation;
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    document.documentElement.classList.remove('intro-running');
    overlay.remove();
    animation?.cancel();
    for (const event of ['resize', 'scroll', 'pointerdown', 'keydown', 'pagehide']) window.removeEventListener(event, finish);
    motion.removeEventListener('change', finish);
  }
  try {
    const rect = destination.getBoundingClientRect();
    const width = Math.min(320, innerWidth * .75);
    const x = (innerWidth - width) / 2;
    const y = innerHeight / 2 - width * 103 / 480;
    const start = `translate(${x}px, ${y}px) scale(1)`;
    const end = `translate(${rect.x}px, ${rect.y}px) scale(${rect.width / width})`;
    mark.style.width = `${width}px`;
    mark.style.height = `${width * 260 / 480}px`;
    document.documentElement.classList.add('intro-running');
    animation = mark.animate([
      {offset: 0, transform: start, opacity: 0, clipPath: 'circle(75% at 50% 39.61538%)'},
      {offset: .06, transform: start, opacity: 0, clipPath: 'circle(75% at 50% 39.61538%)'},
      {offset: .26, transform: start, opacity: .3, clipPath: 'circle(75% at 50% 39.61538%)'},
      {offset: .52, transform: start, opacity: 1, clipPath: 'circle(75% at 50% 39.61538%)', easing: 'cubic-bezier(.4,0,.2,1)'},
      {offset: 1, transform: end, opacity: Number(getComputedStyle(destination.parentElement).opacity), clipPath: 'circle(75% at 50% 39.61538%)'}
    ], {duration: 5000, fill: 'both'});
    animation.onfinish = finish;
    // Interaction and viewport changes reveal the final layout immediately.
    for (const event of ['resize', 'scroll', 'pointerdown', 'keydown', 'pagehide']) window.addEventListener(event, finish, {once: true, passive: true});
    motion.addEventListener('change', finish, {once: true});
  } catch { finish(); }
})();
