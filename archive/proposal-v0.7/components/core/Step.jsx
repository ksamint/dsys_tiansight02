import React from 'react';
export function Step({ current, children, ...rest }) {
  return <span className="ts-step" aria-current={current ? 'step' : undefined} {...rest}>{children}</span>;
}