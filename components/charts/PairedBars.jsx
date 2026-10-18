import React from "react";
import { ChartFrame, ChartLegend, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 结构错位 · paired bars: two shares of the same categories side by side — SKU 占比 vs
   营收占比 per 价格带, 版面 vs 产出 — with the gap printed. Where the pair misaligns most is
   where menu real estate is mis-spent. Mirrors the v4.2 `pairedBars` and the 长卷 §05 figure.
   Both bars start at zero on one shared scale (the independent-scale variant is refused). */
export function PairedBars({ rows = [], height, caption, note, scope, grade, aLabel = "SKU 占比", bLabel = "营收占比", percent = true, unit = "", format, labelWidth = 84, showGap = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 34, m = { top: 10, right: 64, bottom: 26, left: labelWidth };
  const h = height || m.top + m.bottom + rows.length * rowH;
  const fmt = format || function (v) { return percent ? (Math.round(v * 1000) / 10) + "%" : (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && rows.length) {
    const mx = d3.max(rows, function (r) { return Math.max(r.a, r.b); }) || 1;
    const x = d3.scaleLinear().domain([0, mx]).nice().range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(rows.map(function (r) { return r.label; })).range([m.top, h - m.bottom]).padding(0.28);
    body = React.createElement(React.Fragment, null,
      x.ticks(5).map(function (v, i) { return React.createElement("g", { key: i },
        React.createElement("line", { x1: x(v), x2: x(v), y1: m.top, y2: h - m.bottom, stroke: CHART_HEX.grid }),
        React.createElement("text", Object.assign({ x: x(v), y: h - m.bottom + 16, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(v))); }),
      rows.map(function (r) {
        const y0 = y(r.label), bw = y.bandwidth() / 2, gap = r.b - r.a, pos = gap >= 0;
        return React.createElement("g", { key: r.label },
          React.createElement("text", Object.assign({ x: m.left - 10, y: y0 + bw, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink }), r.label),
          React.createElement("rect", { x: x(0), y: y0, width: Math.max(1, x(r.a) - x(0)), height: bw - 1, fill: CHART_HEX.muted }),
          React.createElement("rect", { x: x(0), y: y0 + bw, width: Math.max(1, x(r.b) - x(0)), height: bw - 1, fill: CHART_HEX.gold, opacity: .9 }),
          React.createElement("text", Object.assign({ x: x(r.a) + 5, y: y0 + bw / 2, dy: "0.32em" }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.mutedInk }), fmt(r.a)),
          React.createElement("text", Object.assign({ x: x(r.b) + 5, y: y0 + bw * 1.5, dy: "0.32em" }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.gold }), fmt(r.b)),
          showGap ? React.createElement("text", Object.assign({ x: width - m.right + 8, y: y0 + bw, dy: "0.32em" }, VALUE_LABEL, { fontSize: 10.5, fill: pos ? CHART_HEX.growth : CHART_HEX.seal, fontWeight: 600 }), (pos ? "+" : "−") + fmt(Math.abs(gap)).replace(/^\+/, "")) : null);
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body),
    React.createElement(ChartLegend, { items: [{ label: aLabel, tone: "muted" }, { label: bLabel, tone: "gold" }].concat(showGap ? [{ label: "差 = " + bLabel + " − " + aLabel, tone: "growth" }] : []) }));
}
