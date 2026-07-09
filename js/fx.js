/* Effetti avanzati: cursore magnetico (desktop) + sfondo WebGL a particelle.
   Fallback totale: senza WebGL/Three resta l'aurora CSS; su touch niente cursore. */
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

  /* ==================== SFONDO WEBGL A PARTICELLE ==================== */
  if (reduced || !window.THREE) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'fx-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (err) {
    canvas.remove();
    return;
  }

  var small = window.innerWidth < 680;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 300);
  camera.position.z = 60;

  /* sprite morbido rotondo per le particelle */
  var spr = document.createElement('canvas');
  spr.width = spr.height = 64;
  var g = spr.getContext('2d');
  var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  var sprite = new THREE.CanvasTexture(spr);

  var COUNT = small ? 320 : 850;
  var pos = new Float32Array(COUNT * 3);
  var col = new Float32Array(COUNT * 3);
  var ORANGE = [1, 0.55, 0.12], AMBER = [1, 0.72, 0.35], WHITE = [0.95, 0.96, 1], BLUE = [0.45, 0.6, 1];
  for (var i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 140;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
    var r = Math.random(), c = r < 0.45 ? ORANGE : (r < 0.7 ? AMBER : (r < 0.9 ? WHITE : BLUE));
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  var mat = new THREE.PointsMaterial({
    size: small ? 1.6 : 1.9,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  var field = new THREE.Points(geo, mat);
  scene.add(field);

  var tMouseX = 0, tMouseY = 0, curX = 0, curY = 0;
  if (fine) {
    window.addEventListener('mousemove', function (e) {
      tMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      tMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    var t = clock.getElapsedTime();
    /* deriva lenta + parallasse dolce verso il mouse */
    curX += (tMouseX - curX) * 0.03;
    curY += (tMouseY - curY) * 0.03;
    field.rotation.y = t * 0.02 + curX * 0.22;
    field.rotation.x = Math.sin(t * 0.05) * 0.04 + curY * 0.12;
    /* parallasse con lo scroll */
    field.position.y = (window.scrollY || 0) * -0.008;
    renderer.render(scene, camera);
  })();
})();
