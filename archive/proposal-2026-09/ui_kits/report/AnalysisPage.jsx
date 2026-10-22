const { Matrix2x2, BarSeries, Tag, Divider, Badge } = window.TIANSIGHTDesignSystem_bb63dc;

const CHAPTERS = [
  { key: "渗透率矩阵", note: "菜品结构", kind: "matrix", data: { xAxis: "点单渗透率", yAxis: "毛利率",
      quadrants: [{ label: "高毛利低渗透 · 值得推", tone: "caution" }, { label: "招牌担当 · 守住", tone: "growth" }, { label: "低毛利低渗透 · 下架候选", tone: "muted" }, { label: "低毛利高渗透 · 改配方", tone: "loss" }],
      points: [{ label: "文思豆腐", x: .74, y: .78, tone: "growth" }, { label: "蟹粉狮子头", x: .28, y: .72, tone: "caution" }, { label: "响油鳝糊", x: .68, y: .22, tone: "loss" }, { label: "冷碟拼盘", x: .2, y: .18, tone: "muted" }, { label: "松鼠鳜鱼", x: .55, y: .62, tone: "bronze" }] } },
  { key: "商圈供需洞察", note: "需求 vs 供给", kind: "matrix", data: { xAxis: "同业供给密度", yAxis: "需求强度",
      quadrants: [{ label: "需求旺 供给稀 · 抢占", tone: "growth" }, { label: "需求旺 供给密 · 打差异", tone: "caution" }, { label: "双低 · 不投入", tone: "muted" }, { label: "需求弱 供给密 · 退出", tone: "loss" }],
      points: [{ label: "写字楼午市", x: .32, y: .82, tone: "growth" }, { label: "住宅晚市", x: .58, y: .66, tone: "bronze" }, { label: "商场档口", x: .84, y: .44, tone: "loss" }] } },
  { key: "复购分层四象限", note: "会员分层", kind: "matrix", data: { xAxis: "复购频次", yAxis: "客单价",
      quadrants: [{ label: "高价低频 · 待激活", tone: "caution" }, { label: "核心客群 · 守住", tone: "growth" }, { label: "低价低频 · 观察", tone: "muted" }, { label: "低价高频 · 提客单", tone: "bronze" }],
      points: [{ label: "会员 A 层", x: .78, y: .74, tone: "growth" }, { label: "会员 B 层", x: .26, y: .66, tone: "caution" }, { label: "平台新客", x: .7, y: .26, tone: "bronze" }, { label: "沉睡会员", x: .18, y: .22, tone: "muted" }] } },
  { key: "利润敏感性矩阵", note: "1% 变动的利润弹性", kind: "bars", unit: "万/季",
    bars: [{ label: "折扣结构", value: 4.8, tone: "loss" }, { label: "食材损耗", value: 3.1, tone: "loss" }, { label: "套餐结构", value: 2.9, tone: "growth" }, { label: "人效排班", value: 2.4, tone: "caution" }, { label: "外卖运费", value: 1.2, tone: "muted" }] },
  { key: "价格带断层洞察", note: "订单量分布", kind: "bars", unit: "%",
    bars: [{ label: "38–58 元", value: 34, tone: "bronze" }, { label: "58–88 元", value: 12, tone: "loss" }, { label: "88–128 元", value: 29, tone: "growth" }, { label: "128 元以上", value: 8, tone: "muted" }, { label: "38 元以下", value: 17, tone: "caution" }] }
];

function AnalysisPage() {
  const [active, setActive] = React.useState(CHAPTERS[0].key);
  const ch = CHAPTERS.find(c => c.key === active);
  return <React.Fragment>
    <PageHead eyebrow="分析维度 / 经营洞察图谱" title="增长在何处，利润失于何处"
      subtitle="五张图谱逐层拆解菜品、商圈、会员、利润与价格带；每个点位都能追回原始凭证。" meta="5 CHARTS · V4.2" />
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      {CHAPTERS.map(c => <Tag key={c.key} active={c.key === active} onClick={() => setActive(c.key)}>{c.key}</Tag>)}
    </div>
    <Panel caption={ch.note} title={ch.key} note="点击上方图谱切换">
      {ch.kind === "matrix"
        ? <Matrix2x2 height={340} {...ch.data} />
        : <div style={{ paddingTop: "var(--space-3)" }}><BarSeries data={ch.bars} unit={ch.unit} labelWidth={110} height={18} /></div>}
    </Panel>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-6)" }}>
      {[["证据可追溯", "每个点位可下钻到原始收银与结算凭证。"], ["口径统一", "收银、平台、会员三源对齐同一口径后入图。"], ["不猜不编", "样本不足的维度不出结论，只作标注。"]].map(([t, b]) =>
        <div key={t} style={{ background: "var(--parchment-100)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{t}</div>
          <p style={{ margin: "8px 0 0", fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>{b}</p>
        </div>)}
    </div>
  </React.Fragment>;
}

Object.assign(window, { AnalysisPage });
