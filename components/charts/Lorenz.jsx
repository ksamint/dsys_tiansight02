import React from "react";
import { ChartFrame, ChartLegend, Axes, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 集中度 · Lorenz curve with the Gini coefficient — how unequal the 货盘 is. Items sorted
   ascending; x = cumulative share of items, y = cumulative share of value; the diagonal is
   perfect equality. Marks the point where the top `topShare` of items sit. Complements
   Pareto: Pareto names the A items, Lorenz gives the whole distribution one number. */
export function Lorenz({ values = [], height = 280, caption, note, scope, grade, topShare = 0.2, itemLabel = "SKU", valueLabel = "销售额" }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(420);
  const m = Object.assign({}, CHART_MARGIN, { left: 48, bottom: 40 });
  let body = null, gini = null, topPct = null;
  if (d3 && values.length > 2) {
    const s = values.filter(function (v) { return v > 0; }).sort(d3.ascending), n = s.length, tot = d3.sum(s) || 1;
    let acc = 0; const pts = [[0, 0]].concat(s.map(function (v, i) { acc += v; return [(i + 1) / n, acc / tot]; }));
    const area = pts.slice(1).reduce(function (a, p, i) { const q = pts[i]; return a + (p[0] - q[0]) * (p[1] + q[1]) / 2; }, 0);
    gini = 1 - 2 * area;
    const k = Math.max(1, Math.round(n * (1 - topShare))); topPct = 1 - pts[k][1];
    const x = d3.scaleLinear().domain([0, 1]).range([m.left, width - m.right]), y = d3.scaleLinear().domain([0, 1]).range([height - m.bottom, m.top]);
    const pct = function (v) { return Math.round(v * 100) + "%"; };
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, margin: m, grid: true, xFormat: pct, yFormat: pct, xTicks: 5 }),
      React.createElement("line", { x1: x(0), y1: y(0), x2: x(1), y2: y(1), stroke: CHART_HEX.mutedInk, strokeDasharray: "3 3" }),
      React.createElement("path", { d: d3.area().x(function (p) { return x(p[0]); }).y0(function (p) { return y(p[0]); }).y1(function (p) { return y(p[1]); })(pts), fill: CHART_HEX.key, opacity: .18 }),
      React.createElement("path", { d: d3.line().x(function (p) { return x(p[0]); }).y(function (p) { return y(p[1]); })(pts), fill: "none", stroke: CHART_HEX.gold, strokeWidth: 2 }),
      React.createElement("line", { x1: x(1 - topShare), x2: x(1 - topShare), y1: y(pts[k][1]), y2: height - m.bottom, stroke: CHART_HEX.seal, strokeDasharray: "3 3" }),
      React.createElement("circle", { cx: x(1 - topShare), cy: y(pts[k][1]), r: 4, fill: CHART_HEX.seal }),
      React.createElement("text", Object.assign({ x: x(1 - topShare) - 8, y: y(pts[k][1]) - 8, textAnchor: "end" }, VALUE_LABEL, { fontSize: 10.5, fill: CHART_HEX.seal }), "前 " + pct(topShare) + " " + itemLabel + " → " + pct(topPct) + " " + valueLabel),
      React.createElement("text", Object.assign({ x: x(0.55), y: y(0.16) }, VALUE_LABEL, { fontSize: 12, fill: CHART_HEX.charcoal, fontWeight: 600 }), "Gini " + gini.toFixed(2)),
      React.createElement("text", Object.assign({ x: width - m.right, y: height - 6, textAnchor: "end" }, AXIS_LABEL), itemLabel + " 累计占比（由小到大）"),
      React.createElement("text", Object.assign({ x: m.left, y: m.top - 6 }, AXIS_LABEL), valueLabel + " 累计占比"));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    React.createElement(ChartLegend, { items: [{ label: "洛伦兹曲线", tone: "gold" }, { label: "完全均匀", tone: "datum", dashed: true }, { label: "n=" + values.length, tone: "key", band: true }] }));
}
