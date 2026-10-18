'use strict';
(() => {
  if (globalThis.Tiansight) return;
  const mounts = new WeakMap();
  let sequence = 0;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function button({ label, variant = 'primary', disabled = false, onClick } = {}) {
    const node = element('button', 'ts-button', label || '');
    node.type = 'button';
    if (['secondary', 'quiet', 'charcoal'].includes(variant)) node.classList.add('ts-button-' + variant);
    node.disabled = disabled;
    if (onClick) node.addEventListener('click', onClick);
    return node;
  }
  function feedback(container, { state = 'empty', text = '' } = {}) {
    const node = element('div', 'ts-feedback', text);
    node.dataset.state = state;
    node.setAttribute('role', state === 'error' ? 'alert' : 'status');
    node.setAttribute('aria-busy', String(state === 'loading'));
    container.replaceChildren(node);
    return node;
  }
  function notify(text, state = 'info') {
    let region = document.querySelector('[data-ts-notifications], #toastWrap');
    if (!region) {
      region = element('div', 'ts-notifications ts-root');
      region.dataset.tsNotifications = '';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-relevant', 'additions');
      document.body.append(region);
    }
    region.classList.add('ts-notifications', 'ts-root');
    region.setAttribute('aria-live', 'polite');
    const message = element('div', 'ts-notification toast', text);
    message.dataset.state = state;
    if (state === 'error') message.setAttribute('role', 'alert');
    region.append(message);
    const timeout = setTimeout(() => message.remove(), 5000);
    return () => { clearTimeout(timeout); message.remove(); };
  }
  function dialog({ title = '', content, actions = [], drawer = false } = {}) {
    const previous = document.activeElement;
    const node = element('dialog', 'ts-root ts-dialog' + (drawer ? ' ts-drawer' : ''));
    const heading = element('h2', 'ts-dialog-title', title);
    heading.id = 'ts-dialog-' + (++sequence);
    node.setAttribute('aria-labelledby', heading.id);
    const header = element('div', 'ts-dialog-header');
    const close = button({ label: '关闭', variant: 'quiet', onClick: () => node.close() });
    const body = element('div', 'ts-dialog-body');
    if (content instanceof Node) body.append(content);
    else if (content !== undefined) body.textContent = String(content);
    const footer = element('div', 'ts-dialog-footer');
    actions.forEach(action => footer.append(button(action)));
    header.append(heading, close);
    node.append(header, body, footer);
    node.addEventListener('close', () => {
      node.remove();
      if (previous?.isConnected) previous.focus();
    }, { once: true });
    document.body.append(node);
    node.showModal();
    return { element: node, body, close: () => node.close() };
  }
  function mount(root = document) {
    if (mounts.has(root)) return mounts.get(root);
    const abort = new AbortController();
    function activate(tab) {
      const list = tab.closest('[data-ts-tabs]');
      if (!list || tab.disabled || tab.getAttribute('aria-disabled') === 'true') return;
      for (const candidate of list.querySelectorAll('[role="tab"]')) {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(candidate.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      }
      tab.dispatchEvent(new CustomEvent('ts:change', { bubbles: true }));
    }
    root.addEventListener('click', event => {
      const tab = event.target.closest('[data-ts-tabs] [role="tab"]');
      if (tab) activate(tab);
    }, { signal: abort.signal });
    root.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-ts-tabs] [role="tab"]');
      if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...tab.closest('[data-ts-tabs]').querySelectorAll('[role="tab"]')].filter(node => !node.disabled && node.getAttribute('aria-disabled') !== 'true');
      if (!tabs.length) return;
      const current = tabs.indexOf(tab);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      event.preventDefault();
      activate(tabs[index]);
      tabs[index].focus();
    }, { signal: abort.signal });
    const dispose = () => { abort.abort(); mounts.delete(root); };
    mounts.set(root, dispose);
    return dispose;
  }
  const dialogs = [];
  function manageDialog(backdrop, panel, title) {
    const previous = document.activeElement;
    const abort = new AbortController();
    title.id ||= 'ts-dialog-' + (++sequence);
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', title.id);
    panel.tabIndex = -1;
    dialogs.push(backdrop);
    const focusable = () => [...panel.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
    const observer = new MutationObserver(() => {
      if (backdrop.isConnected) return;
      abort.abort();
      observer.disconnect();
      const index = dialogs.indexOf(backdrop);
      if (index >= 0) dialogs.splice(index, 1);
      if (previous?.isConnected) previous.focus();
      backdrop.dispatchEvent(new Event('ts:close'));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', event => {
      if (dialogs.at(-1) !== backdrop) return;
      if (event.key === 'Escape') { event.preventDefault(); backdrop.remove(); }
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      const first = nodes[0] || panel;
      const last = nodes.at(-1) || panel;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }, { signal: abort.signal });
    queueMicrotask(() => { if (backdrop.isConnected) (focusable()[0] || panel).focus(); });
    return () => backdrop.remove();
  }
  function chartTheme(root = document.documentElement) {
    const styles = getComputedStyle(root);
    const token = name => styles.getPropertyValue('--ts-' + name).trim();
    return { text: token('charcoal'), muted: token('ink-muted'), grid: token('line'), surface: token('paper'), font: token('font-cn'), mono: token('font-mono'), series: [token('chart-1'), token('chart-2'), token('chart-3')], benchmark: token('chart-benchmark'), benchmarkSolid: token('chart-benchmark-solid') };
  }
  globalThis.Tiansight = Object.freeze({ element, button, feedback, notify, dialog, manageDialog, mount, chartTheme });
})();
