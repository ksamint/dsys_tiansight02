import React from "react";
import { ChartFrame, ChartLegend, Axes, tone, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 趋势 · line over labelled periods. `refs` draw horizontal reference lines (约定目标, 同类基准 —
   the benchmark the reader compares against) and enter the y domain; `marks` draw vertical
   event lines at a period label (动作落地), so a before/after read carries its cause. */
export function TrendLine({ series = [], height = 260, caption, note, scope, grade, unit = "", yFormat, showPoints = true, grid = true, refs = [], marks = [] }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = CHART_MARGIN;
  const fmt = yFormat || function (v) { return v + unit; };
  const flat = series.reduce(function (a, s) { return a.concat(s.points || []); }, []);
  let body = null;
  if (d3 && flat.length) {
    const labels = (series[0].points || []).map(function (p) { return p.label; });
    const x = d3.scalePoint().domain(labels).range([m.left, width - m.right]).padding(0.5);
    const ext = d3.extent(flat.map(function (p) { return p.value; }).concat(refs.map(function (r) { return r.value; })));
    const pad = (ext[1] - ext[0] || 1) * 0.18;
    const y = d3.scaleLinear().domain([Math.min(ext[0] - pad, ext[0] * 0.96), ext[1] + pad]).nice().range([height - m.bottom, m.top]);
    const line = d3.line().x(function (p) { return x(p.label); }).y(function (p) { return y(p.value); }).curve(d3.curveMonotoneX);
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: grid, band: false, yFormat: fmt, xTicks: labels.length }),
      labels.map(function (l, i) {
        return React.createElement("text", Object.assign({ key: "xl" + i, x: x(l), y: height - m.bottom + 18, textAnchor: "middle" }, AXIS_LABEL), l);
      }),
      refs.map(function (r, i) {
        const c = tone(r.tone || "datum");
        return React.createElement("g", { key: "r" + i },
          React.createElement("line", { x1: m.left, x2: width - m.right, y1: y(r.value), y2: y(r.value), stroke: c, strokeWidth: 1.25, strokeDasharray: "2 4" }),
          React.createElement("text", Object.assign({ x: m.left + 4, y: y(r.value) - 5 }, VALUE_LABEL, { fontSize: 10, fill: c }), (r.label ? r.label + " " : "") + fmt(r.value)));
      }),
      marks.map(function (mk, i) {
        const mx = x(mk.at);
        if (mx == null) return null;
        const bottom = mk.place === "bottom";
        return React.createElement("g", { key: "m" + i },
          React.createElement("line", { x1: mx, x2: mx, y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.rule, strokeDasharray: "3 3" }),
          mk.label ? React.createElement("text", Object.assign({ x: mx + 6, y: bottom ? height - m.bottom - 6 : m.top + 10 }, AXIS_LABEL, { fontSize: 10, letterSpacing: ".12em" }), mk.label) : null);
      }),
      series.map(function (s, si) {
        const c = tone(s.tone);
        return React.createElement("g", { key: si },
          s.area ? React.createElement("path", {
            d: d3.area().x(function (p) { return x(p.label); }).y0(height - m.bottom).y1(function (p) { return y(p.value); }).curve(d3.curveMonotoneX)(s.points),
            fill: c, opacity: .10
          }) : null,
          React.createElement("path", { d: line(s.points), fill: "none", stroke: c, strokeWidth: s.emphasis ? 2.25 : 1.5, strokeDasharray: s.dashed ? "5 4" : null, strokeLinecap: "round" }),
          showPoints ? s.points.map(function (p, pi) {
            return React.createElement("circle", { key: pi, cx: x(p.label), cy: y(p.value), r: 3.2, fill: "var(--surface-card)", stroke: c, strokeWidth: 1.5 });
          }) : null
        );
      })
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    series.length > 1 ? React.createElement(ChartLegend, {
      items: series.filter(function (s) { return s.name; }).map(function (s) { return { label: s.name, tone: s.tone, dashed: s.dashed }; })
    }) : null);
}
