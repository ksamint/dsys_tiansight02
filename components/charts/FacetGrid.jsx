import React from "react";
import { useWidth } from "./chartKit.jsx";

/* 元模式 · small multiples. Adding a dimension adds a PANEL, never an encoding channel
   (spec B6). Same chart, same scale, one facet per value of the extra dimension, in a
   grid the reader scans like a table. `render(panel, ctx)` draws each facet; ctx carries
   the facet width so children can size themselves, and any shared `max` the caller
   computed so every panel uses one scale. Use for 市别 × 区域 × 点菜员 style breakdowns. */
export function FacetGrid({ panels = [], columns = 3, gap = 20, render, caption, note, scope, panelHeight = 150, max, rowLabel }) {
  const [wrapRef, width] = useWidth(600);
  const cols = Math.max(1, Math.min(columns, panels.length || 1));
  const fw = Math.max(80, Math.floor((width - gap * (cols - 1)) / cols));
  return React.createElement("figure", { ref: wrapRef, style: { margin: 0, width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    caption ? React.createElement("figcaption", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-caption)" } }, caption) : null,
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + cols + ", minmax(0,1fr))", gap: gap + "px " + gap + "px" } },
      panels.map(function (p, i) {
        return React.createElement("div", { key: p.key || p.title || i, style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--line-hairline)", paddingTop: 8 } },
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 } },
            React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-display)", fontWeight: 500, letterSpacing: ".04em" } }, p.title),
            p.meta ? React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" } }, p.meta) : null),
          render ? render(p, { width: fw, height: panelHeight, max: max, index: i }) : null);
      })),
    note || scope ? React.createElement("span", { style: { fontSize: "var(--text-3xs)", color: "var(--text-muted)" } }, [scope ? "口径：" + scope : null, note].filter(Boolean).join(" · ")) : null);
}
