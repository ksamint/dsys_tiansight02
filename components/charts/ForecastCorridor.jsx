import React from "react";
import { ChartFrame, ChartLegend, Axes, useD3, useWidth, CHART_MARGIN, AXIS_LABEL, VALUE_LABEL, CHART_HEX } from "./chartKit.jsx";

/* 不确定性 · forecast corridor. History as a solid 明金 line, the forecast as a P10–P90
   band with the P50 line, a dashed baseline (历史同期 / 简单基线) and 实测 as charcoal points.
   The methodology insists these sit side by side: a "预期增益" is never written as
   "已节省". The band is the message; do not narrow it to look confident. */
export function ForecastCorridor({ history = [], forecast = [], actual = [], baseline = [], height = 280, caption, note, scope, grade, unit = "", format, grid = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(600);
  const m = CHART_MARGIN;
  const fmt = format || function (v) { return Math.round(v).toLocaleString() + unit; };
  let body = null;
  if (d3 && (history.length || forecast.length)) {
    const labels = history.map(function (p) { return p.label; }).concat(forecast.map(function (p) { return p.label; }).filter(function (l) { return history.every(function (p) { return p.label !== l; }); }));
    const x = d3.scalePoint().domain(labels).range([m.left, width - m.right]).padding(0.5);
    const all = history.map(function (p) { return p.value; }).concat(forecast.reduce(function (a, p) { return a.concat([p.p10, p.p90, p.p50]); }, []), actual.map(function (p) { return p.value; }), baseline.map(function (p) { return p.value; })).filter(function (v) { return v != null; });
    const ext = d3.extent(all), pad = (ext[1] - ext[0] || 1) * .15;
    const y = d3.scaleLinear().domain([Math.max(0, ext[0] - pad), ext[1] + pad]).nice().range([height - m.bottom, m.top]);
    const line = function (acc) { return d3.line().defined(function (p) { return acc(p) != null; }).x(function (p) { return x(p.label); }).y(function (p) { return y(acc(p)); }).curve(d3.curveMonotoneX); };
    const bridge = history.length && forecast.length ? [{ label: history[history.length - 1].label, p10: history[history.length - 1].value, p50: history[history.length - 1].value, p90: history[history.length - 1].value }].concat(forecast) : forecast;
    const area = d3.area().x(function (p) { return x(p.label); }).y0(function (p) { return y(p.p10); }).y1(function (p) { return y(p.p90); }).curve(d3.curveMonotoneX);
    const split = history.length ? x(history[history.length - 1].label) : null;
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: grid, yFormat: fmt, xTicks: labels.length }),
      labels.map(function (l, i) { return React.createElement("text", Object.assign({ key: "xl" + i, x: x(l), y: height - m.bottom + 18, textAnchor: "middle" }, AXIS_LABEL), l); }),
      split != null ? React.createElement("g", null,
        React.createElement("line", { x1: split, x2: split, y1: m.top, y2: height - m.bottom, stroke: CHART_HEX.rule, strokeDasharray: "3 3" }),
        React.createElement("text", Object.assign({ x: split + 6, y: m.top + 10 }, AXIS_LABEL, { fontSize: 10, letterSpacing: ".12em" }), "预测 →")) : null,
      forecast.length ? React.createElement("path", { d: area(bridge), fill: CHART_HEX.key, opacity: .22 }) : null,
      forecast.length ? React.createElement("path", { d: line(function (p) { return p.p50; })(bridge), fill: "none", stroke: CHART_HEX.gold, strokeWidth: 1.5, strokeDasharray: "6 3" }) : null,
      baseline.length ? React.createElement("path", { d: line(function (p) { return p.value; })(baseline), fill: "none", stroke: CHART_HEX.mutedInk, strokeWidth: 1.25, strokeDasharray: "2 4" }) : null,
      history.length ? React.createElement("path", { d: line(function (p) { return p.value; })(history), fill: "none", stroke: CHART_HEX.key, strokeWidth: 2 }) : null,
      actual.map(function (p, i) { return React.createElement("circle", { key: "a" + i, cx: x(p.label), cy: y(p.value), r: 3.6, fill: CHART_HEX.charcoal }); }),
      forecast.length ? [forecast[forecast.length - 1]].map(function (p, i) {
        return React.createElement("g", { key: "e" + i },
          React.createElement("text", Object.assign({ x: x(p.label) + 8, y: y(p.p90), dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.gold }), "P90 " + fmt(p.p90)),
          React.createElement("text", Object.assign({ x: x(p.label) + 8, y: y(p.p50), dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.gold }), "P50 " + fmt(p.p50)),
          React.createElement("text", Object.assign({ x: x(p.label) + 8, y: y(p.p10), dy: "0.32em" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.gold }), "P10 " + fmt(p.p10)));
      }) : null);
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body),
    React.createElement(ChartLegend, { items: [{ label: "历史", tone: "key" }, { label: "P10–P90 区间", tone: "key", band: true }, { label: "P50", tone: "gold", dashed: true }].concat(baseline.length ? [{ label: "基线", tone: "datum", dashed: true }] : [], actual.length ? [{ label: "实测", tone: "charcoal" }] : []) }));
}
