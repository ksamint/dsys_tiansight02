const { SectionHeading, StepMarker, Card, Divider, Icon } = window.TIANSIGHTDesignSystem_bb63dc;

const STEPS = [
  { label: "现状", q: "现在怎样", aim: "看清经营", body: "汇总收银、平台、会员与门店数据" },
  { label: "机会", q: "机会在哪", aim: "发现增长点", body: "增长机会与利润流失，一并定位" },
  { label: "优先", q: "先做什么", aim: "判断顺序", body: "按利润影响与可执行性排序" },
  { label: "行动", q: "谁来负责", aim: "形成清单", body: "明确动作、责任人、期限与指标" },
  { label: "结果", q: "是否有效", aim: "验证结果", body: "对比执行前后变化，继续校正" }
];

const THREE = [
  { t: "看得清", b: "收银、平台、会员数据合成一本账，每个数字有出处，异常能追溯。" },
  { t: "改得动", b: "问题进入行动清单，明确优先级、责任人和验证周期。" },
  { t: "留得下", b: "有效的做法沉淀成店里的标准动作，换店长、开新店都不走样。" }
];

function FiveQuestions() {
  const [i, setI] = React.useState(0);
  const s = STEPS[i];
  return <section id="five" style={{ borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="经营五问" title="逐店逐月，循环推演" subtitle="五问既明，百事可决。" />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,300px) minmax(0,1fr)", gap: "var(--space-9)", marginTop: "var(--space-8)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {STEPS.map((st, n) => <div key={st.label} onClick={() => setI(n)}
            style={{ cursor: "pointer", padding: "10px 12px", borderRadius: "var(--radius-sm)",
              background: n === i ? "var(--parchment-100)" : "transparent",
              borderLeft: "1.5px solid " + (n === i ? "var(--line-strong)" : "transparent"),
              transition: "all var(--dur-fast) var(--ease-standard)" }}>
            <StepMarker index={n + 1} label={st.label} sublabel={st.q + " · " + st.aim} active={n === i} size={38} />
          </div>)}
        </div>
        <Card padding="lg" style={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }}>{"第 " + (i + 1) + " 问 · " + s.q}</div>
          <h3 style={{ margin: "14px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{s.aim}</h3>
          <p style={{ margin: "16px 0 0", fontSize: "var(--text-lg)", color: "var(--text-body)", maxWidth: "28em" }}>{s.body}</p>
          <Divider spacing="var(--space-7)" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-6)", marginTop: "auto" }}>
            {THREE.map(t => <div key={t.t} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>
                <span style={{ color: "var(--bronze-500)", display: "flex" }}><Icon name="circle-dot" size={15} /></span>{t.t}
              </span>
              <span style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--text-muted)" }}>{t.b}</span>
            </div>)}
          </div>
        </Card>
      </div>
      <p style={{ margin: "var(--space-7) 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--ink-700)", letterSpacing: "var(--tracking-cjk-display)" }}>
        经验证有效的做法沉淀为门店标准，不随人员流动而流失。
      </p>
    </div>
  </section>;
}

Object.assign(window, { FiveQuestions });
