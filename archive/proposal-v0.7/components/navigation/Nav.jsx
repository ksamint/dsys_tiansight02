import React from 'react';
export function Nav({ items, ...rest }) {
  return <nav className="ts-nav" {...rest}>{items.map(it => <a key={it.label} href={it.href || '#'} aria-current={it.current ? 'page' : undefined}>{it.label}</a>)}</nav>;
}