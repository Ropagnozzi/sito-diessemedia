/* ============================================================
   Galleria Maxi Formati — dati impianti + filtri + lightbox.
   I dati qui sotto sono SEGNAPOSTO realistici: sostituire con
   gli impianti reali (vedi maxi-impianti-TEMPLATE.csv).
   Foto: mettere i file in assets/foto/maxi/ e indicare il nome
   nel campo "photo". Se "photo" è vuoto, si mostra un segnaposto.
   ============================================================ */
(function () {
  'use strict';

  var IMPIANTI = [
    { code:'MX-NA-01', city:'Napoli',   pos:'Corso Meridionale',              type:'Facciata',   dim:'12 × 6 m',  sqm:72,  light:true,  flow:'Uscita Stazione Centrale — altissimo transito', photo:'' },
    { code:'MX-NA-02', city:'Napoli',   pos:'Via Marina',                     type:'Ponteggio',  dim:'20 × 10 m', sqm:200, light:true,  flow:'Traffico portuale e Tangenziale',              photo:'' },
    { code:'MX-NA-03', city:'Napoli',   pos:'Fuorigrotta — Piazzale Tecchio', type:'Muro cieco', dim:'8 × 6 m',   sqm:48,  light:false, flow:'Zona stadio e università',                     photo:'' },
    { code:'MX-NA-04', city:'Napoli',   pos:'Tangenziale — svincolo Vomero',  type:'Ponteggio',  dim:'18 × 9 m',  sqm:162, light:true,  flow:'~80.000 veicoli/giorno',                       photo:'' },
    { code:'MX-CE-01', city:'Caserta',  pos:'Viale Lincoln',                  type:'Facciata',   dim:'10 × 5 m',  sqm:50,  light:true,  flow:'Asse commerciale centrale',                    photo:'' },
    { code:'MX-CE-02', city:'Caserta',  pos:'SS Sannitica — Marcianise',      type:'Muro cieco', dim:'12 × 4 m',  sqm:48,  light:true,  flow:'Polo centri commerciali',                      photo:'' },
    { code:'MX-SA-01', city:'Salerno',  pos:'Lungomare Trieste',              type:'Copertura',  dim:'15 × 8 m',  sqm:120, light:true,  flow:'Passeggio e traffico turistico',               photo:'' },
    { code:'MX-AV-01', city:'Avellino', pos:'Via Circumvallazione',           type:'Facciata',   dim:'9 × 6 m',   sqm:54,  light:false, flow:'Ingresso città',                               photo:'' }
  ];

  var PHOTO_BASE = 'assets/foto/maxi/';

  var state = { city:'*', type:'*' };

  var gallery = document.getElementById('maxi-gallery');
  var countEl = document.getElementById('maxi-count');
  var cityBar = document.getElementById('filter-city');
  var typeBar = document.getElementById('filter-type');
  if (!gallery) return;

  function uniq(key) {
    var seen = [];
    IMPIANTI.forEach(function (i) { if (seen.indexOf(i[key]) === -1) seen.push(i[key]); });
    return seen;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  }); }

  /* ----- costruzione chip filtri ----- */
  function buildChips(bar, values, dim) {
    var html = '<button class="chip active" data-val="*">Tutte</button>';
    values.forEach(function (v) {
      html += '<button class="chip" data-val="' + esc(v) + '">' + esc(v) + '</button>';
    });
    bar.innerHTML = html;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      state[dim] = b.getAttribute('data-val');
      Array.prototype.forEach.call(bar.querySelectorAll('.chip'), function (c) { c.classList.remove('active'); });
      b.classList.add('active');
      render();
    });
  }

  /* ----- markup area immagine (foto reale o segnaposto) ----- */
  function imgMarkup(i, cls) {
    if (i.photo) {
      return '<div class="' + cls + '" style="background-image:url(\'' + PHOTO_BASE + esc(i.photo) + '\')"></div>';
    }
    return '<div class="' + cls + ' maxi-ph"><span>' + esc(i.dim) + '</span></div>';
  }

  function matches(i) {
    return (state.city === '*' || i.city === state.city) &&
           (state.type === '*' || i.type === state.type);
  }

  function render() {
    var list = IMPIANTI.filter(matches);
    countEl.innerHTML = '<b>' + list.length + '</b> impiant' + (list.length === 1 ? 'o' : 'i') + ' su ' + IMPIANTI.length;
    gallery.innerHTML = list.map(function (i, idx) {
      return '' +
        '<button class="maxi-card reveal" data-code="' + esc(i.code) + '" aria-label="Dettagli impianto ' + esc(i.city) + ' ' + esc(i.pos) + '">' +
          imgMarkup(i, 'maxi-card__img') +
          '<div class="maxi-card__grad"></div>' +
          '<div class="maxi-card__body">' +
            '<span class="maxi-chip-type">' + esc(i.type) + '</span>' +
            '<p class="maxi-card__city">' + esc(i.city) + '</p>' +
            '<p class="maxi-card__pos">' + esc(i.pos) + '</p>' +
            '<div class="maxi-card__meta">' +
              '<span><b>' + esc(i.dim) + '</b></span>' +
              '<span>' + (i.light ? 'Illuminato' : 'Non illuminato') + '</span>' +
            '</div>' +
          '</div>' +
        '</button>';
    }).join('');
    Array.prototype.forEach.call(gallery.querySelectorAll('.maxi-card'), function (c) {
      c.classList.add('is-visible');
      c.addEventListener('click', function () { openLightbox(c.getAttribute('data-code')); });
    });
  }

  /* ----- lightbox ----- */
  var lb = document.getElementById('maxi-lb');
  function openLightbox(code) {
    var i = IMPIANTI.filter(function (x) { return x.code === code; })[0];
    if (!i || !lb) return;
    lb.querySelector('#maxi-lb-img').outerHTML =
      i.photo
        ? '<div id="maxi-lb-img" class="maxi-lb__img" style="background-image:url(\'' + PHOTO_BASE + esc(i.photo) + '\')"></div>'
        : '<div id="maxi-lb-img" class="maxi-lb__img maxi-ph"><span>' + esc(i.dim) + '</span></div>';
    lb.querySelector('#maxi-lb-type').textContent = i.type;
    lb.querySelector('#maxi-lb-title').textContent = i.city;
    lb.querySelector('#maxi-lb-sub').textContent = i.pos;
    lb.querySelector('#maxi-lb-specs').innerHTML = '' +
      spec('Dimensioni', '<b>' + esc(i.dim) + '</b>') +
      spec('Superficie', '<b>' + i.sqm + ' m²</b>') +
      spec('Tipologia', esc(i.type)) +
      spec('Illuminazione', i.light ? 'Sì' : 'No') +
      spec('Visibilità', esc(i.flow)) +
      spec('Codice impianto', esc(i.code));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function spec(k, v) { return '<div class="s"><div class="k">' + k + '</div><div class="val">' + v + '</div></div>'; }
  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  if (lb) {
    lb.querySelector('.maxi-lb__bg').addEventListener('click', closeLightbox);
    lb.querySelector('.maxi-lb__close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ----- init ----- */
  buildChips(cityBar, uniq('city'), 'city');
  buildChips(typeBar, uniq('type'), 'type');
  render();
})();
