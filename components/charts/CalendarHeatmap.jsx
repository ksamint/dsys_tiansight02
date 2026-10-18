import React from "react";
import { ChartFrame, useD3, useWidth, isDarkFill, AXIS_LABEL, VALUE_LABEL, CHART_HEX, SEQUENTIAL, DIVERGING } from "./chartKit.jsx";

/* 趋势 × 日历 · one tile per day, weeks as columns (店 × 日 calendar, 153 days of daily
   实收, holiday windows). Colour is a coarse channel, so this is for pattern reading —
   weekday rhythm, holidays, outages — not for reading values; pair with a TrendLine when
   the numbers matter. Single-hue gold ramp by default; `diverging` for 同比 around zero. */
export function CalendarHeatmap({ values = [], caption, note, scope, grade, diverging = false, cell, format, unit = "", weekStart = 1 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(600);
  const m = { top: 22, right: 8, bottom: 8, left: 30 };
  const fmt = format || function (v) { return Math.round(v).toLocaleString() + unit; };
  let body = null, h = 140;
  if (d3 && values.length) {
    const rows = values.map(function (v) { return { d: new Date(v.date), v: +v.value }; }).sort(function (a, b) { return a.d - b.d; });
    const start = d3.timeWeek.offset(weekStart === 1 ? d3.timeMonday.floor(rows[0].d) : d3.timeWeek.floor(rows[0].d), 0);
    const weekOf = function (d) { return weekStart === 1 ? d3.timeMonday.count(start, d) : d3.timeWeek.count(start, d); };
    const nWeeks = weekOf(rows[rows.length - 1].d) + 1;
    const c = cell || Math.max(8, Math.min(18, Math.floor((width - m.left - m.right) / nWeeks) - 2));
    h = m.top + m.bottom + 7 * (c + 2);
    const dow = function (d) { return (d.getDay() - weekStart + 7) % 7; };
    const ext = d3.extent(rows, function (r) { return r.v; });
    const color = diverging
      ? d3.scaleLinear().domain([Math.min(ext[0], 0), 0, Math.max(ext[1], 0)]).range(DIVERGING).clamp(true)
      : d3.scaleQuantize().domain([ext[0], ext[1]]).range(SEQUENTIAL);
    const months = d3.timeMonths(d3.timeMonth.floor(rows[0].d), rows[rows.length - 1].d);
    body = React.createElement(React.Fragment, null,
      ["一", "二", "三", "四", "五", "六", "日"].map(function (l, i) {
        const idx = weekStart === 1 ? i : (i + 1) % 7;
        return React.createElement("text", Object.assign({ key: l, x: m.left - 8, y: m.top + idx * (c + 2) + c / 2, dy: "0.32em", textAnchor: "end" }, AXIS_LABEL, { fontSize: 9.5 }), l);
      }),
      months.map(function (mo, i) {
        return React.createElement("text", Object.assign({ key: i, x: m.left + weekOf(mo < rows[0].d ? rows[0].d : mo) * (c + 2), y: m.top - 8 }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), d3.timeFormat("%m月")(mo));
      }),
      rows.map(function (r, i) {
        const fill = color(r.v), x = m.left + weekOf(r.d) * (c + 2), y = m.top + dow(r.d) * (c + 2);
        return React.createElement("rect", { key: i, x: x, y: y, width: c, height: c, fill: fill, stroke: CHART_HEX.paper, strokeWidth: 1 },
          React.createElement("title", null, d3.timeFormat("%Y-%m-%d")(r.d) + " · " + fmt(r.v)));
      }));
  }
  const ramp = diverging ? DIVERGING : SEQUENTIAL;
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: h }, body),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" } },
      React.createElement("span", null, diverging ? "低" : "少"),
      ramp.map(function (hx, i) { return React.createElement("span", { key: i, style: { width: 18, height: 10, background: hx } }); }),
      React.createElement("span", null, diverging ? "高" : "多")));
}
