import React from "react";
import { ChartFrame, ChartLegend, CanvasLayer, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 时段 / 区间 · when something started and how long it lasted: SKU life spans, menu
   versions, pilots. Horizontal bars on a time axis — the one chart family that is
   naturally 21:9. Above `canvasThreshold` rows the bars paint to canvas and only every
   k-th label is drawn, so 148+ SKUs stay a single frame. `today` draws a seal marker. */
export function Gantt({ rows = [], height, caption, note, scope, grade, today, canvasThreshold = 120, rowHeight, labelWidth = 120, groupTone = {} }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(600);
  const dense = rows.length > canvasThreshold;
  const rh = rowHeight || (dense ? 4 : 22);
  const m = { top: 26, right: 16, bottom: 10, left: dense ? 60 : labelWidth };
  const h = height || m.top + m.bottom + rows.length * rh;
  const toDate = function (v) { return v instanceof Date ? v : new Date(v); };
  let body = null, layer = null;
  if (d3 && rows.length) {
    const data = rows.map(function (r) { return Object.assign({}, r, { s: toDate(r.start), e: toDate(r.end) }); });
    const x = d3.scaleTime().domain([d3.min(data, function (r) { return r.s; }), d3.max(data, function (r) { return r.e; })]).range([m.left, width - m.right]);
    const y = d3.scaleBand().domain(data.map(function (r, i) { return r.label + "\u0000" + i; })).range([m.top, h - m.bottom]).padding(dense ? 0.15 : 0.3);
    const colorOf = function (r) { return r.tone ? tone(r.tone) : r.group && groupTone[r.group] ? tone(groupTone[r.group]) : CHART_HEX.key; };
    const ticks = x.ticks(Math.max(3, Math.min(8, Math.floor((width - m.left) / 90))));
    const tf = d3.timeFormat("%m-%d"), tfY = d3.timeFormat("%Y-%m");
    if (dense) {
      layer = React.createElement(CanvasLayer, { width: width, height: h, deps: [rows.length],
        draw: function (ctx) { data.forEach(function (r, i) { ctx.fillStyle = colorOf(r); ctx.globalAlpha = .85; ctx.fillRect(x(r.s), y(r.label + "\u0000" + i), Math.max(1, x(r.e) - x(r.s)), y.bandwidth()); }); } });
    }
    const every = dense ? Math.ceil(rows.length / 12) : 1;
    body = React.createElement(React.Fragment, null,
      ticks.map(function (t, i) { return React.createElement("g", { key: i },
        React.createElement("line", { x1: x(t), x2: x(t), y1: m.top - 4, y2: h - m.bottom, stroke: CHART_HEX.grid }),
        React.createElement("text", Object.assign({ x: x(t), y: m.top - 10, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), (ticks.length > 1 && (ticks[1] - ticks[0]) > 27 * 864e5) ? tfY(t) : tf(t))); }),
      data.map(function (r, i) {
        const k = r.label + "\u0000" + i, cy = y(k) + y.bandwidth() / 2;
        return React.createElement("g", { key: i },
          i % every === 0 ? React.createElement("text", Object.assign({ x: m.left - 10, y: cy, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fontSize: dense ? 9 : 11, fill: CHART_HEX.ink }), r.label) : null,
          dense ? null : React.createElement("rect", { x: x(r.s), y: y(k), width: Math.max(1, x(r.e) - x(r.s)), height: y.bandwidth(), fill: colorOf(r), opacity: .85 }),
          dense || !r.note ? null : React.createElement("text", Object.assign({ x: x(r.e) + 6, y: cy, dy: "0.32em" }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.mutedInk }), r.note));
      }),
      today ? React.createElement("g", null,
        React.createElement("line", { x1: x(toDate(today)), x2: x(toDate(today)), y1: m.top - 4, y2: h - m.bottom, stroke: CHART_HEX.seal, strokeWidth: 1.25 }),
        React.createElement("text", Object.assign({ x: x(toDate(today)) + 4, y: h - m.bottom - 2 }, VALUE_LABEL, { fontSize: 9.5, fill: CHART_HEX.seal }), "今日")) : null);
  }
  const groups = Object.keys(groupTone);
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h, layers: layer }, body),
    groups.length || dense ? React.createElement(ChartLegend, { items: groups.map(function (g) { return { label: g, tone: groupTone[g] }; }).concat(dense ? [{ label: rows.length + " 行 · canvas 渲染", tone: "key" }] : []) }) : null);
}
