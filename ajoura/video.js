// Embedded AJOURA presentation video: the poster sits in the page and a tap starts the video in place.
// Shared by the landing page and the app. data-video="auto" picks the 16:9 cut on landscape screens
// (computers, tablets sideways); any other value always uses the 9:16 phone cut.
// While playing there are only two controls: mute and full screen (no pause or seeking).
(()=>{
  const wideQuery='(min-aspect-ratio: 1/1) and (min-width: 700px)';
  const wide=el=>el.dataset.video==='auto'&&matchMedia(wideQuery).matches;
  const files=w=>w?{src:'media/ajoura-esittely-vaaka.mp4',poster:'media/ajoura-esittely-vaaka-poster.jpg'}:{src:'media/ajoura-esittely.mp4',poster:'media/ajoura-esittely-poster.jpg'};
  const icon={on:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    off:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    full:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
  const start=el=>{
    if(!el||el.classList.contains('playing'))return;
    if(!el._poster)el._poster=[...el.childNodes];
    const w=wide(el),f=files(w),v=document.createElement('video');
    v.src=f.src;v.poster=f.poster;v.playsInline=true;v.preload='auto';v.setAttribute('aria-label','AJOURA-esittelyvideo');
    const mute=document.createElement('button'),full=document.createElement('button');
    mute.type=full.type='button';mute.className='video-ctrl video-mute';full.className='video-ctrl video-full';
    const setMute=()=>{mute.innerHTML=v.muted?icon.off:icon.on;mute.setAttribute('aria-label',v.muted?'Äänet päälle':'Mykistä');};
    full.innerHTML=icon.full;full.setAttribute('aria-label','Koko näyttö');setMute();
    mute.addEventListener('click',e=>{e.stopPropagation();v.muted=!v.muted;setMute();});
    full.addEventListener('click',e=>{e.stopPropagation();if(document.fullscreenElement)document.exitFullscreen();else if(el.requestFullscreen)el.requestFullscreen().catch(()=>{});else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();});
    // At the end the poster returns, so a new tap plays the video again from the start.
    v.addEventListener('ended',()=>{if(document.fullscreenElement===el)document.exitFullscreen().catch(()=>{});el.classList.remove('playing');el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label','Toista AJOURA-esittelyvideo uudelleen');el.replaceChildren(...el._poster);});
    el.classList.add('playing');el.classList.toggle('wide',w);el.removeAttribute('role');el.removeAttribute('tabindex');el.removeAttribute('aria-label');el.replaceChildren(v,mute,full);
    v.play().catch(()=>{v.muted=true;setMute();v.play().catch(()=>{});});
  };
  document.addEventListener('click',event=>start(event.target.closest('[data-video]')));
  document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-video]:not(.playing)')){event.preventDefault();start(event.target);}});
})();
