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

  /* luci: bianca direzionale + punto luce arancio brand + ambiente freddo tenue */
  scene.add(new THREE.HemisphereLight(0x3a4a6a, 0x14100c, 0.55));
  var keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(40, 60, 80);
  scene.add(keyLight);
  var brandLight = new THREE.PointLight(0xff8a1e, 1.6, 260);
  brandLight.position.set(-50, -20, 50);
  scene.add(brandLight);

  /* poche sfere metalliche, tutte piccole e identiche */
  var COUNT = small ? 36 : 80;
  var RADIUS = 0.45;
  var geo = new THREE.SphereGeometry(RADIUS, 20, 20);
  var mat = new THREE.MeshStandardMaterial({
    color: 0xcdd3dd,
    metalness: 0.9,
    roughness: 0.28
  });
  var field = new THREE.Group();
  var spheres = new THREE.InstancedMesh(geo, mat, COUNT);
  var base = [];
  var dummy = new THREE.Object3D();
  for (var i = 0; i < COUNT; i++) {
    var p = {
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 80,
      z: (Math.random() - 0.5) * 70,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.35
    };
    base.push(p);
    dummy.position.set(p.x, p.y, p.z);
    dummy.updateMatrix();
    spheres.setMatrixAt(i, dummy.matrix);
  }
  field.add(spheres);
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
    /* galleggiamento individuale, lento */
    for (var i = 0; i < COUNT; i++) {
      var p = base[i];
      dummy.position.set(p.x, p.y + Math.sin(t * p.speed + p.phase) * 1.4, p.z);
      dummy.updateMatrix();
      spheres.setMatrixAt(i, dummy.matrix);
    }
    spheres.instanceMatrix.needsUpdate = true;
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
