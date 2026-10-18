import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

/* The 主张 slide: headline → one paragraph of substantiation → the three beats as a ruled
   ledger. Pass `stats` (label / value / unit) instead of `points` when the offer is numeric —
   the mono stat ledger from the earlier 6 个月 / 7 日内 / 90 天 deck still renders that way. */
const DEFAULT_POINTS = [
  { label: "让顾客愿意点", note: "客群、场景与商圈竞争，落成餐厅概念、招牌产品、菜单结构、价格与组合。" },
  { label: "让团队做得稳", note: "产品标准、经营参数与执行方法，沉淀到岗位分工、培训辅导与经营例会。" },
  { label: "让经营留下收益", note: "每个建议明确依据、动作与验证方式；上轮调整与实际结果逐项核对。" }
];

function StatLedger({ stats }) {
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", borderTop: "1.5px solid var(--line-rule)" } },
    stats.map(function (s, i) {
      return React.createElement("div", { key: i, style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, padding: "26px 0", borderBottom: "1px solid var(--line-hairline)" } },
        React.createElement("span", { style: { fontSize: 22, color: "var(--text-muted)", letterSpacing: "var(--tracking-cjk-body)" } }, s.label),
        React.createElement("span", { style: { display: "flex", alignItems: "baseline", gap: 8 } },
          React.createElement("span", { style: { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums", fontSize: 62, fontWeight: 500, lineHeight: 1, color: s.accent ? "var(--bronze-500)" : "var(--ink-900)" } }, s.value),
          React.createElement("span", { style: { fontSize: 22, color: "var(--text-muted)" } }, s.unit)
        )
      );
    })
  );
}

function PointLedger({ points }) {
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", borderTop: "1.5px solid var(--line-rule)" } },
    points.map(function (p, i) {
      return React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", gap: 10, padding: "24px 0", borderBottom: "1px solid var(--line-hairline)" } },
        React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 500, lineHeight: 1.25, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, p.label),
        p.note ? React.createElement("span", { style: { fontSize: 19, lineHeight: "var(--leading-snug)", color: "var(--text-muted)" } }, p.note) : null
      );
    })
  );
}

export function PromiseSlide({ eyebrow = "侍天 TIANSIGHT", title = "菜单，是餐厅向顾客发出的购买邀请，也是每天都在执行的经营决策。", body = "卖什么，决定顾客为什么来；怎么定价，影响顾客怎么点；如何组合，牵动采购、后厨、出品与利润。菜单的每一次变化，都在改变顾客的体验，也在改变餐厅的生意。侍天以菜单设计与持续迭代为核心，将餐饮实战、经营分析与组织能力建设结合起来。", points = DEFAULT_POINTS, stats, page }) {
  return React.createElement(SlideFrame, { ground: "parchment", grain: true, eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,.9fr)", gap: 72, alignItems: "center" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        React.createElement("p", { style: { margin: 0, fontSize: 24, lineHeight: "var(--leading-normal)", color: "var(--text-body)", maxWidth: "24em", textWrap: "pretty" } }, body)
      ),
      stats && stats.length ? React.createElement(StatLedger, { stats: stats }) : React.createElement(PointLedger, { points: points })
    )
  );
}
