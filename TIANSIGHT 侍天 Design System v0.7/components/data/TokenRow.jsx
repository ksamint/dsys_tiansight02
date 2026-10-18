import React from 'react';
export function TokenRow({ color, name, cn, hex, usage, small, ...rest }) {
  return <div className="ts-token-row" {...rest}><span className="ts-swatch" style={{ '--swatch-color': color }} /><span className="ts-token-name">{name}<small>{cn}</small></span><span className="ts-mono ts-hex" data-small={small ? '' : undefined}>{hex}</span><span className="ts-usage">{usage}</span></div>;
}