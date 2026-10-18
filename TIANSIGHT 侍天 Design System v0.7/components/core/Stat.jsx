import React from 'react';
export function Stat({ label, value, unit, boundary, charcoal, ...rest }) {
  return <div className="ts-stat" {...rest}><span className="ts-caption">{label}</span><span className={'ts-value' + (charcoal ? ' ts-charcoal' : '')}>{value}{unit && <small>{unit}</small>}</span>{boundary && <span className="ts-boundary">{boundary}</span>}</div>;
}