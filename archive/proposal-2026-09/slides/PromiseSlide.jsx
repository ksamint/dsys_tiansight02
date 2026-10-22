import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const DEFAULT_STATS = [
  { label: "数据窗口", value: "6", unit: "个月" },
  { label: "交付周期", value: "7", unit: "日内", accent: true },
  { label: "行动清单", value: "90", unit: "天" }
];

export function PromiseSlide({ eyebrow = "侍天的承诺", title = "交 6 个月经营数据，7 日内取得经营诊断", body = "增长在何处、利润失于何处、先改哪三件、由谁执行、以何验收。", stats = DEFAULT_STATS, page }) {
  return React.createElement(SlideFrame, { ground: "parchment", grain: true, eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,.9fr)", gap: 72, alignItems: "center" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        React.createElement("p", { style: { margin: 0, fontSize: 26, lineHeight: "var(--leading-normal)", color: "var(--text-body)", maxWidth: "24em" } }, body)
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, borderTop: "1.5px solid var(--line-rule)" } },
        stats.map(function (s, i) {
          return React.createElement("div", {
            key: i,
            style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, padding: "26px 0", borderBottom: "1px solid var(--line-hairline)" }
          },
            React.createElement("span", { style: { fontSize: 22, color: "var(--text-muted)", letterSpacing: "var(--tracking-cjk-body)" } }, s.label),
            React.createElement("span", { style: { display: "flex", alignItems: "baseline", gap: 8 } },
              React.createElement("span", {
                style: { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums", fontSize: 62, fontWeight: 500, lineHeight: 1, color: s.accent ? "var(--bronze-500)" : "var(--ink-900)" }
              }, s.value),
              React.createElement("span", { style: { fontSize: 22, color: "var(--text-muted)" } }, s.unit)
            )
          );
        })
      )
    )
  );
}
