import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四", "五", "六"];
/* Four-across card row. Default content is 餐饮第二大脑's four parts (readme §1), described
   only by what each part does — never as a finished intelligent system. The earlier 三层 + X
   service ladder still renders by passing its `tiers` (give the last one `numeral: "X"`, a
   `mode` badge and `highlight` for the recommended tier). Emphasis is a gold top rule on a
   paper ground — cards carry no shadow. */
const DEFAULT_TIERS = [
  { tier: "Menu simulation", name: "菜单推演", got: "用真实点单数据推演顾客可能怎样选、不同菜单方案会带来什么变化。" },
  { tier: "Operating dashboard", name: "经营看板", got: "讲清哪里发生了变化、影响有多大、哪些事情需要优先处理。" },
  { tier: "Coaching", name: "教练式督导", got: "把建议落实到负责人、完成时间和执行检查。" },
  { tier: "Continuous review", name: "持续复盘", got: "将预期与实际对照，让下一次决策有更可靠的依据。" }
];

export function LadderSlide({ eyebrow = "餐饮第二大脑", title = "为专家判断和门店行动提供支持。", tiers = DEFAULT_TIERS, highlight = -1, gotLabel = "作用", page }) {
  const n = Math.max(tiers.length, 1);
  return React.createElement(SlideFrame, { ground: "parchment", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 34 } },
      React.createElement(SlideTitle, { size: "md" }, title),
      React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "repeat(" + n + ", minmax(0,1fr))", gap: 22 } },
        tiers.map(function (t, i) {
          const on = i === highlight;
          return React.createElement("div", {
            key: t.name || i,
            style: {
              display: "flex", flexDirection: "column", gap: 18, padding: 28,
              background: on ? "var(--surface-card)" : "var(--parchment-100)",
              border: "1px solid var(--line-hairline)",
              borderTop: "2px solid " + (on ? "var(--bronze-500)" : "var(--line-hairline)"),
              borderRadius: "var(--radius)"
            }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } },
              React.createElement("span", { style: { width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 19, color: "var(--bronze-500)" } }, t.numeral || CN[i] || String(i + 1)),
              t.mode ? React.createElement("span", {
                style: {
                  padding: "4px 10px", fontSize: "var(--text-2xs)", borderRadius: "var(--radius)",
                  background: on ? "var(--bronze-500)" : "var(--parchment-200)",
                  color: on ? "var(--text-on-accent)" : "var(--ink-600)"
                }
              }, t.mode) : null
            ),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              t.tier ? React.createElement("span", { style: { fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, t.tier) : null,
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, lineHeight: 1.25, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, t.name)
            ),
            React.createElement("div", { style: { marginTop: "auto", paddingTop: 18, borderTop: "1px solid var(--line-hairline)", display: "flex", flexDirection: "column", gap: 8 } },
              gotLabel ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" } }, gotLabel) : null,
              React.createElement("span", { style: { fontSize: 19, lineHeight: "var(--leading-snug)", color: "var(--text-body)", textWrap: "pretty" } }, t.got)
            )
          );
        })
      )
    )
  );
}
