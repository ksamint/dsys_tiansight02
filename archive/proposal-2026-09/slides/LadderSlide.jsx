import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "X"];
const DEFAULT_TIERS = [
  { tier: "第一层 · 经营洞察", name: "先把问题看清", got: "增长机会、利润流失点与 90 天行动清单" },
  { tier: "第二层 · 第二大脑共建", name: "让系统昼夜守望经营", mode: "深度共建", got: "打通收银、平台与会员数据：自动对账、异常预警、决策看板" },
  { tier: "第三层 · AI 原生品牌", name: "从零构建一个新品牌", mode: "从 0 共创", got: "品牌、组织、数字底座一体化设计，数据资产归品牌自己" },
  { tier: "X · 增值专项", name: "随层挂接，按需启用", mode: "按需挂接", got: "企业大学、菜单结构、运营托管、成本优化、专家顾问团支持" }
];

export function LadderSlide({ eyebrow = "服务与价格", title = "层层递进，天天有数", tiers = DEFAULT_TIERS, highlight = 1, page }) {
  return React.createElement(SlideFrame, { ground: "parchment", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 34 } },
      React.createElement(SlideTitle, { size: "md" }, title),
      React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 22 } },
        tiers.map(function (t, i) {
          const on = i === highlight;
          return React.createElement("div", {
            key: t.tier,
            style: {
              display: "flex", flexDirection: "column", gap: 18, padding: 28,
              background: on ? "var(--surface-card)" : "var(--parchment-100)",
              border: "1px solid var(--line-hairline)",
              borderTop: "2px solid " + (on ? "var(--bronze-500)" : "var(--line-hairline)"),
              borderRadius: "var(--radius-md)", boxShadow: on ? "var(--shadow-md)" : "none"
            }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } },
              React.createElement("span", { style: { width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 19, color: "var(--bronze-500)" } }, CN[i]),
              t.mode ? React.createElement("span", {
                style: {
                  padding: "4px 10px", fontSize: "var(--text-2xs)", borderRadius: "var(--radius-xs)",
                  background: on ? "var(--bronze-500)" : "var(--parchment-200)",
                  color: on ? "var(--text-on-accent)" : "var(--ink-600)"
                }
              }, t.mode) : null
            ),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("span", { style: { fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, t.tier),
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, lineHeight: 1.25, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, t.name)
            ),
            React.createElement("div", { style: { marginTop: "auto", paddingTop: 18, borderTop: "1px solid var(--line-hairline)", display: "flex", flexDirection: "column", gap: 8 } },
              React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" } }, "老板得到"),
              React.createElement("span", { style: { fontSize: 19, lineHeight: "var(--leading-snug)", color: "var(--text-body)" } }, t.got)
            )
          );
        })
      )
    )
  );
}
