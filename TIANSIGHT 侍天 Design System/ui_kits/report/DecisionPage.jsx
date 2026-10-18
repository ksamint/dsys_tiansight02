const { Stat, MetricRow, LedgerTable, BarSeries, Badge, Divider, Icon } = window.TIANSIGHTDesignSystem_bb63dc;

const CONCLUSIONS = [
  { tone: "growth", head: "午市套餐结构存在可加码空间", evidence: "工作日午市点单集中在 38–58 元价格带，套餐渗透仅 34%。", impact: "+18.2 万 / 季", action: "重排午市套餐结构，主推高毛利招牌组合", kpi: "午市客单 +8%" },
  { tone: "loss", head: "平台满减与会员券叠加，让利失控", evidence: "6 个月内 27% 订单同时使用两类优惠，实收折扣率 6.7%。", impact: "-24.6 万 / 季", action: "收紧叠加规则，按时段分层投放", kpi: "折扣率 ≤ 5.0%" },
  { tone: "caution", head: "招牌菜出餐时长波动，影响复购", evidence: "晚市高峰出餐 P90 为 14.3 分钟，差评关键词首位为「上菜慢」。", impact: "不可计算，如实说明", action: "招牌菜出餐标准化与备料前置", kpi: "出餐时长 ≤ 9 分钟" }
];

function DecisionPage({ onlyAnomalies }) {
  const rows = onlyAnomalies ? CONCLUSIONS.filter(c => c.tone !== "growth") : CONCLUSIONS;
  return <React.Fragment>
    <PageHead eyebrow="第一层 · 经营洞察 / 决策维度" title="先改哪三件，由谁执行，以何验收"
      subtitle="每条结论具备四要素：证据、利润影响、执行动作、验收指标。可计算的，量化到位；不可计算的，如实说明。"
      meta="REPORT V4.2 · 2025-09-04" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-6)", background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderTop: "2px solid var(--bronze-500)", borderRadius: "var(--radius-md)", padding: "var(--space-6)" }}>
      <Stat label="季度营收" value="486.2" unit="万" />
      <Stat label="增长机会" value="+31.4" unit="万" tone="growth" note="午市套餐 + 会员唤醒" />
      <Stat label="利润流失" value="-38.9" unit="万" tone="loss" note="折扣叠加 + 食材损耗" />
      <Stat label="净可争取" value="+70.3" unit="万" tone="bronze" note="90 天内可落地部分" />
    </div>
    <Panel caption="结论 · 四要素" title={"先改这 " + rows.length + " 件"} note="按利润影响与可执行性排序">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        {rows.map((c, i) => <div key={c.head} style={{ display: "grid", gridTemplateColumns: "34px minmax(0,1fr)", gap: "var(--space-4)", paddingBottom: "var(--space-5)", borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--line-hairline)" }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, color: "var(--bronze-500)" }}>{["一", "二", "三"][i]}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }}>{c.head}</span>
              <Badge tone={c.tone}>{c.tone === "growth" ? "增长机会" : c.tone === "loss" ? "利润流失" : "关注"}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-5)" }}>
              {[["证据", c.evidence], ["利润影响", c.impact], ["执行动作", c.action], ["验收指标", c.kpi]].map(([k, v]) =>
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: k === "利润影响" ? (c.tone === "loss" ? "var(--loss-500)" : c.tone === "growth" ? "var(--growth-500)" : "var(--ink-700)") : "var(--ink-700)", fontFamily: k === "利润影响" ? "var(--font-numeral)" : "var(--font-body)" }}>{v}</span>
                </div>)}
            </div>
          </div>
        </div>)}
      </div>
    </Panel>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "var(--space-6)" }}>
      <Panel caption="逐店对比" title="门店经营指数" note="7 家门店 · 近 6 个月">
        <BarSeries labelWidth={96} unit="" data={[
          { label: "旗舰店", value: 92, tone: "growth" },
          { label: "C 店", value: 78, tone: "bronze" },
          { label: "F 店", value: 71, tone: "bronze" },
          { label: "D 店", value: 54, tone: "caution" },
          { label: "E 店", value: 38, tone: "loss" }]} />
      </Panel>
      <Panel caption="关键指标" title="一本账">
        <div>
          <MetricRow dense label="午市客流" sublabel="旗舰店 · 工作日" value="132" unit="人/日" delta="+8.4%" deltaTone="growth" />
          <MetricRow dense label="晚市翻台" value="2.6" unit="次" delta="+0.2" deltaTone="growth" />
          <MetricRow dense label="折扣让利" value="6.7" unit="%" delta="-2.1pt" deltaTone="loss" />
          <MetricRow dense label="食材损耗" value="4.3" unit="%" delta="-0.6pt" deltaTone="loss" />
          <MetricRow dense label="会员复购" value="31.2" unit="%" delta="+1.4pt" deltaTone="growth" />
        </div>
      </Panel>
    </div>
    <Panel caption="行动" title="90 天行动清单" note="动作 · 责任人 · 期限 · 验收指标">
      <LedgerTable
        columns={[{ key: "action", label: "动作" }, { key: "owner", label: "责任人" }, { key: "due", label: "期限", mono: true }, { key: "kpi", label: "验收指标" }, { key: "impact", label: "利润影响", mono: true, align: "right" }]}
        rows={[
          { action: "重排午市套餐结构", owner: "运营总监", due: "D+30", kpi: "午市客单 +8%", impact: "+18.2 万", impactTone: "growth" },
          { action: "收紧平台满减叠加", owner: "渠道经理", due: "D+45", kpi: "折扣率 ≤ 5.0%", impact: "+24.6 万", impactTone: "growth" },
          { action: "招牌菜出餐标准化", owner: "行政总厨", due: "D+60", kpi: "出餐时长 ≤ 9 分钟", impact: "如实说明", impactTone: "muted" },
          { action: "会员 B 层唤醒计划", owner: "会员运营", due: "D+90", kpi: "B 层复购 +6pt", impact: "+13.1 万", impactTone: "growth" },
          { action: "D 店备料流程复核", owner: "店长 · 城北", due: "D+30", kpi: "损耗率 ≤ 3.5%", impact: "+6.4 万", impactTone: "growth" }
        ]}
        footer="数据来源：收银流水 2025-03 至 2025-08，含平台结算单与会员消费明细。不可计算项已如实标注。" />
    </Panel>
  </React.Fragment>;
}

Object.assign(window, { DecisionPage });
