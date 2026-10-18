import React from "react";
import { ChartFrame, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 排序 / 趋势 · rank or value change between exactly two time points. line mark at two
   category positions; slope encodes the change. Highlight ≤3 items — the rest stay muted
   so the eye lands on what moved. */
export function SlopeChart({ items = [], height = 280, caption, note, scope, grade, leftLabel = "P1", rightLabel = "P2", highlight = [], unit = "", format }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(420);
  const m = { top: 28, right: 120, bottom: 16, left: 120 };
  const fmt = format || function (v) { return (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && items.length) {
    const ext = d3.extent(items.reduce(function (a, it) { return a.concat([it.a, it.b]); }, []));
    const y = d3.scaleLinear().domain(ext).nice().range([height - m.bottom, m.top]);
    const xl = m.left, xr = width - m.right;
    const hi = function (it) { return highlight.indexOf(it.label) >= 0; };
    body = React.createElement(React.Fragment, null,
      [xl, xr].map(function (xx, i) { return React.createElement("line", { key: i, x1: xx, x2: xx, y1: m.top - 8, y2: height - m.bottom, stroke: CHART_HEX.rule }); }),
      React.createElement("text", Object.assign({ x: xl, y: m.top - 14, textAnchor: "middle" }, AXIS_LABEL, { letterSpacing: ".18em" }), leftLabel),
      React.createElement("text", Object.assign({ x: xr, y: m.top - 14, textAnchor: "middle" }, AXIS_LABEL, { letterSpacing: ".18em" }), rightLabel),
      items.slice().sort(function (p, q) { return hi(p) - hi(q); }).map(function (it, i) {
        const on = hi(it) || !highlight.length;
        const c = it.tone ? tone(it.tone) : hi(it) ? (highlight.indexOf(it.label) === 0 ? CHART_HEX.key : highlight.indexOf(it.label) === 1 ? CHART_HEX.charcoal : CHART_HEX.seal) : CHART_HEX.muted;
        return React.createElement("g", { key: it.label, opacity: on ? 1 : .8 },
          React.createElement("line", { x1: xl, x2: xr, y1: y(it.a), y2: y(it.b), stroke: c, strokeWidth: hi(it) ? 2.25 : 1.25, strokeLinecap: "round" }),
          React.createElement("circle", { cx: xl, cy: y(it.a), r: hi(it) ? 4 : 2.5, fill: c }),
          React.createElement("circle", { cx: xr, cy: y(it.b), r: hi(it) ? 4 : 2.5, fill: c }),
          React.createElement("text", Object.assign({ x: xl - 12, y: y(it.a), dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: on ? CHART_HEX.ink : CHART_HEX.mutedInk, fontWeight: hi(it) ? 600 : 400 }), it.label + " "),
          React.createElement("text", Object.assign({ x: xl - 12 - 8 * Math.max(1, it.label.length) * 1.1, y: y(it.a), dy: "0.32em", textAnchor: "end" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(it.a)),
          React.createElement("text", Object.assign({ x: xr + 12, y: y(it.b), dy: "0.32em", textAnchor: "start" }, VALUE_LABEL, { fontSize: 10.5, fill: on ? c : CHART_HEX.mutedInk, fontWeight: hi(it) ? 600 : 400 }), fmt(it.b)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body));
}
