/* 侍天 TIANSIGHT — HTML report runtime.
   Deck stage (fit, play, keyboard, jump), explanation panel, source appendix overlay,
   chart drill-down (a chart element with data-key opens the appendix filtered to matching
   rows), tooltips, and URL state (#p=3, #src=key). No dependencies. Works from file://. */
(function () {
  var body = document.body;
  var isDeck = body.classList.contains('mode-deck');
  var deck = document.querySelector('.deck');
  var slides = Array.prototype.slice.call(document.querySelectorAll('section.slide'));
  var rows = Array.prototype.slice.call(document.querySelectorAll('.deck > .row'));
  var N = slides.length, cur = 0, TOC = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('toc'); }));
  var pgind = document.querySelector('.pgind');

  /* page numbers */
  slides.forEach(function (s, i) { var f = s.querySelector('.s-foot .pg'); if (f) f.textContent = (i + 1) + ' / ' + N; });

  /* fit */
  function fit() {
    if (!deck) return;
    var k;
    if (body.classList.contains('play')) { k = Math.min((innerWidth - 24) / 1280, (innerHeight - 24) / 720); deck.style.transform = 'scale(' + k + ')'; deck.style.marginBottom = '0'; return; }
    k = Math.min(1, (innerWidth - 40) / (body.classList.contains('meta-on') ? 1628 : 1280));
    deck.style.transform = 'scale(' + k + ')';
    deck.style.marginBottom = (-(1 - k) * deck.offsetHeight) + 'px';
  }
  addEventListener('resize', fit); fit();

  /* navigation */
  function show(i) {
    cur = Math.max(0, Math.min(N - 1, i));
    if (body.classList.contains('play')) { rows.forEach(function (r, k) { r.classList.toggle('cur', k === cur); }); if (pgind) pgind.textContent = (cur + 1) + ' / ' + N; fit(); }
    else if (slides[cur]) slides[cur].scrollIntoView({ block: 'start' });
    setHash({ p: cur + 1 });
  }
  window.tsGo = function (page) { show(page - 1); };
  document.querySelectorAll('[data-go]').forEach(function (el) { el.classList.add('jump'); el.addEventListener('click', function () { show(parseInt(el.dataset.go, 10) - 1); }); });

  /* play mode */
  var pl = document.getElementById('pl');
  function playOn() { body.classList.add('play'); if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {}); show(cur); if (pl) pl.textContent = '退出播放'; }
  function playOff() { body.classList.remove('play'); if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {}); rows.forEach(function (r) { r.classList.remove('cur'); }); if (pl) pl.textContent = '全屏播放'; fit(); if (slides[cur]) slides[cur].scrollIntoView({ block: 'start' }); }
  if (pl) pl.addEventListener('click', function () { body.classList.contains('play') ? playOff() : playOn(); });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && body.classList.contains('play')) playOff(); });

  /* explanation panel */
  var mt = document.getElementById('mt');
  if (mt) mt.addEventListener('click', function () { body.classList.toggle('meta-on'); mt.textContent = body.classList.contains('meta-on') ? '隐藏解释面板' : '显示解释面板'; fit(); });

  /* source appendix overlay with drill-down filter */
  var ov = document.querySelector('.srcov'), srcbody = document.querySelector('.srcbody');
  function srcOpen(key, filter) {
    if (!ov) return;
    body.classList.add('src-on');
    document.querySelectorAll('.srcnav a').forEach(function (a) { a.classList.toggle('on', a.dataset.k === key); });
    if (key) {
      var sec = document.getElementById('src-' + key);
      if (sec) { applyFilter(sec, filter); sec.scrollIntoView({ block: 'start' }); }
    }
    setHash({ src: key || '', q: filter || '' });
  }
  function applyFilter(sec, filter) {
    var bar = sec.querySelector('.filter'), trs = sec.querySelectorAll('tbody tr');
    trs.forEach(function (tr) { tr.classList.remove('hit', 'dim'); });
    if (!filter) { if (bar) bar.removeAttribute('data-on'); return; }
    var hits = 0;
    trs.forEach(function (tr) {
      var match = (tr.dataset.key && tr.dataset.key === filter) || tr.textContent.indexOf(filter) >= 0;
      tr.classList.add(match ? 'hit' : 'dim'); if (match) hits++;
    });
    if (bar) { bar.setAttribute('data-on', ''); bar.querySelector('span').textContent = '筛选 · ' + filter + ' · 命中 ' + hits + ' 行'; }
  }
  function srcClose() { body.classList.remove('src-on'); setHash({ src: '', q: '' }); }
  window.tsSrc = srcOpen;
  var sv = document.getElementById('sv'); if (sv) sv.addEventListener('click', function () { srcOpen(null); });
  var sc = document.querySelector('.srcclose'); if (sc) sc.addEventListener('click', srcClose);
  document.querySelectorAll('.srcbtn').forEach(function (b) { b.addEventListener('click', function () { srcOpen(b.dataset.src); }); });
  document.querySelectorAll('.srcnav a').forEach(function (a) { a.addEventListener('click', function () { srcOpen(a.dataset.k); }); });
  document.querySelectorAll('.srcbody .filter button').forEach(function (b) { b.addEventListener('click', function () { applyFilter(b.closest('section'), ''); }); });

  /* drill-down: chart elements with data-key inside a .fig[data-src] */
  document.querySelectorAll('.fig[data-src] [data-key]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.stopPropagation(); srcOpen(el.closest('.fig').dataset.src, el.dataset.key); });
  });

  /* tooltips: any element with data-tip */
  var tip = document.querySelector('.tip');
  if (tip) {
    document.querySelectorAll('[data-tip]').forEach(function (el) {
      el.addEventListener('mousemove', function (ev) {
        tip.innerHTML = el.dataset.tip.replace(/\|/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
        tip.style.opacity = 1; tip.style.left = Math.min(ev.clientX + 14, innerWidth - 270) + 'px'; tip.style.top = (ev.clientY + 16) + 'px';
      });
      el.addEventListener('mouseleave', function () { tip.style.opacity = 0; });
    });
  }

  /* keyboard */
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, select')) return;
    if (body.classList.contains('src-on')) { if (e.key === 'Escape') srcClose(); return; }
    if (!isDeck) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); show(cur + 1); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); show(cur - 1); break;
      case 'Home': show(0); break;
      case 'End': show(N - 1); break;
      case 'f': case 'F': body.classList.contains('play') ? playOff() : playOn(); break;
      case 'o': case 'O': show(TOC); break;
      case 'm': case 'M': if (mt) mt.click(); break;
      case 'Escape': if (body.classList.contains('play')) playOff(); break;
    }
  });
  addEventListener('scroll', function () {
    if (!isDeck || body.classList.contains('play')) return;
    var k = Math.round(scrollY / (720 * Math.min(1, (innerWidth - 40) / 1280) + 24));
    cur = Math.max(0, Math.min(N - 1, k));
  });

  /* URL state */
  function readHash() { var o = {}; location.hash.slice(1).split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) o[p[0]] = decodeURIComponent(p[1] || ''); }); return o; }
  function setHash(patch) {
    var o = readHash(); Object.keys(patch).forEach(function (k) { if (patch[k]) o[k] = patch[k]; else delete o[k]; });
    var s = Object.keys(o).map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
    if (history.replaceState) history.replaceState(null, '', s ? '#' + s : location.pathname);
  }
  var h = readHash();
  if (h.p) show(parseInt(h.p, 10) - 1);
  if (h.src) srcOpen(h.src, h.q || '');
})();
