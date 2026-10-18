import React from "react";
import { FacetGrid } from "./FacetGrid.jsx";
import { rollupDims, tone, useD3, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 维度分析 · dimension breakdown as small-multiple bars. Give it the flat fact table and
   1–2 dimension keys; it rolls up (sum / mean / count / median), keeps ONE shared scale
   across facets, sorts bars by value, and prints the n behind each facet. The 3 × 5
   example in the spec — 配菜带率 by 市别 × 区域 — is `dims={["市别","区域"]} agg="mean"`.
   Or pass pre-aggregated `facets` ([{dim, items:[{label,value,n}]}]) and skip the rollup. */
export function FacetBars({ rows, dims = [], measure, agg = "sum", facets, columns = 3, caption, note, scope, unit = "", format, percent = false, panelHeight = 150, sortBars = true, highlight }) {
  const d3 = useD3();
  const data = facets || (rows ? rollupDims(rows, dims, measure, agg) : []);
  const fmt = format || function (v) { return percent ? Math.round(v * 1000) / 10 + "%" : (Math.round(v * 10) / 10).toLocaleString() + unit; };
  const max = data.reduce(function (mx, f) { return Math.max(mx, f.items.reduce(function (a, it) { return Math.max(a, it.value); }, 0)); }, 0) || 1;
  const panels = data.map(function (f) { return { key: f.dim, title: f.dim, meta: "n=" + f.items.reduce(function (a, it) { return a + (it.n || 0); }, 0), items: sortBars ? f.items.slice().sort(function (a, b) { return b.value - a.value; }) : f.items }; });
  const render = function (p, ctx) {
    if (!d3) return null;
    const m = { top: 4, right: 44, bottom: 4, left: 64 }, rowH = Math.max(14, Math.min(22, Math.floor((ctx.height - m.top - m.bottom) / Math.max(1, p.items.length))));
    const h = m.top + m.bottom + rowH * p.items.length;
    const x = d3.scaleLinear().domain([0, max]).range([m.left, ctx.width - m.right]);
    return React.createElement("svg", { width: ctx.width, height: h, style: { display: "block", overflow: "visible" } },
      p.items.map(function (it, i) {
        const y = m.top + i * rowH, hi = highlight && it.label === highlight;
        return React.createElement("g", { key: it.label },
          React.createElement("text", Object.assign({ x: m.left - 8, y: y + rowH / 2, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fontSize: 10.5, fill: hi ? CHART_HEX.charcoal : CHART_HEX.ink }), it.label),
          React.createElement("rect", { x: m.left, y: y + rowH * .2, width: Math.max(1, x(it.value) - m.left), height: rowH * .6, fill: hi ? CHART_HEX.charcoal : it.tone ? tone(it.tone) : CHART_HEX.key }),
          React.createElement("text", Object.assign({ x: x(it.value) + 6, y: y + rowH / 2, dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: hi ? CHART_HEX.charcoal : CHART_HEX.ink }), fmt(it.value)));
      }));
  };
  return React.createElement(FacetGrid, { panels: panels, columns: columns, render: render, caption: caption, note: note, scope: scope, panelHeight: panelHeight, max: max });
}
