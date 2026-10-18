import React from "react";
import { ChartFrame, ChartLegend, useD3, useWidth, isDarkFill, AXIS_LABEL, VALUE_LABEL, CHART_HEX, SEQUENTIAL } from "./chartKit.jsx";

/* 层级 + 构成 · treemap for 大类 → 系列 → 品项. Area is a coarse channel (2–3× reading
   error), so tiles carry their value as a mono label wherever they are large enough and
   the caption should state the total. Depth-1 groups share one sequential gold step;
   never a rainbow. Use a sorted bar chart when the reader must compare precisely. */
export function Treemap({ data, height = 300, caption, note, scope, grade, unit = "", format, minLabelArea = 2200 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const fmt = format || function (v) { return Math.round(v).toLocaleString() + unit; };
  let body = null, legend = [];
  if (d3 && data) {
    const root = d3.hierarchy(data).sum(function (d) { return d.value || 0; }).sort(function (a, b) { return b.value - a.value; });
    d3.treemap().size([width, height]).paddingOuter(2).paddingInner(1.5).paddingTop(function (d) { return d.depth === 1 ? 18 : 0; }).round(true)(root);
    const groups = root.children || [];
    const shade = function (i) { return SEQUENTIAL[Math.min(SEQUENTIAL.length - 1, i % SEQUENTIAL.length)]; };
    legend = groups.map(function (g, i) { return { label: g.data.name + " " + fmt(g.value), tone: null, hex: shade(i) }; });
    body = React.createElement(React.Fragment, null,
      groups.map(function (g, gi) {
        const fill = shade(gi), dark = isDarkFill(d3, fill);
        return React.createElement("g", { key: gi },
          React.createElement("rect", { x: g.x0, y: g.y0, width: g.x1 - g.x0, height: g.y1 - g.y0, fill: fill, opacity: .35 }),
          React.createElement("text", Object.assign({ x: g.x0 + 6, y: g.y0 + 12 }, AXIS_LABEL, { fontSize: 10, fill: CHART_HEX.ink, letterSpacing: ".08em" }), g.data.name),
          (g.children || [g]).map(function (leaf, li) {
            const w = leaf.x1 - leaf.x0, h = leaf.y1 - leaf.y0, big = w * h > minLabelArea && w > 44;
            return React.createElement("g", { key: li },
              React.createElement("rect", { x: leaf.x0, y: leaf.y0, width: w, height: h, fill: fill, stroke: CHART_HEX.paper, strokeWidth: 1 }),
              big ? React.createElement("text", Object.assign({ x: leaf.x0 + 6, y: leaf.y0 + 14 }, AXIS_LABEL, { fontSize: 10.5, fill: dark ? CHART_HEX.paper : CHART_HEX.ink }), leaf.data.name) : null,
              big ? React.createElement("text", Object.assign({ x: leaf.x0 + 6, y: leaf.y0 + 28 }, VALUE_LABEL, { fontSize: 10, fill: dark ? CHART_HEX.paper : CHART_HEX.ink, opacity: .85 }), fmt(leaf.value)) : null);
          }));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    legend.length ? React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px 18px" } }, legend.map(function (it, i) {
      return React.createElement("span", { key: i, style: { display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)" } },
        React.createElement("span", { style: { width: 10, height: 10, background: it.hex, borderRadius: 1 } }), it.label);
    })) : null);
}
