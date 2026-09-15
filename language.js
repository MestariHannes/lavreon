'use strict';
(() => {
  const fi = window.LAVREON_FI || {};
  const languages = [['en','English'],['fi','Suomi'],['es','Español'],['zh','中文'],['hi','हिन्दी'],['ar','العربية'],['fr','Français'],['bn','বাংলা'],['pt','Português'],['ru','Русский'],['ur','اردو'],['id','Bahasa Indonesia']];
  const keys=['Overview','Wealth','Investments','Real Estate','Insurance','AI Signal Brief','Opportunities','Documents','Reports','Agenda','Markets / Currencies','Companies','Expenses','Tax & Legal','Client preview','Admin / Editor preview','Method','Intelligence','Brief','About','Open latest report','View documents','Review intelligence brief','Welcome to your office.'];
  const rows={
    fi:['Yhteenveto','Varallisuus','Sijoitukset','Kiinteistöt','Vakuutukset','Tekoälykatsaus','Mahdollisuudet','Asiakirjat','Raportit','Kalenteri','Markkinat / Valuutat','Yritykset','Kulut','Vero- ja lakiasiat','Asiakasnäkymä','Ylläpito / Editorinäkymä','Menetelmä','Analyysi','Katsaus','Meistä','Avaa uusin raportti','Näytä asiakirjat','Lue tekoälykatsaus','Tervetuloa toimistoosi.'],
    es:['Resumen','Patrimonio','Inversiones','Inmuebles','Seguros','Actualidad de IA','Oportunidades','Documentos','Informes','Agenda','Mercados / Divisas','Empresas','Gastos','Fiscal y legal','Vista del cliente','Vista de administración','Método','Inteligencia','Boletín','Nosotros','Abrir último informe','Ver documentos','Revisar actualidad de IA','Bienvenido a su oficina.'],
    zh:['总览','财富','投资','房地产','保险','人工智能简报','机遇','文件','报告','日程','市场 / 货币','公司','支出','税务与法律','客户预览','管理 / 编辑预览','方法','情报','简报','关于','打开最新报告','查看文件','查看人工智能简报','欢迎来到您的办公室。'],
    hi:['अवलोकन','संपत्ति','निवेश','अचल संपत्ति','बीमा','एआई संक्षेप','अवसर','दस्तावेज़','रिपोर्ट','कार्यसूची','बाज़ार / मुद्राएँ','कंपनियाँ','खर्च','कर और कानून','ग्राहक पूर्वावलोकन','प्रशासन / संपादक पूर्वावलोकन','तरीका','जानकारी','संक्षेप','परिचय','नवीनतम रिपोर्ट खोलें','दस्तावेज़ देखें','एआई संक्षेप देखें','आपके कार्यालय में स्वागत है।'],
    ar:['نظرة عامة','الثروة','الاستثمارات','العقارات','التأمين','موجز الذكاء الاصطناعي','الفرص','المستندات','التقارير','جدول الأعمال','الأسواق / العملات','الشركات','المصروفات','الضرائب والقانون','معاينة العميل','معاينة الإدارة / المحرر','المنهج','المعلومات','الموجز','نبذة عنا','افتح أحدث تقرير','عرض المستندات','مراجعة موجز الذكاء الاصطناعي','مرحبًا بك في مكتبك.'],
    fr:['Vue d’ensemble','Patrimoine','Investissements','Immobilier','Assurances','Veille IA','Opportunités','Documents','Rapports','Agenda','Marchés / Devises','Entreprises','Dépenses','Fiscalité et droit','Aperçu client','Aperçu administration','Méthode','Intelligence','Note','À propos','Ouvrir le dernier rapport','Voir les documents','Consulter la veille IA','Bienvenue dans votre bureau.'],
    bn:['সারসংক্ষেপ','সম্পদ','বিনিয়োগ','স্থাবর সম্পত্তি','বীমা','এআই সংক্ষিপ্তসার','সুযোগ','নথি','প্রতিবেদন','কর্মসূচি','বাজার / মুদ্রা','কোম্পানি','ব্যয়','কর ও আইন','গ্রাহক প্রিভিউ','প্রশাসক / সম্পাদক প্রিভিউ','পদ্ধতি','তথ্য','সংক্ষিপ্তসার','পরিচিতি','সর্বশেষ প্রতিবেদন খুলুন','নথি দেখুন','এআই সংক্ষিপ্তসার দেখুন','আপনার অফিসে স্বাগতম।'],
    pt:['Visão geral','Património','Investimentos','Imóveis','Seguros','Boletim de IA','Oportunidades','Documentos','Relatórios','Agenda','Mercados / Moedas','Empresas','Despesas','Fiscal e jurídico','Prévia do cliente','Prévia de administração','Método','Inteligência','Boletim','Sobre','Abrir último relatório','Ver documentos','Rever boletim de IA','Bem-vindo ao seu escritório.'],
    ru:['Обзор','Капитал','Инвестиции','Недвижимость','Страхование','Обзор ИИ','Возможности','Документы','Отчёты','Календарь','Рынки / Валюты','Компании','Расходы','Налоги и право','Просмотр клиента','Просмотр редактора','Метод','Аналитика','Обзор','О нас','Открыть последний отчёт','Посмотреть документы','Читать обзор ИИ','Добро пожаловать в ваш офис.'],
    ur:['جائزہ','دولت','سرمایہ کاری','جائیداد','بیمہ','اے آئی خلاصہ','مواقع','دستاویزات','رپورٹس','شیڈول','بازار / کرنسیاں','کمپنیاں','اخراجات','ٹیکس اور قانون','کلائنٹ پیش نظارہ','منتظم / ایڈیٹر پیش نظارہ','طریقہ','معلومات','خلاصہ','تعارف','تازہ ترین رپورٹ کھولیں','دستاویزات دیکھیں','اے آئی خلاصہ دیکھیں','آپ کے دفتر میں خوش آمدید۔'],
    id:['Ringkasan','Kekayaan','Investasi','Properti','Asuransi','Ringkasan AI','Peluang','Dokumen','Laporan','Agenda','Pasar / Mata uang','Perusahaan','Pengeluaran','Pajak & Hukum','Pratinjau klien','Pratinjau admin / editor','Metode','Intelijen','Ringkasan','Tentang','Buka laporan terbaru','Lihat dokumen','Tinjau ringkasan AI','Selamat datang di kantor Anda.']
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
  const translate = value => dictionaries[language]?.[normalize(value)] ?? value;
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
    document.documentElement.dir = ['ar','ur'].includes(language) ? 'rtl' : 'ltr';
    document.querySelectorAll('.language-switch').forEach(group => {
      group.dataset.language = language;
      group.setAttribute('aria-label', language === 'fi' ? 'Kieli' : 'Language');
      group.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
      group.querySelector('.language-trigger').textContent='◎ '+language.toUpperCase()+' ▾';
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
