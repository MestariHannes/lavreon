'use strict';
// This prototype uses only fictional in-memory data. No accounts, storage or APIs.
(() => {
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
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="eye-slash" d="M3 3 21 21"/></svg>';
    if (card.matches('.stat')) heading.querySelector(':scope > span')?.remove();
    heading.append(button);
    const donut = card.querySelector('.donut');
    const allocationLabel = donut?.getAttribute('aria-label');
    button.addEventListener('click', () => {
      const hidden = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(hidden));
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
  const views = {
    overview: {title: 'Welcome to your office.', description: 'Your wealth. Your priorities. A clearer perspective.', cards: null},
    wealth: {title: 'Wealth overview', description: 'A consolidated view of your sample wealth.', cards: ['wealth']},
    'real-estate': {title: 'Real Estate', description: 'Your sample property value and quarterly change.', cards: ['real-estate']},
    performance: {title: 'Investments', description: 'Explore your sample portfolio performance over time.', cards: ['performance']},
    allocation: {title: 'Asset allocation', description: 'The composition of your sample asset mix.', cards: ['allocation'], nav: 'wealth'},
    insights: {title: 'Intelligence', description: 'Illustrative insights and planning perspectives.', cards: ['insights']},
    activity: {title: 'Activity', description: 'Your fictional transaction history.', cards: ['activity']},
    upcoming: {title: 'Your agenda', description: 'Upcoming sample conversations and reviews.', cards: ['upcoming']},
    markets: {title: 'Global markets', description: 'Sample market quotes and currency rates.', cards: ['markets', 'currencies']},
    currencies: {title: 'Currencies', description: 'Sample exchange rates and daily changes.', cards: ['currencies'], nav: 'markets'}
  };
  const stats = document.querySelector('.stats');
  const grid = document.querySelector('.main-grid');
  const title = document.querySelector('#greeting');
  title.tabIndex = -1;
  function renderView(focus = false) {
    const requested = location.hash.slice(1) || 'overview';
    const id = Object.hasOwn(views, requested) ? requested : 'overview';
    const view = views[id];
    const overview = id === 'overview';
    document.querySelector('.workspace').classList.toggle('focused-view', !overview);
    stats.hidden = !(overview || id === 'wealth' || id === 'real-estate');
    stats.querySelectorAll('.stat').forEach(card => {
      card.hidden = !overview && id !== 'wealth' && card.id !== id;
    });
    stats.classList.toggle('single-card', id === 'real-estate');
    [...grid.children].forEach(card => { card.hidden = !overview && !view.cards.includes(card.id); });
    grid.hidden = [...grid.children].every(card => card.hidden);
    title.textContent = view.title;
    title.nextElementSibling.textContent = view.description;
    document.querySelector('.hero-note').hidden = !overview;
    document.querySelector('.breadcrumb').replaceChildren(document.createTextNode(`Your office / ${overview ? 'Overview' : view.title}`));
    document.title = `${overview ? 'Client Portal' : view.title} — LAVREON Demo`;
    document.querySelectorAll('nav a').forEach(link => {
      if (link.hash === '#' + (view.nav || id)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focus) {
      title.focus({preventScroll: true});
      window.scrollTo({top: 0, behavior: 'instant'});
    }
  }
  function navigateTo(id) {
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    renderView(true);
  }
  document.querySelectorAll('nav a, .skip').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo(link.hash.slice(1));
  }));
  window.addEventListener('hashchange', () => renderView(true));
  window.addEventListener('popstate', () => renderView(true));
  renderView();
})();

