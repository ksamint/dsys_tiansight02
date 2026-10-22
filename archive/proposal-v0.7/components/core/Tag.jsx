import React from 'react';
export function Tag({ on, onRemove, children, ...rest }) {
  return <span className="ts-tag" aria-pressed={on || undefined} {...rest}>{children}{onRemove && <button type="button" aria-label="移除" onClick={onRemove}>✕</button>}</span>;
}