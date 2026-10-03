'use strict';
(() => {
  const fi = window.LAVREON_FI || {};
  const languages = [['en','English'],['fi','Suomi']];
  const keys=['Overview','Wealth','Investments','Real Estate','Insurance','AI Signal Brief','Opportunities','Documents','Reports','Agenda','Markets / Currencies','Companies','Expenses','Tax & Legal','Client preview','Admin / Editor preview','Method','Intelligence','Brief','About','Open latest report','View documents','Review intelligence brief','Welcome to your office.'];
  const rows={
    fi:['Yhteenveto','Varallisuus','Sijoitukset','Kiinteistöt','Vakuutukset','Tekoälykatsaus','Mahdollisuudet','Asiakirjat','Raportit','Kalenteri','Markkinat / Valuutat','Yritykset','Kulut','Vero- ja lakiasiat','Asiakasnäkymä','Ylläpito / Editorinäkymä','Menetelmä','Analyysi','Katsaus','Meistä','Avaa uusin raportti','Näytä asiakirjat','Lue tekoälykatsaus','Tervetuloa toimistoosi.'],
  };
  const dictionaries={fi};
  for(const [code,values] of Object.entries(rows)) {
    const dict=dictionaries[code] ||= {}; keys.forEach((key,i)=>dict[key]=values[i]);
    dict['Wealth overview']=dict.Wealth; dict['Real estate']=dict['Real Estate'];dict['Your agenda']=dict.Agenda;dict.Upcoming=dict.Agenda;
    for(const key of ['Open latest report','View documents','Review intelligence brief']) dict[key+' ↗']=dict[key]+' ↗';
    dict['Client Portal · Demo']=dict['Client preview']+' · Demo';dict['Open Client Portal · Demo']=dict['Client preview']+' · Demo';
  }
  Object.assign(fi,{'HOME':'ETUSIVU','YOUR WORLD':'OMA MAAILMASI','INTELLIGENCE':'ANALYYSI','OFFICE':'TOIMISTO','ADMIN ONLY':'VAIN YLLÄPITO','Module controls / Client setup':'Moduulivalinnat / Asiakasasetukset','Restore default modules':'Palauta oletusmoduulit','Client module visibility':'Asiakkaan näkyvät moduulit','Fictional client':'Kuvitteellinen asiakas'});
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  let language = 'en';
  try { language = localStorage.getItem('lavreon-language') || 'en'; } catch {}
  if (!languages.some(([code]) => code === language)) language = 'en';
  // Composite portal labels ("Your office / Insurance", "Insurance — LAVREON Demo") translate their parts.
  const patterns = [
    [/^Your office \/ (.+)$/, (dict, part) => dict['Your office'] && `${dict['Your office']} / ${dict[part] ?? part}`],
    [/^(.+) — LAVREON Demo$/, (dict, part) => dict[part] && `${dict[part]} — LAVREON Demo`]
  ];
  const translate = value => {
    const dict = dictionaries[language];
    if (!dict) return value;
    const key = normalize(value);
    if (key in dict) return dict[key];
    for (const [pattern, build] of patterns) {
      const match = key.match(pattern);
      if (match) return build(dict, match[1]) || value;
    }
    return value;
  };
  // Dynamic labels retain an English source, including when controls update after a language switch.
  const names = ['Total Net Worth', 'Investments', 'Liquid Assets', 'Real Estate', 'Asset allocation', 'Portfolio performance', 'Recent activity'];
  for (const name of names) for (const action of ['Hide', 'Show']) fi[`${action} ${name} balances`] = `${action === 'Hide' ? 'Piilota' : 'Näytä'} saldot: ${fi[name]}`;
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
      if (!node.parentElement || node.parentElement.closest('script, style, noscript, .language-switch, .brand, .entry-wordmark')) continue;
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
    document.documentElement.dir = 'ltr';
    document.querySelectorAll('.language-switch').forEach(group => {
      group.dataset.language = language;
      group.setAttribute('aria-label', language === 'fi' ? 'Kieli' : 'Language');
      group.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
      const trigger = group.querySelector('.language-trigger');
      const current = document.createElement('span');
      current.textContent = language.toUpperCase();
      const icon = glyph => { const span = document.createElement('span'); span.setAttribute('aria-hidden', 'true'); span.textContent = glyph; return span; };
      trigger.replaceChildren(icon('◎ '), current, icon(' ▾'));
      trigger.setAttribute('aria-label', `${translate('Choose language')} · ${languages.find(([code]) => code === language)[1]}`);
    });
    observer?.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder']});
  }
  function choose(next) {
    if (!languages.some(([code]) => code === next) || language === next) return;
    language = next;
    try { localStorage.setItem('lavreon-language', language); } catch {}
    apply();
    document.dispatchEvent(new CustomEvent('lavreon-languagechange'));
  }
  window.LavreonLanguage = {translate, get language() { return language; }, apply};
  document.addEventListener('DOMContentLoaded', () => {
    const group = document.createElement('div');
    group.className = 'language-switch';
    const trigger=document.createElement('button');trigger.type='button';trigger.className='language-trigger';trigger.setAttribute('aria-label','Choose language');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','language-options');
    const list=document.createElement('div');list.id='language-options';list.className='language-options';list.hidden=true;
    function close(returnFocus=false){list.hidden=true;trigger.setAttribute('aria-expanded','false');if(returnFocus)trigger.focus();}
    for(const [code,name] of languages){const button=document.createElement('button');button.type='button';button.dataset.lang=code;button.lang=code;button.dir='auto';button.textContent=name;button.addEventListener('click',()=>{choose(code);close(true);});list.append(button);}
    trigger.addEventListener('click',()=>{list.hidden=!list.hidden;trigger.setAttribute('aria-expanded',String(!list.hidden));});
    trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();list.hidden=false;trigger.setAttribute('aria-expanded','true');list.querySelector('button').focus();}});
    list.addEventListener('keydown',event=>{const buttons=[...list.children];const index=buttons.indexOf(document.activeElement);let next;if(event.key==='ArrowDown')next=(index+1)%buttons.length;if(event.key==='ArrowUp')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();buttons[next].focus();}});
    group.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();close(true);}});
    document.addEventListener('click',event=>{if(!group.contains(event.target))close();});
    group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))close();});
    group.append(trigger,list);
    (document.querySelector('.site-header') || document.querySelector('.topbar')).append(group);
    observer = new MutationObserver(apply);
    apply();
  }, {once: true});
  window.addEventListener('storage', event => { if (event.key === 'lavreon-language' && event.newValue) choose(event.newValue); });
})();
