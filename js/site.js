/* Effetti comuni a tutte le pagine:
   preloader, scroll fluido (Lenis), reveal allo scroll,
   titoli rivelati lettera per lettera, contatori animati.
   Con rete di sicurezza: nessun testo resta mai invisibile
   anche se l'IntersectionObserver non scatta (scheda in background,
   browser lento, ecc.). */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader: si chiude sempre ---------- */
  var pre = document.getElementById('preloader');
  if (pre && !pre.classList.contains('skip')) {
    setTimeout(function () { pre.classList.add('done'); }, reduced ? 200 : 1500);
  }

  /* ---------- Titoli: split lettera per lettera ---------- */
  function splitHeading(el) {
    var chIndex = 0;
    (function walk(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var ws = document.createElement('span');
            ws.className = 'st-w';
            for (var i = 0; i < w.length; i++) {
              var cs = document.createElement('span');
              cs.className = 'st-c';
              cs.textContent = w.charAt(i);
              cs.style.transitionDelay = (chIndex * 20) + 'ms';
              chIndex++;
              ws.appendChild(cs);
            }
            frag.appendChild(ws);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
  }

  var headings = [];
  var targets = [];
  var nums = [];

  /* ---------- Contatori animati ---------- */
  function animateNum(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1].replace(/\./g, ''), 10);
    var suffix = m[2] || '';
    if (!end) return;
    var t0 = null, DUR = 1600;
    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / DUR);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (reduced) {
    /* niente animazioni: tutto visibile subito */
    document.querySelectorAll('.hero-copy h1, .page-hero h1, .section-head h2, .split h2, .cta-band h2')
      .forEach(function (h) { h.classList.add('st-in'); });
    return;
  }

  /* ---------- Scroll fluido ---------- */
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.09 });
    requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    });
  }

  /* prepara reveal cards / sezioni */
  targets = Array.prototype.slice.call(document.querySelectorAll(
    '.card, .section-head, .stat, .split > *, .table-wrap, .cta-band .container, .contact-grid > *, .grid .photo'
  ));
  targets.forEach(function (el) {
    var sib = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.nodeType === 1;
    });
    var idx = sib.indexOf(el);
    el.style.transitionDelay = ((idx % 6) * 90) + 'ms';
    el.classList.add('reveal');
  });

  /* prepara titoli split */
  headings = Array.prototype.slice.call(document.querySelectorAll(
    '.hero-copy h1, .page-hero h1, .section-head h2, .split h2, .cta-band h2'
  ));
  headings.forEach(splitHeading);

  nums = Array.prototype.slice.call(document.querySelectorAll('.stat .num'));

  /* rivela un elemento in vista */
  function nearView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh + 100 && r.bottom > -100;
  }
  function sweep() {
    for (var i = targets.length - 1; i >= 0; i--) {
      if (nearView(targets[i])) { targets[i].classList.add('in'); targets.splice(i, 1); }
    }
    for (var j = headings.length - 1; j >= 0; j--) {
      if (nearView(headings[j])) { headings[j].classList.add('st-in'); headings.splice(j, 1); }
    }
    for (var k = nums.length - 1; k >= 0; k--) {
      if (nearView(nums[k])) { animateNum(nums[k]); nums.splice(k, 1); }
    }
  }

  /* Osservatore = effetto principale a cascata; sweep() = rete di sicurezza.
     Entrambi usano le stesse classi, quindi sono idempotenti. */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target;
        obs.unobserve(t);
        if (t.classList.contains('st-w') || t.matches('.hero-copy h1, .page-hero h1, .section-head h2, .split h2, .cta-band h2')) {
          t.classList.add('st-in');
        } else if (t.classList.contains('num')) {
          animateNum(t);
        } else {
          t.classList.add('in');
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { obs.observe(el); });
    headings.forEach(function (el) { obs.observe(el); });
    nums.forEach(function (el) { obs.observe(el); });
  }

  /* rete di sicurezza: allo scroll, al load e su timer.
     Garantisce che nulla resti invisibile se l'osservatore non scatta. */
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('load', sweep);
  window.addEventListener('resize', sweep);
  [120, 700, 1700, 2600].forEach(function (ms) { setTimeout(sweep, ms); });
  sweep();
})();
