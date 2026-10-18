import React from 'react';
export function Breadcrumb({ items, ...rest }) {
  return <ol className="ts-breadcrumb" {...rest}>{items.map((it, i) => <li key={i}>{i === items.length - 1 ? <span aria-current="page">{it.label}</span> : <a href={it.href || '#'}>{it.label}</a>}</li>)}</ol>;
}