// Opens the 20 s AJOURA presentation video in a dialog. Shared by the landing page and the app.
(()=>{
  // Landscape screens (computers, tablets sideways) get the 16:9 cut, phones the original 9:16 video.
  const wide=()=>matchMedia('(min-aspect-ratio: 1/1) and (min-width: 700px)').matches;
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-video]'))return;
    const w=wide(),src=w?'media/ajoura-mainos-20s-vaaka.mp4':'media/ajoura-mainos-20s.mp4',poster=w?'media/ajoura-mainos-vaaka-poster.jpg':'media/ajoura-mainos-poster.jpg';
    const d=document.createElement('dialog');d.className='video-dialog'+(w?' wide':'');d.setAttribute('aria-label','AJOURA-esittelyvideo');
    d.innerHTML=`<video src="${src}" poster="${poster}" controls autoplay playsinline preload="metadata"></video><button type="button" class="video-close">Sulje</button>`;
    document.body.appendChild(d);
    const close=()=>d.close();
    d.addEventListener('click',e=>{if(e.target===d||e.target.closest('.video-close'))close();});
    d.addEventListener('close',()=>{d.querySelector('video').pause();d.remove();});
    d.showModal();
  });
})();
