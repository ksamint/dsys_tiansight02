/* Tiansight 侍天 — site interactions: nav, tabs, stepper, form, reveal. No dependencies. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* mobile nav */
  var toggle = $('.menu-toggle'), nav = $('.site-header .ts-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.hasAttribute('data-open');
      if (open) nav.removeAttribute('data-open'); else nav.setAttribute('data-open', '');
      toggle.setAttribute('aria-expanded', String(!open));
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.removeAttribute('data-open'); toggle.setAttribute('aria-expanded', 'false'); }); });
  }

  /* active nav link */
  var links = $$('.site-header .ts-nav a[href^="#"]');
  var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* generic tabs: [role=tablist] > button[aria-controls] */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
        if (n === null) return;
        e.preventDefault();
        var next = tabs[(n + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
    select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
  });

  /* contact form: local success state only, nothing is sent */
  var form = $('#apply-form'), success = $('#apply-success');
  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.hidden = true; success.hidden = false; success.focus();
    });
    var again = $('button', success);
    if (again) again.addEventListener('click', function () { success.hidden = true; form.hidden = false; form.reset(); });
  }

  /* reveal once */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.setAttribute('data-in', ''); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else reveals.forEach(function (el) { el.setAttribute('data-in', ''); });
})();
