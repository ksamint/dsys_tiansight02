import React from "react";
import { ChartFrame, Axes, tone, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 分布 + 离群 · box plot per category. Box = Q1–Q3, rule = median, whiskers = 1.5 IQR,
   outliers drawn as hollow points. Vertical by default; `horizontal` for long CN labels. */
export function BoxPlot({ groups = [], height = 260, caption, note, scope, grade, unit = "", format, horizontal = false, showN = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = horizontal ? { top: 12, right: 24, bottom: 30, left: 96 } : CHART_MARGIN;
  const fmt = format || function (v) { return (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && groups.length) {
    const stats = groups.map(function (g) {
      const s = g.values.slice().sort(d3.ascending);
      const q1 = d3.quantile(s, .25), q2 = d3.quantile(s, .5), q3 = d3.quantile(s, .75), iqr = q3 - q1;
      const lo = Math.max(s[0], q1 - 1.5 * iqr), hi = Math.min(s[s.length - 1], q3 + 1.5 * iqr);
      return { label: g.label, tone: g.tone, q1: q1, q2: q2, q3: q3, lo: lo, hi: hi, n: s.length, out: s.filter(function (v) { return v < lo || v > hi; }) };
    });
    const all = groups.reduce(function (a, g) { return a.concat(g.values); }, []);
    const v = d3.scaleLinear().domain(d3.extent(all)).nice();
    const c = d3.scaleBand().domain(groups.map(function (g) { return g.label; })).padding(0.45);
    if (horizontal) { v.range([m.left, width - m.right]); c.range([m.top, height - m.bottom]); } else { v.range([height - m.bottom, m.top]); c.range([m.left, width - m.right]); }
    body = React.createElement(React.Fragment, null,
      horizontal
        ? React.createElement(Axes, { x: v, y: c, width: width, height: height, margin: m, yBand: true, xFormat: fmt, grid: false })
        : React.createElement(Axes, { x: c, y: v, width: width, height: height, band: true, yFormat: fmt, grid: true }),
      stats.map(function (s) {
        const col = s.tone ? tone(s.tone) : CHART_HEX.key, bw = c.bandwidth(), c0 = c(s.label), cm = c0 + bw / 2;
        const R = function (a, b) { return horizontal ? React.createElement("rect", { x: v(a), y: c0, width: Math.max(1, v(b) - v(a)), height: bw, fill: col, opacity: .8, stroke: CHART_HEX.gold, strokeWidth: 1 }) : React.createElement("rect", { x: c0, y: v(b), width: bw, height: Math.max(1, v(a) - v(b)), fill: col, opacity: .8, stroke: CHART_HEX.gold, strokeWidth: 1 }); };
        const L = function (a, b, k, w, len) { return horizontal ? React.createElement("line", { key: k, x1: v(a), x2: v(b), y1: len ? c0 + bw / 2 - len : cm, y2: len ? c0 + bw / 2 + len : cm, stroke: CHART_HEX.charcoal, strokeWidth: w }) : React.createElement("line", { key: k, x1: len ? cm - len : cm, x2: len ? cm + len : cm, y1: v(a), y2: v(b), stroke: CHART_HEX.charcoal, strokeWidth: w }); };
        return React.createElement("g", { key: s.label },
          L(s.lo, s.q1, "w1", 1), L(s.q3, s.hi, "w2", 1),
          L(s.lo, s.lo, "c1", 1, bw / 4), L(s.hi, s.hi, "c2", 1, bw / 4),
          R(s.q1, s.q3),
          L(s.q2, s.q2, "med", 2, bw / 2),
          s.out.map(function (o, i) { return React.createElement("circle", { key: "o" + i, cx: horizontal ? v(o) : cm, cy: horizontal ? cm : v(o), r: 2.6, fill: CHART_HEX.paper, stroke: CHART_HEX.seal, strokeWidth: 1.2 }); }),
          showN ? React.createElement("text", Object.assign({ x: horizontal ? width - m.right : cm, y: horizontal ? c0 - 2 : height - m.bottom + 30, textAnchor: horizontal ? "end" : "middle" }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.mutedInk }), "n=" + s.n) : null);
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body));
}
