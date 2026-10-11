// Embedded AJOURA presentation video: the poster sits in the page and a tap starts the video in place.
// Shared by the landing page and the app. data-video="auto" picks the 16:9 cut on landscape screens
// (computers, tablets sideways); any other value always uses the 9:16 phone cut.
(()=>{
  const wideQuery='(min-aspect-ratio: 1/1) and (min-width: 700px)';
  const wide=el=>el.dataset.video==='auto'&&matchMedia(wideQuery).matches;
  const files=w=>w?{src:'media/ajoura-esittely-vaaka.mp4',poster:'media/ajoura-esittely-vaaka-poster.jpg'}:{src:'media/ajoura-esittely.mp4',poster:'media/ajoura-esittely-poster.jpg'};
  const start=el=>{
    if(!el||el.classList.contains('playing'))return;
    const w=wide(el),f=files(w),v=document.createElement('video');
    v.src=f.src;v.poster=f.poster;v.controls=true;v.playsInline=true;v.preload='auto';v.setAttribute('aria-label','AJOURA-esittelyvideo');
    el.classList.add('playing');el.classList.toggle('wide',w);el.removeAttribute('role');el.removeAttribute('tabindex');el.removeAttribute('aria-label');el.replaceChildren(v);
    v.play().catch(()=>{});v.focus();
  };
  document.addEventListener('click',event=>start(event.target.closest('[data-video]')));
  document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-video]:not(.playing)')){event.preventDefault();start(event.target);}});
})();
