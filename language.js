'use strict';
(() => {
  const fi = window.LAVREON_FI;
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  let language = 'en';
  try { language = localStorage.getItem('lavreon-language') || (navigator.language.startsWith('fi') ? 'fi' : 'en'); } catch {}
  if (!['fi', 'en'].includes(language)) language = 'en';
  const translate = value => language === 'fi' ? (fi[normalize(value)] ?? value) : value;
  // Dynamic labels retain an English source, including when controls update after a language switch.
  const names = ['Total Net Worth', 'Investments', 'Liquid Assets', 'Real Estate', 'Asset allocation', 'Portfolio performance', 'Recent activity'];
  for (const name of names) for (const action of ['Hide', 'Show']) fi[`${action} ${name} balances`] = `${action === 'Hide' ? 'Piilota' : 'Näytä'} saldot: ${fi[name]}`;
  for (const name of ['Overview', 'Welcome to your office.', 'Wealth overview', 'Real Estate', 'Investments', 'Asset allocation', 'Intelligence', 'Activity', 'Your agenda', 'Global markets', 'Currencies', 'Client Portal']) {
    fi[`Your office / ${name}`] = `Oma toimistosi / ${fi[name]}`;
    fi[`${name} — LAVREON Demo`] = `${fi[name]} — LAVREON Demo`;
  }
  for (let n = 0; n <= 10; n++) fi[`${n} matching sections.`] = `${n} vastaavaa näkymää.`;
  for (const [en, finnish] of [['one month', 'yhden kuukauden'], ['three months', 'kolmen kuukauden'], ['one year', 'yhden vuoden'], ['three years', 'kolmen vuoden']]) {
    fi[`Sample ${en} value history · includes sample cash flows.`] = `Esimerkkikehitys ${finnish} ajalta · sisältää kuvitteellisia rahavirtoja.`;
    for (const hidden of [false, true]) fi[`Fictional investment values over ${en}${hidden ? '. Current balance hidden.' : ', ending at 8.21 million euros.'}`] = `Kuvitteelliset sijoitusarvot ${finnish} ajalta${hidden ? '. Nykyinen saldo piilotettu.' : ', lopussa 8,21 miljoonaa euroa.'}`;
  }
  Object.assign(fi, {'+2.1% · 1 month': '+2,1 % · 1 kuukausi', '+7.4% · 3 months': '+7,4 % · 3 kuukautta', '+18.3% · 1 year': '+18,3 % · 1 vuosi', '+34.2% · all sample history': '+34,2 % · koko esimerkkihistoria'});
  const allocation = 'Sample allocation: equities 42%, private equity 17.05%, alternatives 7%, real estate 23.17%, cash 10.78%. Total balance hidden.';
  fi[allocation] = 'Esimerkkijakauma: osakkeet 42 %, pääomasijoitukset 17,05 %, vaihtoehtoiset sijoitukset 7 %, kiinteistöt 23,17 %, käteisvarat 10,78 %. Kokonaissaldo piilotettu.';
  const sources = new WeakMap();
  const attributes = new WeakMap();
  function renderValue(owner, key, current, write, records) {
    let record = records.get(owner);
    if (!record) { record = {}; records.set(owner, record); }
    const previous = record[key];
    const source = previous && previous.rendered === current ? previous.source : current;
    const translated = translate(source);
    const result = translated === source ? source : source.replace(/\S[\s\S]*\S|\S/, translated);
    record[key] = {source, rendered: result};
    if (current !== result) write(result);
  }
  let observer;
  function apply() {
    observer?.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || node.parentElement.closest('script, style, .language-switch, .brand, .entry-wordmark')) continue;
      const textNode = node;
      renderValue(node, 'text', node.nodeValue, value => { textNode.nodeValue = value; }, sources);
    }
    for (const element of document.querySelectorAll('[aria-label], [placeholder], meta[name="description"]')) {
      if (element.closest('.language-switch')) continue;
      for (const name of ['aria-label', 'placeholder', 'content']) {
        if (element.hasAttribute(name)) renderValue(element, name, element.getAttribute(name), value => element.setAttribute(name, value), attributes);
      }
    }
    const title = document.querySelector('title');
    renderValue(title, 'title', document.title, value => { document.title = value; }, attributes);
    document.documentElement.lang = language;
    document.querySelectorAll('.language-switch').forEach(group => {
      group.dataset.language = language;
      group.setAttribute('aria-label', language === 'fi' ? 'Kieli' : 'Language');
      group.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
    });
    observer?.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder']});
  }
  function choose(next) {
    if (!['fi', 'en'].includes(next) || language === next) return;
    language = next;
    try { localStorage.setItem('lavreon-language', language); } catch {}
    apply();
    document.dispatchEvent(new CustomEvent('lavreon-languagechange'));
  }
  window.LavreonLanguage = {translate, get language() { return language; }, apply};
  document.addEventListener('DOMContentLoaded', () => {
    const group = document.createElement('div');
    group.className = 'language-switch';
    group.setAttribute('role', 'group');
    group.innerHTML = '<span class="language-highlight" aria-hidden="true"></span><button type="button" data-lang="fi" lang="fi" aria-label="Suomi">FI</button><button type="button" data-lang="en" lang="en" aria-label="English">EN</button>';
    (document.querySelector('.site-header') || document.querySelector('.topbar')).append(group);
    group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => choose(button.dataset.lang)));
    observer = new MutationObserver(apply);
    apply();
  }, {once: true});
  window.addEventListener('storage', event => { if (event.key === 'lavreon-language' && event.newValue) choose(event.newValue); });
})();
