// Load the pinned runtime in order; consumers await TIANSIGHT_READY before rendering.
(() => {
  if (window.TIANSIGHT_READY) return;
  const base = new URL('.', document.currentScript.src);
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = new URL('styles.css', base).href;
  document.head.appendChild(style);
  window.TIANSIGHT_READY = (async () => {
    for (const file of ['vendor/react.min.js', 'vendor/react-dom.min.js', 'vendor/d3.min.js', 'vendor/d3-sankey.min.js', 'vendor/lucide-icons.js', '_ds_bundle.js']) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL(file, base).href;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Unable to load ' + script.src));
        document.head.appendChild(script);
      });
    }
    const runtime = window.TIANSIGHTDesignSystem_e0a760;
    if (runtime.__errors.length) throw new Error(runtime.__errors.join('\n'));
    return runtime;
  })();
})();
