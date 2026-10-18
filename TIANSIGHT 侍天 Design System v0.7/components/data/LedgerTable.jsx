import React from 'react';
export function LedgerTable({ columns, rows, total, ...rest }) {
  return <table className="ts-table-ledger" {...rest}><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>
    {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={typeof c === 'object' && c.mono ? 'ts-mono' : undefined}>{typeof c === 'object' ? c.text : c}</td>)}</tr>)}
    {total && <tr data-total="">{total.map((c, j) => <td key={j}>{c}</td>)}</tr>}
  </tbody></table>;
}