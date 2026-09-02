/* ============================================================
   Allestimenti — galleria realizzazioni filtrabile + lightbox.
   Testi tradotti IT/EN/ZH: chrome via UI/CAT qui sotto, contenuti
   (titoli/descrizioni) via il dizionario condiviso DSMi18n.t().
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

  /* traduzione: T() per i contenuti (dizionario condiviso), UI/CAT per il chrome */
  var T = (window.DSMi18n && window.DSMi18n.t) ? window.DSMi18n.t : function (x) { return x; };
  function curLang() { var l = document.documentElement.getAttribute('lang'); return (l === 'en' || l === 'zh') ? l : 'it'; }
  var UI = {
    it: { all:'Tutte', count:function(n,t){ return '<b>'+n+'</b> '+(n===1?'realizzazione':'realizzazioni')+' su '+t; },
          spec:{ type:'Tipologia', place:'Luogo', desc:'Descrizione', ref:'Riferimento' } },
    en: { all:'All', count:function(n,t){ return '<b>'+n+'</b> project'+(n===1?'':'s')+' of '+t; },
          spec:{ type:'Type', place:'Place', desc:'Description', ref:'Reference' } },
    zh: { all:'全部', count:function(n,t){ return '共 '+t+' 个中的 <b>'+n+'</b> 个案例'; },
          spec:{ type:'类型', place:'地点', desc:'描述', ref:'编号' } }
  };
  var CAT = {
    en:{ 'Wrapping':'Wrapping', 'Vetrine':'Windows', 'Stand':'Stands', 'Eventi':'Events' },
    zh:{ 'Wrapping':'车身贴', 'Vetrine':'橱窗', 'Stand':'展台', 'Eventi':'活动' }
  };
  function ui() { return UI[curLang()]; }
  function clabel(c) { var m = CAT[curLang()]; return (m && m[c]) || c; }

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

  function buildChips(bar, values, dim, labelFn) {
    if (!bar) return;
    bar._labelFn = labelFn || function (v) { return v; };
    var html = '<button class="chip active" data-val="*">' + ui().all + '</button>';
    values.forEach(function (v) {
      html += '<button class="chip" data-val="' + esc(v) + '">' + esc(bar._labelFn(v)) + '</button>';
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
  function relabelChips(bar) {
    if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll('.chip'), function (c) {
      var v = c.getAttribute('data-val');
      c.textContent = (v === '*') ? ui().all : bar._labelFn(v);
    });
  }

  function imgMarkup(i, cls) {
    if (i.photo) return '<div class="' + cls + '" style="background-image:url(\'' + PHOTO_BASE + esc(i.photo) + '\')"></div>';
    return '<div class="' + cls + ' maxi-ph"><span>' + esc(clabel(i.cat)) + '</span></div>';
  }

  function renderGallery(list) {
    gallery.innerHTML = list.map(function (i) {
      return '' +
        '<button class="maxi-card" data-code="' + esc(i.code) + '" aria-label="' + esc(T(i.title)) + '">' +
          imgMarkup(i, 'maxi-card__img') +
          '<div class="maxi-card__grad"></div>' +
          '<div class="maxi-card__body">' +
            '<span class="maxi-chip-type">' + esc(clabel(i.cat)) + '</span>' +
            '<p class="maxi-card__city">' + esc(T(i.title)) + '</p>' +
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
        : '<div id="al-lb-img" class="maxi-lb__img maxi-ph"><span>' + esc(clabel(i.cat)) + '</span></div>';
    lb.querySelector('#al-lb-type').textContent = clabel(i.cat);
    lb.querySelector('#al-lb-title').textContent = T(i.title);
    lb.querySelector('#al-lb-sub').textContent = i.place;
    var S = ui().spec;
    lb.querySelector('#al-lb-specs').innerHTML = '' +
      spec(S.type, esc(clabel(i.cat))) +
      spec(S.place, esc(i.place)) +
      spec(S.desc, esc(T(i.desc))) +
      spec(S.ref, esc(i.code));
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
    countEl.innerHTML = ui().count(list.length, ITEMS.length);
    renderGallery(list);
  }
  buildChips(catBar, uniq('cat'), 'cat', clabel);
  apply();
  window.addEventListener('dsm:langchange', function () {
    relabelChips(catBar);
    apply();
  });
})();
