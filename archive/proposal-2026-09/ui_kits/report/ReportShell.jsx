const { Seal, Badge, Button, Icon, Switch, Divider } = window.TIANSIGHTDesignSystem_bb63dc;

const PAGES = [
  { key: "decision", label: "决策维度", en: "DECISION" },
  { key: "analysis", label: "分析维度", en: "ANALYSIS" },
  { key: "trend", label: "趋势与归因", en: "TREND" },
  { key: "method", label: "方法论地图", en: "METHOD MAP" }
];

function ReportShell({ page, onPage, onlyAnomalies, onToggle, children }) {
  return <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "244px minmax(0,1fr)" }}>
    <aside style={{ borderRight: "1px solid var(--line-hairline)", background: "var(--parchment-100)", padding: "22px 20px", display: "flex", flexDirection: "column", gap: "var(--space-7)", position: "sticky", top: 0, height: "100vh" }}>
      <Seal size={32} wordmark subtitle="报告样张" src="../../assets/logo-seal.png" />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {PAGES.map(p => {
          const on = p.key === page;
          return <div key={p.key} onClick={() => onPage(p.key)}
            style={{ cursor: "pointer", padding: "10px 12px", borderRadius: "var(--radius-sm)",
              borderLeft: "1.5px solid " + (on ? "var(--line-strong)" : "transparent"),
              background: on ? "var(--surface-card)" : "transparent",
              display: "flex", flexDirection: "column", gap: 2,
              transition: "all var(--dur-fast) var(--ease-standard)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: on ? 500 : 400, letterSpacing: "var(--tracking-cjk-display)", color: on ? "var(--bronze-600)" : "var(--ink-700)" }}>{p.label}</span>
            <span style={{ fontFamily: "var(--font-quote)", fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-caps)", color: "var(--text-muted)" }}>{p.en}</span>
          </div>;
        })}
      </div>
      <Divider spacing="0" />
      <Switch label="仅看异常项" description="隐藏在阈值内的指标" checked={onlyAnomalies} onChange={e => onToggle(e.target.checked)} />
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Badge tone="bronze" variant="solid">真实报告</Badge><Badge tone="neutral">V4.2</Badge></div>
        <span style={{ fontFamily: "var(--font-numeral)", fontSize: "var(--text-3xs)", color: "var(--text-muted)" }}>2025-03 → 2025-08 · 7 家门店</span>
        <Button variant="secondary" size="sm" fullWidth icon={<Icon name="file-text" size={14} />} iconPosition="left">导出 PDF</Button>
      </div>
    </aside>
    <main style={{ background: "var(--surface-page)", padding: "34px 40px 72px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>{children}</div>
    </main>
  </div>;
}

function PageHead({ eyebrow, title, subtitle, meta }) {
  return <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-7)", paddingBottom: "var(--space-4)", borderBottom: "1.5px solid var(--line-rule)", flexWrap: "wrap" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <span style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }}>{eyebrow}</span>
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{title}</h1>
      {subtitle ? <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)", maxWidth: "34em" }}>{subtitle}</p> : null}
    </div>
    {meta ? <span style={{ fontFamily: "var(--font-numeral)", fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>{meta}</span> : null}
  </header>;
}

function Panel({ caption, title, note, children, span }) {
  return <div style={{ gridColumn: span ? "1 / -1" : "auto", background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {caption ? <span style={{ fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }}>{caption}</span> : null}
        <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{title}</span>
      </div>
      {note ? <span style={{ fontSize: "var(--text-3xs)", color: "var(--text-muted)" }}>{note}</span> : null}
    </div>
    {children}
  </div>;
}

Object.assign(window, { ReportShell, PageHead, Panel, REPORT_PAGES: PAGES });
