import React from 'react';
const cx = (...a) => a.filter(Boolean).join(' ');
export function Card({ variant, index, caption, title, interactive, selected, children, ...rest }) {
  return <article className={cx('ts-card', variant && 'ts-card-' + variant, interactive && 'ts-card-interactive', selected && 'selected')} data-index={index} aria-selected={selected || undefined} {...rest}>
    {caption && <span className="ts-caption">{caption}</span>}
    {title && <h3 className="ts-card-title">{title}</h3>}
    {children}
  </article>;
}