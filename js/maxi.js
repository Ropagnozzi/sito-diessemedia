/* ============================================================
   Maxi Formati — galleria filtrabile + mappa Leaflet.
   I dati arrivano da js/maxi-data.js (window.MAXI_IMPIANTI), a sua
   volta generato da maxi-impianti.xlsx tramite build-maxi-data.py.
   Se maxi-data.js manca, si usa il set di riserva qui sotto.
   ============================================================ */
(function () {
  'use strict';

  var FALLBACK = [
    { code:'MX-NA-01', city:'Napoli',   pos:'Corso Meridionale',              type:'Facciata',   dim:'12 × 6 m',  sqm:72,  light:true,  flow:'Uscita Stazione Centrale — altissimo transito', photo:'', lat:40.8598, lng:14.2726 },
    { code:'MX-NA-02', city:'Napoli',   pos:'Via Marina',                     type:'Ponteggio',  dim:'20 × 10 m', sqm:200, light:true,  flow:'Traffico portuale e Tangenziale',              photo:'', lat:40.8438, lng:14.2680 },
    { code:'MX-NA-03', city:'Napoli',   pos:'Fuorigrotta — Piazzale Tecchio', type:'Muro cieco', dim:'8 × 6 m',   sqm:48,  light:false, flow:'Zona stadio e università',                     photo:'', lat:40.8290, lng:14.1930 },
    { code:'MX-NA-04', city:'Napoli',   pos:'Tangenziale — svincolo Vomero',  type:'Ponteggio',  dim:'18 × 9 m',  sqm:162, light:true,  flow:'~80.000 veicoli/giorno',                       photo:'', lat:40.8480, lng:14.2200 }
  ];

  var IMPIANTI = (window.MAXI_IMPIANTI && window.MAXI_IMPIANTI.length) ? window.MAXI_IMPIANTI : FALLBACK;
  var PHOTO_BASE = 'assets/foto/maxi/';
  var state = { city:'*', type:'*' };

  var gallery = document.getElementById('maxi-gallery');
  var countEl = document.getElementById('maxi-count');
  var cityBar = document.getElementById('filter-city');
  var typeBar = document.getElementById('filter-type');
  if (!gallery) return;

  function uniq(key) {
    var seen = [];
    IMPIANTI.forEach(function (i) { if (i[key] && seen.indexOf(i[key]) === -1) seen.push(i[key]); });
    return seen;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  }); }
  function matches(i) {
    return (state.city === '*' || i.city === state.city) &&
           (state.type === '*' || i.type === state.type);
  }
  /* elenco foto dell'impianto (photos[] nuovo, photo singolo per retrocompatibilità) */
  function photosOf(i) {
    if (i.photos && i.photos.length) return i.photos;
    if (i.photo) return [i.photo];
    return [];
  }
  /* se l'immagine non carica (file mancante o nome errato), esegue onFail() */
  function guardImg(url, onFail) {
    var probe = new Image();
    probe.onerror = onFail;
    probe.src = url;
  }

  /* ---------- chip filtri ---------- */
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
    var ph = photosOf(i);
    if (ph.length) return '<div class="' + cls + '" style="background-image:url(\'' + PHOTO_BASE + esc(ph[0]) + '\')"></div>';
    return '<div class="' + cls + ' maxi-ph"><span>' + esc(i.dim) + '</span></div>';
  }

  /* ---------- galleria ---------- */
  function renderGallery(list) {
    gallery.innerHTML = list.map(function (i) {
      var np = photosOf(i).length;
      var badge = np > 1 ? '<span class="maxi-card__count">' + np + ' foto</span>' : '';
      return '' +
        '<button class="maxi-card" data-code="' + esc(i.code) + '" aria-label="Dettagli impianto ' + esc(i.city) + ' ' + esc(i.pos) + '">' +
          imgMarkup(i, 'maxi-card__img') +
          badge +
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
    var cards = gallery.querySelectorAll('.maxi-card');
    list.forEach(function (i, idx) {
      var c = cards[idx];
      c.addEventListener('click', function () { openLightbox(c.getAttribute('data-code')); });
      var ph = photosOf(i);
      if (ph.length) {
        var imgEl = c.querySelector('.maxi-card__img');
        guardImg(PHOTO_BASE + ph[0], function () {
          imgEl.className = 'maxi-card__img maxi-ph';
          imgEl.style.backgroundImage = '';
          imgEl.innerHTML = '<span>' + esc(i.dim) + '</span>';
          var badge = c.querySelector('.maxi-card__count');
          if (badge) badge.style.display = 'none';
        });
      }
    });
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('maxi-lb');
  function setMainPhoto(el, photos, dimText, idx) {
    if (photos.length) {
      el.className = 'maxi-lb__img';
      el.style.backgroundImage = "url('" + PHOTO_BASE + esc(photos[idx]) + "')";
      el.innerHTML = '';
      guardImg(PHOTO_BASE + photos[idx], function () {
        el.className = 'maxi-lb__img maxi-ph';
        el.style.backgroundImage = '';
        el.innerHTML = '<span>' + esc(dimText) + '</span>';
      });
    } else {
      el.className = 'maxi-lb__img maxi-ph';
      el.style.backgroundImage = '';
      el.innerHTML = '<span>' + esc(dimText) + '</span>';
    }
  }
  function openLightbox(code) {
    var i = byCode(code);
    if (!i || !lb) return;
    var photos = photosOf(i);
    var imgEl = lb.querySelector('#maxi-lb-img');
    setMainPhoto(imgEl, photos, i.dim, 0);

    /* striscia miniature (creata al volo la prima volta) */
    var thumbs = lb.querySelector('#maxi-lb-thumbs');
    if (!thumbs) {
      thumbs = document.createElement('div');
      thumbs.id = 'maxi-lb-thumbs';
      thumbs.className = 'maxi-lb__thumbs';
      imgEl.parentNode.insertBefore(thumbs, imgEl.nextSibling);
    }
    if (photos.length > 1) {
      thumbs.style.display = '';
      thumbs.innerHTML = photos.map(function (p, idx) {
        return '<button type="button" class="maxi-thumb' + (idx === 0 ? ' active' : '') +
               '" data-idx="' + idx + '" aria-label="Foto ' + (idx + 1) + '" style="background-image:url(\'' +
               PHOTO_BASE + esc(p) + '\')"></button>';
      }).join('');
      Array.prototype.forEach.call(thumbs.querySelectorAll('.maxi-thumb'), function (t) {
        t.addEventListener('click', function () {
          setMainPhoto(imgEl, photos, i.dim, +t.getAttribute('data-idx'));
          Array.prototype.forEach.call(thumbs.querySelectorAll('.maxi-thumb'), function (x) { x.classList.remove('active'); });
          t.classList.add('active');
        });
      });
    } else {
      thumbs.style.display = 'none';
      thumbs.innerHTML = '';
    }

    lb.querySelector('#maxi-lb-type').textContent = i.type;
    lb.querySelector('#maxi-lb-title').textContent = i.city;
    lb.querySelector('#maxi-lb-sub').textContent = i.pos;
    lb.querySelector('#maxi-lb-specs').innerHTML = '' +
      spec('Dimensioni', '<b>' + esc(i.dim) + '</b>') +
      spec('Superficie', '<b>' + (i.sqm != null ? i.sqm + ' m²' : '—') + '</b>') +
      spec('Tipologia', esc(i.type)) +
      spec('Illuminazione', i.light ? 'Sì' : 'No') +
      spec('Visibilità', esc(i.flow || '—')) +
      spec('Codice impianto', esc(i.code));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function spec(k, v) { return '<div class="s"><div class="k">' + k + '</div><div class="val">' + v + '</div></div>'; }
  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function byCode(code) { return IMPIANTI.filter(function (x) { return x.code === code; })[0]; }
  window.openMaxiImpianto = openLightbox;  /* usato dai popup della mappa */

  if (lb) {
    lb.querySelector('.maxi-lb__bg').addEventListener('click', closeLightbox);
    lb.querySelector('.maxi-lb__close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------- mappa Leaflet ---------- */
  var map = null, markersLayer = null;
  var pinIcon = null;

  function initMap() {
    var el = document.getElementById('maxi-map');
    if (!el || typeof window.L === 'undefined') return;
    map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([40.85, 14.26], 11);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 16
    }).addTo(map);
    pinIcon = L.divIcon({ className: 'maxi-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -22] });
    markersLayer = (typeof L.markerClusterGroup === 'function')
      ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 45 })
      : L.layerGroup();
    map.addLayer(markersLayer);
    // il contenitore parte nascosto (preloader/scroll): ricalcola le dimensioni
    setTimeout(function () { map.invalidateSize(); renderMap(currentList()); }, 300);
    window.addEventListener('load', function () { map.invalidateSize(); });
  }

  function popupHtml(i) {
    var pp = photosOf(i);
    var thumb = pp.length
      ? '<div class="maxi-pop__img" style="background-image:url(\'' + PHOTO_BASE + esc(pp[0]) + '\')"></div>'
      : '<div class="maxi-pop__img maxi-ph"><span>' + esc(i.dim) + '</span></div>';
    return '<div class="maxi-pop">' + thumb +
      '<div class="maxi-pop__b">' +
        '<span class="maxi-pop__type">' + esc(i.type) + '</span>' +
        '<strong>' + esc(i.city) + '</strong>' +
        '<span class="maxi-pop__pos">' + esc(i.pos) + '</span>' +
        '<span class="maxi-pop__meta"><b>' + esc(i.dim) + '</b> · ' + (i.light ? 'Illuminato' : 'Non illuminato') + '</span>' +
        '<button type="button" class="maxi-pop__btn" onclick="openMaxiImpianto(\'' + esc(i.code) + '\')">Scheda completa &rarr;</button>' +
      '</div></div>';
  }

  function renderMap(list) {
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();
    var pts = [];
    list.forEach(function (i) {
      if (typeof i.lat !== 'number' || typeof i.lng !== 'number') return;
      if (i.lat < -90 || i.lat > 90 || i.lng < -180 || i.lng > 180) return; /* coord. impossibili: salta */
      var m = L.marker([i.lat, i.lng], { icon: pinIcon });
      m.bindPopup(popupHtml(i), { className: 'maxi-pop-wrap', maxWidth: 260 });
      markersLayer.addLayer(m);
      pts.push([i.lat, i.lng]);
    });
    if (pts.length === 1) { map.setView(pts[0], 14); }
    else if (pts.length > 1) { map.fitBounds(pts, { padding: [40, 40], maxZoom: 14 }); }
  }

  /* ---------- filtro applicato a galleria + mappa ---------- */
  function currentList() { return IMPIANTI.filter(matches); }
  function apply() {
    var list = currentList();
    countEl.innerHTML = '<b>' + list.length + '</b> impiant' + (list.length === 1 ? 'o' : 'i') + ' su ' + IMPIANTI.length;
    renderGallery(list);
    renderMap(list);
  }

  /* ---------- init ---------- */
  buildChips(cityBar, uniq('city'), 'city');
  buildChips(typeBar, uniq('type'), 'type');
  initMap();
  apply();
})();
