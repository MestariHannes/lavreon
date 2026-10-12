'use strict';
// AJOURA English layer. Non-invasive: the app keeps rendering Finnish, and this file translates the
// rendered DOM (text nodes + a few attributes) after the fact. Stored data stays Finnish.
// Language lives in localStorage 'ajoura-lang' ('fi' | 'en'); with 'fi' nothing is touched.
(() => {
  const KEY = 'ajoura-lang';
  let lang = 'fi';
  try { const v = localStorage.getItem(KEY); if (v === 'en' || v === 'fi') lang = v; } catch (e) {}

  // Exact matches, Finnish -> English (looked up on trimmed text).
  const D = {
    // Brand, shell, navigation
    'KONSEPTIDEMO': 'CONCEPT DEMO', 'Konseptidemo': 'Concept demo', 'Koti': 'Home', 'Ajoneuvot': 'Vehicles', 'Minä': 'Me',
    'Sovelluksen valikko': 'App menu', 'Huolehtii autostasi.': 'Takes care of your car.', 'huolehtii autostasi.': 'takes care of your car.',
    'AJOURA – huolehtii autostasi': 'AJOURA – takes care of your car', 'Avaa AJOURA-sovellus': 'Open the AJOURA app',
    'Napauta AJOURA-kuvaketta': 'Tap the AJOURA icon', 'Kalenteri': 'Calendar', 'Kuvat': 'Photos', 'Kartat': 'Maps', 'Sää': 'Weather',
    'Musiikki': 'Music', 'Kello': 'Clock', 'Asetukset': 'Settings', 'Puhelin': 'Phone', 'Viestit': 'Messages', 'Selain': 'Browser', 'Kamera': 'Camera',
    '← Takaisin': '← Back', 'Takaisin': 'Back', '← Tiedot': '← Details', '← Koti': '← Home', '← Ajoneuvot': '← Vehicles', '← Ajoneuvo': '← Vehicle',
    '← Merkintä': '← Entry', '← Huoltohistoria': '← Service history', 'Merkintä': 'Entry', 'Ajoneuvo': 'Vehicle',

    // Welcome
    'Autosi oma huoltokirja: huollot, katsastukset, kilometrit ja kulut. Pienetkin yksityiskohdat talteen.': 'Your car’s own service log: services, inspections, mileage and costs. Every little detail kept safe.',
    'Mitä sinua kutsutaan?': 'What should we call you?', '· valinnainen': '· optional', 'valinnainen': 'optional', 'Etunimi': 'First name', 'Aloita': 'Start',
    'Nimi näkyy vain sinulle tervehdyksessä.': 'Your name is only shown to you, in the greeting.',
    'Ilman kirjautumista tiedot tallentuvat vain tähän laitteeseen.': 'Without signing in, your data is stored on this device only.',
    'Demotilassa tiedot nollautuvat sivun päivityksessä.': 'In demo mode, data is reset when the page reloads.',
    'Kirjaudu sisään': 'Sign in', 'Jatka ilman kirjautumista': 'Continue without signing in', 'Toista AJOURA-esittelyvideo': 'Play the AJOURA intro video',
    'AJOURA-esittelyvideo': 'AJOURA intro video', 'Esittelyvideo': 'Intro video', 'Kirjautuminen on tulossa.': 'Sign-in is coming soon.',
    'Tili tallentaa autosi ja merkintäsi turvallisesti, ja ne siirtyvät mukanasi uuteen puhelimeen. Sitä ennen voit jatkaa ilman kirjautumista.': 'An account will store your cars and entries securely and move them with you to a new phone. Until then, you can continue without signing in.',
    'Ilman kirjautumista avautuu demotila: voit tutustua sovellukseen, mutta tiedot eivät tallennu.': 'Without signing in, you get demo mode: you can explore the app, but nothing is saved.',

    // Home / garage
    'Oma talli': 'My garage', 'Kojelauta': 'Dashboard', 'Tyhjä autopaikka': 'Empty parking space', 'Lisää ensimmäinen ajoneuvosi': 'Add your first vehicle',
    'Rekisteritunnuksella tai käsin. Valitset auton korimallin ja värin, ja päiväkirja on valmis.': 'By licence plate or by hand. Pick the body style and colour, and the logbook is ready.',
    '＋ Lisää ajoneuvo': '＋ Add vehicle', 'tai kokeile valmiilla esimerkkiautolla →': 'or try a ready-made example car →', '＋ Lisää': '＋ Add',
    'Ajoneuvoa': 'Vehicles', 'Merkintää': 'Entries', 'Kulut': 'Costs', 'Viimeisimmät tapahtumat': 'Latest events', 'Kaikki autot': 'All cars',
    'Ei vielä tapahtumia. Avaa auto talli-listasta ja lisää ensimmäinen merkintä.': 'No events yet. Open a car from your garage and add the first entry.',
    'HUOLTOMUISTUTUS': 'SERVICE REMINDER', 'Kirjaa viimeisin huolto': 'Log your latest service',
    'Kun lisäät huollon tai öljynvaihdon, AJOURA laskee seuraavan huollon ajankohdan.': 'When you add a service or oil change, AJOURA works out when the next service is due.',
    'Kilometriraja on jo ylittynyt.': 'The mileage limit has already been passed.',
    'Tervetuloa omaan talliin.': 'Welcome to your garage.', 'Omat ajoneuvot': 'My vehicles', 'Valitse auto ja jatka sen tarinaa.': 'Pick a car and continue its story.',

    // New car
    'Uusi ajoneuvo': 'New vehicle', 'Miten haluat lisätä autosi?': 'How would you like to add your car?', 'Rekisteritunnuksella': 'By licence plate',
    'AJOURA hakee merkin, mallin ja vuosimallin.': 'AJOURA looks up the make, model and model year.', 'Lisää manuaalisesti': 'Add manually',
    'Kirjoitat auton tiedot itse.': 'You enter the car’s details yourself.', 'Mallin valinnan jälkeen valitset vielä korimallin ja värin.': 'After choosing the model, you’ll pick the body style and colour.',
    'Rekisteritunnus': 'Licence plate', 'Syötä rekisteritunnus, niin AJOURA tunnistaa auton ja täyttää perustiedot.': 'Enter the licence plate and AJOURA will identify the car and fill in the basics.',
    'Haetaan ajoneuvoa…': 'Looking up vehicle…', 'Hae ajoneuvo': 'Look up vehicle', 'Kokeile esimerkkitunnuksia:': 'Try example plates:',
    'Syötä tiedot itse →': 'Enter details yourself →',
    'Simuloitu haku: demossa ei tehdä oikeaa rekisterihakua. Tunnistus perustuu kuvitteelliseen esimerkkiaineistoon.': 'Simulated lookup: the demo doesn’t query a real vehicle register. Results come from fictional sample data.',
    'Esikatselu': 'Preview', 'valitse väri': 'choose a colour', 'Valitse korimalli alta': 'Choose a body style below', 'Korimalli ja väri': 'Body style and colour',
    'Korimalli': 'Body style', 'Ulkoväri': 'Exterior colour', 'Tallenna ajoneuvo': 'Save vehicle',
    'Mallikuva on tyylitelty kuvitus, ei valokuva autostasi.': 'The car image is a stylised illustration, not a photo of your car.',
    'Tiedot tallentuvat vain tähän laitteeseen.': 'Your data is stored on this device only.',
    'Kokeilussa tiedot säilyvät vain tämän sivun muistissa.': 'In the demo, data is kept only in this page’s memory.',
    'Valitse malli': 'Choose model', 'Muu malli…': 'Other model…', 'Valitse versio (valinnainen)': 'Choose version (optional)', 'Merkki': 'Make',
    'Valitse merkki': 'Choose make', 'Suosituimmat': 'Most popular', 'Kaikki merkit': 'All makes', 'Muu merkki…': 'Other make…', '· kirjoita': '· type it',
    'Esim. Lada': 'E.g. Lada', 'Malli': 'Model', 'Esim. Niva': 'E.g. Niva', 'Versio / moottori': 'Version / engine', 'Ajoneuvon tiedot': 'Vehicle details',
    'Valitse ensin merkki ja malli. Seuraavaksi näet sen korimallit.': 'Choose the make and model first. Next you’ll see its body styles.',
    'Merkki ja malli': 'Make and model', 'Esim. Skoda Octavia': 'E.g. Skoda Octavia', 'Lempinimi': 'Nickname', 'Esim. Perheauto': 'E.g. Family car',
    'Vuosimalli': 'Model year', 'Mittarilukema (km)': 'Odometer (km)', 'Käyttövoima': 'Fuel', 'Valitse': 'Choose',
    'Perustiedot tulevat simuloidusta esimerkkirekisteristä. Mittarilukeman syötät itse.': 'The basics come from a simulated sample register. You enter the odometer reading yourself.',
    'Lempinimi näkyy kojelaudalla auton nimenä.': 'The nickname is shown as the car’s name on the dashboard.', 'Jatka': 'Continue', 'Peruuta': 'Cancel',

    // Fuels
    'Bensiini': 'Petrol', 'Diesel': 'Diesel', 'Hybridi (bensiini/sähkö)': 'Hybrid (petrol/electric)', 'Lataushybridi': 'Plug-in hybrid', 'Sähkö': 'Electric',
    'Kaasu': 'Gas', 'Muu': 'Other',
    // Body styles (car-render.js)
    'Sedan': 'Sedan', 'Viistoperä': 'Hatchback', 'Farmari': 'Estate', 'Maastoauto / SUV': 'SUV', 'Coupé': 'Coupé', 'Tila-auto': 'MPV', 'Avolava': 'Pickup',
    'Tyylitelty automalli': 'Stylised car model',
    // Colours (car-render.js)
    'Valkoinen': 'White', 'Hopea': 'Silver', 'Harmaa': 'Grey', 'Musta': 'Black', 'Sininen': 'Blue', 'Punainen': 'Red', 'Vihreä': 'Green', 'Beige': 'Beige',
    'Oma väri': 'Custom colour',

    // Event types
    'Huolto': 'Service', 'Määräaikaishuolto': 'Scheduled service', 'Vuosihuolto': 'Annual service', 'Moottoriöljyn vaihto': 'Oil change',
    'Jarruhuolto': 'Brake service', 'Ilmansuodattimen vaihto': 'Air filter change', 'Renkaiden vaihto': 'Tyre change', 'Pyyhkijänsulkien vaihto': 'Wiper blade change',
    'Akun vaihto': 'Battery replacement', 'Polttimon vaihto': 'Bulb replacement', 'Katsastus': 'Inspection', 'Korjaus': 'Repair', 'Osan vaihto': 'Part replacement',
    'Pesu ja vahaus': 'Wash and wax', 'Mittarilukeman päivitys': 'Odometer update', 'Muu tapahtuma': 'Other event',
    // Checklist items
    'Moottoriöljy': 'Engine oil', 'Öljynsuodatin': 'Oil filter', 'Ilmansuodatin': 'Air filter', 'Raitisilmasuodatin': 'Cabin air filter',
    'Polttoainesuodatin': 'Fuel filter', 'Sytytystulpat': 'Spark plugs', 'Jarruneste': 'Brake fluid', 'Jäähdytysneste': 'Coolant', 'Vaihteistoöljy': 'Gearbox oil',
    'Jakohihna / -ketju': 'Timing belt / chain', 'Apulaitehihna': 'Auxiliary belt', 'Jarrupalat': 'Brake pads', 'Jarrulevyt': 'Brake discs',
    'Akku tarkistettu': 'Battery checked', 'Valot tarkistettu': 'Lights checked', 'Pyyhkijät': 'Wipers', 'Rengaspaineet': 'Tyre pressures',
    'Huoltovälinäyttö nollattu': 'Service indicator reset',

    // Sample-car notes (fictional data shipped in app.js)
    'Öljy ja öljynsuodatin vaihdettu. Kuvitteellinen esimerkkimerkintä.': 'Oil and oil filter changed. Fictional example entry.',
    'Moottorin ilmansuodatin vaihdettu.': 'Engine air filter replaced.', 'Kesärenkaat vaihdettu alle.': 'Summer tyres fitted.',
    'Määräaikaiskatsastus hyväksytty. Ei korjauskehotuksia. Kuvitteellinen merkintä.': 'Periodic inspection passed. No repair remarks. Fictional entry.',
    'Etujarrulevyt ja -palat vaihdettu. Jarrujen toiminta tarkistettu koeajolla. Kuvitteellinen työ ja hinta.': 'Front brake discs and pads replaced. Brakes checked on a test drive. Fictional work and price.',
    'Öljyn ja öljynsuodattimen vaihto, raitisilmasuodattimen vaihto sekä nesteiden ja valojen tarkistus. Kuvitteellinen huoltokäynti, ei valmistajan huolto-ohjelma.': 'Oil and oil filter change, cabin air filter change, and fluid and light checks. Fictional service visit, not a manufacturer service schedule.',
    'Talvirenkaat asennettu. Rengaspaineet tarkistettu. Kuvitteellinen merkintä.': 'Winter tyres fitted. Tyre pressures checked. Fictional entry.',
    'Öljy ja öljynsuodatin vaihdettu. Alustan ja jarrujen silmämääräinen tarkistus. Kuvitteellinen huolto ja kustannus.': 'Oil and oil filter changed. Visual check of chassis and brakes. Fictional service and cost.',
    'Vuosihuolto. Kuvitteellinen esimerkkimerkintä.': 'Annual service. Fictional example entry.',

    // Vehicle page
    'Vaihda kuva': 'Change photo', '＋ Lisää oma kuva': '＋ Add your own photo', 'Poista kuva': 'Remove photo', 'Muokkaa tietoja': 'Edit details',
    'Mittarilukema': 'Odometer', 'Kirjatut kulut yhteensä': 'Total recorded costs', '＋ Lisää merkintä': '＋ Add entry', 'Lisää merkintä': 'Add entry',
    'Huoltohistoria': 'Service history', 'Raportti →': 'Report →', 'Yhteensä': 'Total',
    'Ei vielä tapahtumia. Lisää ensimmäinen merkintä yllä olevasta painikkeesta.': 'No events yet. Add the first entry with the button above.',
    'Esimerkkiauto: kuvitteellinen historia, rekisteritunnus ja hinnat.': 'Example car: fictional history, licence plate and prices.',
    'Kuva on omasi ja pysyy tässä laitteessa.': 'The photo is yours and stays on this device.',
    'Automalli on tyylitelty kuvitus valitsemastasi korimallista ja väristä. Voit vaihtaa tilalle oman kuvan.': 'The car image is a stylised illustration of your chosen body style and colour. You can replace it with your own photo.',
    'Poista ajoneuvo': 'Delete vehicle', 'Seuraavaksi': 'Coming up', 'Kirjaa viimeisin, niin AJOURA arvioi seuraavan.': 'Log the latest one and AJOURA will estimate the next.',
    'myöhässä': 'overdue', 'Arviot perustuvat omiin merkintöihisi ja Minä-välilehden huoltoväliin.': 'Estimates are based on your own entries and the service interval on the Me tab.',

    // Report
    'Km nyt': 'Km now', 'Aikaväli': 'Period', 'Ajoa keskimäärin': 'Average driving', 'Kuitteja tallessa': 'Receipts saved', 'Yhteenveto': 'Summary',
    'Tyyppi': 'Type', 'Kpl': 'Qty', 'Kaikki merkinnät': 'All entries', 'Pvm': 'Date', 'Tapahtuma': 'Event', 'Ei vielä merkintöjä.': 'No entries yet.',
    'Käytetyt varaosat': 'Parts used', 'Osa': 'Part', 'Määrä': 'Qty', 'Tulosta / tallenna PDF': 'Print / save as PDF',
    'Hyödyllinen esimerkiksi autoa myydessä.': 'Handy when selling the car, for example.', 'HUOLTOHISTORIARAPORTTI': 'SERVICE HISTORY REPORT', 'Raportti': 'Report',

    // Car edit
    'Muokkaa ajoneuvoa': 'Edit vehicle', 'Väri': 'Colour', 'Tallenna muutokset': 'Save changes',

    // Entry form
    'Kuitit': 'Receipts', '＋ Lisää kuvia': '＋ Add photos', 'Esim. vaihdetut osat tai työn jälki.': 'E.g. replaced parts or the finished work.',
    '＋ Lisää kuitti': '＋ Add receipt', 'Ota kuva kuitista tai valitse se kuvista.': 'Take a photo of the receipt or pick it from your photos.',
    'Kuitti': 'Receipt', 'Kuva': 'Photo', 'Sulje': 'Close', 'Osa, merkki tai tuotenumero': 'Part, brand or part number', 'esim. 4 l': 'e.g. 4 l',
    'Hinta euroina': 'Price in euros', 'Kulut eriteltyinä': 'Itemised costs', '· varaosat, työ, muut': '· parts, labour, other', 'Varaosa': 'Part',
    '＋ Lisää rivi': '＋ Add row', 'Työ (€)': 'Labour (€)', 'Muut (€)': 'Other (€)', 'Yhteensä lasketaan kustannukseen automaattisesti.': 'The total is added to the cost automatically.',
    'Muokkaa merkintää': 'Edit entry', 'Uusi merkintä': 'New entry', 'Tarkenna tietoja, lisää kuitit ja kuvat.': 'Refine the details, add receipts and photos.',
    'Pakollisia ovat vain tyyppi ja päivämäärä. Loput voit lisätä myöhemmin.': 'Only the type and date are required. You can add the rest later.',
    'Valitse tapahtuman tyyppi': 'Choose event type', 'Päivämäärä': 'Date', 'Kustannus (€)': 'Cost (€)', 'Tehdyt toimenpiteet': 'Work done',
    'Muistiinpano': 'Note', 'Esim. öljy ja suodatin vaihdettu itse': 'E.g. changed oil and filter myself', 'Tallenna': 'Save', 'Tallenna silti': 'Save anyway',
    'Poista merkintä': 'Delete entry',

    // Entry detail
    'PÄIVÄMÄÄRÄ': 'DATE', 'MITTARILUKEMA': 'ODOMETER', 'Ei merkitty': 'Not recorded', 'KUSTANNUS': 'COST', 'MUISTIINPANO': 'NOTE', 'Ei muistiinpanoa.': 'No note.',
    'KULUT ERITELTYINÄ': 'ITEMISED COSTS', 'Työ': 'Labour', 'Muut': 'Other', 'TEHDYT TOIMENPITEET': 'WORK DONE', 'Takaisin ajoneuvoon': 'Back to vehicle',
    'Kuvitteellinen esimerkkimerkintä.': 'Fictional example entry.',

    // Settings
    'Omat asetukset': 'My settings', 'Nimesi': 'Your name', 'Huoltomuistutuksen väli': 'Service reminder interval', 'Kuukautta': 'Months', 'Kilometriä': 'Kilometres',
    'Tarkista oikea väli autosi huolto-ohjelmasta. Muistutus tulee sen mukaan, kumpi täyttyy ensin.': 'Check the correct interval in your car’s service schedule. The reminder follows whichever comes first.',
    'Tallenna asetukset': 'Save settings', 'Tietosi': 'Your data',
    'Autot, merkinnät ja nimesi tallentuvat vain tähän laitteeseen. Mitään ei lähetetä palvelimelle.': 'Your cars, entries and name are stored on this device only. Nothing is sent to a server.',
    'Autot, merkinnät ja nimesi tallentuvat vain tähän laitteeseen. Mitään ei lähetetä palvelimelle. Asenna AJOURA puhelimen kotivalikkoon: selain voi muuten poistaa tiedot, jos sivulla ei käydä pitkään aikaan. Ota myös varmuuskopio.': 'Your cars, entries and name are stored on this device only. Nothing is sent to a server. Add AJOURA to your home screen: otherwise the browser may delete the data if the page isn’t visited for a long time. Make a backup too.',
    'Kokeilussa tiedot ovat vain tämän sivun muistissa ja nollautuvat päivityksessä. Asennettu sovellus muistaa ne puhelimessasi.': 'In the demo, data lives only in this page’s memory and is reset on reload. The installed app remembers it on your phone.',
    'Poista kaikki tiedot': 'Delete all data',

    // Validation errors and notices
    'Syötä nykyinen mittarilukema.': 'Enter the current odometer reading.', 'Simuloitu haku: toimii vain kuvitteellisilla esimerkkitunnuksilla.': 'Simulated lookup: works only with fictional sample plates.',
    'Tarkista rekisteritunnus.': 'Check the licence plate.', 'Kirjoita merkki ja malli.': 'Enter the make and model.', 'Tarkista mittarilukema.': 'Check the odometer reading.',
    'Tarkista valinnat.': 'Check your selections.', '✓ Tiedot päivitetty.': '✓ Details updated.',
    'Osaa tiedostoista ei voitu avata. Valitse kuvatiedostoja.': 'Some files couldn’t be opened. Choose image files.', 'Enintään 12 kpl per tapahtuma.': 'Up to 12 per event.',
    '✓ Tallennettu.': '✓ Saved.', '✓ Lisätty. Demotilassa kuvat eivät tallennu.': '✓ Added. Photos aren’t saved in demo mode.',
    'Ei tallennettu: laitteen tila ei riitä.': 'Not saved: not enough storage on this device.', 'Poistettu.': 'Removed.',
    'Yhteensä lasketaan kustannukseen automaattisesti': 'The total is added to the cost automatically',
    'Tarkista tyyppi, päivämäärä ja mittarilukema.': 'Check the type, date and odometer reading.', 'Tarkista hinnat.': 'Check the prices.',
    'Tallennus ei onnistunut: laitteen tila ei riitä. Poista osa kuvista ja yritä uudelleen.': 'Couldn’t save: not enough storage on this device. Remove some photos and try again.',
    '✓ Muutokset tallennettu.': '✓ Changes saved.', '✓ Merkintä tallennettu.': '✓ Entry saved.', 'Poistetaanko merkintä kuvineen ja kuitteineen?': 'Delete this entry with its photos and receipts?',
    'Merkintä poistettu.': 'Entry deleted.', 'Tarkista rekisteritunnus, esim. ABC-123.': 'Check the licence plate, e.g. ABC-123.',
    'Esimerkkiautoa ei löytynyt. Syötä tiedot itse.': 'No example car found. Enter the details yourself.', 'Valitse auton korimalli.': 'Choose the body style.',
    'Valitse auton väri.': 'Choose the colour.', 'Kirjoita auton merkki ja malli.': 'Enter the car’s make and model.', 'Valitse auton merkki.': 'Choose the make.',
    'Valitse tai kirjoita auton malli.': 'Choose or type the model.', 'Valitse käyttövoima listasta.': 'Choose a fuel from the list.',
    'Kuukausia voi olla 1–36.': 'Months must be 1–36.', 'Kilometrejä voi olla 1 000–60 000.': 'Kilometres must be 1,000–60,000.', '✓ Asetukset tallennettu.': '✓ Settings saved.',
    'Ajoneuvo poistettu.': 'Vehicle deleted.', '✓ Esimerkkiauto lisätty.': '✓ Example car added.', 'Kuva poistettu. Näytetään tyylitelty malli.': 'Photo removed. Showing the stylised model.',
    'Valitse kuvatiedosto.': 'Choose an image file.', '✓ Kuva tallennettu.': '✓ Photo saved.', 'Kuvaa ei voitu tallentaa: laitteen tila ei riitä.': 'Couldn’t save the photo: not enough storage on this device.',
    '✓ Kuva lisätty. Demotilassa kuva ei tallennu.': '✓ Photo added. It isn’t saved in demo mode.', 'Kuvaa ei voitu avata.': 'Couldn’t open the photo.',
    'Poistetaanko kaikki autot, merkinnät ja nimesi?': 'Delete all cars, entries and your name?', 'Kaikki tiedot poistettu.': 'All data deleted.',
    'Linkki kopioitu': 'Link copied', 'Kopioi linkki:': 'Copy link:',


    // Help tab, language/theme switches, video controls
    'Apu': 'Help', 'Apua käyttöön': 'Help', 'Apua käyttöön.': 'Help at hand.', 'Yleisimmät kysymykset ja vastaukset.': 'Common questions and answers.',
    'Yleisimmät kysymykset valmiine vastauksineen. Hakukenttä löytää vastauksen nopeasti.': 'Common questions with ready answers. The search field finds an answer fast.',
    'Hae ohjeista': 'Search help', 'Hae, esim. kuitti tai raportti': 'Search, e.g. receipt or report', 'Ei osumia. Kokeile toista sanaa tai kysy meiltä.': 'No matches. Try another word or ask us.',
    'Etkö löytänyt vastausta?': 'Didn’t find an answer?', 'Kysy meiltä suoraan. Vastaamme arkisin.': 'Ask us directly. We reply on weekdays.',
    'Lähetä kysymys · tulossa': 'Send a question · coming soon', 'Yhteydenottolomake avataan ennen julkaisua.': 'The contact form opens before launch.',
    'Miten lisään auton?': 'How do I add a car?',
    'Ajoneuvot → ＋ Lisää. Valitse ensin merkki ja malli (tai hae rekisteritunnuksella), sitten korimalli ja väri. Mittarilukeman voit päivittää myöhemmin.': 'Vehicles → ＋ Add. Choose the make and model first (or look it up by licence plate), then the body style and colour. You can update the odometer reading later.',
    'Miten kirjaan huollon tai korjauksen?': 'How do I log a service or repair?',
    'Avaa auto ja paina ＋ Lisää merkintä. Pakollisia ovat vain tyyppi ja päivämäärä. Kilometrit, kulut, tehdyt toimenpiteet, kuvat ja kuitit voit lisätä heti tai myöhemmin.': 'Open the car and tap ＋ Add entry. Only the type and date are required. Mileage, costs, work done, photos and receipts can be added now or later.',
    'Miten lisään kuitin tai kuvan?': 'How do I add a receipt or photo?',
    'Merkinnässä on erikseen Lisää kuvia ja Lisää kuitit. Voit ottaa kuvan kameralla tai valita sen kuvista. Kuvat pienennetään automaattisesti, jotta ne mahtuvat puhelimeen.': 'Each entry has separate Add photos and Add receipt buttons. Take a picture with the camera or pick one from your photos. Images are shrunk automatically so they fit on your phone.',
    'Kuva ei lataudu. Mitä teen?': 'A photo won’t load. What should I do?',
    'Kokeile toista kuvaa tai ota kuvasta kuvakaappaus ja lisää se. Jotkin kuvamuodot (esim. osa HEIC-kuvista) eivät aukea kaikissa selaimissa.': 'Try another photo, or take a screenshot of it and add that. Some image formats (e.g. some HEIC photos) don’t open in every browser.',
    'Miten muokkaan tai poistan merkinnän?': 'How do I edit or delete an entry?',
    'Avaa merkintä aikajanalta ja paina Muokkaa merkintää. Poisto löytyy muokkausnäkymän alareunasta.': 'Open the entry from the timeline and tap Edit entry. Delete is at the bottom of the edit view.',
    'Miten saan huoltohistorian auton myyntiä varten?': 'How do I get the service history for selling the car?',
    'Avaa auto ja valitse Raportti. Raportin voi tulostaa tai tallentaa PDF-tiedostoksi tulostusvalikosta.': 'Open the car and choose Report. You can print the report or save it as a PDF from the print menu.',
    'Seuraavan huollon arvio on väärin.': 'The next service estimate is wrong.',
    'Huoltoväli on oletuksena 12 kuukautta. Vaihda se kohdasta Minä → Huoltomuistutuksen väli. Arvio lasketaan viimeisimmästä huoltomerkinnästä.': 'The service interval defaults to 12 months. Change it under Me → Service reminder interval. The estimate is based on your latest service entry.',
    'Rekisterihaku ei löytänyt autoani.': 'The plate lookup didn’t find my car.',
    'Rekisterihaku on vielä esimerkkiaineistoon perustuva demo. Valitse Syötä tiedot itse, niin pääset jatkamaan.': 'The plate lookup is still a demo based on sample data. Choose Enter details yourself to continue.',
    'Tallentuvatko tietoni?': 'Is my data saved?',
    'Tiedot tallentuvat vain tähän laitteeseen, myös selaimessa. Asenna sovellus kotivalikkoon ja ota välillä varmuuskopio, koska selain voi poistaa pitkään käyttämättömän sivun tiedot.': 'Data is stored on this device only, in the browser too. Add the app to your home screen and make a backup now and then, because a browser may delete data of a page that hasn’t been used for a long time.',
    'Asennetussa sovelluksessa tiedot tallentuvat vain tähän laitteeseen. Selaimen demotilassa tiedot nollautuvat, kun sivu päivitetään.': 'In the installed app, data is stored on this device only. In the browser demo, data is reset when the page reloads.',
    'Siirtyvätkö tiedot uuteen puhelimeen?': 'Will my data move to a new phone?',
    'Kyllä, varmuuskopiolla. Minä → Tallenna varmuuskopio tallentaa tiedot tiedostoon. Siirrä tiedosto uuteen puhelimeen ja valitse siellä Palauta varmuuskopio.': 'Yes, with a backup. Me → Save backup stores your data in a file. Move the file to the new phone and choose Restore backup there.',
    'Miten tankkauskirja toimii?': 'How does the fuel log work?', 'Avaa auto ja valitse Tankkauskirja. Kirjaa päivä, mittarilukema, litrat ja hinta. Kun tankkaat aina täyteen, AJOURA laskee keskikulutuksen ja ajon hinnan.': 'Open the car and choose Fuel log. Enter the date, odometer reading, litres and price. When you fill the tank up, AJOURA works out average consumption and the cost of driving.',
    'Miten asennan AJOURAn puhelimeen?': 'How do I install AJOURA on my phone?',
    'iPhone: avaa sivu Safarilla → Jaa → Lisää Koti-valikkoon. Android: avaa Chromella → valikko ⋮ → Asenna sovellus.': 'iPhone: open the page in Safari → Share → Add to Home Screen. Android: open it in Chrome → menu ⋮ → Install app.',
    'Sovellus näyttää vanhaa versiota.': 'The app shows an old version.',
    'Sulje sovellus kokonaan ja avaa se uudelleen. Uusi versio latautuu taustalla ja tulee käyttöön seuraavalla avauskerralla.': 'Close the app completely and open it again. The new version downloads in the background and is used the next time you open the app.',
    'Miten poistan kaikki tietoni?': 'How do I delete all my data?',
    'Minä → Poista kaikki tiedot. Poisto koskee vain tätä laitetta, eikä sitä voi perua.': 'Me → Delete all data. This only affects this device and can’t be undone.',
    'Kieli ja ulkoasu': 'Language and appearance', 'Kieli': 'Language', 'Teema': 'Theme', 'Vaalea': 'Light', '☀︎ Vaalea': '☀︎ Light', 'Tumma': 'Dark', '☾ Tumma': '☾ Dark',
    'Äänet päälle': 'Unmute', 'Mykistä': 'Mute', 'Koko näyttö': 'Full screen', 'Toista AJOURA-esittelyvideo uudelleen': 'Replay the AJOURA intro video',

    // Page titles
    'Aloitusnäyttö': 'Home screen', 'Tervetuloa': 'Welcome',

    // Demo guide (app.js guidance + app.html)
    'Avaa sovellus.': 'Open the app.', 'Napauta puhelimen aloitusnäytöllä AJOURA-kuvaketta. Puhelimen alareunan palkista pääset takaisin aloitusnäyttöön.': 'Tap the AJOURA icon on the phone’s home screen. The bar at the bottom of the phone takes you back to the home screen.',
    'Kerro nimesi.': 'Tell us your name.', 'AJOURA tervehtii sinua omalla nimelläsi. Nimen voi myös jättää tyhjäksi.': 'AJOURA greets you by name. You can also leave it blank.',
    'Oma kojelauta.': 'Your dashboard.', 'Kojelauta kokoaa autosi, kulut, viimeisimmät tapahtumat ja seuraavan huoltomuistutuksen. Minä-välilehdellä säädät muistutuksen välin.': 'The dashboard brings together your cars, costs, latest events and the next service reminder. Set the reminder interval on the Me tab.',
    'Lisää oma auto.': 'Add your car.', 'Talli on aluksi tyhjä. Lisää autosi rekisteritunnuksella tai käsin.': 'The garage starts empty. Add your car by licence plate or by hand.',
    'Valitse rekisteritunnus tai käsin syöttäminen. Ensin auton tiedot, sitten mallin korimalli ja väri. Kokeile esimerkkitunnusta LMN-456.': 'Choose licence plate or manual entry. First the car’s details, then the body style and colour. Try the example plate LMN-456.',
    'Auton päiväkirja.': 'The car’s logbook.', 'Tässä on autosi oma historia. Paina Lisää merkintä ja kirjaa vaikka viimeisin huolto.': 'This is your car’s own history. Tap Add entry and log, say, the latest service.',
    'Yksityiskohdat tallessa.': 'Details kept safe.', 'Päivämäärä, mittarilukema ja muistiinpanot yhdessä näkymässä. Palaa historiaan vasemman yläkulman nuolesta.': 'Date, odometer and notes in one view. Go back to the history with the arrow at the top left.',
    'Ensimmäinen merkintä.': 'Your first entry.', 'Valitse tapahtuma, päivämäärä ja mittarilukema. Tallennuksen jälkeen merkintä löytyy auton historiasta.': 'Choose the event, date and odometer reading. Once saved, the entry appears in the car’s history.',
    'Huoltohistoriaraportti.': 'Service history report.', 'Koko historia yhdellä sivulla. Tulosta tai tallenna PDF:ksi vaikka auton myyntiä varten.': 'The whole history on one page. Print it or save it as a PDF, for example when selling the car.',
    'Auton tiedot.': 'Car details.', 'Korjaa tunnus, malli, kilometrit, käyttövoima tai ulkonäkö.': 'Correct the plate, model, mileage, fuel or appearance.',
    'Tarkenna merkintää.': 'Refine the entry.', 'Lisää jälkikäteen kilometrit, kulut, tehdyt toimenpiteet, kuitit ja kuvat.': 'Add mileage, costs, work done, receipts and photos afterwards.',
    'Omat asetukset.': 'Your settings.', 'Nimesi ja huoltomuistutuksen väli. Täältä voit myös poistaa kaikki tiedot.': 'Your name and service reminder interval. You can also delete all data here.',
    'Avaa sovellus': 'Open the app', 'Kerro nimesi': 'Tell us your name', 'Lisää oma auto': 'Add your car', 'Avaa päiväkirja': 'Open the logbook',
    'Lisää tapahtuma': 'Add an event', 'Katso kojelauta': 'See the dashboard', '↻ Aloita demo alusta': '↻ Restart the demo', 'Tyhjentää tallin ja nimen.': 'Clears the garage and your name.',
    'Demon ohje': 'Demo guide',

    // app.html chrome (hidden in installed mode)
    'Siirry sovellusdemoon': 'Skip to the app demo', '← Takaisin AJOURAan': '← Back to AJOURA', 'Ajouran etusivu': 'AJOURA home page', 'INTERAKTIIVINEN DEMO': 'INTERACTIVE DEMO',
    'Asenna puhelimeen': 'Install on phone', 'AJOURA APP / KONSEPTI 01': 'AJOURA APP / CONCEPT 01', 'Autosi historia.': 'Your car’s history.', 'Omissa käsissäsi.': 'In your own hands.',
    'Tämä puhelin toimii.': 'This phone works.', 'Avaa AJOURA, kerro nimesi ja lisää oma autosi rekisteritunnuksella tai käsin. Valitse korimalli ja väri, ja aloita auton oma päiväkirja.': 'Open AJOURA, tell it your name and add your car by licence plate or by hand. Pick the body style and colour, and start the car’s own logbook.',
    'Talli on aluksi tyhjä. Rekisterihaku on simuloitu kuvitteellisilla esimerkkiautoilla. Tiedot säilyvät tällä laitteella; asennettuna ne ovat parhaassa turvassa.': 'The garage starts empty. The plate lookup is simulated with fictional sample cars. Data stays on this device; it is safest in the installed app.',
    'Turvallinen kokeilla.': 'Safe to try.', 'Talli on aluksi tyhjä. Rekisterihaku on simuloitu kuvitteellisilla esimerkkiautoilla. Kokeilussa tiedot säilyvät vain sivun ollessa auki; asennettu sovellus muistaa ne puhelimessasi.': 'The garage starts empty. The plate lookup is simulated with fictional example cars. In the demo, data is kept only while the page is open; the installed app remembers it on your phone.',
    'Ajouran puhelindemo': 'AJOURA phone demo', 'Siirry puhelimen aloitusnäyttöön': 'Go to the phone’s home screen', 'Ota JavaScript käyttöön': 'Turn on JavaScript',
    'Interaktiivinen demo tarvitsee JavaScriptin.': 'The interactive demo needs JavaScript.', 'Palaa Ajouran esittelyyn.': 'Back to the AJOURA overview.',
    'Konseptidemo · Sovellus kehitteillä': 'Concept demo · App in development', 'Asenna AJOURA puhelimeen': 'Install AJOURA on your phone',
    'Demon voi lisätä puhelimen kotinäytölle. Se aukeaa omalla kuvakkeellaan koko näytölle ja muistaa lisäämäsi autot ja merkinnät tässä laitteessa.': 'You can add the demo to your phone’s home screen. It opens full screen from its own icon and remembers the cars and entries you add on this device.',
    'Asenna nyt': 'Install now', 'iPhone ja iPad (Safari)': 'iPhone and iPad (Safari)', 'Avaa tämä sivu': 'Open this page in', 'Safarissa': 'Safari',
    '. Jos sivu aukesi toisen sovelluksen sisällä, kopioi linkki alta ja liitä se Safariin.': '. If it opened inside another app, copy the link below and paste it into Safari.',
    'Napauta': 'Tap', 'Jaa': 'Share', '-painiketta': 'button', '(neliö ja nuoli ylös)': '(square with an up arrow)', '. Uusimmassa iOS:ssä se löytyy ensin alareunan': '. In the latest iOS, it’s first in the bottom', '-valikosta.': 'menu.',
    'Vieritä alaspäin ja valitse': 'Scroll down and choose', 'Lisää Koti-valikkoon': 'Add to Home Screen', '. Pidä': '. Keep', 'Avaa verkkoappina': 'Open as Web App',
    'päällä, jos kohta näkyy, ja napauta': 'on if shown, and tap', 'Lisää': 'Add', 'Kopioi linkki': 'Copy link', 'Vaihtoehto iPhonelle: asennusprofiili': 'iPhone alternative: install profile',
    'Jos Jaa-valikon kautta ei onnistu, lataa pieni profiili. Se lisää kotinäytölle AJOURA-kuvakkeen, joka aukeaa koko näytölle. Profiili sisältää vain kuvakkeen ja osoitteen.': 'If the Share menu doesn’t work, download a small profile. It adds an AJOURA icon to your home screen that opens full screen. The profile contains only the icon and the address.',
    'Lataa asennusprofiili': 'Download install profile', 'Salli': 'Allow', 'ja sitten': 'and then', 'Avaa': 'Open', 'ja napauta': 'and tap', 'Profiili ladattu': 'Profile Downloaded',
    '. Jos sitä ei näy, avaa ladattu tiedosto Tiedostot-sovelluksesta.': '. If it isn’t there, open the downloaded file from the Files app.', 'Asenna': 'Install',
    'ja anna pääsykoodi. iPhone varoittaa, että profiilia ei ole allekirjoitettu; se on tavallista.': 'and enter your passcode. iPhone warns that the profile isn’t signed; that’s normal.',
    'Kuvakkeen poistaminen ei poista profiilia: poista se kohdasta Asetukset → Yleiset → VPN ja laitehallinta.': 'Removing the icon doesn’t remove the profile: delete it in Settings → General → VPN & Device Management.',
    'Android (Chrome)': 'Android (Chrome)', 'Avaa valikko': 'Open the menu', 'oikeasta yläkulmasta.': 'in the top right corner.', 'Valitse': 'Choose',
    'Asenna sovellus': 'Install app', 'tai': 'or', 'Lisää aloitusnäytölle': 'Add to Home screen', '.': '.',
    'Tietokoneella? Avaa puhelimella osoite': 'On a computer? On your phone, open',
    'Konseptidemo kuvitteellisilla tiedoilla. Tiedot pysyvät vain laitteessasi, eikä niitä lähetetä minnekään.': 'Concept demo with fictional data. Your data stays on your device and is never sent anywhere.',
    'AJOURA App — Kokeile sovellusdemoa': 'AJOURA App — Try the app demo'
  };

  const lower = s => s.charAt(0).toLowerCase() + s.slice(1);
  const LOW = {}; // lowercased Finnish event type -> lowercased English (used in "Edellinen: moottoriöljyn vaihto")
  for (const k of Object.keys(D)) LOW[k.toLowerCase()] = lower(D[k]);
  const bodyArticle = { 'sedan': 'a sedan', 'viistoperä': 'a hatchback', 'farmari': 'an estate', 'maastoauto / suv': 'an SUV', 'coupé': 'a coupé', 'tila-auto': 'an MPV', 'avolava': 'a pickup' };
  const N = '([\\d\\s\\u00a0\\u202f,.\\u2212-]+)'; // Finnish-formatted number
  const DATE = '(\\d{1,2}\\.\\d{1,2}\\.\\d{4})';
  const re = s => new RegExp('^' + s + '$');
  const days = { maanantai: 'Monday', tiistai: 'Tuesday', keskiviikko: 'Wednesday', torstai: 'Thursday', perjantai: 'Friday', lauantai: 'Saturday', sunnuntai: 'Sunday' };
  const months = { tammikuuta: 'January', helmikuuta: 'February', maaliskuuta: 'March', huhtikuuta: 'April', toukokuuta: 'May', kesäkuuta: 'June', heinäkuuta: 'July', elokuuta: 'August', syyskuuta: 'September', lokakuuta: 'October', marraskuuta: 'November', joulukuuta: 'December' };
  const greetings = { 'Hyvää yötä': 'Good evening', 'Hyvää huomenta': 'Good morning', 'Hyvää päivää': 'Good afternoon', 'Hyvää iltaa': 'Good evening' };
  const plural = (n, one, many) => (String(n).trim() === '1' ? one : many);
  const typeEn = s => D[s] || s; // event types may be custom text; keep as-is when unknown


  // Report analysis, ownership change, account
  Object.assign(D, {
    'Huoltohistoriaraportti': 'Service history report', 'Analyysi': 'Analysis', 'Öljynvaihtoa': 'Oil changes', 'Öljynvaihtojen väli': 'Oil change interval',
    'Huoltoa': 'Services', 'Kulut / vuosi': 'Costs / year', 'ei kirjattu': 'none logged', 'Seuraava öljynvaihto arviolta': 'Next oil change (estimate)',
    'Suurin yksittäinen kulu': 'Largest single cost', 'Viimeisin katsastus': 'Latest inspection', 'Omistajanvaihdoksia kirjattu': 'Ownership changes logged',
    'Kulut vuosittain': 'Costs by year', 'alle 2 kk': 'under 2 mo', 'Omistajanvaihdos': 'Change of ownership', 'Omistajanvaihdos.': 'Change of ownership.',
    'Kolme vaihetta, kun myyt tai luovutat auton.': 'Three steps when you sell or hand over the car.', 'Kirjaa vaihdos': 'Log the change',
    'Päivä ja mittarilukema jäävät auton historiaan.': 'The date and odometer reading stay in the car’s history.', 'Kirjaa omistajanvaihdos': 'Log change of ownership',
    'Anna historia uudelle omistajalle': 'Give the history to the new owner',
    'Tallenna raportti PDF-tiedostona ja lähetä se ostajalle. Kun ostaja ottaa AJOURAn käyttöön, historian voi siirtää suoraan (tulossa).': 'Save the report as a PDF and send it to the buyer. Once the buyer uses AJOURA, the history can be transferred directly (coming soon).',
    'Avaa raportti': 'Open report', 'Poista auto tallistasi': 'Remove the car from your garage', 'Valinnainen. Poista vasta, kun olet tallentanut raportin.': 'Optional. Remove it only after you have saved the report.',
    'Esim. myyty yksityiselle': 'E.g. sold privately', '✓ Omistajanvaihdos kirjattu historiaan.': '✓ Change of ownership logged.',
    'Kirjaa vaihdos historiaan, anna raportti ostajalle ja poista auto halutessasi.': 'Log the change, give the report to the buyer and remove the car if you like.',
    'Tili': 'Account', 'Kirjaudu sisään': 'Sign in', 'Kirjautumalla autosi ja merkintäsi tallentuvat turvallisesti ja siirtyvät mukanasi uuteen puhelimeen.': 'Signing in keeps your cars and entries safe and moves them to your next phone.',
    'Kirjautuminen on tulossa.': 'Sign-in is coming soon.', 'Sitä ennen tiedot pysyvät tässä laitteessa.': 'Until then your data stays on this device.',
    'Valitse vuosi': 'Select year', 'Tulosta / tallenna PDF': 'Print / save PDF', 'Valitse tulostusikkunassa kohde': 'In the print dialog choose',
    'Tallenna PDF-tiedostona': 'Save as PDF', ', niin saat raportin tiedostona esimerkiksi auton ostajalle.': ' to get the report as a file, for example for a buyer.',
    'Raportti perustuu omistajan omiin merkintöihin. Se ei korvaa valmistajan tai korjaamon virallista huoltokirjaa.': 'This report is based on the owner’s own entries. It does not replace the official service book of the manufacturer or a garage.',
    'Raportti perustuu omistajan omiin merkintöihin (esimerkkiauto, kuvitteelliset tiedot). Se ei korvaa valmistajan tai korjaamon virallista huoltokirjaa.': 'This report is based on the owner’s own entries (sample car, fictional data). It does not replace the official service book of the manufacturer or a garage.'
  });
  // Fuel log and first-run tutorial
  Object.assign(D, {
    'Hae merkki tai malli': 'Search make or model', 'Esim. Volvo tai Octavia': 'E.g. Volvo or Octavia', 'Hakutulokset': 'Search results', '· kaikki mallit': '· all models', 'Ei osumia. Valitse alta “Muu merkki…”.': 'No matches. Choose “Other make…” below.',
    'Muistiinpanot': 'Notes', 'Esim. renkaiden koot, hallipaikka, varaosanumerot…': 'E.g. tyre sizes, parking spot, part numbers…', 'Tallentuu automaattisesti tähän laitteeseen.': 'Saved automatically on this device.', 'Demossa muistiinpanot eivät tallennu.': 'Notes are not saved in the demo.',
    'Tankkauskirja': 'Fuel log', 'Latauskirja': 'Charging log', 'Tankkauskirja.': 'Fuel log.',
    'Kirjaa tankkaukset tai lataukset. AJOURA laskee keskikulutuksen täysien tankkausten väliltä ja kertoo, paljon ajaminen maksaa.': 'Log fill-ups or charges. AJOURA works out average consumption between full tanks and shows what driving costs.',
    'Kirjaa tankkaukset ja näe kulutus': 'Log fill-ups and see consumption', 'Keskikulutus': 'Average consumption', 'Viimeisin väli': 'Latest interval',
    'Ajon hinta': 'Cost of driving', 'Keskihinta': 'Average price', 'Uusi tankkaus': 'New fill-up', 'Uusi lataus': 'New charge', 'Litrat': 'Litres',
    'Ladattu (kWh)': 'Charged (kWh)', 'Summa (€)': 'Total (€)', 'Tankki täyteen': 'Full tank', 'Ladattu täyteen': 'Fully charged',
    'Tallenna tankkaus': 'Save fill-up', 'Tallenna lataus': 'Save charge', 'Tankkaukset': 'Fill-ups', 'Lataukset': 'Charges',
    'Kulutus lasketaan täysien tankkausten väliltä. Osatankkaus lisätään seuraavaan täyteen.': 'Consumption is measured between full tanks. A partial fill is added to the next full one.',
    'Kulutus lasketaan täysien latausten väliltä. Osatankkaus lisätään seuraavaan täyteen.': 'Consumption is measured between full charges. A partial charge is added to the next full one.',
    'Ei vielä kirjauksia. Lisää ensimmäinen tankkaus yllä.': 'No entries yet. Add your first fill-up above.', 'Ei vielä kirjauksia. Lisää ensimmäinen lataus yllä.': 'No entries yet. Add your first charge above.',
    'Esimerkkiauto: kuvitteelliset tankkaukset ja hinnat.': 'Sample car: fictional fill-ups and prices.', 'Poistetaanko tämä kirjaus?': 'Delete this entry?',
    '✓ Tankkaus tallennettu.': '✓ Fill-up saved.', '✓ Lataus tallennettu.': '✓ Charge saved.', 'Polttoainekulut': 'Fuel costs', 'Latauskulut': 'Charging costs',
    'Kirjoita tankatut litrat.': 'Enter the litres you filled.', 'Kirjoita ladattu määrä (kWh).': 'Enter the amount charged (kWh).', 'Tarkista hinta.': 'Check the price.',
    'Katso käyttöönoton opas': 'Watch the getting-started guide', 'Käyttöönoton opas': 'Getting-started guide',
    'Kaikki': 'All', 'Huollot': 'Services', 'Korjaukset': 'Repairs', 'Katsastukset': 'Inspections', 'Renkaat': 'Tyres', 'Suodata historiaa': 'Filter history',
    'Varmuuskopio': 'Backup', 'Tallenna varmuuskopio': 'Save backup', 'Palauta varmuuskopio': 'Restore backup',
    'Tallenna autot, merkinnät ja tankkaukset tiedostoon. Palauttamalla tiedoston saat ne takaisin, myös uudessa puhelimessa. Palautus yhdistää tiedot: sama auto päivittyy ja uudet lisätään.': 'Save your cars, entries and fill-ups to a file. Restore the file to get them back, on a new phone too. Restoring merges: the same car is updated and new ones are added.',
    '✓ Varmuuskopio tallennettu tiedostoon.': '✓ Backup saved to a file.', 'Ei vielä tallennettavaa.': 'Nothing to save yet.',
    'Tiedostoa ei voitu lukea. Valitse AJOURAn varmuuskopiotiedosto.': 'The file could not be read. Choose an AJOURA backup file.',
    'Huolto ja korjaus': 'Service and repair', 'Polttoaine': 'Fuel',
    'Lisää muistutukset kalenteriin': 'Add reminders to calendar', 'Lisää kalenteriin →': 'Add to calendar →',
    'Lähetä ostajalle siirtotiedosto. Ostaja avaa omassa AJOURAssaan Minä → Palauta varmuuskopio, ja koko historia kuitteineen siirtyy hänelle. Raportti PDF:nä sopii ostajalle, jolla ei ole AJOURAa.': 'Send the buyer a transfer file. The buyer opens Me → Restore backup in their own AJOURA, and the whole history, receipts included, moves to them. The PDF report suits a buyer who does not use AJOURA.',
    'Lähetä siirtotiedosto': 'Send transfer file', 'Suosittele AJOURAa': 'Recommend AJOURA', 'Jaa linkki kaverille. Sovellus asennetaan suoraan selaimesta.': 'Share the link with a friend. The app installs straight from the browser.',
    'Jaa linkki': 'Share link', '✓ Linkki kopioitu leikepöydälle.': '✓ Link copied to the clipboard.',
    'Miten saan huoltomuistutuksen puhelimeen?': 'How do I get service reminders on my phone?',
    'Avaa auto ja paina Lisää muistutukset kalenteriin. Seuraavan huollon ja katsastuksen arviot tallentuvat puhelimen kalenteriin, ja kalenteri muistuttaa viikkoa ennen.': 'Open the car and tap Add reminders to calendar. The estimated next service and inspection are saved to your phone’s calendar, which reminds you a week before.',
    'Miten siirrän auton historian ostajalle?': 'How do I hand the car’s history to the buyer?',
    'Avaa auto → Omistajanvaihdos → Lähetä siirtotiedosto. Ostaja valitsee omassa AJOURAssaan Minä → Palauta varmuuskopio, ja historia siirtyy hänelle.': 'Open the car → Change of ownership → Send transfer file. The buyer chooses Me → Restore backup in their own AJOURA, and the history moves to them.'
  });
  // Ordered patterns for dynamic strings. Each returns the English string.
  const P = [
    [re('Keskikulutus ' + N + ' (l|kWh)/100 km'), (m, v, u) => 'Average ' + v.replace(',', '.') + ' ' + u + '/100 km'],
    [re('(\\d+) kirjausta'), (m, n) => n + ' ' + plural(n, 'entry', 'entries')],
    [re(N + ' € · (\\d+) kirjausta'), (m, v, n) => v + ' € · ' + n + ' ' + plural(n, 'entry', 'entries')],
    [re(N + ' km · osatankkaus'), (m, k) => k + ' km · partial fill'],
    [re('Poista kirjaus ' + DATE), (m, d) => 'Delete entry ' + d],
    [re(DATE + ' · myöhässä'), (m, d) => d + ' · overdue'],
    [re(DATE + ' · tänään'), (m, d) => d + ' · today'],
    [re(DATE + ' · (\\d+) pv päästä'), (m, d, n) => d + ' · in ' + n + ' ' + plural(n, 'day', 'days')],
    [re('(Huolto|Katsastus) · (.+)'), (m, w, c) => (w === 'Huolto' ? 'Service' : 'Inspection') + ' · ' + c],
    [re('✓ Varmuuskopio palautettu: (\\d+) uutta, (\\d+) päivitetty\\.'), (m, a, u) => '✓ Backup restored: ' + a + ' new, ' + u + ' updated.'],
    [re('viimeksi ' + DATE), (m, d) => 'last ' + d],
    [re('noin ' + N + ' km'), (m, k) => 'about ' + k + ' km'],
    [re('(\\d+) katsastusta'), (m, n) => n + ' ' + plural(n, 'inspection', 'inspections')],
    [re('(\\d+) kk'), (m, n) => n + ' mo'],
    [re('Raportti (AJ-[\\w-]+)'), (m, id) => 'Report ' + id],
    [re('Tulostettu ' + DATE), (m, d) => 'Printed ' + d],
    [re('Y-tunnus (\\S+) \\(esimerkki\\)'), (m, id) => 'Business ID ' + id + ' (example)'],
    [re('(Hyvää yötä|Hyvää huomenta|Hyvää päivää|Hyvää iltaa)(?:, (.+))?\\.'), (m, g, n) => greetings[g] + (n ? ', ' + n : '') + '.'],
    [re('(.+), tervetuloa omaan talliin\\.'), (m, n) => 'Welcome to your garage, ' + n + '.'],
    [re('SEURAAVA HUOLTO · (.+)'), (m, c) => 'NEXT SERVICE · ' + c],
    [re('Viimeistään ' + DATE + '(?: tai ' + N + ' km)?'), (m, d, k) => 'Due by ' + d + (k ? ' or ' + k + ' km' : '')],
    [re('(?:Ajettavaa jäljellä noin ' + N + ' km\\.|(Kilometriraja on jo ylittynyt\\.))? ?Edellinen: (.+) ' + DATE + '\\.'),
      (m, k, over, t, d) => (k ? 'About ' + k + ' km to go. ' : over ? 'The mileage limit has already been passed. ' : '') + 'Last: ' + (LOW[t] || t) + ', ' + d + '.'],
    [re('Väli (\\d+) kk / ' + N + ' km on oma asetuksesi \\(Minä-välilehti\\), ei valmistajan suositus\\.'),
      (m, mo, k) => 'The ' + mo + '-month / ' + k + ' km interval is your own setting (Me tab), not a manufacturer recommendation.'],
    [re('Kulut (\\d{4})'), (m, y) => 'Costs ' + y],
    [re('(\\d+) tapahtumaa'), (m, n) => n + ' ' + plural(n, 'event', 'events')],
    [re('(\\d+) toimenpidettä'), (m, n) => n + ' ' + plural(n, 'task', 'tasks')],
    [re('(\\d+) kuvaa?'), (m, n) => n + ' ' + plural(n, 'photo', 'photos')],
    [re('(\\d+) kuittia?'), (m, n) => n + ' ' + plural(n, 'receipt', 'receipts')],
    [re('(\\d+) kpl'), (m, n) => n],
    [re('(\\d+) valittu'), (m, n) => n + ' selected'],
    [re('Vaihe (\\d+) / (\\d+)'), (m, a, b) => 'Step ' + a + ' / ' + b],
    [re('Avaa (kuitti|kuva) (\\d+)'), (m, k, n) => 'Open ' + (k === 'kuitti' ? 'receipt' : 'photo') + ' ' + n],
    [re('Poista (kuitti|kuva) (\\d+)'), (m, k, n) => 'Remove ' + (k === 'kuitti' ? 'receipt' : 'photo') + ' ' + n],
    [re('Avaa (.+)'), (m, c) => 'Open ' + c],
    [re('(.+): valitse, mikä näistä (\\d+) korimallista autosi on\\.'), (m, c, n) => c + ': choose which of these ' + n + ' body styles is yours.'],
    [re('(.+) on (sedan|viistoperä|farmari|maastoauto / suv|coupé|tila-auto|avolava)\\. Valitse vielä väri\\.'), (m, c, b) => c + ' is ' + bodyArticle[b] + '. Now choose a colour.'],
    [re('(.+): valitse lähin korimalli\\.'), (m, c) => c + ': choose the closest body style.'],
    [re('(.+), tyylitelty malli'), (m, c) => c + ', stylised model'],
    [re('(.+), oma kuva'), (m, c) => c + ', your photo'],
    [re('Muu (Audi|BMW|Mercedes-Benz)'), (m, b) => 'Other ' + b],
    [re('vm\\. (\\d{4})'), (m, y) => 'model year ' + y],
    [re('noin ' + N + ' km / vuosi'), (m, k) => 'about ' + k + ' km / year'],
    [re('Vuonna (\\d{4}): (.+)'), (m, y, v) => 'In ' + y + ': ' + v],
    [re('Arvio: ' + DATE + '(?: tai ' + N + ' km)?'), (m, d, k) => 'Estimate: ' + d + (k ? ' or ' + k + ' km' : '')],
    [re('Viimeisin kirjattu lukema: ' + N + ' km\\.'), (m, k) => 'Last recorded reading: ' + k + ' km.'],
    [re('Yhteensä (.+) € \\(päivitetty kustannukseen\\)\\.'), (m, v) => 'Total ' + v + ' € (copied to cost).'],
    [re('Lukema ' + N + ' km ei sovi yhteen tapahtuman ”(.+)” \\(' + DATE + ', ' + N + ' km\\) kanssa\\. Tarkista lukema tai tallenna silti\\.'),
      (m, k, t, d, k2) => 'The reading of ' + k + ' km doesn’t fit with “' + typeEn(t) + '” (' + d + ', ' + k2 + ' km). Check the reading or save anyway.'],
    [re('Vuosimallin pitää olla väliltä 1950–(\\d{4})\\.'), (m, y) => 'Model year must be between 1950 and ' + y + '.'],
    [re('✓ (.+) lisätty talliin\\.'), (m, c) => '✓ ' + c + ' added to your garage.'],
    [re('(.+) lisätty ajoneuvoihin'), (m, c) => c + ' added to vehicles'],
    [re('(.+) lisätty ajoneuvolle (.+)'), (m, t, c) => typeEn(t) + ' added to ' + c],
    [re('(.+) päivitetty'), (m, t) => typeEn(t) + ' updated'],
    [re('Ajoneuvo tunnistettu: (.+)'), (m, c) => 'Vehicle identified: ' + c],
    [re('✓ ([^:]+): (.+), (\\d{4})\\. Tarkista tiedot ja lisää mittarilukema\\.'), (m, p, c, y) => '✓ ' + p + ': ' + c + ', ' + y + '. Check the details and add the odometer reading.'],
    [re('Tunnuksella (.+) ei löytynyt esimerkkiautoa\\. Syötä tiedot itse\\.'), (m, p) => 'No example car found for ' + p + '. Enter the details yourself.'],
    [re('Poistetaanko (.+) ja sen koko historia\\?'), (m, c) => 'Delete ' + c + ' and its entire history?'],
    [re('Raportti perustuu omistajan omiin merkintöihin( \\(esimerkkiauto, kuvitteelliset tiedot\\))?\\. Se ei korvaa valmistajan tai korjaamon virallista huoltokirjaa\\. Tulostettu ' + DATE + '\\.'),
      (m, s, d) => 'This report is based on the owner’s own entries' + (s ? ' (example car, fictional data)' : '') + '. It does not replace an official service book from the manufacturer or a workshop. Printed ' + d + '.'],
    [re('Esimerkkiauto: kuvitteellinen historia, rekisteritunnus ja hinnat\\. (.+)'), (m, r) => 'Example car: fictional history, licence plate and prices. ' + (tr(r) || r)],
    [re('(maanantai|tiistai|keskiviikko|torstai|perjantai|lauantai|sunnuntai) (\\d{1,2})\\. (\\S+kuuta)'), (m, d, n, mo) => days[d] + ' ' + n + ' ' + (months[mo] || mo)],
    [re('AJOURA App — (.+)'), (m, v) => 'AJOURA App — ' + (tr(v) || v)]
  ];

  // Translate a trimmed string; returns null when nothing applies.
  function tr(s) {
    if (!s) return null;
    if (Object.prototype.hasOwnProperty.call(D, s)) return D[s];
    for (const [rx, fn] of P) { const m = rx.exec(s); if (m) return fn(...m); }
    // "A · B · C" and "· X": translate segments independently (car names, plates and dates pass through).
    if (s.includes('·')) {
      const parts = s.split(/(\s*·\s*)/); let hit = false;
      const out = parts.map((p, i) => { if (i % 2 || !p) return p; const t = tr(p.trim()); if (t !== null && t !== p.trim()) { hit = true; return t; } return p; });
      if (hit) return out.join('');
    }
    // "Moottoriöljy, Öljynsuodatin": comma lists of known items.
    if (s.includes(', ')) {
      const parts = s.split(', '); let hit = false;
      const out = parts.map(p => { const t = Object.prototype.hasOwnProperty.call(D, p) ? D[p] : null; if (t !== null) { hit = true; return t; } return p; });
      if (hit) return out.join(', ');
    }
    return null;
  }
  // Public t(): keeps surrounding whitespace, returns input unchanged when unknown or when lang is 'fi'.
  function t(str) {
    if (lang !== 'en' || typeof str !== 'string') return str;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(str), out = tr(m[2]);
    return out === null ? str : m[1] + out + m[3];
  }

  // Remember originals so we never re-translate our own output and can switch back to Finnish.
  const textOrig = new WeakMap(); // Text -> {fi, en}
  const attrOrig = new WeakMap(); // Element -> {attr: {fi, en}}
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt', 'label'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'style', 'script']);
  const tracked = new Set(); // WeakRefs of touched nodes, for restoring Finnish
  const track = n => { if (typeof WeakRef === 'function') tracked.add(new WeakRef(n)); };

  function doText(node) {
    const p = node.parentNode; if (!p || SKIP.has(p.nodeName)) return;
    const data = node.data, rec = textOrig.get(node);
    if (rec && data === rec.en) return; // already ours
    if (!data.trim()) return;
    const en = t(data); if (en === data) return;
    // An <option> without value submits its text: pin the Finnish value before translating.
    if (p.nodeName === 'OPTION' && !p.hasAttribute('value')) p.setAttribute('value', p.value);
    textOrig.set(node, { fi: data, en }); if (!rec) track(node);
    node.data = en;
  }
  function doAttrs(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      if (a === 'label' && el.nodeName !== 'OPTGROUP' && el.nodeName !== 'OPTION') continue;
      const v = el.getAttribute(a); if (!v) continue;
      let rec = attrOrig.get(el); if (rec && rec[a] && rec[a].en === v) continue;
      const en = t(v); if (en === v) continue;
      if (!rec) { rec = {}; attrOrig.set(el, rec); track(el); }
      rec[a] = { fi: v, en }; el.setAttribute(a, en);
    }
  }
  function apply(root) {
    if (lang !== 'en') return;
    root = root || document.documentElement;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIP.has(root.nodeName)) { if (root.nodeName === 'TEXTAREA') doAttrs(root); return; } doAttrs(root); }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: n => { if (n.nodeType === 1 && SKIP.has(n.nodeName)) { if (n.nodeName === 'TEXTAREA') doAttrs(n); return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; }
    });
    let n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  function restore() {
    for (const ref of tracked) {
      const n = ref.deref(); if (!n) { tracked.delete(ref); continue; }
      if (n.nodeType === 3) { const r = textOrig.get(n); if (r && n.data === r.en) n.data = r.fi; textOrig.delete(n); }
      else { const r = attrOrig.get(n); if (r) for (const a in r) if (n.getAttribute(a) === r[a].en) n.setAttribute(a, r[a].fi); attrOrig.delete(n); }
    }
    tracked.clear();
  }

  const observer = new MutationObserver(list => {
    if (lang !== 'en') return;
    for (const m of list) {
      if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') { if (m.target.nodeType === 1) doAttrs(m.target); }
      else for (const n of m.addedNodes) apply(n);
    }
  });
  const observe = () => observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  // Native dialogs used by the app (confirm before delete, prompt when copying a link).
  const nConfirm = window.confirm.bind(window), nPrompt = window.prompt.bind(window), nAlert = window.alert.bind(window);
  window.confirm = msg => nConfirm(t(String(msg)));
  window.prompt = (msg, def) => nPrompt(t(String(msg)), def);
  window.alert = msg => nAlert(t(String(msg)));

  function setLang(next) {
    next = next === 'en' ? 'en' : 'fi';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    if (next === lang) { if (lang === 'en') apply(); return; }
    lang = next; api.lang = lang;
    document.documentElement.lang = lang;
    if (lang === 'en') apply(); else restore();
    try { document.dispatchEvent(new CustomEvent('ajoura-lang', { detail: lang })); } catch (e) {}
  }

  const api = { lang, set: setLang, t, apply: root => apply(root) };
  window.AjouraI18n = api;
  observe();
  const start = () => { if (lang === 'en') { document.documentElement.lang = 'en'; apply(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
