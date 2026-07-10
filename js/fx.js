/* Effetti avanzati: cursore magnetico (desktop) + rete metallica deformabile (WebGL).
   Fallback totale: senza WebGL/Three resta l'aurora CSS + griglia statica; su touch niente cursore. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ==================== CURSORE MAGNETICO ==================== */
  if (fine && !reduced) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('cur-on');

    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      if (!shown) { shown = true; dot.classList.add('vis'); ring.classList.add('vis'); }
    });
    document.documentElement.addEventListener('mouseleave', function () {
      dot.classList.remove('vis'); ring.classList.remove('vis'); shown = false;
    });

    (function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    })();

    /* anello che si espande sugli elementi interattivi */
    document.addEventListener('mouseover', function (e) {
      var hit = e.target.closest && e.target.closest('a, button, .nav-toggle, input, textarea, select, .ring-card');
      ring.classList.toggle('on', !!hit);
    });

    /* attrazione magnetica su bottoni e voci di menu */
    Array.prototype.forEach.call(document.querySelectorAll('.btn, .main-nav a'), function (el) {
      el.classList.add('magnet');
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var dx = ev.clientX - (r.left + r.width / 2);
        var dy = ev.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.22).toFixed(1) + 'px,' + (dy * 0.22).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ==================== RETE METALLICA DEFORMABILE (WebGL) ==================== */
  if (reduced || !window.THREE) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'fx-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (err) {
    canvas.remove();
    return;
  }

  /* la rete WebGL sostituisce la griglia CSS statica */
  document.documentElement.classList.add('fx-on');

  var small = window.innerWidth < 680;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300);
  camera.position.z = 60;

  /* piano della rete: copre il viewport a z=0 con margine (fino a schermi 21:9) */
  var worldH = 2 * Math.tan(Math.PI / 6) * 60; /* altezza visibile a z=0 con fov 60 */
  var planeW = worldH * 2.3;
  var planeH = worldH * 1.15;
  var STEP = small ? 2.6 : 1.7;
  var NX = Math.max(2, Math.round(planeW / STEP));
  var NY = Math.max(2, Math.round(planeH / STEP));
  var PX = NX + 1, PY = NY + 1, COUNT = PX * PY;

  var pos = new Float32Array(COUNT * 3);
  var col = new Float32Array(COUNT * 3);
  var baseX = new Float32Array(COUNT);
  var baseY = new Float32Array(COUNT);

  /* grigio acciaio → riflesso arancio brand vicino al mouse */
  var BR = 0.45, BG = 0.5, BB = 0.6;
  var HR = 1.0, HG = 0.62, HB = 0.2;

  var x, y, k = 0;
  for (y = 0; y < PY; y++) {
    for (x = 0; x < PX; x++) {
      var wx = -planeW / 2 + x * (planeW / NX);
      var wy = -planeH / 2 + y * (planeH / NY);
      baseX[k] = wx;
      baseY[k] = wy;
      pos[k * 3] = wx; pos[k * 3 + 1] = wy; pos[k * 3 + 2] = 0;
      col[k * 3] = BR; col[k * 3 + 1] = BG; col[k * 3 + 2] = BB;
      k++;
    }
  }

  /* segmenti: solo fili orizzontali e verticali, come una rete vera */
  var idx = [];
  for (y = 0; y < PY; y++) {
    for (x = 0; x < PX; x++) {
      var a = y * PX + x;
      if (x < NX) { idx.push(a, a + 1); }
      if (y < NY) { idx.push(a, a + PX); }
    }
  }

  var geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geom.setIndex(idx);

  var net = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.3
  }));
  scene.add(net);

  /* posizione del mouse in coordinate mondo sul piano della rete */
  var FAR = 99999;
  var tX = FAR, tY = FAR, mX = FAR, mY = FAR;
  window.addEventListener('pointermove', function (e) {
    tX = ((e.clientX / window.innerWidth) * 2 - 1) * (worldH / 2) * camera.aspect;
    tY = (-(e.clientY / window.innerHeight) * 2 + 1) * (worldH / 2);
  });
  document.documentElement.addEventListener('mouseleave', function () { tX = FAR; tY = FAR; });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var AMP = 7;            /* profondità della deformazione */
  var SIG2 = 2 * 8 * 8;   /* ampiezza della campana */
  var posAttr = geom.getAttribute('position');
  var colAttr = geom.getAttribute('color');
  var clock = new THREE.Clock();

  (function loop() {
    requestAnimationFrame(loop);
    var t = clock.getElapsedTime();
    /* il punto di deformazione insegue il mouse con inerzia */
    mX += (tX - mX) * 0.12;
    mY += (tY - mY) * 0.12;
    for (var i = 0; i < COUNT; i++) {
      var bx = baseX[i], by = baseY[i];
      /* respiro lento della rete */
      var wave = Math.sin(bx * 0.12 + t * 0.6) * 0.5 + Math.cos(by * 0.15 + t * 0.45) * 0.5;
      /* campana di deformazione sotto il mouse */
      var dx = bx - mX, dy = by - mY;
      var g = Math.exp(-(dx * dx + dy * dy) / SIG2);
      pos[i * 3 + 2] = wave + AMP * g;
      /* i fili si accendono d'arancio dove la rete si solleva */
      var h = g * 1.5; if (h > 1) { h = 1; }
      col[i * 3]     = BR + (HR - BR) * h;
      col[i * 3 + 1] = BG + (HG - BG) * h;
      col[i * 3 + 2] = BB + (HB - BB) * h;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    /* leggera parallasse con lo scroll */
    net.position.y = (window.scrollY || 0) * -0.004;
    renderer.render(scene, camera);
  })();
})();
