import React from 'react';
export function Field({ label, hint, error, kind = 'input', id, options = [], ...rest }) {
  const fid = id || 'f-' + Math.random().toString(36).slice(2, 7);
  const ctl = kind === 'select' ? <select id={fid} className="ts-select" aria-invalid={error ? 'true' : undefined} {...rest}>{options.map(o => <option key={o}>{o}</option>)}</select>
    : kind === 'textarea' ? <textarea id={fid} className="ts-textarea" rows={4} aria-invalid={error ? 'true' : undefined} {...rest} />
    : <input id={fid} className="ts-input" aria-invalid={error ? 'true' : undefined} {...rest} />;
  return <div className="ts-field"><label className="ts-label" htmlFor={fid}>{label}</label>{ctl}{error ? <span className="ts-error">{error}</span> : hint && <span className="ts-hint">{hint}</span>}</div>;
}