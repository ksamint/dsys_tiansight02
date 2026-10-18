const { SectionHeading, Card, Quote, Tag, Button } = window.TIANSIGHTDesignSystem_bb63dc;

const PARTNERS = ["苏帮袁", "清水亭", "3699 河鲜小馆", "游园京梦", "吴裕泰", "韵 1980 新派淮扬菜", "潮发潮汕牛肉"];

const VOICES = [
  { by: "王总", text: "太高效，也太透彻了。以前一个月才能完成的深度分析和落地辅导，现在一周就能完成，还能持续跟进。" },
  { by: "张总", text: "报告分析得非常细，最关键的是结论有证据，不靠猜，也没有 AI 幻觉。大力推荐。" },
  { by: "李总", text: "不仅把问题讲清楚，还把优先级、责任人和验收指标都排好了，团队拿到就能执行。" }
];

function Partners() {
  return <section id="partners" style={{ borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" }}>
      <SectionHeading eyebrow="伙伴背书" title="这些品牌，已与侍天同行" subtitle="从单店到连锁，从新派淮扬菜到老字号。" />
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-7)", alignItems: "center" }}>
        {PARTNERS.map(p => <Tag key={p}>{p}</Tag>)}
        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Button variant="ghost" size="sm">更多伙伴</Button>
          <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>正在签约中</span>
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "var(--space-5)", marginTop: "var(--space-8)" }}>
        {VOICES.map(v => <Card key={v.by} padding="lg">
          <Quote author={v.by} role="餐饮老板" size="sm">{v.text}</Quote>
        </Card>)}
      </div>
    </div>
  </section>;
}

Object.assign(window, { Partners });
