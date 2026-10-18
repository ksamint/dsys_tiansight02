const { SectionHeading, PlanCard, Button, Card, Icon, Divider } = window.TIANSIGHTDesignSystem_703ad4;

const TIERS = [
  { tier: "点单模型", name: "辅助判断顾客怎样选", deliverable: "辅助判断顾客可能怎样选、不同菜单方案会带来什么变化。" },
  { tier: "经营看板", name: "讲清哪里发生了变化", mode: "自研", emphasized: true, deliverable: "讲清哪里发生了变化、影响有多大、哪些事情需要优先处理。" },
  { tier: "教练式督导", name: "把建议落实到人", mode: "专家 + 系统", deliverable: "把建议落实到负责人、完成时间和执行检查。" },
  { tier: "持续复盘", name: "让下一次决策更可靠", mode: "逐轮", deliverable: "将预期与实际对照，让下一次决策有更可靠的依据。" }
];

const OUTCOMES = [
  { icon: "check", t: "顾客更容易点到满意的一餐", b: "卖什么、怎么定价、如何组合，落在真实点单上。" },
  { icon: "route", t: "出品更稳定", b: "配方、采购、工位与人员配置一并核对。" },
  { icon: "correction", t: "浪费减少", b: "识别正在消耗利润的环节，逐项核对改善。" },
  { icon: "chart", t: "门店留下更多经营贡献", b: "改善结果与双方确认的基线、目标和计量口径对照。" }
];

function ServiceLadder({ onNav }) {
  return <section id="ladder" style={{ background: "var(--parchment-100)", borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="餐饮第二大脑" title="为专家判断和门店行动提供支持"
        subtitle="侍天持续建设餐饮第二大脑，将自研点单模型、经营看板与教练式督导结合。"
        action={<Button variant="secondary" onClick={() => onNav("contact")}>联系侍天</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-5)", marginTop: "var(--space-8)" }}>
        {TIERS.map(t => <PlanCard key={t.tier} {...t} />)}
      </div>
      <Divider spacing="var(--section-y-tight)" />
      <SectionHeading size="md" eyebrow="老板看到的价值" title="落在具体的经营变化上"
        subtitle="对于具备数据基础和执行条件的项目，服务费用可与双方确认的改善结果挂钩：合作开始时约定基线、目标、计量口径与验证方式；实施过程中记录动作和投入；复盘时共同核对实际结果与可归属的改善。" rule={false} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-5)", marginTop: "var(--space-7)" }}>
        {OUTCOMES.map(o => <Card key={o.t} padding="md" interactive>
          <span style={{ color: "var(--gold)", display: "flex" }}><Icon name={o.icon} size={22} /></span>
          <h4 style={{ margin: "14px 0 8px", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-title)", letterSpacing: "var(--tracking-cjk-display)" }}>{o.t}</h4>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--text-muted)" }}>{o.b}</p>
        </Card>)}
      </div>
    </div>
  </section>;
}

Object.assign(window, { ServiceLadder });
