import React from 'react';
export function HeadingPair({ caption, level = 2, sub, children, ...rest }) {
  const H = 'h' + level;
  return <div className="ts-heading" {...rest}><H style={{ margin: 0 }}>{children}</H><span className="ts-caption">{caption}</span>{sub && <p className="ts-sub" style={{ margin: 0 }}>{sub}</p>}</div>;
}