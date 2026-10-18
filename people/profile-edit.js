/* 侍天 TIANSIGHT — profile backstage.
   The page carries its profile JSON (#ts-profile-data) and every printed value is bound to a path
   in that object with data-bind="…". This script keeps the two in step:
     · edit mode      every bound value becomes editable; edits write back to the in-page state
     · import         a JSON payload (file, paste, ?data=URL, or postMessage) is applied to the page
     · export         the current state as JSON, ready to be written to people/profiles.json
     · PDF            the browser's print dialog; the stylesheet already sets A4 pages
   Values move here; structure comes from scripts/build_profiles.py. No dependencies, no network
   unless ?data= names a URL. Nothing is persisted between visits. */
(function () {
  'use strict';
  var holder = document.getElementById('ts-profile-data');
  if (!holder) return;
  var original = JSON.parse(holder.textContent);
  var state = JSON.parse(holder.textContent);
  var MAX_AUX = 3;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── path resolution: "cases.bj-case-a.facts.2.v", arrays by id or index ── */
  function step(node, seg) {
    if (Array.isArray(node)) {
      if (/^\d+$/.test(seg)) return node[Number(seg)];
      for (var i = 0; i < node.length; i++) if (node[i] && node[i].id === seg) return node[i];
      return undefined;
    }
    return node == null ? undefined : node[seg];
  }
  function root(path) { return path.indexOf('branding.') === 0 ? state : state.profile; }
  function strip(path) { return path.indexOf('branding.') === 0 ? path : path; }
  function get(path) {
    var node = root(path), segs = strip(path).split('.');
    for (var i = 0; i < segs.length; i++) { node = step(node, segs[i]); if (node === undefined) return undefined; }
    return node;
  }
  function set(path, value) {
    var node = root(path), segs = strip(path).split('.');
    for (var i = 0; i < segs.length - 1; i++) { node = step(node, segs[i]); if (node === undefined) return false; }
    var last = segs[segs.length - 1];
    if (Array.isArray(node)) {
      if (/^\d+$/.test(last)) node[Number(last)] = value;
      else for (var j = 0; j < node.length; j++) if (node[j].id === last) node[j] = value;
    } else node[last] = value;
    return true;
  }

  /* ── rendering state → page ── */
  function text(el, value) {
    if (value == null) value = '';
    if (Array.isArray(value)) value = value.join(el.getAttribute('data-join') || '、');
    if (el.textContent !== String(value)) el.textContent = value;
  }
  function apply() {
    $$('[data-bind]').forEach(function (el) { text(el, get(el.getAttribute('data-bind'))); });
    $$('[data-bind-src]').forEach(function (el) { var v = get(el.getAttribute('data-bind-src')); if (v) el.setAttribute('src', v); });
    $$('[data-slot="cobrand"]').forEach(function (slot) {
      var logo = get('cobrand.logo'), label = get('cobrand.label') || (state.branding && state.branding.cobrand_label) || '';
      var img = slot.querySelector('img'), span = slot.querySelector('.slot-label');
      if (logo) {
        if (!img) { img = document.createElement('img'); img.alt = label; slot.innerHTML = ''; slot.appendChild(img); }
        img.src = logo;
      } else if (!span) {
        slot.innerHTML = '<span class="slot-label" data-bind="cobrand.label"></span>';
        slot.querySelector('.slot-label').setAttribute('data-placeholder', (state.branding && state.branding.cobrand_label) || '');
        slot.querySelector('.slot-label').textContent = get('cobrand.label') || '';
      }
    });
    renderAux();
    $$('[data-delta]').forEach(renderDelta);
  }
  function number(s) { var m = String(s || '').match(/[\d.]+/); return m ? parseFloat(m[0]) : 0; }
  function renderDelta(strip) {
    var b = get(strip.getAttribute('data-before')), a = get(strip.getAttribute('data-after'));
    var bn = number(b), an = number(a), wide = Math.max(bn, an) || 1;
    strip.querySelector('[data-delta-before]').textContent = b || '';
    strip.querySelector('[data-delta-after]').textContent = a || '';
    strip.querySelector('[data-delta-bar="before"]').style.width = (bn / wide * 100).toFixed(0) + '%';
    strip.querySelector('[data-delta-bar="after"]').style.width = (an / wide * 100).toFixed(0) + '%';
    var gain = bn ? (an - bn) / bn * 100 : 0;
    strip.querySelector('[data-delta-gain]').textContent = (gain >= 0 ? '+' : '') + gain.toFixed(0) + '%';
  }
  function renderAux() {
    var titles = state.profile.titles_aux || [];
    var shown = titles.filter(function (t) { return t.show; }).slice(0, MAX_AUX);
    $$('[data-aux-slot]').forEach(function (slot) {
      slot.innerHTML = '';
      shown.forEach(function (t) { var s = document.createElement('span'); s.textContent = t.zh; slot.appendChild(s); });
    });
    var on = titles.filter(function (t) { return t.show; }).length;
    $$('input[data-aux]').forEach(function (box) {
      var t = titles[Number(box.getAttribute('data-aux'))];
      box.checked = !!(t && t.show);
      box.disabled = !box.checked && on >= MAX_AUX;
    });
    var over = $('.backstage .over'); if (over) over.hidden = on <= MAX_AUX;
  }

  /* ── page → state ── */
  function onInput(e) {
    var el = e.target.closest('[data-bind]'); if (!el) return;
    var path = el.getAttribute('data-bind'), join = el.getAttribute('data-join');
    var value = el.textContent;
    set(path, join ? value.split(join).map(function (s) { return s.trim(); }).filter(Boolean) : value);
    // the same path may be printed in several places (name on cover and footer, a case title twice)
    $$('[data-bind="' + path + '"]').forEach(function (other) { if (other !== el) text(other, get(path)); });
    $$('[data-delta]').forEach(function (strip) {
      if (strip.getAttribute('data-before') === path || strip.getAttribute('data-after') === path) renderDelta(strip);
    });
    status('已修改 ' + path);
  }
  $$('input[data-aux]').forEach(function (box) {
    box.addEventListener('change', function () {
      var t = state.profile.titles_aux[Number(box.getAttribute('data-aux'))];
      if (t) t.show = box.checked;
      renderAux();
    });
  });

  /* ── backstage controls ── */
  var editing = false;
  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('editing', on);
    $$('[data-bind]').forEach(function (el) { el.contentEditable = on ? 'true' : 'false'; });
    var btn = $('#bs-edit'); if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.textContent = on ? '完成编辑' : '编辑参数'; }
    status(on ? '编辑模式：点击任一带虚线的值直接修改。' : '预览模式。');
  }
  function status(msg) { var el = $('#bs-status'); if (el) el.textContent = msg; }
  document.addEventListener('input', function (e) { if (editing) onInput(e); });
  document.addEventListener('keydown', function (e) {
    if (editing && e.key === 'Enter' && e.target.closest('[data-bind]') && !e.target.closest('[data-join]')) e.preventDefault();
  });

  var dlg = $('#bs-dialog'), area = $('#bs-json');
  function openDialog(mode) {
    if (!dlg) return;
    dlg.setAttribute('data-mode', mode);
    $('#bs-dialog-title').textContent = mode === 'export' ? '导出 JSON' : '导入 JSON';
    area.value = mode === 'export' ? JSON.stringify(exportPayload(), null, 2) : '';
    $('#bs-apply').hidden = mode === 'export';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (mode === 'export') { area.focus(); area.select(); }
  }
  function exportPayload() { return { schema: state.schema, version: state.version, issued: state.issued, branding: state.branding, profile: state.profile }; }
  function importPayload(obj) {
    if (!obj || typeof obj !== 'object') throw new Error('不是对象');
    var profile = obj.profile || obj;
    if (Array.isArray(obj.profiles)) {
      profile = obj.profiles.filter(function (p) { return p.id === state.profile.id; })[0];
      if (!profile) throw new Error('profiles.json 中没有 id 为 ' + state.profile.id + ' 的档案');
    }
    if (profile.id && profile.id !== state.profile.id) throw new Error('档案 id 不符：' + profile.id + ' ≠ ' + state.profile.id);
    if (obj.branding) state.branding = obj.branding;
    state.profile = profile;
    apply();
    status('已应用 JSON（' + Object.keys(profile).length + ' 个字段）。结构性变化仍需重新构建。');
  }
  var on = function (id, fn) { var el = $(id); if (el) el.addEventListener('click', fn); };
  on('#bs-edit', function () { setEditing(!editing); });
  on('#bs-import', function () { openDialog('import'); });
  on('#bs-export', function () { openDialog('export'); download(); });
  on('#bs-pdf', function () { if (editing) setEditing(false); window.print(); });
  on('#bs-reset', function () { state = JSON.parse(JSON.stringify(original)); apply(); status('已复位到构建时的数据。'); });
  on('#bs-apply', function () {
    try { importPayload(JSON.parse(area.value)); dlg.close(); } catch (err) { status('导入失败：' + err.message); }
  });
  $$('[data-close]', dlg || document).forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
  var file = $('#bs-file');
  if (file) file.addEventListener('change', function () {
    var f = file.files[0]; if (!f) return;
    var r = new FileReader(); r.onload = function () { area.value = String(r.result); }; r.readAsText(f);
  });
  function download() {
    try {
      var blob = new Blob([JSON.stringify(exportPayload(), null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'profile-' + state.profile.id + '.json'; document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { /* the dialog still shows the JSON for copying */ }
  }

  /* ── inbound: ?data=URL and postMessage from a host system ── */
  var params = new URLSearchParams(location.search);
  if (params.get('data')) {
    fetch(params.get('data')).then(function (r) { return r.json(); }).then(importPayload)
      .catch(function (err) { status('?data 读取失败：' + err.message); });
  }
  window.addEventListener('message', function (e) {
    var msg = e.data;
    if (!msg || msg.type !== 'tiansight:profile') return;
    try {
      importPayload(msg.payload);
      if (e.source && e.source.postMessage) e.source.postMessage({ type: 'tiansight:profile:applied', id: state.profile.id }, '*');
    } catch (err) { status('宿主数据失败：' + err.message); }
  });
  window.tiansightProfile = { get: function () { return exportPayload(); }, set: importPayload, apply: apply };

  apply();
})();
