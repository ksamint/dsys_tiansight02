import React from "react";
import { ChartFrame, Axes, tone, useD3, useWidth, CHART_HEX, CHART_MARGIN, VALUE_LABEL, AXIS_LABEL } from "./chartKit.jsx";

export function Donut({ data = [], size = 220, thickness = 26, caption, note, centerValue, centerLabel, unit = "%", showLegend = true }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(size + 200);
  let body = null;
  if (d3 && data.length) {
    const r = size / 2;
    const arcs = d3.pie().sort(null).padAngle(.012).value(function (d) { return d.value; })(data);
    const arc = d3.arc().innerRadius(r - thickness).outerRadius(r).cornerRadius(1);
    body = React.createElement("g", { transform: "translate(" + r + "," + r + ")" },
      arcs.map(function (a, i) {
        return React.createElement("path", { key: i, d: arc(a), fill: tone(data[i].tone), stroke: "var(--surface-card)", strokeWidth: 1 });
      }),
      centerValue != null ? React.createElement("text", Object.assign({ x: 0, y: -2, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 30, fill: CHART_HEX.ink }), centerValue) : null,
      centerLabel ? React.createElement("text", Object.assign({ x: 0, y: 20, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 11 }), centerLabel) : null
    );
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", alignItems: "center", gap: "var(--space-7)", flexWrap: "wrap" } },
    React.createElement(ChartFrame, { caption: caption, note: note, width: size, height: size }, body),
    showLegend ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 } },
      data.map(function (d, i) {
        return React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, fontSize: "var(--text-xs)", color: "var(--ink-700)" } },
          React.createElement("span", { style: { width: 10, height: 10, borderRadius: 1, background: tone(d.tone), flexShrink: 0 } }),
          React.createElement("span", { style: { flex: 1 } }, d.label),
          React.createElement("span", { style: { fontFamily: "var(--font-numeral)", color: "var(--ink-900)" } }, d.value + unit)
        );
      })
    ) : null
  );
}
