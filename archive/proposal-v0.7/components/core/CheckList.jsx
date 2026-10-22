import React from 'react';
export function CheckList({ items, ...rest }) {
  return <ul className="ts-check-list" {...rest}>{items.map((it, i) => <li key={i} data-no={it.no ? '' : undefined}>{it.text}</li>)}</ul>;
}