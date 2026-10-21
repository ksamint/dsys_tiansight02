import React from "react";
import { ChartFrame, Axes, tone, useD3, useWidth, CHART_HEX, CHART_MARGIN, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

/* 指标达成: a 200° arc with the target marked. Bronze by default; tone by attainment. */
export function Gauge({ value = 0, target = 100, max, size = 190, label, unit = "%", caption, note, autoTone = true, toneName }) {
  const d3 = useD3();
  const top = max != null ? max : Math.max(target * 1.25, value * 1.1);
  let body = null;
  if (d3) {
    const r = size / 2;
    const a0 = -Math.PI * 0.62, a1 = Math.PI * 0.62;
    const s = d3.scaleLinear().domain([0, top]).range([a0, a1]).clamp(true);
    const track = d3.arc().innerRadius(r - 20).outerRadius(r - 4).startAngle(a0).endAngle(a1).cornerRadius(2);
    const fill = d3.arc().innerRadius(r - 20).outerRadius(r - 4).startAngle(a0).endAngle(s(value)).cornerRadius(2);
    const pct = target ? value / target : 0;
    const c = tone(toneName || (!autoTone ? "bronze" : pct >= 1 ? "growth" : pct >= .85 ? "caution" : "loss"));
    const tx = Math.sin(s(target)) * (r - 12), ty = -Math.cos(s(target)) * (r - 12);
    const tx2 = Math.sin(s(target)) * (r - 26), ty2 = -Math.cos(s(target)) * (r - 26);
    body = React.createElement("g", { transform: "translate(" + r + "," + (r + 6) + ")" },
      React.createElement("path", { d: track(), fill: "var(--parchment-300)" }),
      React.createElement("path", { d: fill(), fill: c }),
      React.createElement("line", { x1: tx2, y1: ty2, x2: tx, y2: ty, stroke: CHART_HEX.ink, strokeWidth: 1.5 }),
      React.createElement("text", Object.assign({ x: 0, y: 4, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 34, fill: c }), value + unit),
      label ? React.createElement("text", Object.assign({ x: 0, y: 26, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 11 }), label) : null,
      React.createElement("text", Object.assign({ x: 0, y: 46, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10 }), "目标 " + target + unit)
    );
  }
  return React.createElement(ChartFrame, { caption: caption, note: note, width: size, height: size * 0.82 + 20 }, body);
}
