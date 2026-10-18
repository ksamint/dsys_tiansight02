import React from 'react';
const cx = (...a) => a.filter(Boolean).join(' ');
export function Button({ variant = 'primary', size, disabled, pressed, latin, children, ...rest }) {
  return <button type="button" className={cx('ts-button', variant !== 'primary' && 'ts-button-' + variant, size && 'ts-button-' + size)} disabled={disabled} aria-pressed={pressed || undefined} {...rest}>{children}{latin && <span className="ts-latin">{latin}</span>}</button>;
}