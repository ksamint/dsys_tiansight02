import React, { useState } from 'react';
export function Tabs({ tabs, pill, initial = 0, ...rest }) {
  const [i, setI] = useState(initial);
  return <div {...rest}><div className={'ts-tabs' + (pill ? ' ts-tabs-pill' : '')} role="tablist">{tabs.map((t, k) => <button key={k} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>{t.label}</button>)}</div><div role="tabpanel" style={{ paddingTop: 'var(--space-4)' }}>{tabs[i].content}</div></div>;
}