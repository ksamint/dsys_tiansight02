import React from "react";
import { ChartFrame, isDarkFill, useD3, useWidth, CHART_HEX, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

/* 逐店逐月: rows = 门店, columns = 月份. Parchment → bronze ramp, or growth↔loss diverging. */
export function Heatmap({ rows = [], columns = [], values = {}, height, caption, note, diverging = false, unit = "", cellGap = 2, labelWidth = 92 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const rowH = 30;
  const h = height || rows.length * rowH + 46;
  let body = null;
  if (d3 && rows.length && columns.length) {
    const all = [];
    rows.forEach(function (r) { columns.forEach(function (c) { const v = values[r + "|" + c]; if (v != null) all.push(v); }); });
    const ext = d3.extent(all);
    const scale = diverging
      ? d3.scaleDiverging().domain([ext[0], 0, ext[1]]).interpolator(d3.interpolateRgbBasis([CHART_HEX.loss, "#F6F1E4", CHART_HEX.growth]))
      : d3.scaleSequential().domain(ext).interpolator(d3.interpolateRgbBasis(["#F6F1E4", "#D2BD8E", CHART_HEX.bronze]));
    const cw = (width - labelWidth - 8) / columns.length;
    body = React.createElement(React.Fragment, null,
      columns.map(function (c, ci) {
        return React.createElement("text", Object.assign({ key: "c" + ci, x: labelWidth + ci * cw + cw / 2, y: 12, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10 }), c);
      }),
      rows.map(function (r, ri) {
        return React.createElement("g", { key: "r" + ri },
          React.createElement("text", Object.assign({ x: labelWidth - 12, y: 24 + ri * rowH + rowH / 2, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fill: CHART_HEX.ink }), r),
          columns.map(function (c, ci) {
            const v = values[r + "|" + c];
            const fill = v == null ? "var(--parchment-100)" : scale(v);
            // Luminance of the RESOLVED fill, in both modes: a diverging scale is dark at
            // BOTH ends, so a mode flag would leave the deepest red and green unreadable.
            const dark = v != null && isDarkFill(d3, fill);
            return React.createElement("g", { key: ci },
              React.createElement("rect", {
                x: labelWidth + ci * cw + cellGap / 2, y: 24 + ri * rowH + cellGap / 2,
                width: Math.max(1, cw - cellGap), height: rowH - cellGap, rx: 1,
                fill: fill, stroke: v == null ? CHART_HEX.grid : "none", strokeDasharray: v == null ? "2 2" : null
              }),
              v != null ? React.createElement("text", Object.assign({
                x: labelWidth + ci * cw + cw / 2, y: 24 + ri * rowH + rowH / 2, dy: "0.32em", textAnchor: "middle"
              }, VALUE_LABEL, { fontSize: 10, fill: dark ? "#FBF8F1" : CHART_HEX.ink }), v + unit) : null
            );
          })
        );
      })
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: width, height: h }, body));
}
