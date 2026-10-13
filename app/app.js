'use strict';
// LAVREON app demo: a phone-first client app on fictional sample data. No account, backend or live data.
// Preferences, reviewed items and sent demo messages stay in this browser only (localStorage 'lavreon-app-v1').
(() => {
  const D = window.LAVREON_APP_DATA;
  const FI = Object.assign({}, window.LAVREON_FI || {}, window.LAVREON_APP_FI || {});
  const STORE = 'lavreon-app-v1';
  const root = document.querySelector('#app');
  const html = document.documentElement;
  const EMBED = html.classList.contains('mode-embed');
  const STANDALONE = html.classList.contains('is-standalone');
  const motion = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(resolve => setTimeout(resolve, motion() ? ms : 0));

  // ---------- storage ----------
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch { return false; } };
  const session = (key, value) => { try { if (value === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, value); } catch {} return null; };
  let saved = {};
  try { saved = JSON.parse(read(STORE, '{}')) || {}; } catch {}
  const defaults = {hideOnLaunch: false, requireUnlock: true, notifyPriority: true, notifyBrief: true};
  const state = {
    lang: read('lavreon-language', /^fi\b/i.test(navigator.language || '') ? 'fi' : 'en'),
    settings: {...defaults, ...(saved.settings || {})},
    reviewed: saved.reviewed && typeof saved.reviewed === 'object' ? saved.reviewed : {},
    sent: Array.isArray(saved.sent) ? saved.sent.filter(m => m && typeof m.text === 'string') : [],
    readMessages: saved.readMessages === true,
    tab: 'today', period: '1Y', intel: 'priorities', focus: null, hidden: false, locked: true
  };
  if (!['en', 'fi'].includes(state.lang)) state.lang = 'en';
  state.hidden = state.settings.hideOnLaunch;
  const persist = () => write(STORE, JSON.stringify({settings: state.settings, reviewed: state.reviewed, sent: state.sent.slice(-40), readMessages: state.readMessages}));

  // ---------- language and formats ----------
  const fi = () => state.lang === 'fi';
  const t = text => (fi() ? (FI[text] ?? text) : text);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const T = text => esc(t(text));
  const tf = (text, vars) => t(text).replace(/\{(\w+)\}/g, (_, key) => vars[key]);
  const NB = ' ';
  const digits = value => value.replace(/\B(?=(\d{3})+(?!\d))/g, fi() ? NB : ',');
  const money = n => { const s = digits(String(Math.abs(Math.round(n)))); const sign = n < 0 ? '−' : ''; return fi() ? `${sign}${s}${NB}€` : `${sign}€${s}`; };
  const signedMoney = n => (n > 0 ? '+' : '') + money(n);
  const millions = n => { const s = n.toFixed(2); return fi() ? `${s.replace('.', ',')}${NB}M€` : `€${s}M`; };
  // "+6.8%" -> "+6,8 %", "5,483.00" -> "5 483,00" in Finnish.
  const figure = s => (fi() ? s.replace(/,/g, NB).replace(/\.(\d)/, ',$1').replace(/(\d)%$/, `$1${NB}%`) : s);
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shift = (days = 0, months = 0) => { const d = new Date(); d.setHours(12, 0, 0, 0); if (months) d.setMonth(d.getMonth() + months); d.setDate(d.getDate() + days); return d; };
  const intl = (date, options) => new Intl.DateTimeFormat(fi() ? 'fi-FI' : 'en-GB', options).format(date);
  const fmt = (date, style = 'date') => {
    const day = date.getDate(), month = date.getMonth();
    if (style === 'short') return fi() ? `${day}.${month + 1}.` : `${day} ${monthsEn[month]}`;
    if (style === 'month') return fi() ? intl(date, {month: 'short'}).replace('.', '') : monthsEn[month];
    if (style === 'axis') return fi() ? `${intl(date, {month: 'short'}).replace('.', '')} ${String(date.getFullYear()).slice(2)}` : `${monthsEn[month]} '${String(date.getFullYear()).slice(2)}`;
    if (style === 'weekday') { const s = intl(date, {weekday: 'long', day: 'numeric', month: 'long'}); return s.charAt(0).toUpperCase() + s.slice(1); }
    return fi() ? `${day}.${month + 1}.${date.getFullYear()}` : `${day} ${monthsEn[month]} ${date.getFullYear()}`;
  };
  const relative = days => (days === 0 ? t('Today') : days === 1 ? t('Tomorrow') : days === -1 ? t('Yesterday')
    : days > 0 ? tf('In {n} days', {n: days}) : tf('{n} days ago', {n: -days}));
  const published = iso => new Date(`${iso}T12:00:00`);

  // ---------- icons ----------
  const svg = (body, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${body}</svg>`;
  const I = {
    today: svg('<path d="M4 11.2 12 4.8l8 6.4V20h-5.2v-5.4H9.2V20H4z"/>'),
    wealth: svg('<path d="M4 20h16M6.5 16.5v-5M10.5 16.5V7M14.5 16.5v-3.5M18.5 16.5V9.5"/>'),
    intelligence: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>'),
    office: svg('<rect x="3.5" y="7" width="17" height="12.5" rx="2.5"/><path d="M9 7V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6V7M3.5 12.5h17"/>'),
    profile: svg('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1.2-3.6 3.8-5.6 7-5.6s5.8 2 7 5.6"/>'),
    eye: svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: svg('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>'),
    bell: svg('<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>'),
    chevron: svg('<path d="m9.5 6 6 6-6 6"/>'),
    close: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
    check: svg('<path d="m5 12.5 4.2 4.2L19 7"/>'),
    doc: svg('<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z"/><path d="M14 3.5V8h4M9.5 12h6M9.5 15.5h6"/>'),
    lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
    calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    message: svg('<path d="M4 5.5h16v11H9.5L5 20v-3.5H4z"/>'),
    send: svg('<path d="M4 12 20 4l-5 16-3.5-6.5z"/><path d="m11.5 13.5 3-3"/>'),
    globe: svg('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5Z"/>'),
    download: svg('<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>'),
    arrow: svg('<path d="M7 17 17 7M9 7h8v8"/>'),
    info: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.4"/>'),
    reset: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.8h3.8"/>'),
    shield: svg('<path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),
    portal: svg('<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 20.5h6M12 17v3.5"/>'),
    up: svg('<path d="M7 17 17 7M9 7h8v8"/>'),
    home: svg('<path d="M4 11.2 12 4.8l8 6.4V20H4z"/>'),
    diamond: svg('<path d="m12 3.5 8.5 8.5-8.5 8.5L3.5 12z"/>'),
    shareIos: svg('<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M7 11H5.5v9.5h13V11H17"/>'),
    dots: svg('<circle cx="12" cy="5.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="18.5" r="1.2" fill="currentColor"/>'),
    faceid: svg('<path d="M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4h2M15.5 4h2A2.5 2.5 0 0 1 20 6.5v2M20 15.5v2a2.5 2.5 0 0 1-2.5 2.5h-2M8.5 20h-2A2.5 2.5 0 0 1 4 17.5v-2"/><path d="M9 9.5v1.2M15 9.5v1.2M12 9.5v4h-1M9.6 16c1.4 1 3.4 1 4.8 0"/>', ' class="faceid-icon"')
  };
  const SYMBOL = '../assets/lavreon-symbol.svg';

  // ---------- small renderers ----------
  const amount = text => (state.hidden ? `<span class="masked" aria-label="${T('Balance hidden')}">•••••</span>` : text);
  const eyeButton = () => `<button type="button" class="icon-btn eye" data-act="toggle-hidden" aria-pressed="${state.hidden}" aria-label="${T(state.hidden ? 'Show balances' : 'Hide balances')}">${state.hidden ? I.eyeOff : I.eye}</button>`;
  const points = (values, w, h, pad = 2) => {
    const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
    return values.map((v, i) => [pad + i * (w - 2 * pad) / (values.length - 1), pad + (h - 2 * pad) * (1 - (v - min) / span)]);
  };
  const path = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const chip = type => `<span class="chip chip-${type.toLowerCase()}">${T(type)}</span>`;
  const head = (title, meta = '', action = '') => `<div class="section-head"><h2>${T(title)}</h2>${action || (meta ? `<span class="meta">${meta}</span>` : '')}</div>`;
  const bar = title => `<header class="bar"><span class="bar-title">${T(title)}</span></header>`;
  const unreadCount = () => (state.readMessages ? 0 : D.messages.length);
  const priority = id => D.priorities.find(p => p.id === id);
  const dueLine = p => (p.due ? `${T('Act by')} ${esc(fmt(shift(p.due), 'short'))} · ${esc(relative(p.due))}` : T('No deadline · a question for review'));
  const reviewedMark = p => (state.reviewed[p.id] ? `<span class="done">${I.check}${T('Reviewed')}</span>` : '');
  const dateBlock = days => { const d = shift(days); return `<span class="date-block"><b>${String(d.getDate()).padStart(2, '0')}</b><small>${esc(fmt(d, 'month').toUpperCase())}</small></span>`; };

  const priorityCard = p => `<button type="button" class="pcard press" data-act="priority" data-id="${p.id}">
    <span class="pcard-top">${chip(p.type)}${reviewedMark(p)}</span>
    <span class="pcard-title">${T(p.title)}</span>
    <span class="pcard-foot">${dueLine(p)}</span></button>`;

  const priorityRow = p => `<button type="button" class="card icard press" data-act="priority" data-id="${p.id}">
    <span class="icard-top">${chip(p.type)}<span class="meta">${T(p.area)}</span>${reviewedMark(p)}</span>
    <span class="icard-title">${T(p.title)}</span>
    <span class="icard-text"><span class="stage-tag">${T('Data')}</span>${T(p.steps[0])}</span>
    <span class="icard-foot"><span>${dueLine(p)}</span><span class="steps-mini" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span></button>`;

  const signalCard = (s, i) => `<button type="button" class="card scard press" data-act="signal" data-id="${s.id}">
    <span class="scard-num">0${i + 1}</span>
    <span class="scard-body"><span class="meta">${esc(s.source)} · ${esc(fmt(published(s.date)))}</span>
    <span class="scard-title">${T(s.title)}</span><span class="scard-text">${T(s.summary)}</span></span></button>`;

  const meetingRow = m => `<button type="button" class="row press" data-act="meeting" data-id="${m.id}">${dateBlock(m.day)}
    <span class="row-main"><b>${T(m.title)}</b><small>${T(m.detail)} · ${esc(relative(m.day))}</small></span>
    <span class="row-end"><b class="time">${esc(m.time)}</b></span></button>`;

  const activityRow = a => `<div class="row"><span class="row-icon">${I[a.icon]}</span>
    <span class="row-main"><b>${T(a.title)}</b><small>${T(a.detail)} · ${esc(fmt(shift(a.day), 'short'))}</small></span>
    <span class="row-end"><b class="${a.amount > 0 ? 'pos' : ''}">${amount(signedMoney(a.amount))}</b><small>${T(a.kind)}</small></span></div>`;

  // ---------- views ----------
  function viewToday() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 5 || hour >= 18 ? 'Good evening' : hour < 12 ? 'Good morning' : 'Good afternoon';
    const spark = points(D.wealth.sparkline, 300, 54, 3);
    const unread = unreadCount();
    const lastOffice = D.messages[D.messages.length - 1];
    return `<header class="bar bar-brand"><span class="brand"><img src="${SYMBOL}" alt="" width="34" height="19">LAVREON</span>
      <span class="bar-actions"><button type="button" class="icon-btn" data-act="notifications" aria-label="${T('Notifications')}">${I.bell}${state.settings.notifyPriority ? '<i class="dot"></i>' : ''}</button>
      <button type="button" class="avatar-btn" data-act="tab" data-tab="profile" aria-label="${T('Profile')}">${esc(D.client.initials)}</button></span></header>
    <div class="page">
      <p class="eyebrow">${esc(fmt(now, 'weekday'))}</p>
      <h1 class="title">${T(greeting)},<br><em>${esc(D.client.name)}.</em></h1>
      <section class="card worth" aria-label="${T('Total net worth')}">
        <div class="card-row"><span class="label">${T('Total net worth')}</span>${eyeButton()}</div>
        <p class="worth-value">${amount(money(D.wealth.total))}</p>
        <p class="worth-change"><span class="pos">↗ ${esc(figure(D.wealth.change))}</span> ${T('vs. last quarter')} · ${T('Sample')}</p>
        <svg class="spark" viewBox="0 0 300 54" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="g-spark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8a06a" stop-opacity=".32"/><stop offset="1" stop-color="#b8a06a" stop-opacity="0"/></linearGradient></defs>
          <path d="${path(spark)} L297 54 L3 54Z" fill="url(#g-spark)"/><path class="spark-line" d="${path(spark)}" pathLength="1"/></svg>
        <div class="worth-split">${D.wealth.classes.map(c => `<button type="button" data-act="tab" data-tab="wealth"><span>${T(c.label)}</span><b>${amount(millions(c.value / 1e6))}</b></button>`).join('')}</div>
      </section>
      ${head('Needs attention', '', `<button type="button" class="link" data-act="tab" data-tab="intelligence">${T('See all')}</button>`)}
      <div class="rail">${D.priorities.filter(p => p.feeds.includes('priorities')).map(priorityCard).join('')}</div>
      ${head('AI Signal Brief', T('Curated · not live'))}
      <section class="card brief">
        <p class="brief-sub">${T('3 developments shaping the future of AI')}</p>
        ${D.signals.map((s, i) => `<button type="button" class="brief-row press" data-act="signal" data-id="${s.id}"><span class="brief-num">0${i + 1}</span><span><b>${T(s.title)}</b><small>${esc(s.source)}</small></span>${I.chevron}</button>`).join('')}
      </section>
      ${head('Next up', T('Sample agenda'))}
      <div class="list">${D.agenda.slice(0, 2).map(meetingRow).join('')}</div>
      ${head('Your office')}
      <div class="tiles">
        <button type="button" class="tile press" data-act="messages">${I.message}<b>${T('Messages')}</b><small>${unread ? tf('{n} new', {n: unread}) : esc(t(lastOffice.text).slice(0, 34)) + '…'}</small>${unread ? `<span class="badge">${unread}</span>` : ''}</button>
        <button type="button" class="tile press" data-act="report">${I.doc}<b>${T('Office report')}</b><small>${T('Ready to read')}</small></button>
        <button type="button" class="tile press" data-act="priority" data-id="p1">${I.shield}<b>${T('Property renewal')}</b><small>${esc(fmt(shift(D.insurance.renewal), 'short'))} · ${esc(relative(D.insurance.renewal))}</small></button>
        <button type="button" class="tile press" data-act="tab" data-tab="office">${I.lock}<b>${T('Documents')}</b><small>${tf('{n} in your vault', {n: D.documents.length})}</small></button>
      </div>
      <p class="footnote">${T('Fictional sample data for a demo client. No accounts are connected.')}</p>
    </div>`;
  }

  const CW = 340, CH = 150;
  function chartPoints(series) {
    const xy = points(series.values, CW, CH, 12);
    const start = shift(...series.start).getTime(), end = shift().getTime(), last = series.values.length - 1;
    return series.values.map((value, i) => ({x: xy[i][0], y: xy[i][1], value, date: new Date(start + (end - start) * i / last)}));
  }
  function chart(series) {
    const pts = chartPoints(series);
    const d = path(pts.map(p => [p.x, p.y]));
    const lastPoint = pts[pts.length - 1];
    return `<svg viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${esc(tf('Sample investment values over {period}', {period: t(series.label).toLowerCase()}))}">
      <defs><linearGradient id="g-perf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8a06a" stop-opacity=".26"/><stop offset="1" stop-color="#b8a06a" stop-opacity="0"/></linearGradient></defs>
      <path class="grid" d="M0 ${CH / 3}H${CW}M0 ${2 * CH / 3}H${CW}"/>
      <path d="${d} L${CW - 12} ${CH} L12 ${CH}Z" fill="url(#g-perf)"/>
      <path class="line" d="${d}" pathLength="1"/>
      <g class="scrub"><line x1="${lastPoint.x}" x2="${lastPoint.x}" y1="0" y2="${CH}"/><circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="5"/></g>
    </svg><div class="chart-axis"><span>${esc(fmt(pts[0].date, series.label === '1 month' ? 'short' : 'axis'))}</span><span>${T('Today')}</span></div>`;
  }
  function allocation() {
    const r = 54, c = 2 * Math.PI * r, gap = 2.4;
    let offset = 0;
    const segments = D.wealth.allocation.map((a, i) => {
      const length = c * a.share / 100;
      const dim = state.focus !== null && state.focus !== i ? ' dim' : '';
      const seg = `<circle class="seg${dim}" r="${r}" cx="70" cy="70" stroke="${a.color}" stroke-dasharray="${Math.max(length - gap, .1).toFixed(2)} ${(c - length + gap).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}"/>`;
      offset += length;
      return seg;
    }).join('');
    const focus = state.focus !== null ? D.wealth.allocation[state.focus] : null;
    const center = focus ? `<b>${esc(figure(focus.share.toFixed(2) + '%'))}</b><small>${T(focus.label)}</small>` : `<b>${amount(millions(D.wealth.total / 1e6))}</b><small>${T('Total assets')}</small>`;
    return `<div class="alloc"><div class="donut-wrap"><svg class="donut" viewBox="0 0 140 140" aria-hidden="true"><g transform="rotate(-90 70 70)">${segments}</g></svg><div class="donut-center">${center}</div></div>
      <ul class="legend">${D.wealth.allocation.map((a, i) => `<li><button type="button" data-act="focus" data-index="${i}" aria-pressed="${state.focus === i}"><i style="background:${a.color}"></i><span>${T(a.label)}</span><b>${esc(figure(a.share.toFixed(2) + '%'))}</b></button></li>`).join('')}</ul></div>`;
  }
  function viewWealth() {
    const series = D.performance[state.period];
    const last = series.values[series.values.length - 1];
    return `${bar('Wealth')}
    <div class="page">
      <p class="eyebrow">${T('Your world')}</p>
      <h1 class="title">${T('Wealth')}</h1>
      <section class="card perf">
        <div class="card-row"><span class="label">${T('Investments')}</span>${eyeButton()}</div>
        <p class="worth-value" data-chart-value>${amount(millions(last))}</p>
        <p class="worth-change" data-chart-caption><span class="pos">${esc(figure(series.change))}</span> · ${T(series.label)}</p>
        <div class="chart" data-chart>${chart(series)}</div>
        <div class="segmented" role="group" aria-label="${T('Chart period')}">${Object.keys(D.performance).map(k => `<button type="button" data-act="period" data-period="${k}" aria-pressed="${k === state.period}">${T(k === 'ALL' ? 'All' : k)}</button>`).join('')}</div>
        <p class="hint">${T('Drag across the chart to see earlier values.')}</p>
      </section>
      ${head('Asset allocation', T('Sample'))}
      <section class="card">${allocation()}<p class="hint">${T('Tap a class to highlight it.')}</p></section>
      ${head('Asset classes')}
      <div class="list">${D.wealth.classes.map(c => `<div class="row"><span class="row-icon">${c.id === 'real-estate' ? I.home : c.id === 'liquid' ? I.diamond : I.up}</span><span class="row-main"><b>${T(c.label)}</b><small>${T('Sample · vs. last quarter')}</small></span><span class="row-end"><b>${amount(money(c.value))}</b><small class="pos">↗ ${esc(figure(c.change))}</small></span></div>`).join('')}</div>
      ${head('Recent activity', T('Last 30 days · sample'))}
      <div class="list">${D.activity.map(activityRow).join('')}</div>
      ${head('Global markets', T('Sample · not live'))}
      <div class="markets">${D.markets.map(m => { const down = m.change.startsWith('−'); return `<div class="mkt"><span class="mkt-name">${esc(m.name)}</span><b>${esc(figure(m.value))}</b><span class="mkt-foot"><small class="${down ? 'neg' : 'pos'}">${esc(figure(m.change))}</small><svg viewBox="0 0 60 20" preserveAspectRatio="none" aria-hidden="true"><path class="${down ? 'neg' : ''}" d="${path(points(m.line, 60, 20, 2))}"/></svg></span></div>`; }).join('')}</div>
      ${head('Currencies', T('Sample · not live'))}
      <div class="list">${D.currencies.map(c => `<div class="row compact"><span class="row-main"><b>${esc(c.pair)}</b></span><span class="row-end inline"><b>${esc(figure(c.rate))}</b><small class="${c.change.startsWith('−') ? 'neg' : 'pos'}">${esc(figure(c.change))}</small></span></div>`).join('')}</div>
      <p class="footnote">${T('Fictional values for a sample client. No accounts are connected and no live prices are shown.')}</p>
    </div>`;
  }

  function viewIntelligence() {
    const segments = [['priorities', 'Priorities'], ['brief', 'AI brief'], ['opportunities', 'Opportunities']];
    const body = state.intel === 'brief' ? D.signals.map(signalCard).join('') : D.priorities.filter(p => p.feeds.includes(state.intel)).map(priorityRow).join('');
    const open = D.priorities.filter(p => p.feeds.includes('priorities') && !state.reviewed[p.id]).length;
    return `${bar('Intelligence')}
    <div class="page">
      <p class="eyebrow">${T('DATA → CONTEXT → INTELLIGENCE → ACTION')}</p>
      <h1 class="title">${T('Intelligence')}</h1>
      <p class="lede">${open === 1 ? T('1 priority waiting for your review.') : open ? tf('{n} priorities waiting for your review.', {n: open}) : T('Everything has been reviewed. Well done.')}</p>
      <div class="segmented wide" role="tablist" aria-label="${T('Intelligence')}">${segments.map(([id, label]) => `<button type="button" role="tab" data-act="intel" data-seg="${id}" aria-selected="${state.intel === id}">${T(label)}</button>`).join('')}</div>
      <div class="stack">${body}</div>
      <p class="footnote">${state.intel === 'brief' ? T('Editorial selection from public sources, checked 15 September 2026. Implications are LAVREON interpretations, not predictions or advice.') : T('Fictional scenarios derived from the sample data. No accounts are connected and no recommendation is made.')}</p>
    </div>`;
  }

  function viewOffice() {
    const unread = unreadCount();
    const messages = allMessages();
    const last = messages[messages.length - 1];
    const ins = D.insurance;
    return `${bar('Office')}
    <div class="page">
      <p class="eyebrow">${T('Your private office')}</p>
      <h1 class="title">${T('Office')}</h1>
      <button type="button" class="card msg-card press" data-act="messages">
        <span class="msg-top"><span class="office-avatar"><img src="${SYMBOL}" alt="" width="26" height="14"></span><span class="msg-who"><b>${T('Your office')}</b><small>${T('Private messages · demo')}</small></span>${unread ? `<span class="badge">${unread}</span>` : I.chevron}</span>
        <span class="msg-preview">${esc(messageText(last))}</span></button>
      ${head('Agenda', T('Sample agenda'))}
      <div class="list">${D.agenda.map(meetingRow).join('')}</div>
      ${head('Insurance', T('Illustrative sample'))}
      <section class="card insurance">
        <div class="ins-grid"><div><b>${ins.policies}</b><small>${T('Active policies')}</small></div><div><b>${amount(money(ins.premium))}</b><small>${T('Annual premium')}</small></div><div><b>${esc(fmt(shift(ins.renewal), 'short'))}</b><small>${T('Next renewal')} · ${esc(relative(ins.renewal))}</small></div></div>
        <div class="renewal-track" aria-hidden="true"><i style="width:${Math.round((1 - ins.renewal / 365) * 100)}%"></i></div>
        <div class="tags">${ins.tags.map(tag => `<span>${T(tag)}</span>`).join('')}</div>
        <button type="button" class="btn btn-ghost small" data-act="priority" data-id="p1">${T('Review property cover')} ${I.chevron}</button>
      </section>
      ${head('Reports')}
      <button type="button" class="card report-card press" data-act="report"><span class="eyebrow">${T('MONTHLY OFFICE NOTE')}</span><span class="report-title">${T(D.report.title)}</span><small>${T('Sample office report')} · ${esc(fmt(shift(D.report.day)))}</small><span class="link">${T('Read the note')} →</span></button>
      ${head('Documents', T('Illustrative'))}
      <div class="list">${D.documents.map(d => `<button type="button" class="row press" data-act="document" data-id="${d.id}"><span class="row-icon">${I.doc}</span><span class="row-main"><b>${T(d.title)}</b><small>${T(d.kind)} · ${esc(fmt(shift(d.day)))}</small></span>${I.chevron}</button>`).join('')}</div>
      <p class="footnote">${T('Demo previews only · no confidential files uploaded.')}</p>
    </div>`;
  }

  function viewProfile() {
    const toggle = (key, label, note = '') => `<label class="setting"><span><b>${T(label)}</b>${note ? `<small>${T(note)}</small>` : ''}</span><input type="checkbox" class="switch" role="switch" data-setting="${key}"${state.settings[key] ? ' checked' : ''}></label>`;
    const linkRow = (icon, label, note, attrs) => `<${attrs.href ? 'a' : 'button type="button"'} class="setting link-row press" ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}><span class="row-icon">${I[icon]}</span><span><b>${T(label)}</b>${note ? `<small>${T(note)}</small>` : ''}</span>${attrs.href ? I.arrow : I.chevron}</${attrs.href ? 'a' : 'button'}>`;
    return `${bar('Profile')}
    <div class="page">
      <div class="profile-head"><span class="avatar-lg">${esc(D.client.initials)}</span><h1 class="title">${esc(D.client.fullName)}</h1>
        <p><span class="chip chip-deadline">${esc(D.client.tier)}</span><span class="meta">${T('Fictional client')} · ${esc(D.client.id)}</span></p></div>
      <h2 class="group-title">${T('Preferences')}</h2>
      <div class="group">
        <div class="setting"><span><b>${T('Language')}</b></span><div class="segmented small" role="group" aria-label="${T('Language')}">${[['en', 'English'], ['fi', 'Suomi']].map(([code, name]) => `<button type="button" lang="${code}" data-act="lang" data-lang="${code}" aria-pressed="${state.lang === code}">${name}</button>`).join('')}</div></div>
        ${toggle('hideOnLaunch', 'Hide balances on launch')}
        ${toggle('requireUnlock', 'Biometric unlock', 'Simulated in this demo.')}
      </div>
      <h2 class="group-title">${T('Notifications')}</h2>
      <div class="group">${toggle('notifyPriority', 'Priority alerts')}${toggle('notifyBrief', 'Weekly intelligence brief')}</div>
      <p class="group-note">${T('Demo: no notifications are sent from this app.')}</p>
      <h2 class="group-title">${T('App')}</h2>
      <div class="group">
        ${linkRow('download', 'Install on your phone', STANDALONE ? 'Installed on this device' : 'Add LAVREON to your home screen', {'data-act': 'install'})}
        ${linkRow('portal', 'Client portal on a computer', '', {href: '../dashboard.html', target: '_top'})}
        ${linkRow('globe', 'Visit public website', '', {href: '../index.html', target: '_top'})}
        ${linkRow('info', 'About this demo', 'Disclaimer and data', {'data-act': 'about'})}
        ${linkRow('reset', 'Reset demo', 'Clear reviews, messages and preferences', {'data-act': 'reset'})}
      </div>
      <p class="version"><img src="${SYMBOL}" alt="" width="40" height="22"><br>LAVREON · ${T('App prototype')} 01<br>${T('All content is fictional sample data.')}</p>
    </div>`;
  }

  // ---------- messages ----------
  const messageText = m => (m.key ? t(m.key) : m.from === 'office' ? t(m.text) : m.text);
  function allMessages() {
    return [
      ...D.messages.map(m => { const date = shift(m.day); const [h, min] = m.time.split(':').map(Number); date.setHours(h, min, 0, 0); return {...m, date}; }),
      ...state.sent.map(m => ({...m, date: new Date(m.at)}))
    ];
  }
  function chatHtml() {
    let lastDay = '';
    return allMessages().map(m => {
      const dayKey = m.date.toDateString();
      const diff = Math.round((new Date(m.date).setHours(12, 0, 0, 0) - shift().getTime()) / 864e5);
      const divider = dayKey !== lastDay ? `<p class="chat-day">${esc(Math.abs(diff) <= 1 ? relative(diff) : fmt(m.date))}</p>` : '';
      lastDay = dayKey;
      const time = `${String(m.date.getHours()).padStart(2, '0')}:${String(m.date.getMinutes()).padStart(2, '0')}`;
      if (m.from === 'demo') return `${divider}<p class="chat-note">${esc(messageText(m))}</p>`;
      return `${divider}<div class="bubble from-${m.from === 'me' ? 'me' : 'office'}"><p>${esc(messageText(m))}</p><time>${time}${m.from === 'me' ? ` · ${T('Not delivered · demo')}` : ''}</time></div>`;
    }).join('');
  }
  function messagesSheet(draft = '') {
    return `<div class="chat-head"><span class="office-avatar"><img src="${SYMBOL}" alt="" width="26" height="14"></span><span><b>${T('Your office')}</b><small>${T('Demo · messages stay on this device')}</small></span></div>
      <div class="chat" data-chat>${chatHtml()}</div>
      <form class="composer" data-form="message" autocomplete="off"><label class="sr-only" for="message-input">${T('Message')}</label>
        <textarea id="message-input" rows="1" maxlength="600" placeholder="${T('Write to your office…')}">${esc(draft)}</textarea>
        <button type="submit" class="send" aria-label="${T('Send')}">${I.send}</button></form>`;
  }

  // ---------- sheets ----------
  const STAGES = ['Data', 'Context', 'Intelligence', 'Action'];
  function prioritySheet(p) {
    const done = state.reviewed[p.id];
    return `<div class="sheet-meta">${chip(p.type)}<span class="meta">${T(p.area)}</span></div>
      <h2 class="sheet-title">${T(p.title)}</h2>
      ${p.due ? `<div class="countdown"><span>${T('Act by')}</span><b>${esc(fmt(shift(p.due)))}</b><small>${esc(relative(p.due))}</small></div>` : `<div class="countdown"><span>${T('No deadline')}</span><b>${T('A question for review')}</b></div>`}
      <ol class="steps">${p.steps.map((step, i) => `<li><span class="step-dot">${i + 1}</span><div><span class="step-label">${T(STAGES[i])}</span><p>${T(step)}</p></div></li>`).join('')}</ol>
      <div class="sheet-actions">
        <button type="button" class="btn ${done ? 'btn-ghost' : 'btn-primary'}" data-act="review" data-id="${p.id}" aria-pressed="${!!done}">${done ? `${I.check}${T('Reviewed')}` : T('Mark as reviewed')}</button>
        <button type="button" class="btn btn-ghost" data-act="ask" data-id="${p.id}">${I.message}${T('Ask the office')}</button>
      </div>
      <p class="footnote">${T('Fictional scenario derived from the sample data. No recommendation is made.')}</p>`;
  }
  function signalSheet(s) {
    return `<div class="sheet-meta"><span class="chip chip-deadline">${T('AI Signal Brief')}</span><span class="meta">${esc(fmt(published(s.date)))}</span></div>
      <h2 class="sheet-title">${T(s.title)}</h2>
      <p class="sheet-text">${T(s.summary)}</p>
      <div class="why"><span class="step-label">${T('Why it matters')}</span><p>${T(s.why)}</p></div>
      <a class="btn btn-ghost" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${T('Read the source')} · ${esc(s.source)} ${I.arrow}</a>
      <p class="footnote">${T('Publication date is real. The implication is a LAVREON interpretation, not a prediction or advice.')}</p>`;
  }
  function meetingSheet(m) {
    const d = shift(m.day);
    return `<div class="sheet-meta"><span class="chip chip-deadline">${T('Sample agenda')}</span></div>
      <h2 class="sheet-title">${T(m.title)}</h2>
      <div class="meeting-when">${dateBlock(m.day)}<span><b>${esc(fmt(d, 'weekday'))}</b><small>${esc(m.time)} · ${tf('{n} min', {n: m.minutes})} · ${esc(relative(m.day))}</small></span></div>
      <p class="sheet-text">${T(m.detail)}.</p>
      <div class="sheet-actions"><button type="button" class="btn btn-primary" data-act="ics" data-id="${m.id}">${I.calendar}${T('Add to calendar')}</button>
      <button type="button" class="btn btn-ghost" data-act="ask-meeting" data-id="${m.id}">${I.message}${T('Message the office')}</button></div>
      <p class="footnote">${T('No meeting is booked. This is a fictional sample agenda.')}</p>`;
  }
  function documentSheet(d) {
    return `<div class="sheet-meta"><span class="chip chip-deadline">${T(d.kind)}</span><span class="meta">${esc(fmt(shift(d.day)))}</span></div>
      <h2 class="sheet-title">${T(d.title)}</h2>
      <div class="paper"><img src="${SYMBOL}" alt="" width="44" height="24"><span class="paper-label">${T('Illustrative document')}</span><p>${T(d.body)}</p></div>
      <p class="footnote">${T('Demo previews only · no confidential files uploaded.')}</p>`;
  }
  function reportSheet() {
    return `<div class="sheet-meta"><span class="chip chip-deadline">${T('MONTHLY OFFICE NOTE')}</span><span class="meta">${esc(fmt(shift(D.report.day)))}</span></div>
      <h2 class="sheet-title">${T(D.report.title)}</h2>
      <div class="paper">${D.report.body.map(p => `<p>${T(p)}</p>`).join('')}</div>
      <div class="sheet-actions"><button type="button" class="btn btn-ghost" data-act="tab" data-tab="intelligence">${T('Open priorities')} ${I.chevron}</button></div>`;
  }
  function notificationsSheet() {
    const p = priority('p1');
    const items = [
      state.settings.notifyPriority && {act: 'priority', id: 'p1', title: t('Priority alert'), text: t(p.title), when: t('Now')},
      {act: 'messages', title: t('Your office'), text: t(D.messages[1].text), when: relative(-1)},
      state.settings.notifyBrief && {act: 'tab', tab: 'intelligence', seg: 'brief', title: t('AI Signal Brief'), text: t('3 developments shaping the future of AI'), when: fmt(published('2026-09-15'), 'short')}
    ].filter(Boolean);
    return `<h2 class="sheet-title">${T('Notifications')}</h2>
      <div class="list">${items.map(n => `<button type="button" class="row press" data-act="${n.act}"${n.id ? ` data-id="${n.id}"` : ''}${n.tab ? ` data-tab="${n.tab}" data-seg="${n.seg}"` : ''}><span class="row-icon">${n.act === 'messages' ? I.message : n.act === 'priority' ? I.bell : I.intelligence}</span><span class="row-main"><b>${esc(n.title)}</b><small class="clamp">${esc(n.text)}</small></span><span class="row-end"><small>${esc(n.when)}</small></span></button>`).join('')}</div>
      <p class="footnote">${T('Simulated notifications. Change them under Profile.')}</p>`;
  }
  function installSheet() {
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /android/i.test(ua);
    const url = new URL('./', location.href).href;
    const iosSteps = `<ol class="howto"><li>${T('Open this page in Safari.')}</li><li>${T('Tap Share')} ${I.shareIos}</li><li>${T('Choose “Add to Home Screen”.')}</li><li>${T('Tap Add. LAVREON opens full screen from its own icon.')}</li></ol>`;
    const androidSteps = `<ol class="howto"><li>${T('Open this page in Chrome.')}</li><li>${T('Tap the menu')} ${I.dots}</li><li>${T('Choose “Install app” or “Add to Home screen”.')}</li></ol>`;
    let body;
    if (STANDALONE) body = `<p class="sheet-text">${T('LAVREON is installed on this device and opens full screen from its own icon.')}</p>`;
    else if (ios) body = iosSteps + `<details class="more"><summary>${T('Android')}</summary>${androidSteps}</details>`;
    else if (android) body = (deferredPrompt ? `<button type="button" class="btn btn-primary" data-act="install-now">${I.download}${T('Install now')}</button>` : '') + androidSteps + `<details class="more"><summary>${T('iPhone')}</summary>${iosSteps}</details>`;
    else body = `<p class="sheet-text">${T('Open this address on your phone:')}</p><p class="url">${esc(url)}</p>${deferredPrompt ? `<button type="button" class="btn btn-primary" data-act="install-now">${I.download}${T('Install on this computer')}</button>` : ''}<details class="more" open><summary>${T('iPhone')}</summary>${iosSteps}</details><details class="more"><summary>${T('Android')}</summary>${androidSteps}</details>`;
    return `<div class="install-icon"><img src="icons/icon-192.png" alt="" width="72" height="72"></div>
      <h2 class="sheet-title center">${T('Install LAVREON')}</h2>
      <p class="sheet-text center">${T('Add the app to your home screen. It opens full screen, works offline and keeps your preferences on this device.')}</p>${body}`;
  }
  function aboutSheet() {
    return `<h2 class="sheet-title">${T('About this demo')}</h2>
      <p class="sheet-text">${T('The LAVREON app is a public prototype of a private intelligence office in your pocket.')}</p>
      <ul class="facts"><li>${T('All financial values, policies, meetings, documents and messages are fictional sample data for Alex Morgan.')}</li>
      <li>${T('The AI Signal Brief cites real public reporting, checked 15 September 2026. Its implications are editorial interpretations.')}</li>
      <li>${T('There is no account, authentication or connection to any financial service. Unlock is simulated.')}</li>
      <li>${T('Preferences, reviews and demo messages are stored only in this browser.')}</li>
      <li>${T('Nothing here is investment, legal, insurance or tax advice.')}</li></ul>`;
  }
  function resetSheet() {
    return `<h2 class="sheet-title">${T('Reset demo?')}</h2><p class="sheet-text">${T('This clears reviewed items, your demo messages and preferences on this device.')}</p>
      <div class="sheet-actions"><button type="button" class="btn btn-primary" data-act="reset-confirm">${T('Reset demo')}</button><button type="button" class="btn btn-ghost" data-act="close">${T('Cancel')}</button></div>`;
  }

  // ---------- shell ----------
  const TABS = [['today', 'Today'], ['wealth', 'Wealth'], ['intelligence', 'Intelligence'], ['office', 'Office'], ['profile', 'Profile']];
  const VIEWS = {today: viewToday, wealth: viewWealth, intelligence: viewIntelligence, office: viewOffice, profile: viewProfile};
  root.innerHTML = `
    <div class="statusbar" aria-hidden="true"><span class="sb-time"></span><span class="sb-icons"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .4C5.2.4 2.7 1.5.8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.6c-.5 0-.9.2-1.2.5L8 11.2l1.2-1.3c-.3-.3-.7-.5-1.2-.5Z"/></svg><span class="sb-battery"><i></i></span></span></div>
    <main class="views">${TABS.map(([id]) => `<section class="view" id="view-${id}" data-view="${id}" hidden></section>`).join('')}</main>
    <nav class="tabbar"></nav>
    <div class="banner" hidden></div>
    <div class="toast" role="status" aria-live="polite"></div>
    <div class="sheet-layer" hidden><div class="scrim" data-act="close"></div>
      <div class="sheet" role="dialog" aria-modal="true" tabindex="-1"><div class="sheet-grip"><span></span></div>
      <button type="button" class="sheet-close" data-act="close"></button><div class="sheet-body"></div></div></div>
    <div class="lock" hidden></div>`;
  const $ = selector => root.querySelector(selector);
  const tabbar = $('.tabbar'), layer = $('.sheet-layer'), sheet = $('.sheet'), sheetBody = $('.sheet-body'), lock = $('.lock'), banner = $('.banner'), toastEl = $('.toast');

  function renderTabbar() {
    const unread = unreadCount();
    tabbar.setAttribute('aria-label', t('Main navigation'));
    tabbar.innerHTML = TABS.map(([id, label]) => `<button type="button" data-act="tab" data-tab="${id}"${state.tab === id ? ' aria-current="page"' : ''}>${I[id]}<span>${T(label)}</span>${id === 'office' && unread ? `<i class="badge">${unread}</i>` : ''}</button>`).join('');
  }
  function renderView(id) {
    const view = $(`#view-${id}`);
    const scroll = view.scrollTop;
    view.innerHTML = VIEWS[id]();
    view.scrollTop = scroll;
    view.setAttribute('aria-label', t(TABS.find(([key]) => key === id)[1]));
  }
  function renderAll() {
    html.lang = state.lang;
    TABS.forEach(([id]) => renderView(id));
    renderTabbar();
    $('.sheet-close').setAttribute('aria-label', t('Close'));
    $('.sheet-close').innerHTML = I.close;
    document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll('[data-lang-switch] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
    document.title = `LAVREON — ${t('Private Office App · Demo')}`;
    if (!lock.hidden) renderLock();
  }
  function setTab(id, {focus = false} = {}) {
    if (!VIEWS[id]) id = 'today';
    const same = state.tab === id;
    const view = $(`#view-${id}`);
    if (same && !view.hidden) { view.scrollTo({top: 0, behavior: motion() ? 'smooth' : 'auto'}); return; }
    state.tab = id;
    TABS.forEach(([key]) => { $(`#view-${key}`).hidden = key !== id; });
    renderView(id);
    view.classList.remove('entering');
    if (motion()) { void view.offsetWidth; view.classList.add('entering'); }
    renderTabbar();
    if (!EMBED) history.replaceState(history.state, '', `#${id}`);
    if (focus) focusTitle(view);
  }
  function focusTitle(view) {
    const title = view.querySelector('h1');
    if (!title) return;
    title.setAttribute('tabindex', '-1');
    title.focus({preventScroll: true});
  }
  const refresh = () => { renderView(state.tab); renderTabbar(); };

  // Compact title in the top bar once the large title scrolls away.
  root.querySelectorAll('.view').forEach(view => view.addEventListener('scroll', () => view.classList.toggle('scrolled', view.scrollTop > 46), {passive: true}));

  let toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  const buzz = () => { try { navigator.vibrate?.(8); } catch {} };

  // ---------- sheet behaviour ----------
  let sheetOpen = false, lastFocus = null, sheetRender = null;
  function openSheet(render, {full = false, label = ''} = {}) {
    if (!sheetOpen) lastFocus = document.activeElement;
    sheetRender = render;
    sheet.classList.toggle('sheet-full', full);
    sheet.setAttribute('aria-label', label);
    sheetBody.innerHTML = render();
    sheetBody.scrollTop = 0;
    sheet.style.removeProperty('--drag');
    layer.hidden = false;
    requestAnimationFrame(() => layer.classList.add('open'));
    if (!sheetOpen && !EMBED) history.pushState({sheet: true}, '', location.hash);
    sheetOpen = true;
    root.querySelectorAll('.views, .tabbar').forEach(el => el.setAttribute('aria-hidden', 'true'));
    setTimeout(() => sheet.focus({preventScroll: true}), 30);
  }
  const rerenderSheet = () => { if (sheetOpen && sheetRender) { const top = sheetBody.scrollTop; sheetBody.innerHTML = sheetRender(); sheetBody.scrollTop = top; } };
  function closeSheet(fromHistory = false) {
    if (!sheetOpen) return;
    sheetOpen = false;
    layer.classList.remove('open');
    root.querySelectorAll('.views, .tabbar').forEach(el => el.removeAttribute('aria-hidden'));
    setTimeout(() => { if (!sheetOpen) { layer.hidden = true; sheetBody.innerHTML = ''; sheetRender = null; } }, motion() ? 340 : 0);
    if (!fromHistory && !EMBED && history.state?.sheet) history.back();
    if (lastFocus && root.contains(lastFocus)) lastFocus.focus({preventScroll: true});
  }
  window.addEventListener('popstate', () => { if (sheetOpen) closeSheet(true); });

  // Drag the sheet down by its grip to dismiss it.
  (() => {
    let startY = null, dy = 0;
    const grip = $('.sheet-grip');
    grip.addEventListener('pointerdown', e => { startY = e.clientY; dy = 0; grip.setPointerCapture(e.pointerId); sheet.classList.add('dragging'); });
    grip.addEventListener('pointermove', e => { if (startY === null) return; dy = Math.max(0, e.clientY - startY); sheet.style.setProperty('--drag', `${dy}px`); });
    const end = () => { if (startY === null) return; startY = null; sheet.classList.remove('dragging'); if (dy > 110) closeSheet(); else sheet.style.removeProperty('--drag'); };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  })();
  sheet.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeSheet(); }
    if (e.key !== 'Tab') return;
    const items = [...sheet.querySelectorAll('button, a[href], textarea, input, summary')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------- messages ----------
  let replied = false;
  function openMessages(draft = '') {
    state.readMessages = true;
    persist();
    openSheet(() => messagesSheet(draft), {full: true, label: t('Messages')});
    refresh();
    requestAnimationFrame(() => { sheetBody.scrollTop = sheetBody.scrollHeight; });
  }
  function sendMessage(form) {
    const field = form.querySelector('textarea');
    const text = field.value.trim();
    if (!text) { field.focus(); return; }
    state.sent.push({from: 'me', at: new Date().toISOString(), text: text.slice(0, 600)});
    persist();
    field.value = '';
    autosize(field);
    const chat = $('[data-chat]');
    chat.innerHTML = chatHtml();
    sheetBody.scrollTop = sheetBody.scrollHeight;
    buzz();
    if (replied) return;
    replied = true;
    const typing = document.createElement('div');
    typing.className = 'bubble from-office typing';
    typing.setAttribute('aria-label', t('Typing'));
    typing.innerHTML = '<i></i><i></i><i></i>';
    setTimeout(() => { chat.append(typing); sheetBody.scrollTop = sheetBody.scrollHeight; }, 400);
    setTimeout(() => {
      typing.remove();
      state.sent.push({from: 'demo', at: new Date().toISOString(), key: 'This is a demo. Your message stays on this device and nobody reads it.', text: ''});
      persist();
      if (document.contains(chat)) { chat.innerHTML = chatHtml(); sheetBody.scrollTop = sheetBody.scrollHeight; }
    }, 1700);
  }
  const autosize = field => { field.style.height = 'auto'; field.style.height = `${Math.min(field.scrollHeight, 120)}px`; };

  // ---------- calendar file ----------
  function downloadIcs(m) {
    const start = shift(m.day);
    const [h, min] = m.time.split(':').map(Number);
    start.setHours(h, min, 0, 0);
    const end = new Date(start.getTime() + m.minutes * 60000);
    const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const text = value => value.replace(/([,;\\])/g, '\\$1');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LAVREON//App demo//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      `UID:${m.id}-${stamp(start)}@lavreon-demo`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
      `SUMMARY:${text(`LAVREON · ${t(m.title)} (${t('sample')})`)}`, `DESCRIPTION:${text(`${t(m.detail)}. ${t('Fictional sample meeting from the LAVREON app demo.')}`)}`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], {type: 'text/calendar'}));
    link.download = `lavreon-${m.id}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
    toast(t('Calendar file downloaded'));
  }

  // ---------- lock screen ----------
  function renderLock() {
    lock.innerHTML = `<div class="lock-top"><img class="lock-symbol" src="${SYMBOL}" alt="" width="148" height="80"><p class="lock-word">LAVREON</p><p class="lock-sub">${T('PRIVATE INTELLIGENCE OFFICE')}</p></div>
      <div class="lock-bottom"><p class="lock-greet">${T('Welcome back')}, <em>${esc(D.client.name)}.</em></p>
      <button type="button" class="unlock" data-act="unlock"><span class="faceid">${I.faceid}<svg class="scan-ring" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" pathLength="1"/></svg>${I.check.replace('<svg', '<svg class="unlock-check"')}</span><span class="unlock-label">${T('Unlock')}</span></button>
      <p class="lock-note">${T('Demo · biometric unlock is simulated. No account is signed in.')}</p></div>`;
  }
  let unlocking = false;
  async function unlock() {
    if (unlocking) return;
    unlocking = true;
    lock.classList.add('scanning');
    buzz();
    await wait(850);
    lock.classList.add('verified');
    await wait(380);
    lock.classList.add('unlocked');
    await wait(480);
    lock.hidden = true;
    lock.classList.remove('scanning', 'verified', 'unlocked');
    state.locked = false;
    unlocking = false;
    root.querySelectorAll('.views, .tabbar').forEach(el => el.removeAttribute('aria-hidden'));
    focusTitle($(`#view-${state.tab}`));
    setTimeout(showBanner, 700);
  }
  function lockApp() {
    if (!state.settings.requireUnlock) return;
    closeSheet();
    renderLock();
    lock.hidden = false;
    state.locked = true;
    root.querySelectorAll('.views, .tabbar').forEach(el => el.setAttribute('aria-hidden', 'true'));
    setTimeout(() => lock.querySelector('.unlock')?.focus({preventScroll: true}), 50);
  }

  // ---------- notification banner ----------
  let bannerTimer;
  function showBanner() {
    if (!state.settings.notifyPriority || session('lavreon-app-banner') || state.reviewed.p1) return;
    session('lavreon-app-banner', '1');
    const p = priority('p1');
    banner.innerHTML = `<button type="button" data-act="priority" data-id="p1"><span class="banner-icon"><img src="${SYMBOL}" alt="" width="26" height="14"></span><span class="banner-text"><span class="banner-top"><b>LAVREON</b><small>${T('now')}</small></span><b>${T('Priority alert')} · ${T(p.type)}</b><span>${T(p.title)}</span></span></button>`;
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('show')));
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(hideBanner, 6500);
  }
  function hideBanner() {
    banner.classList.remove('show');
    setTimeout(() => { banner.hidden = true; }, motion() ? 450 : 0);
  }
  (() => { let y = null; banner.addEventListener('pointerdown', e => { y = e.clientY; }); banner.addEventListener('pointerup', e => { if (y !== null && y - e.clientY > 20) hideBanner(); y = null; }); })();

  // ---------- chart scrubbing ----------
  function scrub(e, reset = false) {
    const box = e.target.closest('[data-chart]');
    if (!box) return;
    const series = D.performance[state.period];
    const pts = chartPoints(series);
    const svgEl = box.querySelector('svg');
    let p = pts[pts.length - 1];
    if (!reset) {
      const rect = svgEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * CW;
      p = pts.reduce((best, q) => (Math.abs(q.x - x) < Math.abs(best.x - x) ? q : best), pts[0]);
    }
    svgEl.querySelector('.scrub line').setAttribute('x1', p.x);
    svgEl.querySelector('.scrub line').setAttribute('x2', p.x);
    svgEl.querySelector('.scrub circle').setAttribute('cx', p.x);
    svgEl.querySelector('.scrub circle').setAttribute('cy', p.y);
    box.classList.toggle('scrubbing', !reset);
    const card = box.closest('.card');
    card.querySelector('[data-chart-value]').innerHTML = amount(millions(p.value));
    card.querySelector('[data-chart-caption]').innerHTML = reset ? `<span class="pos">${esc(figure(series.change))}</span> · ${T(series.label)}` : esc(fmt(p.date));
  }
  root.addEventListener('pointerdown', e => { if (e.target.closest('[data-chart]')) scrub(e); });
  root.addEventListener('pointermove', e => { if (e.target.closest('[data-chart]') && (e.buttons || e.pointerType === 'mouse')) scrub(e); });
  root.addEventListener('pointerleave', e => { if (e.target.closest?.('[data-chart]')) scrub(e, true); }, true);
  root.addEventListener('pointerup', e => { if (e.target.closest('[data-chart]') && e.pointerType !== 'mouse') scrub(e, true); });
  root.addEventListener('pointercancel', e => { if (e.target.closest('[data-chart]')) scrub(e, true); });

  // ---------- actions ----------
  const actions = {
    tab: el => { if (sheetOpen) closeSheet(); if (!banner.hidden) hideBanner(); if (el.dataset.seg) state.intel = el.dataset.seg; setTab(el.dataset.tab); },
    'toggle-hidden': () => { state.hidden = !state.hidden; buzz(); refresh(); toast(t(state.hidden ? 'Balances hidden' : 'Balances visible')); },
    period: el => { state.period = el.dataset.period; refresh(); },
    focus: el => { const i = Number(el.dataset.index); state.focus = state.focus === i ? null : i; refresh(); },
    intel: el => { state.intel = el.dataset.seg; refresh(); },
    priority: el => { hideBanner(); const p = priority(el.dataset.id); openSheet(() => prioritySheet(p), {label: t(p.title)}); },
    signal: el => { const s = D.signals.find(x => x.id === el.dataset.id); openSheet(() => signalSheet(s), {label: t(s.title)}); },
    meeting: el => { const m = D.agenda.find(x => x.id === el.dataset.id); openSheet(() => meetingSheet(m), {label: t(m.title)}); },
    document: el => { const d = D.documents.find(x => x.id === el.dataset.id); openSheet(() => documentSheet(d), {label: t(d.title)}); },
    report: () => openSheet(reportSheet, {label: t('Office report')}),
    notifications: () => openSheet(notificationsSheet, {label: t('Notifications')}),
    messages: () => openMessages(),
    install: () => openSheet(installSheet, {label: t('Install LAVREON')}),
    'install-now': async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const choice = await deferredPrompt.userChoice.catch(() => null); deferredPrompt = null; if (choice?.outcome === 'accepted') { closeSheet(); toast(t('Installing LAVREON')); } else rerenderSheet(); },
    about: () => openSheet(aboutSheet, {label: t('About this demo')}),
    reset: () => openSheet(resetSheet, {label: t('Reset demo?')}),
    'reset-confirm': () => {
      try { localStorage.removeItem(STORE); } catch {}
      Object.assign(state, {settings: {...defaults}, reviewed: {}, sent: [], readMessages: false, focus: null, period: '1Y', intel: 'priorities', hidden: false});
      replied = false;
      closeSheet();
      renderAll();
      toast(t('Demo reset'));
    },
    review: el => {
      const id = el.dataset.id;
      if (state.reviewed[id]) delete state.reviewed[id]; else state.reviewed[id] = new Date().toISOString();
      persist(); buzz(); rerenderSheet(); refresh();
      if (state.reviewed[id]) toast(t('Marked as reviewed'));
    },
    ask: el => { const p = priority(el.dataset.id); closeSheet(); setTimeout(() => openMessages(tf('Could we look at this together: “{title}”?', {title: t(p.title)})), motion() ? 360 : 0); },
    'ask-meeting': el => { const m = D.agenda.find(x => x.id === el.dataset.id); closeSheet(); setTimeout(() => openMessages(tf('About the {title} on {date}: ', {title: t(m.title).toLowerCase(), date: fmt(shift(m.day), 'short')})), motion() ? 360 : 0); },
    ics: el => downloadIcs(D.agenda.find(x => x.id === el.dataset.id)),
    lang: el => { state.lang = el.dataset.lang; write('lavreon-language', state.lang); renderAll(); rerenderSheet(); },
    unlock: () => unlock(),
    close: () => closeSheet()
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || (!root.contains(el) && !el.closest('.stage-intro'))) return;
    const action = actions[el.dataset.act];
    if (action) { e.preventDefault(); action(el); }
  });
  root.addEventListener('change', e => {
    const key = e.target.dataset?.setting;
    if (!key) return;
    state.settings[key] = e.target.checked;
    persist();
    buzz();
    if (key === 'notifyPriority') renderView('today');
    toast(t(e.target.checked ? 'On' : 'Off') + ' · ' + t({hideOnLaunch: 'Hide balances on launch', requireUnlock: 'Biometric unlock', notifyPriority: 'Priority alerts', notifyBrief: 'Weekly intelligence brief'}[key]));
  });
  root.addEventListener('submit', e => { if (e.target.dataset.form === 'message') { e.preventDefault(); sendMessage(e.target); } });
  root.addEventListener('input', e => { if (e.target.matches('.composer textarea')) autosize(e.target); });
  root.addEventListener('keydown', e => { if (e.target.matches('.composer textarea') && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendMessage(e.target.form); } });
  // Language buttons on the desktop presentation beside the phone.
  document.querySelectorAll('[data-lang-switch] button').forEach(button => button.addEventListener('click', () => actions.lang(button)));
  document.querySelectorAll('[data-open-install]').forEach(button => button.addEventListener('click', () => {
    if (state.locked) { lock.hidden = true; state.locked = false; root.querySelectorAll('.views, .tabbar').forEach(el => el.removeAttribute('aria-hidden')); }
    actions.install();
  }));
  window.addEventListener('storage', e => { if (e.key === 'lavreon-language' && e.newValue && e.newValue !== state.lang && ['en', 'fi'].includes(e.newValue)) { state.lang = e.newValue; renderAll(); rerenderSheet(); } });

  // Re-lock after the installed app has been in the background for a while, like a banking app.
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else if (STANDALONE && hiddenAt && Date.now() - hiddenAt > 5 * 60000 && !state.locked) lockApp();
  });

  // ---------- status bar clock ----------
  const clock = () => { const now = new Date(); $('.sb-time').textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`; };
  clock();
  setInterval(clock, 20000);

  // ---------- install and offline ----------
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast(t('LAVREON installed')); });
  if ('serviceWorker' in navigator && !EMBED && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  // ---------- start ----------
  const initial = (location.hash || '').slice(1);
  state.tab = VIEWS[initial] ? initial : 'today';
  renderAll();
  TABS.forEach(([id]) => { $(`#view-${id}`).hidden = id !== state.tab; });
  if (!EMBED) history.replaceState(null, '', `#${state.tab}`);
  if (params().has('install')) {
    state.locked = false;
    setTimeout(() => actions.install(), 300);
  } else if (state.settings.requireUnlock && !params().has('nolock')) {
    renderLock();
    lock.hidden = false;
    root.querySelectorAll('.views, .tabbar').forEach(el => el.setAttribute('aria-hidden', 'true'));
  } else {
    state.locked = false;
    setTimeout(showBanner, 1200);
  }
  function params() { return new URLSearchParams(location.search); }
  html.classList.add('app-ready');
})();
