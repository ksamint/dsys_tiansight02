import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

/* Chart slide: one graphic, one 结论, one 动作. Pass the chart as `chart` — reuse the
   data components (BarSeries / Matrix2x2) rather than drawing a slide-only chart. */
export function ChartSlide({ eyebrow = "分析维度 · 经营洞察图谱", title = "增长在何处，利润失于何处", chartTitle, chart, takeaway, action, source, page }) {
  return React.createElement(SlideFrame, { ground: "paper", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,.65fr)", gap: 60, alignItems: "stretch" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24, minWidth: 0 } },
        chartTitle ? React.createElement("span", { style: { fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, chartTitle) : null,
        React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" } }, chart),
        source ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, source) : null
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 30, paddingLeft: 44, borderLeft: "1px solid var(--line-hairline)" } },
        React.createElement(SlideTitle, { size: "sm" }, title),
        takeaway ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement("span", { style: { fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" } }, "结论"),
          React.createElement("span", { style: { fontSize: 24, lineHeight: "var(--leading-normal)", color: "var(--ink-800)" } }, takeaway)
        ) : null,
        action ? React.createElement("div", { style: { marginTop: "auto", paddingTop: 26, borderTop: "1.5px solid var(--line-rule)", display: "flex", flexDirection: "column", gap: 12 } },
          React.createElement("span", { style: { fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, "先改这件"),
          React.createElement("span", { style: { fontSize: 24, lineHeight: "var(--leading-normal)", color: "var(--ink-800)" } }, action)
        ) : null
      )
    )
  );
}
