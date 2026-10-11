// Opens the 20 s AJOURA presentation video in a dialog. Shared by the landing page and the app.
(()=>{
  const src='media/ajoura-mainos-20s.mp4',poster='media/ajoura-mainos-poster.jpg';
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-video]'))return;
    const d=document.createElement('dialog');d.className='video-dialog';d.setAttribute('aria-label','AJOURA-esittelyvideo');
    d.innerHTML=`<video src="${src}" poster="${poster}" controls autoplay playsinline preload="metadata"></video><button type="button" class="video-close">Sulje</button>`;
    document.body.appendChild(d);
    const close=()=>d.close();
    d.addEventListener('click',e=>{if(e.target===d||e.target.closest('.video-close'))close();});
    d.addEventListener('close',()=>{d.querySelector('video').pause();d.remove();});
    d.showModal();
  });
})();
