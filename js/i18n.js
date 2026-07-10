/* Bilingue IT/EN.
   L'italiano è la fonte: resta nell'HTML e viene catturato automaticamente.
   Qui vive solo la traduzione inglese, indicizzata dalle chiavi data-i18n.
   Deve girare PRIMA di site.js (che poi divide i titoli in lettere). */
(function () {
  var EN = {
    /* ---- navigazione / comuni ---- */
    'nav.home': 'Home',
    'nav.servizi': 'Services',
    'nav.impianti': 'Media &amp; Coverage',
    'nav.chisiamo': 'About',
    'nav.contatti': 'Contact',
    'nav.cta': 'Request a quote',
    'a11y.menu': 'Open menu',
    'btn.pianifica': 'Plan your campaign',
    'btn.scopri': 'Explore services',
    'card.approfondisci': 'Learn more &rarr;',

    /* ---- footer (tutte le pagine) ---- */
    'footer.tagline': 'Media agency specialised in outdoor advertising and geolocated campaign planning.',
    'footer.h.sito': 'Site',
    'footer.h.servizi': 'Services',
    'footer.h.contatti': 'Contact',
    'footer.serv.affissioni': 'Classic billboards',
    'footer.serv.maxi': 'Large-format',
    'footer.serv.pian': 'Media planning',
    'footer.serv.stampa': 'Print &amp; logistics',
    'footer.tel': '[Phone to be added]',
    'footer.addr': '[Address to be added]<br>Naples, Italy',
    'footer.rights': '&copy; 2026 Diesse Media SRL — All rights reserved',
    'footer.piva': 'VAT [to be added]',

    /* ---- HOME: hero + giostra ---- */
    'home.hero.eyebrow': 'Media Agency &middot; Outdoor Communication',
    'home.hero.title': 'Your advertising, everywhere they <span class="accent">look</span>.',
    'home.hero.lead': '6x3 posters, large-format billboards and digital screens. Together we choose where and when to communicate, backed by data — in Campania and across Italy.',
    'ring.poster.t': 'Posters 6x3 &middot; 4x3 &middot; 3x2',
    'ring.poster.d': 'Covering high-traffic areas, across Italy',
    'ring.maxi.t': 'Large Formats',
    'ring.maxi.d': 'To truly get noticed, across Italy',
    'ring.pian.t': 'Targeted planning',
    'ring.pian.d': 'Isochrone calculation with travel times and ISTAT data',
    'ring.arredo.t': 'Street furniture',
    'ring.arredo.d': 'Bus-stop signs and banners to cover the city centre with precision',
    'ring.digital.t': 'EAV station circuits',
    'ring.digital.d': 'LED screens and various formats in EAV stations',
    'ring.cta.t': 'Already have a campaign in mind?',
    'ring.cta.d': 'A concrete proposal right away: a quote and an interactive dashboard with a first draft.',
    'ring.cta.btn': 'Get in touch &rarr;',

    /* ---- HOME: dashboard SVG ---- */
    'dash.title': 'DSM PLANNER',
    'dash.impianti': 'Sites',
    'dash.comuni': 'Towns',
    'dash.pop': 'Population',
    'dash.pop.val': '1.2M',
    'dash.iso': '15-min isochrone',
    'dash.cop': 'Coverage by town',

    /* ---- HOME: showreel ---- */
    'home.showreel.eyebrow': 'Showcase',
    'home.showreel.title': 'See our formats in action',
    'cap1.num': '01 — BILLBOARDS',
    'cap1.t': '6x3 posters on high-traffic roads',
    'cap2.num': '02 — LARGE FORMAT',
    'cap2.t': 'Large surfaces that dominate the city',
    'cap3.num': '03 — DIGITAL OOH',
    'cap3.t': 'Digital screens in stations and transit hubs',

    /* ---- HOME: cosa facciamo ---- */
    'home.cf.eyebrow': 'What we do',
    'home.cf.title': 'One partner, from strategy to the wall.',
    'home.cf.text': 'From choosing the sites to the proof-of-posting photo: we handle every stage with geolocated planning tools we built ourselves. You follow the results, we take care of the rest.',
    'home.card.affissioni.t': 'Billboards',
    'home.card.affissioni.d': '6x3, 4x3 and other formats in the highest-traffic positions, across Italy. The classic presence that will always work.',
    'home.card.maxi.t': 'Large-format billboards',
    'home.card.maxi.d': 'Large surfaces on building façades and prestige locations: maximum impact for product launches and brand campaigns.',
    'home.card.pian.t': 'Data-driven planning',
    'home.card.pian.d': 'We select sites on a map based on population and resident households, catchment areas and traffic flows. Every euro invested exactly where it counts.',

    /* ---- HOME: numeri ---- */
    'stat.impianti.n': '8,000+',
    'stat.impianti.l': 'Sites available to plan',
    'stat.comuni.n': '7,900',
    'stat.comuni.l': 'Towns mapped in Italy',
    'stat.anni.n': '20+',
    'stat.anni.l': 'Years of experience',
    'stat.verifica.n': '100%',
    'stat.verifica.l': 'Photo verification',

    /* ---- HOME: metodo ---- */
    'home.method.eyebrow': 'Our method',
    'home.method.title': "We don't sell space.<br><span class=\"accent\">We build campaigns.</span>",
    'home.method.text': 'Every campaign starts with a question: where is your audience? With our tools we analyse the territory and propose only the sites that deliver results. No random space.',
    'method.li1': 'Geographic analysis of target and points of sale',
    'method.li2': 'Site selection on an interactive map shared with the client',
    'method.li3': 'Print, distribution and posting management',
    'method.li4': 'Proof-of-posting photo report',
    'home.method.photo': '6x3 site photo in an urban setting<br>(assets/foto/home-metodo.jpg)',

    /* ---- HOME: banda CTA ---- */
    'home.ctaband.title': 'Got a campaign in mind?',
    'home.ctaband.text': "Tell us your goals and budget: we'll propose a tailored plan, with a site map and a detailed quote.",
    'home.ctaband.btn': 'Contact us now',

    /* ---- META ---- */
    'meta.home.title': 'Diesse Media — Outdoor Advertising Media Agency | Billboards Naples & Italy',
    'meta.home.desc': 'Diesse Media SRL is a media agency specialised in outdoor advertising: billboard planning, large-format sites and out-of-home campaigns in Campania and across Italy.',
    'meta.serv.title': 'Services — Diesse Media | Billboards, Large Format, OOH Planning',
    'meta.serv.desc': 'Diesse Media services: outdoor media planning, classic 6x3 and 4x3 billboards, large-format, street furniture, print & logistics, geolocated campaigns.',
    'meta.imp.title': 'Media & Coverage — Diesse Media | Formats & Territory',
    'meta.imp.desc': 'The Diesse Media inventory: 6x3, 4x3 formats, large-format and street furniture. Coverage in Campania and a national network across Italy.',
    'meta.about.title': 'About — Diesse Media | Outdoor Media Agency',
    'meta.about.desc': 'Diesse Media SRL: an independent media agency specialised in outdoor advertising. Experience, proprietary technology and a direct presence across Campania.',
    'meta.contact.title': 'Contact — Diesse Media | Request a Quote',
    'meta.contact.desc': 'Contact Diesse Media for a billboard or outdoor campaign quote: we reply with a tailored planning proposal.',

    /* ---- SERVIZI ---- */
    'serv.hero.eyebrow': 'Services',
    'serv.hero.title': 'From strategy to the site on the street',
    'serv.hero.sub': 'A complete service for planning and managing outdoor communication, with a single point of contact for the whole campaign.',
    'serv.card1.t': 'Classic billboards',
    'serv.card1.d': '6x3, 4x3, 100x140, 140x200 posters and special formats on selected sites. City and provincial circuits in positions with high vehicle and pedestrian traffic.',
    'serv.card2.t': 'Large-format billboards',
    'serv.card2.d': 'Large banners on façades, scaffolding and prestige locations. The maximum-impact solution for product launches, brand awareness and corporate campaigns.',
    'serv.card3.t': 'Geolocated planning',
    'serv.card3.d': 'Proprietary map-based planning tools: catchment-area analysis, travel-time isochrones and ISTAT population data to choose the right sites.',
    'serv.card4.t': 'Street furniture & bus-stop signs',
    'serv.card4.d': 'Advertising on shelters, bus-stop signs and barriers: fine-grained formats that follow people through their daily journeys across the city.',
    'serv.card5.t': 'Print & logistics',
    'serv.card5.d': 'We coordinate printing, material distribution and posting crews across the territory: delivery and campaign go-live on the agreed schedule.',
    'serv.card6.t': 'Verification & reporting',
    'serv.card6.d': 'A proof-of-posting photo report for every site: documented certainty that your campaign is on the street exactly as planned.',
    'serv.split.title': 'Planning you can see on the map',
    'serv.split.text': 'With our proprietary planner we share an interactive campaign map with the client: every proposed site is geolocated, with its format, photo and catchment area reached.',
    'serv.li1': 'Interactive map shareable via link',
    'serv.li2': 'Reached population calculated per town',
    'serv.li3': 'Travel-time isochrones from points of sale',
    'serv.li4': 'Formatted Excel export of the proposal',
    'serv.photo': 'Planner map screenshot<br>(assets/foto/servizi-pianificatore.jpg)',
    'serv.ctaband.title': "Let's talk about your next campaign",
    'serv.ctaband.text': "We'll get back to you with a concrete planning proposal: sites, map and quote.",

    /* ---- IMPIANTI ---- */
    'imp.hero.eyebrow': 'Media & Coverage',
    'imp.hero.title': 'The territory is our medium',
    'imp.hero.sub': 'Sites selected in the most visible positions across Campania, plus a partner network to plan nationwide.',
    'imp.formats.eyebrow': 'Formats',
    'imp.formats.title': 'Available formats',
    'imp.formats.sub': 'From large roadside posters to fine-grained street-furniture formats: each format serves a different communication goal.',
    'imp.th.formato': 'Format',
    'imp.th.dim': 'Dimensions',
    'imp.th.ideale': 'Ideal for',
    'imp.r1.f': '6x3 poster',
    'imp.r1.i': 'High-impact campaigns on main roads and ring roads',
    'imp.r2.f': '4x3 poster',
    'imp.r2.i': 'Urban visibility on through-roads',
    'imp.r3.i': 'Fine-grained coverage of neighbourhoods and old towns',
    'imp.r4.i': 'Proximity advertising and points of sale',
    'imp.r5.f': 'Large-format',
    'imp.r5.d': 'Custom',
    'imp.r5.i': 'Product launches and brand awareness in prestige locations',
    'imp.r6.f': 'Street furniture',
    'imp.r6.d': 'Various formats',
    'imp.r6.i': "Constant presence along people's daily routes",
    'imp.split.title': 'Coverage: from Campania to all of Italy',
    'imp.split.p1': 'The heart of our inventory is in Campania — Naples and its province, Caserta, Salerno, Avellino and Benevento — where we directly manage the best positions.',
    'imp.split.p2': 'For national campaigns we activate our network of partner agencies: a single plan, a single point of contact, coverage across more than 7,900 mapped Italian towns.',
    'imp.li1': 'Direct management of sites in Campania',
    'imp.li2': 'Partner network across the whole country',
    'imp.li3': 'A single multi-city plan with a shared map',
    'imp.li4': 'Photo verification on every site, everywhere',
    'imp.photo': 'Site coverage map<br>(assets/foto/impianti-copertura.jpg)',
    'imp.gallery.eyebrow': 'Gallery',
    'imp.gallery.title': 'Our sites',
    'imp.gallery.sub': 'Some of the positions managed by Diesse Media.',
    'imp.g1': 'Site photo 1<br>(assets/foto/impianto-1.jpg)',
    'imp.g2': 'Site photo 2<br>(assets/foto/impianto-2.jpg)',
    'imp.g3': 'Site photo 3<br>(assets/foto/impianto-3.jpg)',
    'imp.g4': 'Site photo 4<br>(assets/foto/impianto-4.jpg)',
    'imp.g5': 'Site photo 5<br>(assets/foto/impianto-5.jpg)',
    'imp.g6': 'Site photo 6<br>(assets/foto/impianto-6.jpg)',
    'imp.ctaband.title': 'Want to see the sites available in your area?',
    'imp.ctaband.text': "Send us your area of interest: we'll reply with the map of available sites and the rates.",
    'imp.ctaband.btn': 'Check availability',

    /* ---- CHI SIAMO ---- */
    'about.hero.eyebrow': 'About',
    'about.hero.title': 'Outdoor specialists, by choice',
    'about.hero.sub': 'Diesse Media is an independent media agency that does one thing, and does it well: outdoor communication.',
    'about.story.title': 'Our story',
    'about.story.p1': 'Diesse Media was born in Naples from years of experience in the billboard and outdoor advertising market. Over the years we have grown into a point of reference for companies, agencies and institutions that want to communicate across Campania and nationwide.',
    'about.story.p2': 'Alongside our first-hand knowledge of the territory — site by site, street by street — we have built in-house digital tools that make planning transparent and measurable.',
    'about.story.photo': 'Team / office photo<br>(assets/foto/chi-siamo.jpg)',
    'about.values.eyebrow': 'Our values',
    'about.values.title': 'Why choose Diesse Media',
    'about.val1.t': 'Transparency',
    'about.val1.d': 'Shared maps, detailed site-by-site quotes and photo reports: you always know where your investment goes.',
    'about.val2.t': 'Precision',
    'about.val2.d': 'We plan with real data: population, catchment areas and traffic flows. No gut-feeling choices.',
    'about.val3.t': 'Local presence',
    'about.val3.d': 'Our crews work directly in the field: we know every site because we drive past it every day.',
    'about.stat2.l': 'Campania provinces covered',
    'about.stat4.l': 'Campaigns verified',
    'about.ctaband.title': "Let's get to know each other",
    'about.ctaband.text': 'Tell us about your communication project: a couple of lines is enough to start.',
    'about.ctaband.btn': 'Write to us',

    /* ---- CONTATTI ---- */
    'contact.hero.eyebrow': 'Contact',
    'contact.hero.title': "Let's start planning",
    'contact.hero.sub': 'Fill in the form or write to us directly: we reply within one business day with a first proposal.',
    'contact.form.title': 'Request a quote',
    'contact.lbl.nome': 'Full name',
    'contact.lbl.azienda': 'Company',
    'contact.lbl.email': 'Email',
    'contact.lbl.telefono': 'Phone',
    'contact.lbl.servizio': 'Service of interest',
    'contact.opt1': 'Classic billboards',
    'contact.opt2': 'Large-format',
    'contact.opt3': 'Street furniture',
    'contact.opt4': 'Full campaign planning',
    'contact.opt5': 'Other',
    'contact.lbl.messaggio': 'Message',
    'contact.ph.messaggio': 'Area of interest, timing, campaign goals, indicative budget...',
    'contact.btn.invia': 'Send request',
    'contact.form.note': 'Submitting the form opens your email client with a pre-filled message to info@diessemedia.it.',
    'contact.info.email': 'Email',
    'contact.info.tel': 'Phone',
    'contact.info.sede': 'Office',
    'contact.info.orari': 'Hours',
    'contact.hours.val': 'Monday – Friday<br>9:00 – 13:00 / 14:30 – 18:00',
    'contact.photo': 'Office map / photo<br>(assets/foto/contatti-sede.jpg)'
  };

  var STORE = 'dsmLang';
  var ATTRS = ['placeholder', 'alt', 'content', 'aria-label', 'title'];
  var orig = new WeakMap();
  var captured = false;

  function setContent(el, val) {
    if (val == null) return;
    /* usa innerHTML se il valore contiene markup o entità HTML (&middot; &amp; ...) */
    if (val.indexOf('<') > -1 || val.indexOf('&') > -1) el.innerHTML = val;
    else el.textContent = val;
  }

  function capture() {
    var all = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < all.length; i++) {
      var el = all[i], rec = orig.get(el) || {};
      rec.html = el.innerHTML;
      orig.set(el, rec);
    }
    ATTRS.forEach(function (a) {
      var els = document.querySelectorAll('[data-i18n-' + a + ']');
      for (var j = 0; j < els.length; j++) {
        var el2 = els[j], rec2 = orig.get(el2) || {};
        rec2['attr_' + a] = el2.getAttribute(a);
        orig.set(el2, rec2);
      }
    });
    captured = true;
  }

  function apply(lang) {
    if (!captured) capture();
    var en = (lang === 'en');
    var all = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < all.length; i++) {
      var el = all[i], key = el.getAttribute('data-i18n');
      var v = en ? EN[key] : (orig.get(el) || {}).html;
      if (v != null) setContent(el, v);
    }
    ATTRS.forEach(function (a) {
      var els = document.querySelectorAll('[data-i18n-' + a + ']');
      for (var j = 0; j < els.length; j++) {
        var el2 = els[j], key2 = el2.getAttribute('data-i18n-' + a);
        var v2 = en ? EN[key2] : (orig.get(el2) || {})['attr_' + a];
        if (v2 != null) el2.setAttribute(a, v2);
      }
    });
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    var btns = document.querySelectorAll('[data-lang-btn]');
    for (var k = 0; k < btns.length; k++) {
      btns[k].classList.toggle('on', btns[k].getAttribute('data-lang-btn') === lang);
      btns[k].setAttribute('aria-pressed', btns[k].getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    }
    window.dispatchEvent(new CustomEvent('dsm:langchange', { detail: { lang: lang } }));
  }

  var initial = 'it';
  try { initial = localStorage.getItem(STORE) || 'it'; } catch (e) {}

  window.DSMi18n = { apply: apply, current: function () { return document.documentElement.getAttribute('lang'); } };

  capture();
  apply(initial);

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-lang-btn]') : null;
    if (b) { e.preventDefault(); apply(b.getAttribute('data-lang-btn')); }
  });
})();
