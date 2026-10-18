import React from 'react';
export function Pagination({ pages, current, onChange, ...rest }) {
  return <ul className="ts-pagination" {...rest}>{Array.from({ length: pages }, (_, i) => i + 1).map(n => <li key={n}>{n === current ? <span aria-current="page">{n}</span> : <a href={'#p' + n} onClick={e => { e.preventDefault(); onChange && onChange(n); }}>{n}</a>}</li>)}</ul>;
}