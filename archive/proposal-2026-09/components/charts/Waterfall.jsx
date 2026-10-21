import React from "react";
import { ChartFrame, Axes, tone, useD3, useWidth, CHART_HEX, CHART_MARGIN, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

/* 利润流失归因: start → signed steps → end. Bars are placed cumulatively. */
export function Waterfall({ start, steps = [], endLabel = "当期", startLabel = "上期", height = 300, caption, note, unit = "万" }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = { top: 22, right: 20, bottom: 46, left: 56 };
  let body = null;
  if (d3 && steps.length) {
    const bars = [];
    let run = start;
    bars.push({ label: startLabel, y0: 0, y1: start, kind: "total", value: start });
    steps.forEach(function (s) {
      const next = run + s.value;
      bars.push({ label: s.label, y0: Math.min(run, next), y1: Math.max(run, next), kind: s.value >= 0 ? "growth" : "loss", value: s.value });
      run = next;
    });
    bars.push({ label: endLabel, y0: 0, y1: run, kind: "total", value: run });
    const x = d3.scaleBand().domain(bars.map(function (b) { return b.label; })).range([m.left, width - m.right]).padding(0.32);
    const y = d3.scaleLinear().domain([0, d3.max(bars, function (b) { return b.y1; }) * 1.12]).nice().range([height - m.bottom, m.top]);
    body = React.createElement(React.Fragment, null,
      React.createElement(Axes, { x: x, y: y, width: width, height: height, grid: true, band: true, yFormat: function (v) { return v + ""; } }),
      bars.map(function (b, i) {
        const c = b.kind === "total" ? tone("bronze") : tone(b.kind);
        const h = Math.max(1, y(b.y0) - y(b.y1));
        return React.createElement("g", { key: i },
          React.createElement("rect", { x: x(b.label), y: y(b.y1), width: x.bandwidth(), height: h, fill: c, opacity: b.kind === "total" ? 1 : .92, rx: 1 }),
          React.createElement("text", Object.assign({ x: x(b.label) + x.bandwidth() / 2, y: y(b.y1) - 7, textAnchor: "middle" }, VALUE_LABEL, { fill: c, fontSize: 11 }),
            (b.kind === "total" ? "" : b.value > 0 ? "+" : "") + b.value),
          i < bars.length - 1 ? React.createElement("line", {
            x1: x(b.label) + x.bandwidth(), x2: x(bars[i + 1].label),
            y1: y(b.kind === "loss" ? b.y0 : b.y1), y2: y(b.kind === "loss" ? b.y0 : b.y1),
            stroke: CHART_HEX.rule, strokeWidth: 1, strokeDasharray: "3 3"
          }) : null
        );
      }),
      React.createElement("text", Object.assign({ x: m.left, y: 10 }, AXIS_LABEL), "单位：" + unit)
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: width, height: height }, body));
}
