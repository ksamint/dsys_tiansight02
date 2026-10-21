/* Tiansight 侍天 — report reader: rail navigation, anomaly filter, print. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail nav a'));
  var pages = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && pages.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    pages.forEach(function (p) { io.observe(p); });
  }
  var toggle = document.getElementById('only-anomalies');
  if (toggle) toggle.addEventListener('change', function () {
    if (toggle.checked) document.body.setAttribute('data-anomalies', ''); else document.body.removeAttribute('data-anomalies');
  });
  var print = document.getElementById('export-pdf');
  if (print) print.addEventListener('click', function () { window.print(); });
})();
