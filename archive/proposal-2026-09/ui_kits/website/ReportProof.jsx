const { SectionHeading, Card, Tag, Matrix2x2, BarSeries, LedgerTable, Icon, Badge } = window.TIANSIGHTDesignSystem_bb63dc;

const CHAPTERS = [
  { key: "菜品结构", title: "渗透率矩阵", kind: "matrix",
    matrix: { xAxis: "点单渗透率", yAxis: "毛利率",
      quadrants: [{ label: "高毛利低渗透 · 值得推", tone: "caution" }, { label: "招牌担当 · 守住", tone: "growth" }, { label: "低毛利低渗透 · 下架候选", tone: "muted" }, { label: "低毛利高渗透 · 改配方", tone: "loss" }],
      points: [{ label: "文思豆腐", x: .74, y: .78, tone: "growth" }, { label: "蟹粉狮子头", x: .28, y: .71, tone: "caution" }, { label: "响油鳝糊", x: .68, y: .22, tone: "loss" }, { label: "冷碟拼盘", x: .22, y: .2, tone: "muted" }] } },
  { key: "商圈供需", title: "商圈供需洞察", kind: "bars",
    bars: [{ label: "写字楼午市", value: 82, tone: "growth" }, { label: "周边住宅晚市", value: 64, tone: "bronze" }, { label: "商场客流", value: 41, tone: "caution" }, { label: "同业供给密度", value: 88, tone: "loss" }] },
  { key: "复购四象限", title: "复购分层四象限", kind: "matrix",
    matrix: { xAxis: "复购频次", yAxis: "客单价",
      quadrants: [{ label: "高价低频 · 待激活", tone: "caution" }, { label: "核心客群 · 守住", tone: "growth" }, { label: "低价低频 · 观察", tone: "muted" }, { label: "低价高频 · 提客单", tone: "bronze" }],
      points: [{ label: "会员 A 层", x: .78, y: .74, tone: "growth" }, { label: "会员 B 层", x: .26, y: .66, tone: "caution" }, { label: "平台新客", x: .7, y: .26, tone: "bronze" }] } },
  { key: "利润敏感性", title: "利润敏感性矩阵", kind: "bars",
    bars: [{ label: "折扣结构", value: 4.8, tone: "loss" }, { label: "食材损耗", value: 3.1, tone: "loss" }, { label: "人效排班", value: 2.4, tone: "caution" }, { label: "套餐结构", value: 2.9, tone: "growth" }] },
  { key: "价格带洞察", title: "价格带断层洞察", kind: "bars",
    bars: [{ label: "38–58 元", value: 34, tone: "bronze" }, { label: "58–88 元", value: 12, tone: "loss" }, { label: "88–128 元", value: 29, tone: "growth" }, { label: "128 元以上", value: 8, tone: "muted" }] }
];

const PROMISES = [
  { icon: "target", label: "哪里最值得先改" },
  { icon: "users", label: "谁负责，何时完成" },
  { icon: "shield", label: "用什么指标验收" }
];

function ReportProof() {
  const [active, setActive] = React.useState(CHAPTERS[0].key);
  const ch = CHAPTERS.find(c => c.key === active);
  return <section id="proof" style={{ background: "var(--parchment-100)", borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="以样张为证" title="一份报告，就是一份决策文件"
        subtitle="每条结论具备四要素：证据、利润影响、执行动作、验收指标。可计算的，量化到位；不可计算的，如实说明。" />
      <div style={{ display: "flex", gap: "var(--space-7)", marginTop: "var(--space-6)", flexWrap: "wrap" }}>
        {PROMISES.map(p => <span key={p.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--ink-700)" }}>
          <span style={{ color: "var(--bronze-500)", display: "flex" }}><Icon name={p.icon} size={18} /></span>{p.label}
        </span>)}
      </div>
      <Card padding="lg" style={{ marginTop: "var(--space-8)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-5)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>经营洞察图谱</span>
            <Badge tone="neutral">V4.2</Badge>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {CHAPTERS.map(c => <Tag key={c.key} active={c.key === active} onClick={() => setActive(c.key)}>{c.key}</Tag>)}
          </div>
        </div>
        <div style={{ height: 1, background: "var(--line-hairline)", margin: "var(--space-6) 0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "var(--space-9)", alignItems: "start" }}>
          <div>
            <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)", marginBottom: "var(--space-4)" }}>{ch.title}</div>
            {ch.kind === "matrix"
              ? <Matrix2x2 height={260} {...ch.matrix} />
              : <div style={{ paddingTop: "var(--space-3)" }}><BarSeries data={ch.bars} unit="%" labelWidth={104} height={16} /></div>}
          </div>
          <LedgerTable caption="90 天行动清单"
            columns={[{ key: "action", label: "动作" }, { key: "owner", label: "责任人" }, { key: "due", label: "期限", mono: true }, { key: "kpi", label: "验收指标" }]}
            rows={[
              { action: "重排午市套餐结构", owner: "运营总监", due: "D+30", kpi: "午市客单 +8%" },
              { action: "收紧平台满减叠加", owner: "渠道经理", due: "D+45", kpi: "折扣率 ≤ 5.0%" },
              { action: "招牌菜出餐标准化", owner: "行政总厨", due: "D+60", kpi: "出餐时长 ≤ 9 分钟" },
              { action: "会员 B 层唤醒计划", owner: "会员运营", due: "D+90", kpi: "B 层复购 +6pt" }
            ]}
            footer="数据来源：收银流水 2025-03 至 2025-08，含平台结算单与会员消费明细。" />
        </div>
      </Card>
    </div>
  </section>;
}

Object.assign(window, { ReportProof });
