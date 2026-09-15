'use strict';
// Financial demo data stays static. Only language and module presentation preferences persist.
(() => {
  function renderEye(button, hidden) {
    // The slash does not exist in the visible state. No ancestor can activate it.
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>' + (hidden ? '<path class="eye-slash" d="M3 3 21 21"/>' : '') + '</svg>';
  }
  // Mask monetary amounts only; percentages, charts and labels stay available.
  document.querySelectorAll('.stat, #allocation, #performance, #activity').forEach((card, index) => {
    const heading = card.querySelector('.card-top, .section-top');
    const name = heading.querySelector('h2').textContent.trim();
    const amounts = [...card.querySelectorAll('.value, #chart-value, .donut > div > span, .rows b')];
    const balances = amounts.map((amount, amountIndex) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'balance-amount';
      wrapper.id = `balance-${index}-${amountIndex}`;
      const original = document.createElement('span');
      original.className = 'balance-original';
      // Keep transaction descriptions and other child elements in place.
      [...amount.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => original.append(node));
      const dots = document.createElement('span');
      dots.className = 'balance-dots';
      dots.textContent = '...';
      dots.setAttribute('aria-label', 'Balance hidden');
      dots.hidden = true;
      wrapper.append(original, dots);
      amount.prepend(wrapper);
      return {wrapper, original, dots};
    });
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'privacy-toggle';
    button.setAttribute('aria-label', `Hide ${name} balances`);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-controls', balances.map(({wrapper}) => wrapper.id).join(' '));
    renderEye(button, false);
    if (card.matches('.stat')) heading.querySelector(':scope > span')?.remove();
    heading.append(button);
    const donut = card.querySelector('.donut');
    const allocationLabel = donut?.getAttribute('aria-label');
    button.addEventListener('click', () => {
      const hidden = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(hidden));
      renderEye(button, hidden);
      button.setAttribute('aria-label', `${hidden ? 'Show' : 'Hide'} ${name} balances`);
      balances.forEach(({wrapper, original, dots}) => {
        wrapper.classList.toggle('balance-hidden', hidden);
        original.setAttribute('aria-hidden', String(hidden));
        dots.hidden = !hidden;
      });
      if (donut) donut.setAttribute('aria-label', hidden ? allocationLabel.replace(/Total .+$/, 'Total balance hidden.') : allocationLabel);
      if (card.id === 'performance') draw(card.querySelector('[data-period][aria-pressed="true"]').dataset.period);
    });
  });
  const samples = {
    '1M': {values:[8.04,8.06,8.02,8.08,8.10,8.07,8.12,8.16,8.13,8.18,8.21],change:'+2.1% · 1 month',start:"Aug '26",mid:'Late Aug',name:'one month'},
    '3M': {values:[7.64,7.70,7.67,7.78,7.73,7.86,7.94,7.89,8.02,7.98,8.10,8.21],change:'+7.4% · 3 months',start:"Jun '26",mid:"Jul '26",name:'three months'},
    '1Y': {values:[6.94,7.02,6.96,7.16,7.10,7.35,7.30,7.42,7.26,7.61,7.74,7.66,7.90,7.84,7.72,7.95,7.83,7.70,7.92,8.02,7.91,8.10,8.04,8.21],change:'+18.3% · 1 year',start:"Sep '25",mid:"Mar '26",name:'one year'},
    'ALL': {values:[6.12,6.25,6.17,6.46,6.38,6.72,6.84,6.75,7.10,7.01,7.28,7.39,7.22,7.55,7.48,7.84,7.71,8.02,7.86,8.21],change:'+34.2% · all sample history',start:"Sep '23",mid:"Mar '25",name:'three years'}
  };
  function draw(period) {
    const sample = samples[period];
    const points = sample.values.map((value, index) => [40 + index * 430 / (sample.values.length - 1), 140 - (value - 6) * 40]);
    const line = points.map(([x,y],index) => (index ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
    document.querySelector('#chart-line').setAttribute('d',line);
    document.querySelector('#chart-area').setAttribute('d',line + ' L470 140 L40 140 Z');
    document.querySelector('#chart-change').textContent = sample.change;
    document.querySelector('#chart-start').textContent = sample.start;
    document.querySelector('#chart-mid').textContent = sample.mid;
    document.querySelector('#chart-title').textContent = 'Fictional investment values over ' + sample.name + (document.querySelector('#performance .privacy-toggle').getAttribute('aria-pressed') === 'true' ? '. Current balance hidden.' : ', ending at 8.21 million euros.');
    document.querySelector('#chart-caption').textContent = 'Sample ' + sample.name + ' value history · includes sample cash flows.';
    document.querySelectorAll('[data-period]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.period === period)));
  }
  document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click',() => draw(button.dataset.period)));
  draw('1Y');
  const modules = [
    {id:'overview', label:'Overview', group:'HOME', cards:[], enabled:true},
    {id:'wealth', label:'Wealth', group:'YOUR WORLD', cards:['allocation','activity'], enabled:true},
    {id:'investments', label:'Investments', group:'YOUR WORLD', route:'performance', cards:['performance'], enabled:true},
    {id:'real-estate', label:'Real Estate', group:'YOUR WORLD', cards:[], enabled:true},
    {id:'insurance', label:'Insurance', group:'YOUR WORLD', cards:['insurance'], enabled:true},
    {id:'intelligence', label:'AI Signal Brief', group:'INTELLIGENCE', route:'insights', cards:['insights'], enabled:true},
    {id:'opportunities', label:'Opportunities', group:'INTELLIGENCE', cards:['opportunities'], enabled:false},
    {id:'documents', label:'Documents', group:'OFFICE', cards:['documents'], enabled:true},
    {id:'reports', label:'Reports', group:'OFFICE', cards:['reports'], enabled:true},
    {id:'agenda', label:'Agenda', group:'OFFICE', route:'upcoming', cards:['upcoming'], enabled:true},
    {id:'markets', label:'Markets / Currencies', group:'OFFICE', cards:['markets','currencies'], enabled:true},
    {id:'companies', label:'Companies', group:'ADMIN ONLY', cards:['companies'], enabled:false},
    {id:'expenses', label:'Expenses', group:'ADMIN ONLY', cards:['expenses'], enabled:false},
    {id:'tax-legal', label:'Tax & Legal', group:'ADMIN ONLY', cards:['tax-legal'], enabled:false}
  ];
  const preferenceKey = 'lavreon-modules-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(preferenceKey) || '{}') || {}; } catch {}
  let visibility = Object.fromEntries(modules.map(m => [m.id, typeof saved[m.id] === 'boolean' ? saved[m.id] : m.enabled]));
  let mode = new URLSearchParams(location.search).get('mode') === 'admin' ? 'admin' : 'client';
  const allowed = id => mode === 'admin' || visibility[id];
  const route = m => m.route || m.id;
  const owner = id => modules.find(m => route(m) === id || m.cards.includes(id));
  const sections = modules.map(m => [m.label, route(m)]).concat([['Asset allocation','allocation'],['Recent activity','activity'],['Currencies','currencies']]);
  const nav = document.querySelector('#module-nav');
  const menuToggle = document.querySelector('.mobile-nav-toggle');
  menuToggle.addEventListener('click',()=>{const expanded=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(expanded));});
  nav.addEventListener('keydown',event=>{if(event.key==='Escape' && matchMedia('(max-width:850px)').matches){menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}});
  for (const group of ['HOME','YOUR WORLD','INTELLIGENCE','OFFICE','ADMIN ONLY']) {
    const section = document.createElement('div'); section.className = 'nav-group'; section.dataset.group = group;
    const label = document.createElement('p'); label.className='nav-label'; label.textContent=group; section.append(label);
    for (const m of modules.filter(m => m.group === group)) {
      const link = document.createElement('a'); link.href='#'+route(m); link.textContent=m.label; link.dataset.module=m.id; section.append(link);
    }
    if(group === 'ADMIN ONLY') { const link=document.createElement('a'); link.href='#client-setup'; link.textContent='Module controls / Client setup'; link.dataset.admin='true'; section.append(link); }
    nav.append(section);
  }
  const controls=document.querySelector('#module-controls');
  for(const m of modules) {
    const label=document.createElement('label'); const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.dataset.module=m.id; checkbox.checked=visibility[m.id];
    const text=document.createElement('span'); text.textContent=m.label; label.append(checkbox,text); controls.append(label);
    checkbox.addEventListener('change',()=>{visibility[m.id]=checkbox.checked; persist(); renderView();});
  }
  function persist(){try{localStorage.setItem(preferenceKey,JSON.stringify(visibility));document.querySelector('#storage-status').textContent='Saved in this browser only.';}catch{document.querySelector('#storage-status').textContent='Browser storage unavailable. Changes apply for this visit only.';}}
  document.querySelector('#reset-modules').addEventListener('click',()=>{visibility=Object.fromEntries(modules.map(m=>[m.id,m.enabled]));controls.querySelectorAll('input').forEach(c=>c.checked=visibility[c.dataset.module]);persist();renderView();});
  document.querySelectorAll('button[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;const url=new URL(location.href);url.searchParams.set('mode',mode);url.hash='overview';history.pushState(null,'',url);renderView(true);}));
  const signals = [
    {title:'AI forecasting moves into operational infrastructure', summary:'Google says WeatherNext 3 adds satellite observations, hourly refreshes and higher-resolution forecasts, with integration across its consumer and cloud products.', why:'More granular forecasts could support energy and property-risk planning; reliability still needs validation in each use case.', source:'Google DeepMind',date:'2026-09-03',url:'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-weathernext-3/'},
    {title:'Personal AI gains memory and visual assistance', summary:'Google announced forthcoming Android features that let Gemini remember item locations in Find Hub and provide camera-based Guided vision assistance. Availability depends on device and country.', why:'AI is becoming part of everyday workflows, making consent, accessibility and useful memory central product questions.',source:'Google / Android',date:'2026-09-01',url:'https://blog.google/products-and-platforms/platforms/android/android-drop-september-2026/'},
    {title:'Agent capability puts containment under scrutiny',summary:'Anthropic described stronger monitoring and isolation after incidents involving evaluation models running with reduced cyber safeguards. It paused some testing and training while improving controls.',why:'Organisations adopting autonomous agents need scoped permissions, independent checks and clear accountability alongside model capability.',source:'Anthropic',date:'2026-08-31',url:'https://www.anthropic.com/news/improving-alignment-security-efforts'}
  ];
  const signalRoot=document.querySelector('#signal-items');
  signals.forEach((s,i)=>{const article=document.createElement('article');article.className='signal-item';const num=document.createElement('span');num.className='insight-num';num.textContent='0'+(i+1);const body=document.createElement('div');const h=document.createElement('h3');h.textContent=s.title;const p=document.createElement('p');p.textContent=s.summary;const implication=document.createElement('p');implication.className='implication';const label=document.createElement('strong');label.textContent='Why it matters · ';implication.append(label,s.why);const link=document.createElement('a');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=s.source+' ↗';const time=document.createElement('time');time.dateTime=s.date;time.textContent=s.date;const meta=document.createElement('div');meta.className='signal-meta';meta.append(link,time);body.append(meta,h,p,implication);article.append(num,body);signalRoot.append(article);});
  const input = document.querySelector('#search');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  input.addEventListener('input',() => {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    results.hidden = !query;
    if (!query) { status.textContent = ''; return; }
    const matches = sections.filter(([,id]) => allowed(owner(id)?.id)).filter(([name]) => (window.LavreonLanguage?.translate(name) || name).toLowerCase().includes(query) || name.toLowerCase().includes(query));
    for (const [name,id] of matches) {
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = name;
      link.addEventListener('click',event => {
        event.preventDefault();
        results.hidden = true;
        input.value = '';
        navigateTo(id);
      });
      results.append(link);
    }
    status.textContent = matches.length + ' matching sections.';
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No sections found. Try “markets” or “wealth”.';
      results.append(empty);
    }
  });
  input.addEventListener('keydown',event => {
    if (event.key === 'ArrowDown' && !results.hidden) {
      const first = results.querySelector('a');
      if (first) { event.preventDefault(); first.focus(); }
    }
    if (event.key === 'Enter' && !results.hidden) results.querySelector('a')?.click();
  });
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') {
      if (!results.hidden) { results.hidden = true; input.focus(); }
      const profile = document.querySelector('.profile');
      if (profile.open) { profile.open = false; profile.querySelector('summary').focus(); }
    }
  });
  document.addEventListener('click',event => {
    if (!event.target.closest('.search-wrap')) results.hidden = true;
    if (!event.target.closest('.profile')) document.querySelector('.profile').open = false;
  });
  const stats = document.querySelector('.stats');
  const grid = document.querySelector('.main-grid');
  const title = document.querySelector('#greeting');
  title.tabIndex = -1;
  function renderView(focus = false) {
    mode = new URLSearchParams(location.search).get('mode') === 'admin' ? 'admin' : 'client';
    const requested=location.hash.slice(1)||'overview';
    const match=owner(requested);
    const setup=requested==='client-setup' && mode==='admin';
    const selected=match && allowed(match.id) ? match : modules.find(m=>allowed(m.id));
    const id=setup ? 'client-setup' : selected ? (match===selected ? requested : route(selected)) : 'empty';
    const overview=id==='overview';
    const heading=setup?'Client setup':id==='empty'?'Your office is being curated.':overview?'Welcome, Alex.':selected.label;
    document.querySelector('.workspace').classList.toggle('focused-view',!overview);
    document.body.dataset.mode=mode;
    document.querySelector('#mode-label').textContent=mode==='admin'?'Admin / Editor preview':'Client preview';
    document.querySelectorAll('button[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
    document.querySelector('#client-setup').hidden=mode!=='admin';
    const shown=modules.filter(m=>visibility[m.id]);
    document.querySelector('#visibility-summary').textContent='Client preview · '+shown.length+' / '+modules.length+' modules: '+(shown.map(m=>m.label).join(', ')||'None selected');
    document.querySelectorAll('a[data-module]').forEach(link=>link.hidden=!allowed(link.dataset.module));
    document.querySelectorAll('[data-admin]').forEach(link=>link.hidden=mode!=='admin');
    nav.querySelectorAll('.nav-group').forEach(group=>{group.hidden=[...group.querySelectorAll('a')].every(a=>a.hidden);group.querySelector('.nav-label').textContent=group.dataset.group==='ADMIN ONLY'&&mode==='client'?'YOUR WORLD':group.dataset.group;});
    const statModules=['wealth','investments','wealth','real-estate'];
    stats.querySelectorAll('.stat').forEach((card,i)=>{card.hidden=!allowed(statModules[i]) || !(overview || selected?.id===statModules[i]);});
    stats.hidden=[...stats.children].every(c=>c.hidden);
    stats.classList.toggle('single-card',!overview);
    [...grid.children].forEach(card=>{const m=owner(card.id);card.hidden=m ? !allowed(m.id)||!(overview||selected===m) : !overview;});
    grid.hidden=[...grid.children].every(c=>c.hidden);
    document.querySelector('#attention').hidden=!overview;
    document.querySelector('.quick-actions').hidden=!overview;
    title.textContent=heading;
    title.nextElementSibling.textContent=id==='empty'?'No modules are selected for this demo. Use Admin / Editor preview to curate the presentation.':overview?'Your wealth. Your priorities. A clearer perspective.':'A curated perspective for Alex Morgan · fictional sample client.';
    document.querySelector('.hero-note').hidden=!overview;
    document.querySelector('.breadcrumb').textContent='Your office / '+(overview?'Overview':heading);
    document.title=(overview?'Client Portal':heading)+' — LAVREON Demo';
    nav.querySelectorAll('a').forEach(link=>{if(link.hash==='#'+(setup?'client-setup':selected?route(selected):id))link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(input.value.trim())input.dispatchEvent(new Event('input'));
    if (focus) {
      title.focus({preventScroll: true});
      window.scrollTo({top: 0, behavior: 'instant'});
    }
  }
  function navigateTo(id) {
    menuToggle.setAttribute('aria-expanded', 'false');
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    renderView(true);
  }
  document.querySelectorAll('nav a, .skip, .quick-actions a, .attention-strip a').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo(link.hash.slice(1));
  }));
  document.addEventListener('lavreon-languagechange', () => {
    if (input.value.trim()) input.dispatchEvent(new Event('input'));
  });
  window.addEventListener('hashchange', () => renderView(true));
  window.addEventListener('popstate', () => renderView(true));
  renderView();
})();

