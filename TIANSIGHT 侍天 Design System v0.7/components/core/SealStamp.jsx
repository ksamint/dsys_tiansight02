import React from 'react';
export function SealStamp({ size = 56, two, children = '侍', ...rest }) {
  return <span className="ts-seal-stamp" data-two={two ? '' : undefined} style={{ '--stamp-size': size + 'px' }} {...rest}>{children}</span>;
}