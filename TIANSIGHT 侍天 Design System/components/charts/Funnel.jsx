import React from "react";
import { ChartFrame, tone, useD3, useWidth, CHART_HEX, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

/* 转化漏斗: each stage's width is proportional to its value; drop-off is labelled. */
export function Funnel({ stages = [], height, caption, note, unit = "", showDrop = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 52;
  const h = height || stages.length * rowH + 20;
  let body = null;
  if (d3 && stages.length) {
    const max = d3.max(stages, function (s) { return s.value; }) || 1;
    // Gutters are PROPORTIONAL, never a fixed 240px: a fixed reserve exceeds a narrow
    // two-column container and collapses every bar to the minimum width.
    const labelG = Math.min(120, Math.max(52, width * 0.2));
    const valueG = Math.min(84, Math.max(44, width * 0.15));
    const wideEnough = width > 320;
    const dropG = showDrop && wideEnough ? Math.min(56, width * 0.11) : 0;
    const usable = Math.max(width * 0.3, width - labelG - valueG - dropG);
    body = stages.map(function (s, i) {
      const w = Math.max(2, s.value / max * usable);
      const prev = i > 0 ? stages[i - 1].value : null;
      const drop = prev ? ((s.value - prev) / prev * 100) : null;
      const cx = labelG + usable / 2;
      return React.createElement("g", { key: i, transform: "translate(0," + (i * rowH + 8) + ")" },
        React.createElement("rect", { x: cx - w / 2, y: 0, width: w, height: rowH - 16, rx: 1, fill: tone(s.tone || (i === 0 ? "bronze" : i === stages.length - 1 ? "growth" : "datum")), opacity: .92 }),
        React.createElement("text", Object.assign({ x: 0, y: (rowH - 16) / 2, dy: "0.32em" }, AXIS_LABEL, { fill: CHART_HEX.ink, fontSize: 12 }), s.label),
        React.createElement("text", Object.assign({ x: Math.min(cx + w / 2 + 10, width - dropG - 6), y: (rowH - 16) / 2, dy: "0.32em" }, VALUE_LABEL, { fontSize: 12 }), s.value + unit),
        dropG && drop != null ? React.createElement("text", Object.assign({
          x: width - 2, y: (rowH - 16) / 2, dy: "0.32em", textAnchor: "end"
        }, VALUE_LABEL, { fontSize: 11, fill: CHART_HEX.loss }), drop.toFixed(1) + "%") : null
      );
    });
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: width, height: h }, body));
}
