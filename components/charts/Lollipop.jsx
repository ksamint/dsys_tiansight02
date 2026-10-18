import React from "react";
import { ChartFrame, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 排序 · lollipop: point + hairline, the light version of a ranked bar. Same channel
   (position on a common scale), a fraction of the ink — right for ranks of 8–30 items
   such as the v4.2 高毛利样本 (Q2f). Sorted by value; a `threshold` draws a dashed rule
   and colours items beyond it. */
export function Lollipop({ rows = [], height, caption, note, scope, grade, unit = "", format, labelWidth = 110, threshold, thresholdLabel, sorted = true, highlight = [] }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(520);
  const rowH = 24, m = { top: 12, right: 56, bottom: 26, left: labelWidth };
  const h = height || m.top + m.bottom + rows.length * rowH;
  const fmt = format || function (v) { return (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && rows.length) {
    const data = sorted ? rows.slice().sort(function (a, b) { return b.value - a.value; }) : rows;
    const x = d3.scaleLinear().domain([Math.min(0, d3.min(data, function (r) { return r.value; })), d3.max(data, function (r) { return r.value; })]).nice().range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(data.map(function (r) { return r.label; })).range([m.top, h - m.bottom]);
    body = React.createElement(React.Fragment, null,
      x.ticks(5).map(function (v, i) { return React.createElement("g", { key: i },
        React.createElement("line", { x1: x(v), x2: x(v), y1: m.top, y2: h - m.bottom, stroke: CHART_HEX.grid }),
        React.createElement("text", Object.assign({ x: x(v), y: h - m.bottom + 16, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(v))); }),
      threshold != null ? React.createElement("g", null,
        React.createElement("line", { x1: x(threshold), x2: x(threshold), y1: m.top - 4, y2: h - m.bottom, stroke: CHART_HEX.seal, strokeDasharray: "4 3" }),
        React.createElement("text", Object.assign({ x: x(threshold) + 4, y: m.top + 2 }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.seal }), (thresholdLabel || "阈值") + " " + fmt(threshold))) : null,
      data.map(function (r) {
        const cy = y(r.label) + y.bandwidth() / 2, hi = highlight.indexOf(r.label) >= 0;
        const c = r.tone ? tone(r.tone) : hi ? CHART_HEX.charcoal : threshold != null && r.value >= threshold ? CHART_HEX.gold : CHART_HEX.key;
        return React.createElement("g", { key: r.label },
          React.createElement("text", Object.assign({ x: m.left - 10, y: cy, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink, fontWeight: hi ? 600 : 400 }), r.label),
          React.createElement("line", { x1: x(0), x2: x(r.value), y1: cy, y2: cy, stroke: c, strokeWidth: 1.5, opacity: .85 }),
          React.createElement("circle", { cx: x(r.value), cy: cy, r: hi ? 5 : 4, fill: c }),
          React.createElement("text", Object.assign({ x: x(r.value) + 10, y: cy, dy: "0.32em" }, VALUE_LABEL, { fontSize: 10.5, fill: c }), fmt(r.value)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body));
}
