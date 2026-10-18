import React from "react";
import { ChartFrame, ChartLegend, Axes, CanvasLayer, tone, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 关系 · scatter / bubble. Position on two common scales — the two most precise channels —
   carry the two important quantities; `r` (area) is only for a third, coarse magnitude.
   Above `canvasThreshold` points the marks paint to a <canvas> layer in one pass while
   axes, quadrant rules and labelled points stay in SVG, so 10k+ rows remain instant.
   `quadrants: true` draws median rules; pass {x, y} for explicit thresholds. */
export function Scatter({ points = [], height = 300, caption, note, scope, grade, xLabel, yLabel, xFormat, yFormat, quadrants = false, quadrantLabels, canvasThreshold = 1500, maxR = 14, emphasis = [], trend = false }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = Object.assign({}, CHART_MARGIN, { top: quadrantLabels && quadrantLabels.length ? 20 : 16, bottom: 48, left: 56 });
  const useCanvas = points.length > canvasThreshold;
  let body = null, layer = null;
  if (d3 && points.length) {
    const x = d3.scaleLinear().domain(d3.extent(points, function (p) { return p.x; })).nice().range([m.left, width - m.right]);
    const y = d3.scaleLinear().domain(d3.extent(points, function (p) { return p.y; })).nice().range([height - m.bottom, m.top]);
    const hasR = points.some(function (p) { return p.r != null; });
    const r = hasR ? d3.scaleSqrt().domain([0, d3.max(points, function (p) { return p.r; })]).range([2, maxR]) : function () { return useCanvas ? 1.8 : 3.4; };
    const q = quadrants ? { x: typeof quadrants === "object" && quadrants.x != null ? quadrants.x : d3.median(points, function (p) { return p.x; }), y: typeof quadrants === "object" && quadrants.y != null ? quadrants.y : d3.median(points, function (p) { return p.y; }) } : null;
    const fillOf = function (p) { return p.tone ? tone(p.tone) : CHART_HEX.gold; };
    const em = function (p) { return emphasis.indexOf(p.label) >= 0; };
    let fit = null;
    if (trend && points.length > 2) {
      const mx = d3.mean(points, function (p) { return p.x; }), my = d3.mean(points, function (p) { return p.y; });
      const b = d3.sum(points, function (p) { return (p.x - mx) * (p.y - my); }) / (d3.sum(points, function (p) { return (p.x - mx) * (p.x - mx); }) || 1);
      const a = my - b * mx, xd = x.domain();
      fit = { x1: x(xd[0]), y1: y(a + b * xd[0]), x2: x(xd[1]), y2: y(a + b * xd[1]) };
    }
    if (useCanvas) {
      layer = React.createElement(CanvasLayer, { width: width, height: height, deps: [points.length, quadrants],
        draw: function (ctx) {
          ctx.globalAlpha = .55;
          points.forEach(function (p) { ctx.beginPath(); ctx.fillStyle = fillOf(p); ctx.arc(x(p.x), y(p.y), r(p.r), 0, Math.PI * 2); ctx.fill(); });
          ctx.globalAlpha = 1;
        } });
    }
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, margin: m, grid: true, xFormat: xFormat, yFormat: yFormat }),
      xLabel ? React.createElement("text", Object.assign({ x: (m.left + width - m.right) / 2, y: height - 6, textAnchor: "middle" }, AXIS_LABEL), xLabel) : null,
      yLabel ? React.createElement("text", Object.assign({ x: m.left, y: m.top - 6, textAnchor: "start" }, AXIS_LABEL), yLabel) : null,
      q ? React.createElement("g", null,
        React.createElement("line", { x1: x(q.x), x2: x(q.x), y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.rule, strokeDasharray: "4 3" }),
        React.createElement("line", { x1: m.left, x2: width - m.right, y1: y(q.y), y2: y(q.y), stroke: CHART_HEX.rule, strokeDasharray: "4 3" }),
        (quadrantLabels || []).map(function (t, i) {
          /* quadrant words live in the margins, above / below the plot, so they never share a band with point labels */
          const px = i % 2 ? width - m.right : m.left, py = i < 2 ? m.top - 5 : height - m.bottom + 30;
          return React.createElement("text", Object.assign({ key: i, x: px, y: py, textAnchor: i % 2 ? "end" : "start" }, AXIS_LABEL, { fontSize: 10, fill: CHART_HEX.gold, letterSpacing: ".12em" }), t);
        })) : null,
      fit ? React.createElement("line", Object.assign({ stroke: CHART_HEX.charcoal, strokeWidth: 1, strokeDasharray: "2 3" }, fit)) : null,
      useCanvas ? null : points.map(function (p, i) {
        return React.createElement("circle", { key: i, cx: x(p.x), cy: y(p.y), r: r(p.r), fill: fillOf(p), fillOpacity: em(p) ? .95 : .5, stroke: em(p) ? CHART_HEX.charcoal : fillOf(p), strokeWidth: em(p) ? 1.5 : .5 });
      }),
      points.filter(function (p) { return p.label && (em(p) || (!useCanvas && points.length <= 40)); }).map(function (p, i) {
        /* labels flip to the left of the mark in the right 30% of the plot so they never cross the frame or the right-hand quadrant words */
        const left = x(p.x) > m.left + (width - m.left - m.right) * 0.7;
        return React.createElement("text", Object.assign({ key: "l" + i, x: x(p.x) + (left ? -1 : 1) * (r(p.r) + 4), y: y(p.y), dy: "0.32em", textAnchor: left ? "end" : "start" }, VALUE_LABEL, { fontFamily: "var(--font-body)", fontSize: 10, fill: em(p) ? CHART_HEX.charcoal : CHART_HEX.mutedInk }), p.label);
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height, layers: layer }, body),
    useCanvas ? React.createElement(ChartLegend, { items: [{ label: "n=" + points.length.toLocaleString() + " · canvas 渲染", tone: "gold" }] }) : null);
}
