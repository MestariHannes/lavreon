'use strict';
// Front-end concept only. All changes live in this page's memory; no network or storage writes.
(() => {
  const initial = [
    {id:'touring',name:'Volvo XC60',plate:'ABC-123',year:2020,km:184320,body:'suv',color:'#eef1f4',fuel:'Bensiini',events:[
      {id:'oil',type:'Moottoriöljyn vaihto',date:'2026-09-23',km:184320,cost:'129',note:'Öljy ja öljynsuodatin vaihdettu. Kuvitteellinen esimerkkimerkintä.'},
      {id:'filter',type:'Ilmansuodattimen vaihto',date:'2026-05-12',km:182450,cost:'35',note:'Moottorin ilmansuodatin vaihdettu.'},
      {id:'tyres',type:'Renkaiden vaihto',date:'2026-04-05',km:181900,cost:'50',note:'Kesärenkaat vaihdettu alle.'},
      {id:'inspection',type:'Katsastus',date:'2026-02-15',km:181120,cost:'75',note:'Määräaikaiskatsastus hyväksytty. Ei korjauskehotuksia. Kuvitteellinen merkintä.'},
      {id:'brakes',type:'Jarruhuolto',date:'2025-11-14',km:174860,cost:'485',note:'Etujarrulevyt ja -palat vaihdettu. Jarrujen toiminta tarkistettu koeajolla. Kuvitteellinen työ ja hinta.'},
      {id:'annual',type:'Vuosihuolto',date:'2025-09-18',km:169540,cost:'329',note:'Öljyn ja öljynsuodattimen vaihto, raitisilmasuodattimen vaihto sekä nesteiden ja valojen tarkistus. Kuvitteellinen huoltokäynti, ei valmistajan huolto-ohjelma.'},
      {id:'winter',type:'Renkaiden vaihto',date:'2024-10-28',km:151200,cost:'65',note:'Talvirenkaat asennettu. Rengaspaineet tarkistettu. Kuvitteellinen merkintä.'},
      {id:'service2024',type:'Vuosihuolto',date:'2024-09-12',km:148300,cost:'310',note:'Öljy ja öljynsuodatin vaihdettu. Alustan ja jarrujen silmämääräinen tarkistus. Kuvitteellinen huolto ja kustannus.'}
    ]},
    {id:'city',name:'Toyota Corolla',plate:'XYZ-789',year:2018,km:92450,body:'sedan',color:'#b9c1ca',fuel:'Bensiini',events:[
      {id:'service',type:'Huolto',date:'2026-08-17',km:92450,cost:'220',note:'Vuosihuolto. Kuvitteellinen esimerkkimerkintä.'},
      {id:'tyres2',type:'Renkaiden vaihto',date:'2026-04-07',km:89100,cost:'45',note:'Kesärenkaat vaihdettu alle.'}
    ]}
  ];
  // Simulated registry for the concept demo only. No real vehicle register is queried.
  const registry={
    'LMN-456':{name:'Volkswagen Golf',year:2015,body:'hatchback',fuel:'Bensiini',color:'#eef1f4'},
    'KLM-482':{name:'Toyota Corolla Touring Sports',year:2021,body:'wagon',fuel:'Hybridi (bensiini/sähkö)',color:'#b9c1ca'},
    'FIN-202':{name:'Škoda Octavia Combi',year:2019,body:'wagon',fuel:'Diesel',color:'#1e4f9c'},
    'MKV-310':{name:'Toyota RAV4',year:2022,body:'suv',fuel:'Hybridi (bensiini/sähkö)',color:'#6b737c'},
    'EKO-500':{name:'Kia Niro EV',year:2023,body:'suv',fuel:'Sähkö',color:'#2f5b45'},
    'RTX-118':{name:'Mazda 3',year:2020,body:'hatchback',fuel:'Bensiini',color:'#a8232d'}
  };
  const examplePlates=['LMN-456','FIN-202','MKV-310','EKO-500'];
  const kinds=['Huolto','Vuosihuolto','Jarruhuolto','Moottoriöljyn vaihto','Ilmansuodattimen vaihto','Renkaiden vaihto','Katsastus','Korjaus','Osan vaihto','Mittarilukeman päivitys','Muu tapahtuma'];
  // Illustrative reminder interval. Presented as a user's own setting, never as manufacturer guidance.
  const serviceKinds=['Huolto','Vuosihuolto','Moottoriöljyn vaihto'],intervalMonths=12,intervalKm=15000;
  const guidance={
    welcome:['01 / 05','Tervetuloa kyytiin.','Aloita demo puhelimen sinisestä painikkeesta. Et tarvitse tiliä tai latausta.'],
    home:['02 / 05','Kaikki yhdellä silmäyksellä.','Kojelauta kokoaa autot, kulut, viimeisimmät tapahtumat ja esimerkin tulevasta huoltomuistutuksesta.'],
    vehicles:['03 / 05','Valitse ajoneuvo.','Avaa esimerkkiauto tai lisää oma kuvitteellinen ajoneuvo. Jokaisella autolla on oma historia.'],
    newcar:['03 / 05','Rekisteritunnuksella alkuun.','Syötä esimerkkitunnus, esim. LMN-456. Simuloitu haku täyttää perustiedot, ja voit valita auton ulkovärin.'],
    vehicle:['04 / 05','Jokainen merkintä kertoo.','Avaa tapahtuma nähdäksesi sen tiedot. Tai paina Lisää tapahtuma ja kokeile päiväkirjaa itse.'],
    event:['04 / 05','Yksityiskohdat tallessa.','Päivämäärä, mittarilukema ja muistiinpanot yhdessä näkymässä. Palaa historiaan vasemman yläkulman nuolesta.'],
    add:['05 / 05','Kokeile uutta merkintää.','Valitse tapahtuma, päivämäärä ja ajokilometrit. Tallennuksen jälkeen merkintä löytyy auton historiasta.']
  };
  const guideStep={welcome:'welcome',home:'home',vehicles:'vehicles',newcar:'vehicles',vehicle:'vehicle',event:'vehicle',add:'add'};
  let cars=structuredClone(initial),sequence=0,notice='',draft=null,lookup=null;
  const screen=document.getElementById('app-screen');
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number=value=>Number(value).toLocaleString('fi-FI',{maximumFractionDigits:2});
  const date=value=>new Intl.DateTimeFormat('fi-FI').format(new Date(value+'T12:00:00'));
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const addMonths=(value,months)=>{const [y,m,d]=value.split('-').map(Number);const t=new Date(Date.UTC(y,m-1+months,1));const last=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth()+1,0)).getUTCDate();return `${t.getUTCFullYear()}-${String(t.getUTCMonth()+1).padStart(2,'0')}-${String(Math.min(d,last)).padStart(2,'0')}`;};
  const newest=(a,b)=>b.date.localeCompare(a.date)||b.km-a.km;
  const costOf=events=>events.reduce((sum,e)=>sum+(e.cost!==''?Number(e.cost):0),0);
  const Car=window.AjouraCar;
  const colorName=hex=>(Car.colors.find(([,v])=>v===hex)||['Oma väri'])[0];
  const vehicleImage=c=>`<div class="car-stage">${Car.render(c.body,c.color,escape(c.name)+', tyylitelty malli')}</div>`;
  const normalPlate=value=>{const v=String(value).toUpperCase().replace(/\s+/g,'');return /^[A-ZÅÄÖ]{1,3}\d{1,3}$/.test(v)?v.replace(/^([A-ZÅÄÖ]+)/,'$1-'):v;};
  const top=()=>'<div class="app-top"><img class="app-brand" src="logo.svg" width="640" height="198" alt="AJOURA"><span class="demo-label">KONSEPTIDEMO</span></div>';
  const back=(target,label)=>`<a class="app-back" href="#${target}">← ${label}</a>`;
  const route=()=>{const [view='welcome',id='',eventId='']=(location.hash.slice(1)||'welcome').split('/');return {view,id,eventId};};
  const go=target=>{if(location.hash==='#'+target)render();else location.hash=target;};
  const svg=paths=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const icons={
    wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    oil:'<path d="M12 3.5s5.5 6 5.5 10a5.5 5.5 0 0 1-11 0c0-4 5.5-10 5.5-10z"/>',
    filter:'<path d="M4 5h16l-6 7.5V18l-4 2v-7.5z"/>',
    tyre:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    inspection:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    brake:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
    repair:'<path d="m14 4 6 6-3 3-6-6zM11 7l-7 7 3 3 7-7"/><path d="m4 20 3-3"/>',
    part:'<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
    gauge:'<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-5"/>',
    note:'<path d="M6 3.5h9l3 3V20.5H6z"/><path d="M9 11h6M9 15h6"/>',
    home:'<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    car:'<path d="M4 16v-4l2-5h12l2 5v4z"/><path d="M4 16v2.5M20 16v2.5M7 13h1.5M15.5 13H17"/>',
    bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/>'
  };
  const iconFor={'Huolto':'wrench','Vuosihuolto':'wrench','Moottoriöljyn vaihto':'oil','Ilmansuodattimen vaihto':'filter','Renkaiden vaihto':'tyre','Katsastus':'inspection','Jarruhuolto':'brake','Korjaus':'repair','Osan vaihto':'part','Mittarilukeman päivitys':'gauge'};
  const eventIcon=type=>svg(icons[iconFor[type]||'note']);
  const eventRow=(c,e,showCar)=>`<li><a class="event-row" href="#event/${c.id}/${e.id}"><span class="event-symbol" aria-hidden="true">${eventIcon(e.type)}</span><span><strong>${escape(e.type)}</strong><small>${showCar?escape(c.name)+' · ':''}${date(e.date)} · ${number(e.km)} km</small></span><span class="chevron" aria-hidden="true">›</span></a></li>`;
  const tabBar=view=>`<nav class="tab-bar" aria-label="Sovelluksen valikko"><a href="#home"${view==='home'?' aria-current="page"':''}>${svg(icons.home)}<span>Koti</span></a><a href="#vehicles"${view!=='home'?' aria-current="page"':''}>${svg(icons.car)}<span>Ajoneuvot</span></a></nav>`;
  function nextService(){
    let next=null;
    for(const c of cars){const last=[...c.events].filter(e=>serviceKinds.includes(e.type)).sort(newest)[0];if(!last)continue;const due=addMonths(last.date,intervalMonths);if(!next||due<next.due)next={c,last,due,dueKm:last.km+intervalKm};}
    return next;
  }
  function welcome(){return `${top()}<div class="welcome"><img class="welcome-logo" src="mark.svg" alt="" width="49" height="49"><h2>Hyvä matka<br><span>jää muistiin.</span></h2><p>Autosi tapahtumat, mittarilukemat ja huollot. Yhdessä omassa päiväkirjassa.</p><div class="welcome-art"><div class="car-stage">${Car.render('suv','#eef1f4')}</div><p>Yksi selkeä näkymä autosi matkaan.</p></div><a class="app-button" href="#home">Aloita kokeilu <span aria-hidden="true">→</span></a><p class="app-fineprint">Kuvitteelliset tiedot. Ei kirjautumista.<br>Merkinnät nollautuvat sivun päivityksessä.</p></div>`;}
  function home(){
    const year=today().slice(0,4),all=cars.flatMap(c=>c.events.map(e=>({c,e})));
    const latest=all.sort((a,b)=>newest(a.e,b.e)).slice(0,3),n=nextService();
    const reminder=n?`<div class="reminder-card"><span class="event-symbol" aria-hidden="true">${svg(icons.bell)}</span><div><span class="mini-label">SEURAAVA HUOLTO · ${escape(n.c.name)}</span><strong>Viimeistään ${date(n.due)} tai ${number(n.dueKm)} km</strong><small>${n.dueKm>n.c.km?'Ajettavaa jäljellä noin '+number(n.dueKm-n.c.km)+' km.':'Kilometriraja on jo ylittynyt.'} Edellinen: ${escape(n.last.type.toLowerCase())} ${date(n.last.date)}.</small></div></div><p class="reminder-note">Esimerkki tulevasta muistutusominaisuudesta. Väli ${intervalMonths} kk / ${number(intervalKm)} km on käyttäjän oma asetus, ei valmistajan suositus.</p>`:'';
    return `${top()}<p class="app-greeting">Hyvää päivää.</p><h2 class="app-heading">Kojelauta</h2><div class="app-stats three"><div><strong>${cars.length}</strong><span>Ajoneuvoa</span></div><div><strong>${all.length}</strong><span>Tapahtumaa</span></div><div><strong>${number(costOf(all.filter(x=>x.e.date.startsWith(year)).map(x=>x.e)))} <small>€</small></strong><span>Kulut ${year}</span></div></div>${reminder}<div class="history-heading"><h3>Viimeisimmät tapahtumat</h3><span>Kaikki autot</span></div>${latest.length?`<ul class="event-list">${latest.map(x=>eventRow(x.c,x.e,true)).join('')}</ul>`:'<p class="app-empty">Ei vielä tapahtumia.</p>'}<a class="app-button home-action" href="#vehicles">Valitse ajoneuvo <span aria-hidden="true">→</span></a>`;
  }
  function vehicles(){return `${top()}<p class="app-greeting">Tervetuloa omaan talliin.</p><h2 class="app-heading">Omat ajoneuvot</h2><p class="app-subtitle">Valitse auto ja jatka sen tarinaa.</p>${notice?`<p class="success-note" role="status">${escape(notice)}</p>`:''}${cars.map(c=>`<a class="vehicle-card" href="#vehicle/${c.id}" aria-label="Avaa ${escape(c.name)}"><span class="mini-label">${escape(c.plate)} · ${c.year}</span>${vehicleImage(c)}<div class="vehicle-line"><div><h3>${escape(c.name)}</h3><p>Oma ajoneuvopäiväkirja</p></div><span class="round-arrow" aria-hidden="true">↗</span></div><div class="vehicle-mileage"><span>${number(c.km)} km</span><span>${c.events.length} tapahtumaa</span></div></a>`).join('')}<a class="app-button secondary" href="#newcar">＋ Lisää ajoneuvo</a><p class="app-fineprint">Demossa on kaksi valmista esimerkkiautoa.</p><button class="app-back" data-reset type="button">↻ Palauta demon lähtötiedot</button>`;}
  const fuels=['Bensiini','Diesel','Hybridi (bensiini/sähkö)','Lataushybridi','Sähkö','Kaasu','Muu'];
  function plateStep(){const pending=lookup&&lookup.pending;return `${back('vehicles','Ajoneuvot')}<h2 class="app-heading">Uusi ajoneuvo</h2><p class="app-subtitle">Syötä rekisteritunnus, niin AJOURA tunnistaa auton ja täyttää perustiedot.</p><form class="app-form" id="plate-form" novalidate><label for="plate-input">Rekisteritunnus</label><div class="plate-field"><span class="plate-country" aria-hidden="true">FIN</span><input id="plate-input" name="plate" maxlength="10" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABC-123" value="${escape(lookup?.plate||'')}"${pending?' disabled':''}></div><p class="error-note" id="form-error" role="alert">${lookup?.error?escape(lookup.error):''}</p><button class="app-button" type="submit"${pending?' disabled':''}>${pending?'<span class="spinner" aria-hidden="true"></span> Haetaan ajoneuvoa…':'Hae ajoneuvo'}</button><p class="field-help plate-examples"><span>Kokeile esimerkkitunnuksia:</span>${examplePlates.map(p=>`<button type="button" class="plate-chip" data-plate="${p}">${p}</button>`).join('')}</p><button class="app-back manual-link" type="button" data-manual>Syötä tiedot itse →</button><p class="app-fineprint">Simuloitu haku: demossa ei tehdä oikeaa rekisterihakua. Tunnistus perustuu kuvitteelliseen esimerkkiaineistoon.</p></form>`;}
  function detailsStep(){const d=draft,year=new Date().getFullYear();return `<button class="app-back" type="button" data-restart>← Vaihda rekisteritunnus</button><h2 class="app-heading">${d.source==='lookup'?'Ajoneuvo tunnistettu':'Ajoneuvon tiedot'}</h2>${d.source==='lookup'?`<p class="success-note" role="status">✓ ${escape(d.plate)}: ${escape(d.name)}, ${d.year}. Tarkista tiedot ja valitse väri.</p>`:d.missed?`<p class="info-note" role="status">Tunnuksella ${escape(d.plate)} ei löytynyt esimerkkiautoa. Syötä tiedot itse.</p>`:''}<div class="car-preview" id="car-preview">${Car.render(d.body,d.color,'Esikatselu')}<span>${Car.names[d.body]} · ${colorName(d.color)}</span></div><form class="app-form" id="car-form" novalidate><fieldset class="color-picker"><legend>Ulkoväri</legend><div>${Car.colors.map(([n,v])=>`<label title="${n}"><input type="radio" name="color" value="${v}"${v===d.color?' checked':''}><span style="--swatch:${v}"></span><small>${n}</small></label>`).join('')}</div></fieldset><label>Rekisteritunnus<input name="plate" required maxlength="10" autocomplete="off" autocapitalize="characters" value="${escape(d.plate)}"></label><label>Merkki ja malli<input name="name" required minlength="2" maxlength="40" autocomplete="off" placeholder="Esim. Skoda Octavia" value="${escape(d.name)}"></label><div class="form-row"><label>Vuosimalli<input name="year" type="number" required min="1950" max="${year+1}" step="1" inputmode="numeric" placeholder="${year-6}" value="${d.year}"></label><label>Korityyppi<select name="body">${Car.bodies.map(b=>`<option value="${b}"${b===d.body?' selected':''}>${Car.names[b]}</option>`).join('')}</select></label></div><label>Käyttövoima <small>· valinnainen</small><select name="fuel"><option value="">Valitse</option>${fuels.map(f=>`<option${f===d.fuel?' selected':''}>${f}</option>`).join('')}</select></label><label>Mittarilukema (km)<input name="km" type="number" required min="0" max="2000000" step="1" inputmode="numeric" placeholder="120000"></label><p class="field-help">${d.source==='lookup'?'Perustiedot tulevat simuloidusta esimerkkirekisteristä. Mittarilukeman syötät itse.':'Täytä perustiedot. Väri ja korityyppi päivittävät mallikuvan.'}</p><p class="error-note" id="form-error" role="alert"></p><div class="form-actions"><button class="app-button" type="submit">Tallenna ajoneuvo</button><a class="app-button secondary" href="#vehicles">Peruuta</a></div><p class="app-fineprint">Mallikuva on tyylitelty kuvitus, ei valokuva autostasi.<br>Ajoneuvo säilyy vain tämän sivun muistissa.</p></form>`;}
  function newcar(){return draft?detailsStep():plateStep();}
  function vehicle(c){const sorted=[...c.events].sort(newest),year=today().slice(0,4);return `${back('vehicles','Ajoneuvot')}<div class="vehicle-hero">${vehicleImage(c)}<h2 class="app-heading">${escape(c.name)}</h2><p>${escape(c.plate)} · ${c.year} · ${colorName(c.color)}${c.fuel?' · '+escape(c.fuel):''}</p></div>${notice?`<p class="success-note" role="status">${escape(notice)}</p>`:''}<div class="app-stats"><div><strong>${number(c.km)} <small>km</small></strong><span>Mittarilukema</span></div><div><strong>${c.events.length}</strong><span>Tapahtumaa</span></div></div><div class="cost-line"><span>Kirjatut kulut yhteensä</span><strong>${number(costOf(c.events))} €</strong><small>Vuonna ${year}: ${number(costOf(c.events.filter(e=>e.date.startsWith(year))))} €</small></div><a class="app-button" href="#add/${c.id}">＋ Lisää tapahtuma</a><div class="history-heading"><h3>Tapahtumahistoria</h3><span>Uusin ensin</span></div>${sorted.length?`<ul class="event-list">${sorted.map(e=>eventRow(c,e)).join('')}</ul>`:'<p class="app-empty">Ei vielä tapahtumia. Lisää ensimmäinen merkintä yllä olevasta painikkeesta.</p>'}<p class="app-note">${c.id.startsWith('new')?'Tässä demossa lisätty kokeiluajoneuvo.':'Kuvitteellinen historia, rekisteritunnus ja hinnat.'} Automalli on tyylitelty kuvitus.</p>`;}
  function add(c){return `${back('vehicle/'+c.id,'Ajoneuvo')}<h2 class="app-heading">Uusi tapahtuma</h2><p class="app-subtitle">${escape(c.name)} · ${escape(c.plate)}<br>Pieni merkintä. Yksi asia vähemmän muistettavana.</p><form class="app-form" id="event-form"><label>Tapahtuma<select name="type" required><option value="">Valitse tapahtuman tyyppi</option>${kinds.map(k=>`<option>${k}</option>`).join('')}</select></label><label>Päivämäärä<input name="date" type="date" value="${today()}" max="${today()}" min="${c.year-1}-01-01" required></label><label>Mittarilukema (km)<input name="km" type="number" min="0" max="2000000" step="1" inputmode="numeric" placeholder="${c.km}" required></label><p class="field-help">Viimeisin kirjattu lukema: ${number(c.km)} km. Voit lisätä myös vanhemman tapahtuman.</p><label>Kustannus (€) <small>· valinnainen</small><input name="cost" type="number" min="0" max="1000000" step="0.01" inputmode="decimal" placeholder="0,00"></label><label>Muistiinpano <small>· valinnainen</small><textarea name="note" maxlength="300" rows="3" placeholder="Esim. öljy ja suodatin vaihdettu"></textarea></label><p class="error-note" id="form-error" role="alert"></p><div class="form-actions"><button class="app-button" type="submit">Tallenna demoon</button><a class="app-button secondary" href="#vehicle/${c.id}">Peruuta</a></div><p class="app-fineprint">Merkintä säilyy vain tämän sivun muistissa.<br>Älä kirjoita oikeita henkilötietoja.</p></form>`;}
  function detail(c,e){return `${back('vehicle/'+c.id,'Tapahtumahistoria')}<div class="detail-icon" aria-hidden="true">${eventIcon(e.type)}</div><h2 class="app-heading">${escape(e.type)}</h2><p class="app-subtitle">${escape(c.name)} · ${escape(c.plate)}</p><dl class="detail-list"><div><dt>PÄIVÄMÄÄRÄ</dt><dd>${date(e.date)}</dd></div><div><dt>MITTARILUKEMA</dt><dd>${number(e.km)} km</dd></div><div><dt>KUSTANNUS</dt><dd>${e.cost!==''?number(e.cost)+' €':'Ei merkitty'}</dd></div><div><dt>MUISTIINPANO</dt><dd>${e.note?escape(e.note):'Ei muistiinpanoa.'}</dd></div></dl><a class="app-button secondary" href="#vehicle/${c.id}">Takaisin ajoneuvoon</a><p class="app-fineprint">${e.id.startsWith('new')?'Tässä demossa lisätty kokeilumerkintä.':'Kuvitteellinen esimerkkimerkintä.'}</p>`;}
  function render(){let {view,id,eventId}=route();let c=cars.find(c=>c.id===id);if(!guidance[view]||(['vehicle','add','event'].includes(view)&&!c)){history.replaceState(null,'','#vehicles');view='vehicles';}let e=c?.events.find(e=>e.id===eventId);if(view==='event'&&!e){history.replaceState(null,'','#vehicle/'+c.id);view='vehicle';}if(view!=='newcar'){draft=null;lookup=null;}let html=view==='welcome'?welcome():view==='home'?home():view==='vehicles'?vehicles():view==='newcar'?newcar():view==='vehicle'?vehicle(c):view==='add'?add(c):detail(c,e);screen.innerHTML='<div class="screen-content">'+html+'</div>'+(['home','vehicles','vehicle','event'].includes(view)?tabBar(view):'');screen.scrollTop=0;screen.focus({preventScroll:true});const g=guidance[view];document.getElementById('guide-number').textContent=g[0];document.getElementById('guide-title').textContent=g[1];document.getElementById('guide-copy').textContent=g[2];document.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('active',el.dataset.step===guideStep[view]));document.title='AJOURA App — '+({welcome:'Tervetuloa',home:'Kojelauta',vehicles:'Omat ajoneuvot',newcar:'Uusi ajoneuvo',vehicle:c?.name,add:'Uusi tapahtuma',event:e?.type}[view]);notice='';}
  function saveEvent(form){
    if(!form.reportValidity())return;const c=cars.find(c=>c.id===route().id);if(!c)return;
    const data=new FormData(form),km=Number(data.get('km')),when=String(data.get('date')),type=String(data.get('type')),cost=String(data.get('cost'));const error=document.getElementById('form-error'),submit=form.querySelector('[type=submit]');
    if(!kinds.includes(type)||!Number.isSafeInteger(km)||km<0||km>2000000||!/^\d{4}-\d{2}-\d{2}$/.test(when)||when>today()||when<(c.year-1)+'-01-01'||(cost!==''&&(!Number.isFinite(Number(cost))||Number(cost)<0))){error.textContent='Tarkista päivämäärä ja mittarilukema.';return;}
    // Odometer readings should grow with time. A conflict is a warning the user can override, not a hard block.
    const conflict=c.events.find(e=>(e.date<when&&e.km>km)||(e.date>when&&e.km<km)),signature=when+'|'+km;
    if(conflict&&form.dataset.confirmed!==signature){form.dataset.confirmed=signature;error.textContent=`Lukema ${number(km)} km ei sovi yhteen tapahtuman ”${conflict.type}” (${date(conflict.date)}, ${number(conflict.km)} km) kanssa. Tarkista lukema tai tallenna silti.`;submit.textContent='Tallenna silti';return;}
    c.events.push({id:'new'+(++sequence),type,date:when,km,cost,note:String(data.get('note')).trim().slice(0,300)});c.km=Math.max(c.km,km);notice='✓ Tapahtuma lisätty demoon.';document.getElementById('demo-announcement').textContent=type+' lisätty ajoneuvolle '+c.name;go('vehicle/'+c.id);
  }
  function startLookup(raw){
    const plate=normalPlate(raw);
    if(!/^[A-ZÅÄÖ0-9-]{2,10}$/.test(plate)){lookup={plate:String(raw).trim(),error:'Tarkista rekisteritunnus, esim. ABC-123.'};render();document.getElementById('plate-input')?.focus();return;}
    const token={plate,pending:true};lookup=token;render();
    // A short pause stands in for a network lookup; the result comes from the fictional registry above.
    setTimeout(()=>{if(lookup!==token||route().view!=='newcar')return;const found=registry[plate];draft=found?{...found,plate,source:'lookup'}:{plate,name:'',year:'',body:'sedan',fuel:'',color:'#b9c1ca',source:'manual',missed:true};lookup=null;document.getElementById('demo-announcement').textContent=found?'Ajoneuvo tunnistettu: '+found.name:'Esimerkkiautoa ei löytynyt. Syötä tiedot itse.';render();},700);
  }
  function syncDraft(form){
    const data=new FormData(form),body=String(data.get('body')),color=String(data.get('color'));
    Object.assign(draft,{plate:String(data.get('plate')),name:String(data.get('name')),year:String(data.get('year')),fuel:String(data.get('fuel'))});
    if(Car.bodies.includes(body))draft.body=body;if(Car.colors.some(([,v])=>v===color))draft.color=color;
    const preview=document.getElementById('car-preview');if(preview)preview.innerHTML=Car.render(draft.body,draft.color,'Esikatselu')+`<span>${Car.names[draft.body]} · ${colorName(draft.color)}</span>`;
  }
  function saveCar(form){
    const data=new FormData(form),name=String(data.get('name')).trim().replace(/\s+/g,' '),plate=normalPlate(String(data.get('plate')).trim()),year=Number(data.get('year')),km=Number(data.get('km')),max=new Date().getFullYear()+1;const error=document.getElementById('form-error');
    const body=String(data.get('body')),color=String(data.get('color')),fuel=String(data.get('fuel'));
    if(!/^[A-ZÅÄÖ0-9-]{2,10}$/.test(plate)){error.textContent='Tarkista rekisteritunnus, esim. ABC-123.';return;}
    if(name.length<2||name.length>40){error.textContent='Kirjoita auton merkki ja malli.';return;}
    if(!Number.isInteger(year)||year<1950||year>max){error.textContent=`Vuosimallin pitää olla väliltä 1950–${max}.`;return;}
    if(String(data.get('km')).trim()===''||!Number.isSafeInteger(km)||km<0||km>2000000){error.textContent='Tarkista mittarilukema.';return;}
    if(!Car.bodies.includes(body)||!Car.colors.some(([,v])=>v===color)||(fuel!==''&&!fuels.includes(fuel))){error.textContent='Valitse korityyppi ja väri.';return;}
    const id='new-car'+(++sequence);cars.push({id,name,plate,year,km,body,color,fuel,events:[]});notice='✓ Ajoneuvo lisätty demoon.';document.getElementById('demo-announcement').textContent=name+' lisätty ajoneuvoihin';go('vehicle/'+id);
  }

  screen.addEventListener('submit',event=>{const form=event.target;if(!['event-form','car-form','plate-form'].includes(form.id))return;event.preventDefault();if(form.id==='plate-form')startLookup(form.elements.plate.value);else form.id==='event-form'?saveEvent(form):saveCar(form);});
  screen.addEventListener('input',event=>{const carForm=event.target.closest('#car-form');if(carForm&&draft)syncDraft(carForm);const form=event.target.closest('#event-form');if(form&&form.dataset.confirmed){delete form.dataset.confirmed;form.querySelector('[type=submit]').textContent='Tallenna demoon';document.getElementById('form-error').textContent='';}});
  function reset(){cars=structuredClone(initial);sequence=0;notice='';draft=null;lookup=null;document.getElementById('demo-announcement').textContent='Demo palautettu lähtötilanteeseen.';go('welcome');}
  document.getElementById('reset-demo').addEventListener('click',reset);
  screen.addEventListener('click',event=>{const t=event.target;if(t.closest('[data-reset]'))reset();const chip=t.closest('[data-plate]');if(chip)startLookup(chip.dataset.plate);if(t.closest('[data-manual]')){draft={plate:'',name:'',year:'',body:'sedan',fuel:'',color:'#b9c1ca',source:'manual'};lookup=null;render();}if(t.closest('[data-restart]')){const plate=draft?.plate||'';draft=null;lookup={plate};render();}});
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();screen.focus();});
  window.addEventListener('hashchange',render);
  render();
})();
