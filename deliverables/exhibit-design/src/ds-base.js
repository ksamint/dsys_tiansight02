// Current supported runtime; resolve relative to this loader, not the page URL.
(() => {
  const s = document.createElement("script");
  s.src = new URL("../../../dist/components/2026.10.21-e0a760/loader.js", document.currentScript.src).href;
  document.head.appendChild(s);
})();
