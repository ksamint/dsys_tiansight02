const { StepMarker, Divider, Icon, Badge } = window.TIANSIGHTDesignSystem_bb63dc;

const STEPS = [
  { label: "现状", q: "现在怎样", aim: "看清经营", body: "汇总收银、平台、会员与门店数据", out: "一本账 · 口径对齐表" },
  { label: "机会", q: "机会在哪", aim: "发现增长点", body: "增长机会与利润流失，一并定位", out: "五张经营洞察图谱" },
  { label: "优先", q: "先做什么", aim: "判断顺序", body: "按利润影响与可执行性排序", out: "先改哪三件" },
  { label: "行动", q: "谁来负责", aim: "形成清单", body: "明确动作、责任人、期限与指标", out: "90 天行动清单" },
  { label: "结果", q: "是否有效", aim: "验证结果", body: "对比执行前后变化，继续校正", out: "验收记录 · 门店标准" }
];

const LAYERS = [
  { tier: "第一层 · 经营洞察", name: "先把问题看清", got: "增长机会、利润流失点与 90 天行动清单" },
  { tier: "第二层 · 第二大脑共建", name: "让系统昼夜守望经营", mode: "深度共建", got: "打通收银、平台与会员数据：自动对账、异常预警、决策看板" },
  { tier: "第三层 · AI 原生品牌", name: "从零构建一个新品牌", mode: "从 0 共创", got: "品牌、组织、数字底座一体化设计，数据资产归品牌自己" },
  { tier: "X · 增值专项", name: "随层挂接，按需启用", mode: "按需挂接", got: "企业大学、菜单结构、运营托管、成本优化、专家顾问团支持" }
];

function MethodMapPage() {
  return <React.Fragment>
    <PageHead eyebrow="方法论地图 / 经营五问" title="五问既明，百事可决"
      subtitle="逐店逐月，循环推演。经验证有效的做法沉淀为门店标准，不随人员流动而流失。" meta="METHOD MAP · V4.2" />
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: "var(--space-7)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: "var(--space-4)", position: "relative" }}>
        <span aria-hidden="true" style={{ position: "absolute", left: 20, right: 20, top: 22, height: 1, background: "var(--line-hairline)" }} />
        {STEPS.map((s, i) => <div key={s.label} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <StepMarker index={i + 1} active={i === 0} size={44} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{s.label}</span>
            <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-accent)" }}>{s.q + " · " + s.aim}</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "var(--leading-normal)" }}>{s.body}</span>
            <span style={{ marginTop: 6, paddingTop: 8, borderTop: "1px solid var(--line-hairline)", fontFamily: "var(--font-numeral)", fontSize: "var(--text-3xs)", color: "var(--text-muted)" }}>{s.out}</span>
          </div>
        </div>)}
      </div>
      <Divider spacing="var(--space-7)" />
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--ink-700)" }}>
        <span style={{ color: "var(--bronze-500)", display: "flex" }}><Icon name="check" size={17} /></span>
        经验证有效的做法沉淀为门店标准，不随人员流动而流失。
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <span style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }}>层层递进，天天有数</span>
      {LAYERS.map((l, i) => <div key={l.tier} style={{ display: "grid", gridTemplateColumns: "38px minmax(0,240px) minmax(0,1fr) auto", gap: "var(--space-5)", alignItems: "center", background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderLeft: "2px solid " + (i === 1 ? "var(--bronze-500)" : "var(--line-hairline)"), borderRadius: "var(--radius-md)", padding: "var(--space-5) var(--space-6)" }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, color: "var(--bronze-500)" }}>{["一", "二", "三", "X"][i]}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" }}>{l.tier}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{l.name}</span>
        </div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "var(--leading-normal)" }}>
          <span style={{ fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)", marginRight: 8 }}>老板得到</span>{l.got}
        </span>
        {l.mode ? <Badge tone={i === 1 ? "bronze" : "neutral"} variant={i === 1 ? "solid" : "soft"}>{l.mode}</Badge> : <span />}
      </div>)}
    </div>
  </React.Fragment>;
}

Object.assign(window, { MethodMapPage });
