import React from "react";
import { ChartFrame, ChartLegend, Axes, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* ABC 二八 · Pareto. Ranked bars (额) with the cumulative-share line on a declared second
   axis — the one two-axis figure the spec tolerates (F33), because the right axis is a
   fixed 0–100% and both are labelled. A/B cut rules at 80% and 95% mark the classes;
   bars are shaded by class. Mirrors the v4.2 `pareto_dual` (A2f · m4.pareto). */
export function Pareto({ rows = [], height = 280, caption, note, scope, grade, unit = "", format, cuts = [0.8, 0.95], maxBars = 40, labelEvery }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(600);
  const m = Object.assign({}, CHART_MARGIN, { right: 48, bottom: 56 });
  const fmt = format || function (v) { return Math.round(v).toLocaleString() + unit; };
  let body = null, classes = null;
  if (d3 && rows.length) {
    const data = rows.slice().sort(function (a, b) { return b.value - a.value; }).slice(0, maxBars);
    const total = d3.sum(rows, function (r) { return r.value; }) || 1;
    let acc = 0;
    data.forEach(function (r) { acc += r.value; r.cum = acc / total; r.cls = r.cum <= cuts[0] + 1e-9 ? "A" : r.cum <= cuts[1] + 1e-9 ? "B" : "C"; });
    classes = { A: data.filter(function (r) { return r.cls === "A"; }).length, B: data.filter(function (r) { return r.cls === "B"; }).length, C: data.filter(function (r) { return r.cls === "C"; }).length };
    const x = d3.scaleBand().domain(data.map(function (r) { return r.label; })).range([m.left, width - m.right]).padding(0.25);
    const y = d3.scaleLinear().domain([0, d3.max(data, function (r) { return r.value; })]).nice().range([height - m.bottom, m.top]);
    const y2 = d3.scaleLinear().domain([0, 1]).range([height - m.bottom, m.top]);
    const line = d3.line().x(function (r) { return x(r.label) + x.bandwidth() / 2; }).y(function (r) { return y2(r.cum); });
    const every = labelEvery || Math.ceil(data.length / Math.max(4, Math.floor((width - m.left - m.right) / 64)));
    const shade = { A: CHART_HEX.gold, B: CHART_HEX.key, C: CHART_HEX.muted };
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, margin: m, band: true, grid: true, yFormat: fmt, xFormat: function () { return ""; } }),
      data.map(function (r, i) {
        return React.createElement("g", { key: r.label },
          React.createElement("rect", { x: x(r.label), y: y(r.value), width: x.bandwidth(), height: height - m.bottom - y(r.value), fill: shade[r.cls], opacity: .9 }),
          i % every === 0 ? React.createElement("text", Object.assign({ x: x(r.label) + x.bandwidth() / 2, y: height - m.bottom + 14, textAnchor: "end", transform: "rotate(-35 " + (x(r.label) + x.bandwidth() / 2) + " " + (height - m.bottom + 14) + ")" }, AXIS_LABEL, { fontSize: 10 }), r.label) : null);
      }),
      cuts.map(function (c, i) {
        const idx = data.findIndex(function (r) { return r.cum > c; });
        const cx = idx > 0 ? x(data[idx].label) : idx === 0 ? x(data[0].label) : null;
        return React.createElement("g", { key: "c" + i },
          React.createElement("line", { x1: m.left, x2: width - m.right, y1: y2(c), y2: y2(c), stroke: CHART_HEX.rule, strokeDasharray: "3 3" }),
          cx != null ? React.createElement("line", { x1: cx - x.step() * x.padding() / 2, x2: cx - x.step() * x.padding() / 2, y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.seal, strokeDasharray: "3 3" }) : null,
          React.createElement("text", Object.assign({ x: width - m.right + 6, y: y2(c), dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), Math.round(c * 100) + "%"));
      }),
      React.createElement("path", { d: line(data), fill: "none", stroke: CHART_HEX.charcoal, strokeWidth: 1.5 }),
      data.map(function (r, i) { return React.createElement("circle", { key: "p" + i, cx: x(r.label) + x.bandwidth() / 2, cy: y2(r.cum), r: 2.2, fill: CHART_HEX.charcoal }); }),
      React.createElement("text", Object.assign({ x: width - m.right + 6, y: m.top - 4 }, AXIS_LABEL, { fontSize: 9.5, letterSpacing: ".1em" }), "累计 %"),
      React.createElement("text", Object.assign({ x: m.left - 10, y: m.top - 4, textAnchor: "end" }, AXIS_LABEL, { fontSize: 9.5, letterSpacing: ".1em" }), unit || "额"));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    React.createElement(ChartLegend, { items: [{ label: "A 类" + (classes ? " · " + classes.A : "") + " ≤" + Math.round(cuts[0] * 100) + "%", tone: "gold" }, { label: "B 类" + (classes ? " · " + classes.B : "") + " ≤" + Math.round(cuts[1] * 100) + "%", tone: "key" }, { label: "C 类" + (classes ? " · " + classes.C : ""), tone: "muted" }, { label: "累计份额（右轴 0–100%）", tone: "charcoal" }] }));
}
