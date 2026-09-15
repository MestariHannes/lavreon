'use strict';
(async () => {
  const root = document.documentElement;
  const overlay = document.querySelector('.page-entry');
  const mark = overlay.querySelector('.entry-symbol');
  const destination = document.querySelector('.hero-emblem img');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || location.hash || !mark.animate) { overlay.remove(); root.classList.add('intro-complete'); return; }
  let animation;
  let observer;
  let frame;
  let finished = false;
  let start;
  let width;
  const interruptions = ['pointerdown', 'keydown', 'pagehide'];
  root.classList.add('intro-pending');
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove('intro-running', 'intro-pending');
    overlay.remove();
    root.classList.add('intro-complete');
    animation?.cancel();
    observer?.disconnect();
    cancelAnimationFrame(frame);
    for (const event of interruptions) window.removeEventListener(event, finish);
    window.removeEventListener('resize', scheduleGeometry);
    window.visualViewport?.removeEventListener('resize', scheduleGeometry);
    window.visualViewport?.removeEventListener('scroll', scheduleGeometry);
    window.removeEventListener('scroll', scheduleGeometry);
    motion.removeEventListener('change', finish);
  }
  function keyframes() {
    // Read the destination again after layout/viewport changes, in the fixed overlay's coordinate space.
    const rect = destination.getBoundingClientRect();
    const origin = overlay.getBoundingClientRect();
    const end = `translate(${rect.x - origin.x}px, ${rect.y - origin.y}px) scale(${rect.width / width})`;
    return [
      {offset: 0, transform: start, opacity: 0},
      {offset: .06, transform: start, opacity: 0},
      {offset: .26, transform: start, opacity: .3},
      {offset: .52, transform: start, opacity: 1, easing: 'cubic-bezier(.4,0,.2,1)'},
      {offset: 1, transform: end, opacity: Number(getComputedStyle(destination.parentElement).opacity)}
    ];
  }
  function scheduleGeometry() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (!finished && animation) animation.effect.setKeyframes(keyframes());
    });
  }
  for (const event of interruptions) window.addEventListener(event, finish, {once: true, passive: true});
  motion.addEventListener('change', finish, {once: true});
  try {
    // A cold visit must decode the SVG and settle fonts before measuring the hero.
    await Promise.all([mark.decode(), destination.decode(), document.fonts.ready]);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (finished) return;
    const bounds = overlay.getBoundingClientRect();
    width = Math.min(320, bounds.width * .75);
    start = `translate(${(bounds.width - width) / 2}px, ${bounds.height / 2 - width * 103 / 480}px) scale(1)`;
    mark.style.width = `${width}px`;
    mark.style.height = `${width * 260 / 480}px`;
    root.classList.add('intro-running');
    root.classList.remove('intro-pending');
    animation = mark.animate(keyframes(), {duration: 5000, fill: 'both'});
    animation.onfinish = finish;
    // Browser chrome can resize the mobile viewport on first load: retarget, never abort.
    window.addEventListener('resize', scheduleGeometry, {passive: true});
    window.addEventListener('scroll', scheduleGeometry, {passive: true});
    window.visualViewport?.addEventListener('resize', scheduleGeometry, {passive: true});
    window.visualViewport?.addEventListener('scroll', scheduleGeometry, {passive: true});
    observer = new ResizeObserver(scheduleGeometry);
    observer.observe(document.querySelector('.hero'));
    observer.observe(destination);
    observer.observe(document.querySelector('.site-header'));
  } catch { finish(); }
})();
