const { Button, Badge, Stat, Eyebrow, Icon, Divider } = window.TIANSIGHTDesignSystem_703ad4;

const SHEETS = [
  { name: "侍天决策维度报告", tag: "决策维度" },
  { name: "侍天分析维度报告", tag: "分析维度" },
  { name: "侍天方法论地图", tag: "方法论地图" }
];

function SheetThumb({ sheet, onOpen }) {
  const [h, setH] = React.useState(false);
  return <div onClick={onOpen} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ cursor: "pointer", background: "var(--surface-card)", border: "1px solid " + (h ? "var(--gold)" : "var(--line-card)"),
      borderRadius: "var(--radius)", overflow: "hidden", transition: "border-color var(--dur-fast) var(--ease-standard)" }}>
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
        <Eyebrow>侍天 TIANSIGHT</Eyebrow>
        <h1 style={{ margin: "20px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-6xl)", fontWeight: "var(--weight-medium)", lineHeight: 1.12, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>
          从一道菜，<br />到一家家店的好生意。
        </h1>
        <p style={{ margin: "26px 0 0", maxWidth: "30em", fontSize: "var(--text-lg)", lineHeight: "var(--leading-normal)", color: "var(--text-body)" }}>
          菜单，是餐厅向顾客发出的购买邀请，也是每天都在执行的经营决策。侍天以菜单设计与持续迭代为核心，将餐饮实战、经营分析与组织能力建设结合起来。
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-8)", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" icon={<Icon name="arrow-right" size={16} />} onClick={() => onNav("contact")}>问侍天</Button>
          <Button variant="secondary" size="lg" onClick={() => onNav("ladder")}>餐饮第二大脑</Button>
        </div>
        <Divider spacing="var(--space-8)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-6)" }}>
          {[["让顾客愿意点", "卖什么，决定顾客为什么来"], ["让团队做得稳", "如何组合，牵动采购、后厨与出品"], ["让经营留下收益", "怎么定价，影响顾客怎么点"]].map(([t, b]) =>
            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-title)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{t}</span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{b}</span>
            </div>)}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          <Badge variant="outline">真实报告</Badge>
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
