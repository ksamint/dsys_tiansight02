import React from 'react';
export function Disclosure({ summary, open, children, ...rest }) {
  return <details className="ts-disclosure" open={open} {...rest}><summary>{summary}<span className="ts-icon" aria-hidden="true">⌄</span></summary><div className="body">{children}</div></details>;
}