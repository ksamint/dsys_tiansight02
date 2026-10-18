import React from "react";
import { ChartFrame, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 十二要素评分罗盘 · a ring of arcs, one per factor, radius = score, tone by threshold
   (≥68 增长 · ≥45 明金 · else 朱红), the weighted total in the hub. The compass is the
   brand's own motif and the 地点推演台 hero. Angle + radius are mid-precision channels, so
   every score is printed and the strongest / weakest factors are named beside the ring —
   read it for pattern and outliers, not for decimals. */
export function ScoreCompass({ factors = [], caption, note, scope, grade, size = 300, thresholds = [45, 68], hubLabel = "综合", verdict }) {
  const d3 = useD3();
  const [wrapRef] = useWidth(320);
  const cx = size / 2, cy = size / 2, r0 = size * .14, r1 = size * .38, rl = size * .43;
  let body = null;
  if (d3 && factors.length) {
    const n = factors.length, step = (Math.PI * 2) / n, gap = 0.035;
    const wsum = d3.sum(factors, function (f) { return f.weight == null ? 1 : f.weight; }) || 1;
    const avg = d3.sum(factors, function (f) { return f.score * (f.weight == null ? 1 : f.weight); }) / wsum;
    const colorOf = function (s) { return s >= thresholds[1] ? CHART_HEX.growth : s >= thresholds[0] ? CHART_HEX.key : CHART_HEX.seal; };
    const arc = d3.arc();
    const sorted = factors.slice().sort(function (a, b) { return b.score - a.score; });
    body = React.createElement("g", { transform: "translate(" + cx + "," + cy + ")" },
      [0.25, 0.5, 0.75, 1].map(function (t, i) { return React.createElement("circle", { key: i, r: r0 + (r1 - r0) * t, fill: "none", stroke: CHART_HEX.grid, strokeDasharray: i === 3 ? null : "2 3" }); }),
      factors.map(function (f, i) {
        const a0 = -Math.PI / 2 + i * step + gap, a1 = -Math.PI / 2 + (i + 1) * step - gap;
        const rr = r0 + (r1 - r0) * Math.max(0, Math.min(100, f.score)) / 100;
        const am = (a0 + a1) / 2, lx = Math.cos(am) * rl, ly = Math.sin(am) * rl;
        const anchor = Math.abs(Math.cos(am)) < .25 ? "middle" : Math.cos(am) > 0 ? "start" : "end";
        return React.createElement("g", { key: f.label },
          React.createElement("path", { d: arc({ innerRadius: r0, outerRadius: r1, startAngle: a0 + Math.PI / 2, endAngle: a1 + Math.PI / 2 }), fill: CHART_HEX.field, opacity: .5 }),
          React.createElement("path", { d: arc({ innerRadius: r0, outerRadius: rr, startAngle: a0 + Math.PI / 2, endAngle: a1 + Math.PI / 2 }), fill: colorOf(f.score), opacity: .82 },
            React.createElement("title", null, f.label + " · " + Math.round(f.score) + " 分" + (f.note ? " · " + f.note : ""))),
          React.createElement("text", Object.assign({ x: lx, y: ly, dy: "-0.1em", textAnchor: anchor }, AXIS_LABEL, { fontSize: 10.5, fill: CHART_HEX.ink }), f.label),
          React.createElement("text", Object.assign({ x: lx, y: ly, dy: "1.05em", textAnchor: anchor }, VALUE_LABEL, { fontSize: 10, fill: colorOf(f.score) }), Math.round(f.score)));
      }),
      React.createElement("circle", { r: r0 - 4, fill: CHART_HEX.paper, stroke: CHART_HEX.gold }),
      React.createElement("text", Object.assign({ y: -6, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 9.5, letterSpacing: ".14em" }), hubLabel),
      React.createElement("text", Object.assign({ y: 14, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 20, fontWeight: 600, fill: colorOf(avg) }), Math.round(avg)),
      verdict ? React.createElement("text", Object.assign({ y: r1 + size * .08, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 11, fill: CHART_HEX.charcoal, letterSpacing: ".2em" }), verdict) : null,
      React.createElement("text", Object.assign({ x: -cx + 6, y: cy - 8 }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.mutedInk }), "最强 " + sorted[0].label + " " + Math.round(sorted[0].score) + " · 最弱 " + sorted[n - 1].label + " " + Math.round(sorted[n - 1].score)));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: size, height: size }, body));
}
