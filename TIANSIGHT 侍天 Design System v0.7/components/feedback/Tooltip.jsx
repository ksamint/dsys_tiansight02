import React from 'react';
export function Tooltip({ tip, children, ...rest }) {
  return <span className="ts-tip" data-tip={tip} tabIndex={0} {...rest}>{children}</span>;
}