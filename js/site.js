/* Effetti comuni a tutte le pagine:
   preloader, scroll fluido (Lenis), reveal allo scroll,
   titoli rivelati lettera per lettera, contatori animati. */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader: si chiude sempre ---------- */
  var pre = document.getElementById('preloader');
  if (pre && !pre.classList.contains('skip')) {
    setTimeout(function () { pre.classList.add('done'); }, reduced ? 200 : 1500);
  }

  if (reduced) return;

  /* ---------- Scroll fluido ---------- */
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.09 });
    requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    });
  }

  if (!('IntersectionObserver' in window)) return;

  /* ---------- Reveal allo scroll ---------- */
  var targets = document.querySelectorAll(
    '.card, .section-head, .stat, .split > *, .table-wrap, .cta-band .container, .contact-grid > *, .grid .photo'
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    var sib = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.nodeType === 1;
    });
    var idx = sib.indexOf(el);
    el.style.transitionDelay = ((idx % 6) * 90) + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });

  /* ---------- Titoli rivelati lettera per lettera ---------- */
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

  var headings = document.querySelectorAll('.hero-copy h1, .page-hero h1, .section-head h2, .split h2, .cta-band h2');
  var ioTitles = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('st-in');
        ioTitles.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  headings.forEach(function (h) {
    splitHeading(h);
    ioTitles.observe(h);
  });

  /* ---------- Contatori animati ---------- */
  function animateNum(el) {
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

  var ioNums = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateNum(e.target);
        ioNums.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat .num').forEach(function (n) { ioNums.observe(n); });
})();
