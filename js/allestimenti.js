/* ============================================================
   Allestimenti — galleria realizzazioni filtrabile + lightbox.
   I dati qui sotto sono SEGNAPOSTO: sostituire con le realizzazioni
   reali. Foto: metterle in assets/foto/allestimenti/ e indicare il
   nome nel campo "photo" (se vuoto, si mostra un segnaposto).
   ============================================================ */
(function () {
  'use strict';

  var ITEMS = [
    { code:'AL-01', cat:'Wrapping', title:'Wrapping flotta aziendale',   place:'Napoli',            desc:'Rivestimento integrale di tre veicoli commerciali con grafica coordinata: il brand viaggia per la città ogni giorno.', photo:'' },
    { code:'AL-02', cat:'Vetrine',  title:'Vetrofania temporary store',  place:'Napoli',            desc:'Allestimento completo delle vetrine di un temporary store con pellicole su misura e lettering adesivo.',           photo:'' },
    { code:'AL-03', cat:'Stand',    title:'Stand espositivo fiera',      place:'Napoli',            desc:'Stand modulare 4×3 m con pareti brandizzate, totem e bancone reception per una fiera di settore.',                  photo:'' },
    { code:'AL-04', cat:'Eventi',   title:'Evento di lancio prodotto',   place:'Campania',          desc:'Backdrop, totem e segnaletica brandizzata per un evento di lancio: immagine coerente in ogni dettaglio.',           photo:'' },
    { code:'AL-05', cat:'Wrapping', title:'Car wrapping full color',     place:'Napoli',            desc:'Wrapping integrale di un\'auto con pellicola stampata: massima resa cromatica e finitura professionale.',           photo:'' },
    { code:'AL-06', cat:'Vetrine',  title:'Restyling vetrine negozio',   place:'Napoli',            desc:'Nuovo look per le vetrine di un punto vendita con vetrofanie su misura e cornici luminose.',                       photo:'' },
    { code:'AL-07', cat:'Stand',    title:'Corner promozionale',         place:'Centro commerciale',desc:'Isola promozionale con totem, espositori e grafica coordinata in galleria commerciale.',                           photo:'' },
    { code:'AL-08', cat:'Eventi',   title:'Allestimento congressuale',   place:'Napoli',            desc:'Segnaletica, roll-up e pannelli per un congresso: percorsi chiari e immagine coerente in tutti gli spazi.',        photo:'' }
  ];

  var PHOTO_BASE = 'assets/foto/allestimenti/';
  var state = { cat:'*' };

  var gallery = document.getElementById('al-gallery');
  var countEl = document.getElementById('al-count');
  var catBar  = document.getElementById('al-filter-cat');
  if (!gallery) return;

  function uniq(key) {
    var seen = [];
    ITEMS.forEach(function (i) { if (i[key] && seen.indexOf(i[key]) === -1) seen.push(i[key]); });
    return seen;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  }); }
  function matches(i) { return state.cat === '*' || i.cat === state.cat; }
  function byCode(code) { return ITEMS.filter(function (x) { return x.code === code; })[0]; }

  function buildChips(bar, values, dim) {
    if (!bar) return;
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
      apply();
    });
  }

  function imgMarkup(i, cls) {
    if (i.photo) return '<div class="' + cls + '" style="background-image:url(\'' + PHOTO_BASE + esc(i.photo) + '\')"></div>';
    return '<div class="' + cls + ' maxi-ph"><span>' + esc(i.cat) + '</span></div>';
  }

  function renderGallery(list) {
    gallery.innerHTML = list.map(function (i) {
      return '' +
        '<button class="maxi-card" data-code="' + esc(i.code) + '" aria-label="Dettagli ' + esc(i.title) + '">' +
          imgMarkup(i, 'maxi-card__img') +
          '<div class="maxi-card__grad"></div>' +
          '<div class="maxi-card__body">' +
            '<span class="maxi-chip-type">' + esc(i.cat) + '</span>' +
            '<p class="maxi-card__city">' + esc(i.title) + '</p>' +
            '<p class="maxi-card__pos">' + esc(i.place) + '</p>' +
          '</div>' +
        '</button>';
    }).join('');
    Array.prototype.forEach.call(gallery.querySelectorAll('.maxi-card'), function (c) {
      c.addEventListener('click', function () { openLightbox(c.getAttribute('data-code')); });
    });
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('al-lb');
  function openLightbox(code) {
    var i = byCode(code);
    if (!i || !lb) return;
    lb.querySelector('#al-lb-img').outerHTML =
      i.photo
        ? '<div id="al-lb-img" class="maxi-lb__img" style="background-image:url(\'' + PHOTO_BASE + esc(i.photo) + '\')"></div>'
        : '<div id="al-lb-img" class="maxi-lb__img maxi-ph"><span>' + esc(i.cat) + '</span></div>';
    lb.querySelector('#al-lb-type').textContent = i.cat;
    lb.querySelector('#al-lb-title').textContent = i.title;
    lb.querySelector('#al-lb-sub').textContent = i.place;
    lb.querySelector('#al-lb-specs').innerHTML = '' +
      spec('Tipologia', esc(i.cat)) +
      spec('Luogo', esc(i.place)) +
      spec('Descrizione', esc(i.desc)) +
      spec('Riferimento', esc(i.code));
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

  /* ---------- init ---------- */
  function apply() {
    var list = ITEMS.filter(matches);
    countEl.innerHTML = '<b>' + list.length + '</b> ' + (list.length === 1 ? 'realizzazione' : 'realizzazioni') + ' su ' + ITEMS.length;
    renderGallery(list);
  }
  buildChips(catBar, uniq('cat'), 'cat');
  apply();
})();
