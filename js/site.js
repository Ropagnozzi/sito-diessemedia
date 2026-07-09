/* Animazioni di comparsa allo scroll — comuni a tutte le pagine */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

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
    // ritardo a cascata tra elementi fratelli
    var sib = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.nodeType === 1;
    });
    var idx = sib.indexOf(el);
    el.style.transitionDelay = ((idx % 6) * 90) + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });
})();
