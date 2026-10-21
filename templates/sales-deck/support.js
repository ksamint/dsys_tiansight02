// Boot editable Design Component templates through the same pinned offline runtime.
(() => {
  const base = new URL('../../dist/components/2026.10.21-e0a760/', document.currentScript.src);
  const loader = document.createElement('script');
  loader.src = new URL('loader.js', base).href;
  loader.onload = async () => {
    try {
      await window.TIANSIGHT_READY;
      const support = document.createElement('script');
      support.src = new URL('support.js', base).href;
      document.head.appendChild(support);
    } catch (error) { console.error('TIANSIGHT template boot failed', error); }
  };
  loader.onerror = () => console.error('TIANSIGHT loader unavailable: ' + loader.src);
  document.head.appendChild(loader);
})();
