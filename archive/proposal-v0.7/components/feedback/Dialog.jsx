import React from 'react';
export function Dialog({ open, title, actions, onClose, children, ...rest }) {
  if (!open) return null;
  return <div style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', display: 'grid', placeItems: 'center', zIndex: 'var(--z-modal)' }} onClick={onClose}>
    <div className="ts-dialog" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()} {...rest}>{title && <h3>{title}</h3>}{children}{actions && <div className="actions">{actions}</div>}</div>
  </div>;
}