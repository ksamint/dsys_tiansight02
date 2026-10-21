const { SectionHeading, PlanCard, Button, Card, Icon, Divider } = window.TIANSIGHTDesignSystem_bb63dc;

const TIERS = [
  { tier: "第一层 · 经营洞察", name: "先把问题看清", deliverable: "增长机会、利润流失点与 90 天行动清单" },
  { tier: "第二层 · 第二大脑共建", name: "让系统昼夜守望经营", mode: "深度共建", emphasized: true, deliverable: "打通收银、平台与会员数据：自动对账、异常预警、决策看板" },
  { tier: "第三层 · AI 原生品牌", name: "从零构建一个新品牌", mode: "从 0 共创", deliverable: "品牌、组织、数字底座一体化设计，数据资产归品牌自己" },
  { tier: "X · 增值专项", name: "随层挂接，按需启用", mode: "按需挂接", deliverable: "企业大学、菜单结构、运营托管、成本优化、专家顾问团支持" }
];

const OUTCOMES = [
  { icon: "trending-up", t: "看见增长机会", b: "找到值得加码的门店、菜品、时段与渠道。" },
  { icon: "trending-down", t: "守住利润空间", b: "减少折扣、损耗、人效与结构性浪费。" },
  { icon: "target", t: "聚焦关键投入", b: "把时间和预算集中到最有影响的经营动作。" },
  { icon: "layers", t: "复制有效经验", b: "一家店验证有效的做法，直接搬到其他店用。" }
];

function ServiceLadder({ onNav }) {
  return <section id="ladder" style={{ background: "var(--parchment-100)", borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="服务与价格" title="层层递进，天天有数"
        subtitle="第一层出洞察，第二层建大脑，第三层立 AI 原生品牌：X 为增值专项，每一层皆可挂接。"
        action={<Button variant="secondary" onClick={() => onNav("contact")}>联系侍天</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-5)", marginTop: "var(--space-8)" }}>
        {TIERS.map(t => <PlanCard key={t.tier} {...t} />)}
      </div>
      <Divider spacing="var(--section-y-tight)" />
      <SectionHeading size="md" eyebrow="增长与止损，皆可量化" title="把资源投向最值得做的事"
        subtitle="看见机会，守住利润，让有效经验在每家门店持续复制。" rule={false} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "var(--space-5)", marginTop: "var(--space-7)" }}>
        {OUTCOMES.map(o => <Card key={o.t} padding="md" interactive>
          <span style={{ color: "var(--bronze-500)", display: "flex" }}><Icon name={o.icon} size={22} /></span>
          <h4 style={{ margin: "14px 0 8px", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)" }}>{o.t}</h4>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", lineHeight: "var(--leading-normal)", color: "var(--text-muted)" }}>{o.b}</p>
        </Card>)}
      </div>
    </div>
  </section>;
}

Object.assign(window, { ServiceLadder });
