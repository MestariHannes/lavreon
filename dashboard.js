'use strict';
// This prototype uses only fictional in-memory data. No accounts, storage or APIs.
(() => {
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
    document.querySelector('#chart-title').textContent = 'Fictional investment values over ' + sample.name + ', ending at 8.21 million euros.';
    document.querySelector('#chart-caption').textContent = 'Sample ' + sample.name + ' value history · includes sample cash flows.';
    document.querySelectorAll('[data-period]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.period === period)));
  }
  document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click',() => draw(button.dataset.period)));
  draw('1Y');
  const sections = [
    ['Overview','overview'],['Wealth overview','wealth'],['Real estate','real-estate'],
    ['Asset allocation','allocation'],['Investments · Portfolio performance','performance'],
    ['AI Insights · Intelligence','insights'],['Recent activity','activity'],['Upcoming · Your agenda','upcoming'],
    ['Global markets','markets'],['Currencies','currencies']
  ];
  const input = document.querySelector('#search');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  input.addEventListener('input',() => {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    results.hidden = !query;
    if (!query) { status.textContent = ''; return; }
    const matches = sections.filter(([name]) => name.toLowerCase().includes(query));
    for (const [name,id] of matches) {
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = name;
      link.addEventListener('click',() => {
        results.hidden = true;
        input.value = '';
        const target = document.getElementById(id);
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
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
  function updateNavigation() {
    const hash = location.hash || '#overview';
    document.querySelectorAll('nav a').forEach(link => {
      if (link.getAttribute('href') === hash) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange',updateNavigation);
  updateNavigation();
})();

