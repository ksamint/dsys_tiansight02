// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../_ds/tiansight-design-system-e0a760e4-87b6-4953-bd3e-7b463edf75cf';
  for (const p of ["styles.css"]) { // styles.css @imports every token + font-face file
    const __dsu = (window.__resources || {})[base + '/' + p];
    const __dsb = __dsu && (window.__resourceBlobs || {})[__dsu];
    if (__dsb) {
      const __dst = document.createElement('style');
      __dsb.text().then(function (t) { __dst.textContent = t; });
      document.head.appendChild(__dst);
    } else {
      const l = document.createElement('link');
      l.href = base + '/' + p; l.rel = 'stylesheet';
      document.head.appendChild(l);
    }
  }
  // d3 v7 — the chart kit (图谱, 样张, 案例 slides) renders empty until it arrives
  const d3 = document.createElement('script');
  d3.src = 'https://unpkg.com/d3@7.9.0/dist/d3.min.js';
  document.head.appendChild(d3);
  const s = document.createElement('script');
  s.src = (window.__resources || {})[base + '/_ds_bundle.js'] || base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
