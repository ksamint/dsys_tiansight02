import React from 'react';
export function Progress({ value, max = 100, label, key: k, keyed, ...rest }) {
  const pct = Math.round(100 * value / max);
  return <div className="ts-progress" {...rest}><div className="track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><div className={'fill' + (keyed ? ' key' : '')} style={{ width: pct + '%' }} /></div><div className="meta"><span>{label}</span><span>{value} / {max}</span></div></div>;
}