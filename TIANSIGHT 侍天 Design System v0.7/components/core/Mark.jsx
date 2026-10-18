import React from 'react';
export function Mark({ size = 40, wordmark, caption = 'Tiansight', src = 'brand/logo.png', ...rest }) {
  const img = <span className="ts-mark" style={{ '--mark-size': size + 'px' }}><img src={src} alt="侍天" /></span>;
  if (!wordmark) return img;
  return <span className="ts-lockup-row" {...rest}>{img}<span className="ts-wordmark"><span className="ts-caption" style={{ letterSpacing: 'var(--tracking-caps-tight)' }}>{caption}</span></span></span>;
}