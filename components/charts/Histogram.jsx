import React from "react";
import { ChartFrame, ChartLegend, Axes, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 分布 · histogram with optional KDE density curve, reference lines (mean, thresholds) and
   shaded `bands` (a 价格带 the reading is about, labelled with its share). Bars start at
   zero. Bin count is a hint for d3.bin — edges snap to nice values. */
export function Histogram({ values = [], bins = 20, height = 240, caption, note, scope, grade, unit = "", format, density = true, marks = [], bands = [], domain, legend = true, yTicks = 4 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = CHART_MARGIN;
  const fmt = format || function (v) { return (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && values.length) {
    const ext = domain || d3.extent(values);
    const x = d3.scaleLinear().domain(ext).nice().range([m.left, width - m.right]);
    const binner = d3.bin().domain(x.domain()).thresholds(x.ticks(bins));
    const bs = binner(values);
    const y = d3.scaleLinear().domain([0, d3.max(bs, function (b) { return b.length; }) || 1]).nice().range([height - m.bottom, m.top]);
    let dens = null;
    if (density && values.length > 8) {
      const bw = (x.domain()[1] - x.domain()[0]) / bins * 1.1;
      const k = function (u) { return Math.abs(u /= bw) <= 1 ? 0.75 * (1 - u * u) / bw : 0; };
      const pts = x.ticks(80).map(function (t) { return [t, d3.mean(values, function (v) { return k(t - v); })]; });
      const binW = (x.domain()[1] - x.domain()[0]) / bs.length;
      const scale = values.length * binW;
      dens = d3.line().curve(d3.curveBasis).x(function (p) { return x(p[0]); }).y(function (p) { return y(Math.min(y.domain()[1], p[1] * scale)); })(pts);
    }
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: true, xFormat: fmt, yTicks: yTicks }),
      bands.map(function (bd, i) {
        const x0 = x(bd.from), x1 = x(bd.to);
        return React.createElement("g", { key: "b" + i },
          React.createElement("rect", { x: x0, y: m.top, width: Math.max(0, x1 - x0), height: height - m.bottom - m.top, fill: CHART_HEX.key, opacity: .16 }),
          React.createElement("line", { x1: x0, x2: x0, y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.gold, strokeDasharray: "4 3" }),
          React.createElement("line", { x1: x1, x2: x1, y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.gold, strokeDasharray: "4 3" }),
          bd.label ? React.createElement("text", Object.assign({ x: (x0 + x1) / 2, y: m.top - 5, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10, fill: CHART_HEX.gold, letterSpacing: ".12em" }), bd.label) : null);
      }),
      bs.map(function (b, i) {
        const bw = Math.max(1, x(b.x1) - x(b.x0) - 1);
        return React.createElement("rect", { key: i, x: x(b.x0) + .5, y: y(b.length), width: bw, height: height - m.bottom - y(b.length), fill: CHART_HEX.key, opacity: .85 });
      }),
      dens ? React.createElement("path", { d: dens, fill: "none", stroke: CHART_HEX.charcoal, strokeWidth: 1.5 }) : null,
      marks.map(function (mk, i) {
        return React.createElement("g", { key: "m" + i },
          React.createElement("line", { x1: x(mk.value), x2: x(mk.value), y1: m.top, y2: height - m.bottom, stroke: mk.tone === "loss" ? CHART_HEX.seal : CHART_HEX.gold, strokeDasharray: "4 3" }),
          React.createElement("text", Object.assign({ x: x(mk.value) + 5, y: m.top + 10 }, VALUE_LABEL, { fontSize: 10, fill: mk.tone === "loss" ? CHART_HEX.seal : CHART_HEX.gold }), (mk.label ? mk.label + " " : "") + fmt(mk.value)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    legend ? React.createElement(ChartLegend, { items: [{ label: "样本数 n=" + values.length, tone: "key" }].concat(density ? [{ label: "密度曲线", tone: "charcoal" }] : []) }) : null);
}
