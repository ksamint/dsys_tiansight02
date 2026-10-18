const { SectionHeading, StepMarker, Card, Divider, Icon } = window.TIANSIGHTDesignSystem_703ad4;

const STEPS = [
  { label: "开店之前", q: "把生意想清楚", aim: "建立餐厅概念", body: "从目标客群、用餐场景与商圈竞争出发，建立餐厅概念，设计招牌产品、菜单结构、价格与组合，同时核对成本、后厨产能和人员配置，让开店设想具备可执行的经营基础。" },
  { label: "经营之中", q: "把问题找到菜上", aim: "识别去留与消耗", body: "结合真实点单、收入成本、现场出品与顾客反馈，识别哪些菜值得保留，哪些需要调整，哪些场景尚未满足，以及哪些环节正在消耗利润。每个建议都明确依据、动作与验证方式。" },
  { label: "每月复盘", q: "让菜单持续进化", aim: "逐项核对结果", body: "追踪新品表现、时令变化、价格接受度、组合选择与履约体验，将上轮调整与实际结果逐项核对，形成下一轮菜品、定价、供应和服务动作。" },
  { label: "复制扩张", q: "让好方法进入组织", aim: "稳定交付", body: "把成熟门店的产品标准、经营参数与执行方法沉淀下来，通过岗位分工、培训辅导、经营例会和持续督导，帮助更多门店稳定交付，同时保留因商圈、客群与店型而异的调整空间。" }
];

const THREE = [
  { t: "有依据", b: "每次拍板有依据。" },
  { t: "有人落实", b: "每项行动有人落实。" },
  { t: "可以核对", b: "每轮改善可以核对。" }
];

function FiveQuestions() {
  const [i, setI] = React.useState(0);
  const s = STEPS[i];
  return <section id="five" style={{ borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="从概念到连锁" title="贯穿新餐厅概念开创、单店经营优化与连锁规模化发展" subtitle="产品决定顾客的选择，组织决定承诺能否兑现。侍天把这两件事放在同一张经营蓝图里。" />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,300px) minmax(0,1fr)", gap: "var(--space-9)", marginTop: "var(--space-8)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {STEPS.map((st, n) => <div key={st.label} onClick={() => setI(n)}
            style={{ cursor: "pointer", padding: "10px 12px", borderRadius: "var(--radius)",
              background: n === i ? "var(--parchment-100)" : "transparent",
              borderLeft: "1.5px solid " + (n === i ? "var(--line-strong)" : "transparent"),
              transition: "all var(--dur-fast) var(--ease-standard)" }}>
            <StepMarker index={n + 1} label={st.label} sublabel={st.q} active={n === i} size={38} />
          </div>)}
        </div>
        <Card padding="lg" style={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-caption)" }}>{s.label}</div>
          <h3 style={{ margin: "14px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: "var(--weight-title)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{s.q}</h3>
          <p style={{ margin: "16px 0 0", fontSize: "var(--type-body)", lineHeight: "var(--leading-normal)", color: "var(--text-body)", maxWidth: "36em" }}>{s.body}</p>
          <Divider spacing="var(--space-7)" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-6)", marginTop: "auto" }}>
            {THREE.map(t => <div key={t.t} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-title)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>
                <span style={{ color: "var(--gold)", display: "flex" }}><Icon name="seal" size={15} /></span>{t.t}
              </span>
              <span style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--text-muted)" }}>{t.b}</span>
            </div>)}
          </div>
        </Card>
      </div>
      <p style={{ margin: "var(--space-7) 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--ink-700)", letterSpacing: "var(--tracking-cjk-display)" }}>
        让顾客愿意点，让团队做得稳，让经营留下收益。
      </p>
    </div>
  </section>;
}

Object.assign(window, { FiveQuestions });
