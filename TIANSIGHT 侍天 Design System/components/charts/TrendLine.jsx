import React from "react";
import { ChartFrame, ChartLegend, Axes, tone, useD3, useWidth, CHART_MARGIN, AXIS_LABEL } from "./chartKit.jsx";

export function TrendLine({ series = [], height = 260, caption, note, unit = "", yFormat, showPoints = true, grid = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = CHART_MARGIN;
  const flat = series.reduce(function (a, s) { return a.concat(s.points || []); }, []);
  let body = null;
  if (d3 && flat.length) {
    const labels = (series[0].points || []).map(function (p) { return p.label; });
    const x = d3.scalePoint().domain(labels).range([m.left, width - m.right]).padding(0.5);
    const ext = d3.extent(flat, function (p) { return p.value; });
    const pad = (ext[1] - ext[0] || 1) * 0.18;
    const y = d3.scaleLinear().domain([Math.min(ext[0] - pad, ext[0] * 0.96), ext[1] + pad]).nice().range([height - m.bottom, m.top]);
    const line = d3.line().x(function (p) { return x(p.label); }).y(function (p) { return y(p.value); }).curve(d3.curveMonotoneX);
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: grid, band: false, yFormat: yFormat || function (v) { return v + unit; }, xTicks: labels.length }),
      labels.map(function (l, i) {
        return React.createElement("text", Object.assign({ key: "xl" + i, x: x(l), y: height - m.bottom + 18, textAnchor: "middle" }, AXIS_LABEL), l);
      }),
      series.map(function (s, si) {
        const c = tone(s.tone);
        return React.createElement("g", { key: si },
          s.area ? React.createElement("path", {
            d: d3.area().x(function (p) { return x(p.label); }).y0(height - m.bottom).y1(function (p) { return y(p.value); }).curve(d3.curveMonotoneX)(s.points),
            fill: c, opacity: .10
          }) : null,
          React.createElement("path", { d: line(s.points), fill: "none", stroke: c, strokeWidth: s.emphasis ? 2.25 : 1.5, strokeDasharray: s.dashed ? "5 4" : null, strokeLinecap: "round" }),
          showPoints ? s.points.map(function (p, pi) {
            return React.createElement("circle", { key: pi, cx: x(p.label), cy: y(p.value), r: 3.2, fill: "var(--surface-card)", stroke: c, strokeWidth: 1.5 });
          }) : null
        );
      })
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: width, height: height }, body),
    series.length > 1 ? React.createElement(ChartLegend, {
      items: series.filter(function (s) { return s.name; }).map(function (s) { return { label: s.name, tone: s.tone, dashed: s.dashed }; })
    }) : null);
}
