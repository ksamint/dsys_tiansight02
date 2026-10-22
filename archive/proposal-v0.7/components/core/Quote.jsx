import React from 'react';
export function Quote({ by, children, ...rest }) {
  return <blockquote className="ts-quote" {...rest}>{children}{by && <footer>{by}</footer>}</blockquote>;
}