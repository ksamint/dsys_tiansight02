import React from 'react';
const cx = (...a) => a.filter(Boolean).join(' ');
export function Badge({ variant = 'filled', children, ...rest }) {
  return <span className={cx('ts-badge', variant === 'outline' && 'ts-badge-outline', variant === 'seal' && 'ts-badge-seal')} {...rest}>{children}</span>;
}