/* ============================================================
   Allestimenti — galleria realizzazioni filtrabile + lightbox.
   I dati qui sotto sono SEGNAPOSTO: sostituire con le realizzazioni
   reali. Foto: metterle in assets/foto/allestimenti/ e indicare il
   nome nel campo "photo" (se vuoto, si mostra un segnaposto).
   ============================================================ */
(function () {
  'use strict';

  var ITEMS = [
    { code:'AL-01', cat:'Wrapping', title:'Ascensore panoramico brandizzato', place:'C.C. Campania — Marcianise (CE)', desc:'Rivestimento integrale del vano ascensore panoramico, a tutta altezza, per la campagna TECNOMAT al Centro Commerciale Campania: un punto focale impossibile da ignorare.', photo:'al-01.jpg' },
    { code:'AL-02', cat:'Wrapping', title:'Scale mobili brandizzate',        place:'C.C. Campania — Marcianise (CE)', desc:'Fiancate delle scale mobili rivestite con grafica coordinata: il messaggio accompagna i visitatori lungo tutta la risalita.', photo:'al-02.jpg' },
    { code:'AL-03', cat:'Wrapping', title:'Totem nell’area centrale',        place:'C.C. Campania — Marcianise (CE)', desc:'Totem pubblicitario a tutta altezza nell’area centrale della galleria commerciale, visibile da ogni livello.', photo:'al-03.jpg' },
    { code:'AL-04', cat:'Vetrine',  title:'Ingresso e welcome banner',        place:'C.C. Campania — Marcianise (CE)', desc:'Allestimento dell’ingresso con maxi grafica a parete e vetrofania “Benvenuti / Welcome” sulle porte automatiche.', photo:'al-04.jpg' },
    { code:'AL-05', cat:'Wrapping', title:'Rivestimento vani ascensore',      place:'C.C. Campania — Marcianise (CE)', desc:'Wrapping dei vani ascensore su più livelli: massima visibilità in un punto di grande passaggio.', photo:'al-05.jpg' }
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
