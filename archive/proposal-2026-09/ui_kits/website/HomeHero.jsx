const { Button, Badge, Stat, Eyebrow, Icon, Divider } = window.TIANSIGHTDesignSystem_bb63dc;

const SHEETS = [
  { name: "侍天决策维度报告", tag: "决策维度" },
  { name: "侍天分析维度报告", tag: "分析维度" },
  { name: "侍天方法论地图", tag: "方法论地图" }
];

function SheetThumb({ sheet, onOpen }) {
  const [h, setH] = React.useState(false);
  return <div onClick={onOpen} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ cursor: "pointer", background: "var(--surface-card)", border: "1px solid " + (h ? "var(--line-rule)" : "var(--line-hairline)"),
      borderRadius: "var(--radius-md)", boxShadow: h ? "var(--shadow-md)" : "var(--shadow-sm)", overflow: "hidden",
      transform: h ? "translateY(-2px)" : "none", transition: "all var(--dur-base) var(--ease-standard)" }}>
    <div style={{ height: 132, padding: "14px 14px 0", display: "flex", flexDirection: "column", gap: 7, background: "var(--parchment-50)", borderBottom: "1px solid var(--line-hairline)" }}>
      <div style={{ height: 5, width: "42%", background: "var(--bronze-400)", borderRadius: 1 }} />
      <div style={{ height: 3, width: "78%", background: "var(--parchment-400)" }} />
      <div style={{ height: 3, width: "64%", background: "var(--parchment-400)" }} />
      <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "flex-end", height: 56 }}>
        {[.5, .78, .36, .92, .62].map((v, i) =>
          <div key={i} style={{ flex: 1, height: v * 100 + "%", background: i === 3 ? "var(--growth-500)" : i === 2 ? "var(--loss-500)" : "var(--parchment-300)", borderRadius: "1px 1px 0 0" }} />)}
      </div>
    </div>
    <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-800)" }}>{sheet.name}</span>
      <span style={{ color: "var(--bronze-500)", display: "flex" }}><Icon name="arrow-up-right" size={14} /></span>
    </div>
  </div>;
}

function HomeHero({ onNav }) {
  return <section id="top" className="ts-paper" style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line-hairline)" }}>
    <div aria-hidden="true" style={{ position: "absolute", right: -180, top: -120, width: 620, height: 620, borderRadius: "50%", border: "1.5px solid rgba(118,85,31,.09)" }} />
    <div aria-hidden="true" style={{ position: "absolute", right: -60, top: 40, width: 380, height: 380, borderRadius: "50%", border: "1px solid rgba(118,85,31,.06)" }} />
    <div style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "88px 32px 72px", display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,.95fr)", gap: "var(--space-10)", alignItems: "start" }}>
      <div>
        <Eyebrow>侍天 TIANSIGHT · 餐饮第二大脑</Eyebrow>
        <h1 style={{ margin: "20px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-6xl)", fontWeight: "var(--weight-medium)", lineHeight: 1.12, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>
          拍板之前，<br />问侍天
        </h1>
        <p style={{ margin: "26px 0 0", maxWidth: "30em", fontSize: "var(--text-lg)", lineHeight: "var(--leading-normal)", color: "var(--text-body)" }}>
          交 6 个月经营数据，7 日内取得经营诊断：增长在何处、利润失于何处、先改哪三件、由谁执行、以何验收。
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-8)", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" icon={<Icon name="arrow-right" size={16} />} onClick={() => onNav("contact")}>进入平台</Button>
          <Button variant="secondary" size="lg" onClick={() => onNav("ladder")}>服务与价格</Button>
        </div>
        <Divider spacing="var(--space-8)" />
        <div style={{ display: "flex", gap: "var(--space-9)", flexWrap: "wrap" }}>
          <Stat label="交付周期" value="7" unit="日内" tone="bronze" />
          <Stat label="数据窗口" value="6" unit="个月" />
          <Stat label="行动清单" value="90" unit="天" />
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          <Badge tone="bronze" variant="solid">真实报告</Badge>
          <Badge tone="neutral">V4.2</Badge>
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>报告样张</span>
        </div>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          {SHEETS.map(s => <SheetThumb key={s.name} sheet={s} onOpen={() => onNav("proof")} />)}
        </div>
      </div>
    </div>
  </section>;
}

Object.assign(window, { HomeHero, SheetThumb });
