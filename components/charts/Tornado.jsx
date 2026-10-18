import React from "react";
import { ChartFrame, ChartLegend, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 敏感性 · tornado: each variable swung ±x% and the effect on the target (年净利, 毛利)
   drawn as a bar pair around the base value, sorted by total swing. "最长的那根，就是该盯
   的那件事" — the figure appears in all three 推演 samples. Low side 朱红, high side 增长. */
export function Tornado({ rows = [], height, caption, note, scope, grade, unit = "", format, baseLabel = "基准", swingLabel = "±10%", labelWidth = 120 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 28, m = { top: 24, right: 60, bottom: 26, left: labelWidth };
  const h = height || m.top + m.bottom + rows.length * rowH;
  const fmt = format || function (v) { return (v > 0 ? "+" : "") + Math.round(v).toLocaleString() + unit; };
  let body = null;
  if (d3 && rows.length) {
    const data = rows.slice().sort(function (a, b) { return Math.abs(b.high - b.low) - Math.abs(a.high - a.low); });
    const mx = d3.max(data, function (r) { return Math.max(Math.abs(r.low), Math.abs(r.high)); }) || 1;
    const x = d3.scaleLinear().domain([-mx, mx]).nice().range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(data.map(function (r) { return r.label; })).range([m.top, h - m.bottom]).padding(0.32);
    body = React.createElement(React.Fragment, null,
      x.ticks(5).map(function (v, i) { return React.createElement("text", Object.assign({ key: i, x: x(v), y: h - m.bottom + 16, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(v)); }),
      React.createElement("line", { x1: x(0), x2: x(0), y1: m.top - 10, y2: h - m.bottom, stroke: CHART_HEX.rule }),
      React.createElement("text", Object.assign({ x: x(0), y: m.top - 14, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10 }), baseLabel),
      data.map(function (r) {
        const cy = y(r.label), bw = y.bandwidth();
        const lo = Math.min(r.low, r.high), hi = Math.max(r.low, r.high);
        return React.createElement("g", { key: r.label },
          React.createElement("text", Object.assign({ x: m.left - 12, y: cy + bw / 2, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink }), r.label),
          lo < 0 ? React.createElement("rect", { x: x(lo), y: cy, width: Math.max(1, x(0) - x(lo)), height: bw, fill: CHART_HEX.seal, opacity: .8 }) : null,
          hi > 0 ? React.createElement("rect", { x: x(0), y: cy, width: Math.max(1, x(hi) - x(0)), height: bw, fill: CHART_HEX.growth, opacity: .8 }) : null,
          React.createElement("text", Object.assign({ x: x(lo) - 6, y: cy + bw / 2, dy: "0.32em", textAnchor: "end" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.seal }), fmt(lo)),
          React.createElement("text", Object.assign({ x: x(hi) + 6, y: cy + bw / 2, dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.growth }), fmt(hi)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body),
    React.createElement(ChartLegend, { items: [{ label: "变量 −" + swingLabel.replace("±", "") + " 时", tone: "loss" }, { label: "变量 +" + swingLabel.replace("±", "") + " 时", tone: "growth" }] }));
}
