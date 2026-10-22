/* Tiansight 侍天 — minimal deck stage: fit-to-window scaling, keyboard and tap
   navigation, hash deep link, HUD counter, fullscreen. Print is pure CSS. */
(function () {
  var canvas = document.querySelector('.deck-canvas');
  var slides = Array.prototype.slice.call(canvas.querySelectorAll('.slide'));
  var hud = document.querySelector('.deck-hud');
  var counter = hud.querySelector('.count');
  var W = 1280, H = 720, index = 0, hudTimer;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    canvas.style.transform = 'scale(' + s + ')';
  }
  function show(n, reason) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === index && reason !== 'init') return;
    slides.forEach(function (el, i) {
      if (i === n) el.setAttribute('data-active', ''); else el.removeAttribute('data-active');
    });
    index = n;
    counter.textContent = String(n + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    if (history.replaceState) history.replaceState(null, '', '#' + (n + 1));
    document.title = slides[n].getAttribute('data-label') + ' · 侍天 TIANSIGHT';
    poke();
  }
  function poke() {
    hud.setAttribute('data-show', '');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(function () { hud.removeAttribute('data-show'); }, 1800);
  }
  slides.forEach(function (el, i) {
    el.querySelector('.footer .page') && (el.querySelector('.footer .page').textContent = String(i + 1).padStart(2, '0'));
  });
  window.addEventListener('resize', fit);
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': show(index + 1, 'key'); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': show(index - 1, 'key'); break;
      case 'Home': show(0, 'key'); break;
      case 'End': show(slides.length - 1, 'key'); break;
      case 'f': case 'F': toggleFull(); break;
      default:
        if (/^[1-9]$/.test(e.key)) show(Number(e.key) - 1, 'key'); else return;
    }
    e.preventDefault();
  });
  canvas.addEventListener('click', function (e) {
    if (e.target.closest('a, button, input, select, textarea')) return;
    var r = canvas.getBoundingClientRect();
    show(e.clientX - r.left < r.width / 2 ? index - 1 : index + 1, 'tap');
  });
  document.addEventListener('mousemove', poke);
  hud.querySelector('.prev').addEventListener('click', function () { show(index - 1, 'hud'); });
  hud.querySelector('.next').addEventListener('click', function () { show(index + 1, 'hud'); });
  hud.querySelector('.full').addEventListener('click', toggleFull);
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen && document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  }
  window.addEventListener('hashchange', function () { show(fromHash(), 'hash'); });
  function fromHash() { var n = parseInt(location.hash.slice(1), 10); return isNaN(n) ? 0 : n - 1; }
  if (reduced) canvas.style.setProperty('--dur-base', '0ms');
  fit();
  show(fromHash(), 'init');
})();
