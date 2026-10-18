import React from "react";
import { ChartFrame, ChartLegend, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 比较 · two-state comparison. point × 2 + line. Horizontal, so long CN labels fit and
   the chart stays flat enough for a 21:9 slide. Position on a common scale = the most
   precise channel, which is why this beats a grouped-bar pair. */
export function Dumbbell({ rows = [], height, caption, note, scope, grade, unit = "", format, fromLabel = "前", toLabel = "后", semantic = true, labelWidth = 96 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 30, m = { top: 10, right: 44, bottom: 28, left: labelWidth };
  const h = height || m.top + m.bottom + rows.length * rowH;
  const fmt = format || function (v) { return (Math.round(v * 10) / 10) + unit; };
  let body = null;
  if (d3 && rows.length) {
    const all = rows.reduce(function (a, r) { return a.concat([r.before, r.after]); }, []);
    const x = d3.scaleLinear().domain([Math.min(0, d3.min(all)), d3.max(all)]).nice().range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(rows.map(function (r) { return r.label; })).range([m.top, h - m.bottom]).padding(0.4);
    body = React.createElement(React.Fragment, null,
      x.ticks(5).map(function (v, i) { return React.createElement("g", { key: i },
        React.createElement("line", { x1: x(v), x2: x(v), y1: m.top, y2: h - m.bottom, stroke: CHART_HEX.grid }),
        React.createElement("text", Object.assign({ x: x(v), y: h - m.bottom + 16, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(v))); }),
      rows.map(function (r) {
        const cy = y(r.label) + y.bandwidth() / 2, up = r.after >= r.before;
        const c = r.tone ? tone(r.tone) : semantic ? (up ? CHART_HEX.growth : CHART_HEX.loss) : CHART_HEX.gold;
        return React.createElement("g", { key: r.label },
          React.createElement("text", Object.assign({ x: m.left - 12, y: cy, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink }), r.label),
          React.createElement("line", { x1: x(r.before), x2: x(r.after), y1: cy, y2: cy, stroke: c, strokeWidth: 2, strokeLinecap: "round" }),
          React.createElement("circle", { cx: x(r.before), cy: cy, r: 4.5, fill: CHART_HEX.paper, stroke: CHART_HEX.mutedInk, strokeWidth: 1.5 }),
          React.createElement("circle", { cx: x(r.after), cy: cy, r: 4.5, fill: c }),
          React.createElement("text", Object.assign({ x: x(r.after) + (up ? 10 : -10), y: cy, dy: "0.32em", textAnchor: up ? "start" : "end" }, VALUE_LABEL, { fontSize: 10.5, fill: c }), fmt(r.after)),
          React.createElement("text", Object.assign({ x: x(r.before) + (up ? -10 : 10), y: cy, dy: "0.32em", textAnchor: up ? "end" : "start" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(r.before)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body),
    React.createElement(ChartLegend, { items: [{ label: fromLabel, tone: "muted" }, { label: toLabel, tone: semantic ? "growth" : "gold" }] }));
}
