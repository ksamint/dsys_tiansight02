import React from "react";
import { ChartFrame, ChartLegend, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 偏差 · deviation from a target or zero line, zero centred. Bars start at zero on both
   sides; 增长 right, 利润流失 left. Sorted by value unless `sorted` is false. */
export function DivergingBars({ rows = [], height, caption, note, scope, grade, unit = "", format, sorted = true, semantic = true, labelWidth = 96, targetLabel = "目标" }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 26, m = { top: 22, right: 48, bottom: 26, left: labelWidth };
  const h = height || m.top + m.bottom + rows.length * rowH;
  const fmt = format || function (v) { return (v > 0 ? "+" : "") + (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && rows.length) {
    const data = sorted ? rows.slice().sort(function (a, b) { return b.value - a.value; }) : rows;
    const mx = d3.max(data, function (r) { return Math.abs(r.value); }) || 1;
    const x = d3.scaleLinear().domain([-mx, mx]).nice().range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(data.map(function (r) { return r.label; })).range([m.top, h - m.bottom]).padding(0.3);
    body = React.createElement(React.Fragment, null,
      x.ticks(5).map(function (v, i) { return React.createElement("text", Object.assign({ key: i, x: x(v), y: h - m.bottom + 16, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(v)); }),
      React.createElement("line", { x1: x(0), x2: x(0), y1: m.top - 10, y2: h - m.bottom, stroke: CHART_HEX.rule, strokeWidth: 1 }),
      React.createElement("text", Object.assign({ x: x(0), y: m.top - 14, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10 }), targetLabel),
      data.map(function (r) {
        const pos = r.value >= 0;
        const c = r.tone ? tone(r.tone) : semantic ? (pos ? CHART_HEX.growth : CHART_HEX.loss) : CHART_HEX.gold;
        const x0 = x(Math.min(0, r.value)), x1 = x(Math.max(0, r.value));
        return React.createElement("g", { key: r.label },
          React.createElement("text", Object.assign({ x: m.left - 12, y: y(r.label) + y.bandwidth() / 2, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink }), r.label),
          React.createElement("rect", { x: x0, y: y(r.label), width: Math.max(1, x1 - x0), height: y.bandwidth(), fill: c, opacity: .9 }),
          React.createElement("text", Object.assign({ x: pos ? x1 + 6 : x0 - 6, y: y(r.label) + y.bandwidth() / 2, dy: "0.32em", textAnchor: pos ? "start" : "end" }, VALUE_LABEL, { fontSize: 10.5, fill: c }), fmt(r.value)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body),
    semantic ? React.createElement(ChartLegend, { items: [{ label: "高于" + targetLabel, tone: "growth" }, { label: "低于" + targetLabel, tone: "loss" }] }) : null);
}
