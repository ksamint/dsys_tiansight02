const { SectionHeading, Card, Tag, Button, Icon, Divider, ExpertCard, PartnerCase, Badge } = window.TIANSIGHTDesignSystem_703ad4;

const PARTNERS = [
  { brand: "韵 1980 新派淮扬菜", kind: "新派淮扬菜", stores: 7, since: "2024-09",
    summary: "午市结构与折扣叠加同时改动，两个季度内利润率回到目标区间。",
    metrics: [
      { label: "午市客单", before: "68 元", after: "74 元", delta: "+8.8%" },
      { label: "折扣率", before: "6.7%", after: "4.9%", delta: "-1.8pt", tone: "loss" },
      { label: "会员复购", before: "29.8%", after: "31.2%", delta: "+1.4pt" }
    ],
    actions: ["重排午市套餐结构，主推高毛利招牌组合", "收紧平台满减与会员券叠加规则", "招牌菜出餐标准化，备料前置"],
    quote: { text: "不仅把问题讲清楚，还把优先级、责任人和验收指标都排好了，团队拿到就能执行。", by: "李总", role: "餐饮老板" } },
  { brand: "3699 河鲜小馆", kind: "河鲜小馆", stores: 3, since: "2025-01",
    summary: "河鲜损耗与价格带断层同时处理，主力价格带重新连上。",
    metrics: [
      { label: "食材损耗", before: "5.4%", after: "3.6%", delta: "-1.8pt", tone: "loss" },
      { label: "主力价格带占比", before: "12%", after: "26%", delta: "+14pt" }
    ],
    actions: ["按到货批次调整每日主推", "补齐 58–88 元价格带缺口"],
    quote: { text: "报告分析得非常细，最关键的是结论有证据，不靠猜，也没有 AI 幻觉。", by: "张总", role: "餐饮老板" } }
];

const EXPERTS = [
  { name: "边江", title: "创始人", field: "北京大学经济系背景，近三十年餐饮实战经验", tags: ["餐饮定位", "产品结构", "菜单体系", "利润模型"] },
  { name: "郭峰", title: "联合创始人", field: "瑞士洛桑酒店管理中国区创始团队成员", tags: ["服务体验", "组织能力构建", "经营体系建设"] }
];

const ROSTER = ["苏帮袁", "清水亭", "3699 河鲜小馆", "游园京梦", "吴裕泰", "韵 1980 新派淮扬菜", "潮发潮汕牛肉"];

function PartnersPage({ onNav }) {
  const [active, setActive] = React.useState(PARTNERS[0].brand);
  const p = PARTNERS.find(function (x) { return x.brand === active; }) || PARTNERS[0];
  return React.createElement("div", null,
    React.createElement("section", { style: { borderBottom: "1px solid var(--line-hairline)" } },
      React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" } },
        React.createElement(SectionHeading, {
          eyebrow: "伙伴背书", title: "这些品牌，已与侍天同行",
          subtitle: "从单店到连锁，从新派淮扬菜到老字号。",
          action: React.createElement(Button, { variant: "secondary", onClick: function () { onNav && onNav("contact"); } }, "成为伙伴")
        }),
        React.createElement("div", { style: { display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-7)", alignItems: "center" } },
          ROSTER.map(function (b) {
            const has = PARTNERS.some(function (x) { return x.brand === b; });
            return React.createElement(Tag, {
              key: b, active: b === active,
              onClick: has ? function () { setActive(b); } : undefined
            }, b, has ? null : null);
          }),
          React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, "更多伙伴正在签约中")
        ),
        React.createElement("div", { style: { marginTop: "var(--space-8)" } }, React.createElement(PartnerCase, p)),
        React.createElement("p", { style: { margin: "var(--space-5) 0 0", fontSize: "var(--text-2xs)", color: "var(--text-muted)" } },
          "案例数据经伙伴确认后发布；未确认的品牌只列名称，不列数字。")
      )
    ),
    React.createElement("section", { style: { background: "var(--parchment-100)" } },
      React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px" } },
        React.createElement(SectionHeading, {
          eyebrow: "创始团队", title: "产品决定顾客的选择，组织决定承诺能否兑现",
          subtitle: "侍天把这两件事放在同一张经营蓝图里。"
        }),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "var(--space-8)", marginTop: "var(--space-8)", maxWidth: 760 } },
          EXPERTS.map(function (e, i) { return React.createElement(ExpertCard, Object.assign({ key: i, size: 120 }, e)); })
        ),
        React.createElement("p", { style: { margin: "var(--space-7) 0 0", fontSize: "var(--text-2xs)", color: "var(--text-muted)" } },
          "顾问头像与实名待品牌方确认后补充。")
      )
    )
  );
}

Object.assign(window, { PartnersPage });
