import React from "react";
import { ChartFrame, ChartLegend, Axes, tone, useD3, useWidth, CHART_MARGIN } from "./chartKit.jsx";

export function StackedBars({ data = [], keys = [], tones = {}, height = 280, caption, note, unit = "%", normalize = false, grid = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = CHART_MARGIN;
  let body = null;
  if (d3 && data.length && keys.length) {
    const rows = normalize ? data.map(function (d) {
      const t = keys.reduce(function (a, k) { return a + (d[k] || 0); }, 0) || 1;
      const o = { label: d.label };
      keys.forEach(function (k) { o[k] = (d[k] || 0) / t * 100; });
      return o;
    }) : data;
    const stack = d3.stack().keys(keys)(rows);
    const x = d3.scaleBand().domain(rows.map(function (d) { return d.label; })).range([m.left, width - m.right]).padding(0.34);
    const top = d3.max(stack[stack.length - 1], function (d) { return d[1]; }) || 1;
    const y = d3.scaleLinear().domain([0, top]).nice().range([height - m.bottom, m.top]);
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: grid, band: true, yFormat: function (v) { return Math.round(v) + unit; } }),
      stack.map(function (layer, li) {
        return React.createElement("g", { key: li, fill: tone(tones[keys[li]]) },
          layer.map(function (d, di) {
            const h = Math.max(0, y(d[0]) - y(d[1]));
            return React.createElement("rect", { key: di, x: x(rows[di].label), y: y(d[1]), width: x.bandwidth(), height: h, rx: 1 });
          })
        );
      })
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: width, height: height }, body),
    React.createElement(ChartLegend, { items: keys.map(function (k) { return { label: k, tone: tones[k] }; }) }));
}
