import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四", "五", "六"];
/* Numbered step row. Default content is the four stages of a 侍天 engagement (readme §1);
   the earlier 经营五问 loop still renders by passing its five `steps`. Columns follow
   `steps.length`, so four, five or six steps all fill the row. */
const DEFAULT_STEPS = [
  { label: "开店之前", q: "把生意想清楚", aim: "从客群、场景与商圈竞争出发，建立餐厅概念与菜单结构，核对成本与产能。" },
  { label: "经营之中", q: "把问题落到菜上", aim: "结合真实点单、成本、出品与顾客反馈，识别哪些菜留、哪些改、哪里在消耗利润。" },
  { label: "每月复盘", q: "让菜单持续进化", aim: "追踪新品、时令、价格接受度与组合，将上轮调整与实际结果逐项核对。" },
  { label: "复制扩张", q: "让好方法进入组织", aim: "沉淀产品标准、经营参数与执行方法，通过分工、培训、例会与督导进入组织。" }
];

export function FiveQuestionsSlide({ eyebrow = "四个阶段", title = "从概念到连锁", note = "侍天以菜单设计与持续迭代为核心，贯穿新餐厅概念开创、单店经营优化与连锁规模化发展。", steps = DEFAULT_STEPS, active, page }) {
  const n = Math.max(steps.length, 1);
  return React.createElement(SlideFrame, { ground: "parchment", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 52 } },
      React.createElement(SlideTitle, { size: "md" }, title),
      React.createElement("div", { style: { position: "relative", display: "grid", gridTemplateColumns: "repeat(" + n + ", minmax(0,1fr))", gap: 24 } },
        React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 28, right: 28, top: 27, height: 1, background: "var(--line-rule)" } }),
        steps.map(function (s, i) {
          const on = active === i;
          return React.createElement("div", { key: s.label, style: { position: "relative", display: "flex", flexDirection: "column", gap: 18 } },
            React.createElement("span", {
              style: {
                width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 500,
                border: "1px solid " + (on ? "var(--bronze-500)" : "var(--line-rule)"),
                background: on ? "var(--bronze-500)" : "var(--surface-page)",
                color: on ? "var(--text-on-accent)" : "var(--bronze-500)"
              }
            }, s.numeral || CN[i] || String(i + 1)),
            React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 8 } },
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, s.label),
              React.createElement("span", { style: { fontSize: 21, color: "var(--text-accent)" } }, s.q),
              React.createElement("span", { style: { fontSize: 19, lineHeight: "var(--leading-snug)", color: "var(--text-muted)", textWrap: "pretty" } }, s.aim)
            )
          );
        })
      ),
      React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "var(--tracking-cjk-display)", color: "var(--ink-700)", textWrap: "pretty" } }, note)
    )
  );
}

/* Name that matches the default content; same component. */
export const StagesSlide = FiveQuestionsSlide;
