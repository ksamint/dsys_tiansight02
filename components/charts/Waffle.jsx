import React from "react";
import { ChartFrame, ChartLegend, tone, useWidth, seriesTone, SERIES_ORDER, CHART_HEX } from "./chartKit.jsx";

/* 构成 · waffle: a 10 × 10 grid where one cell = 1% (or one of `units` real units), so a
   share reads as a count — "每 100 件出炉，71 件卖掉、9 件报废、20 件留到明天". Largest-remainder
   rounding keeps the cells summing to the grid. From the 烘焙决策台 sample (drawWaffle). */
export function Waffle({ parts = [], caption, note, scope, grade, cols = 10, rows = 10, unitLabel = "件", totalLabel, cell }) {
  const [wrapRef, width] = useWidth(360);
  const n = cols * rows, total = parts.reduce(function (a, p) { return a + (p.value || 0); }, 0) || 1;
  const raw = parts.map(function (p) { return p.value / total * n; });
  const floors = raw.map(Math.floor); let rem = n - floors.reduce(function (a, b) { return a + b; }, 0);
  raw.map(function (v, i) { return [v - floors[i], i]; }).sort(function (a, b) { return b[0] - a[0]; }).forEach(function (x) { if (rem > 0) { floors[x[1]] += 1; rem -= 1; } });
  const size = cell || Math.max(8, Math.min(22, Math.floor((Math.min(width, 360) - 4) / cols) - 3));
  const gap = Math.max(2, Math.round(size * .18)), w = cols * (size + gap) - gap, h = rows * (size + gap) - gap;
  const fills = []; floors.forEach(function (c, i) { for (let k = 0; k < c; k++) fills.push(i); });
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: w, height: h },
      fills.map(function (pi, i) {
        const c = i % cols, r = Math.floor(i / cols), p = parts[pi];
        return React.createElement("rect", { key: i, x: c * (size + gap), y: (rows - 1 - r) * (size + gap), width: size, height: size, fill: p.tone ? tone(p.tone) : seriesTone(pi), opacity: .92 },
          React.createElement("title", null, p.label + " · " + floors[pi] + " / " + n));
      })),
    React.createElement(ChartLegend, { items: parts.map(function (p, i) { return { label: p.label + " " + floors[i] + " " + unitLabel + " / " + n, tone: p.tone || SERIES_ORDER[i % SERIES_ORDER.length] }; }) }),
    totalLabel ? React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: CHART_HEX.mutedInk } }, totalLabel) : null);
}
