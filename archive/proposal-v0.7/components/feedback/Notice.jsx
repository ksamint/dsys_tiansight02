import React from 'react';
const cx = (...a) => a.filter(Boolean).join(' ');
export function Notice({ variant, title, children, ...rest }) {
  return <div className={cx('ts-notice', variant && 'ts-notice-' + variant)} role={variant === 'warn' ? 'alert' : 'status'} {...rest}><span className="ts-icon" aria-hidden="true">·</span><div>{title && <b>{title}</b>}{children}</div></div>;
}