import React from "react";
import { ChartFrame, Axes, tone, useD3, useWidth, CHART_HEX, CHART_MARGIN, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

/* 表内微图: inline trend for a table cell or MetricRow. No axes, no labels. */
export function Sparkline({ values = [], width = 84, height = 22, toneName = "datum", area = true, showLast = true }) {
  const d3 = useD3();
  if (!d3 || values.length < 2) return React.createElement("svg", { width: width, height: height, style: { display: "block" } });
  const ext = d3.extent(values);
  const pad = (ext[1] - ext[0] || 1) * .12;
  const x = d3.scaleLinear().domain([0, values.length - 1]).range([1, width - 1]);
  const y = d3.scaleLinear().domain([ext[0] - pad, ext[1] + pad]).range([height - 2, 2]);
  const pts = values.map(function (v, i) { return { i: i, v: v }; });
  const c = tone(toneName);
  return React.createElement("svg", { width: width, height: height, style: { display: "block", overflow: "visible" } },
    area ? React.createElement("path", {
      d: d3.area().x(function (p) { return x(p.i); }).y0(height).y1(function (p) { return y(p.v); }).curve(d3.curveMonotoneX)(pts),
      fill: c, opacity: .12
    }) : null,
    React.createElement("path", {
      d: d3.line().x(function (p) { return x(p.i); }).y(function (p) { return y(p.v); }).curve(d3.curveMonotoneX)(pts),
      fill: "none", stroke: c, strokeWidth: 1.4, strokeLinecap: "round"
    }),
    showLast ? React.createElement("circle", { cx: x(values.length - 1), cy: y(values[values.length - 1]), r: 2.2, fill: c }) : null
  );
}
