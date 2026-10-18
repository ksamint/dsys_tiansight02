import React from "react";
import { ChartFrame, useD3, useWidth, isDarkFill, AXIS_LABEL, VALUE_LABEL, CHART_HEX, SEQUENTIAL } from "./chartKit.jsx";

/* 构成 × 两个分类 · marimekko: column width = the outer category's share of the total,
   segment height = the inner category's share within it (区域 × 品类, 渠道 × 价格带). The
   spec's 马赛克图 cell for 构成 × 2 分类. Areas are coarse, so segments print their share
   when large enough and the caption should carry the total. */
export function Mekko({ columns = [], height = 300, caption, note, scope, grade, format, minLabelArea = 1400 }) {
  const d3 = useD3();
  const [wrapRef, width] = useWidth(560);
  const m = { top: 26, right: 8, bottom: 30, left: 8 };
  const pct = function (v) { return Math.round(v * 100) + "%"; };
  const fmt = format || pct;
  let body = null;
  if (d3 && columns.length) {
    const total = d3.sum(columns, function (c) { return d3.sum(c.parts, function (p) { return p.value; }); }) || 1;
    const partsOrder = []; columns.forEach(function (c) { c.parts.forEach(function (p) { if (partsOrder.indexOf(p.label) < 0) partsOrder.push(p.label); }); });
    const x = d3.scaleLinear().domain([0, 1]).range([m.left, width - m.right]), y = d3.scaleLinear().domain([0, 1]).range([height - m.bottom, m.top]);
    const shade = function (i) { return SEQUENTIAL[i % SEQUENTIAL.length]; };
    let x0 = 0;
    body = React.createElement(React.Fragment, null,
      columns.map(function (c, ci) {
        const ct = d3.sum(c.parts, function (p) { return p.value; }) || 1, w = ct / total, xs = x0; x0 += w;
        let y0 = 0;
        return React.createElement("g", { key: c.label },
          c.parts.map(function (p) {
            const hgt = p.value / ct, ys = y0; y0 += hgt;
            const pi = partsOrder.indexOf(p.label), fill = shade(pi), dark = isDarkFill(d3, fill);
            const px = x(xs) + 1, py = y(ys + hgt), pw = Math.max(0, x(xs + w) - x(xs) - 2), ph = Math.max(0, y(ys) - y(ys + hgt) - 1);
            return React.createElement("g", { key: p.label },
              React.createElement("rect", { x: px, y: py, width: pw, height: ph, fill: fill, stroke: CHART_HEX.paper, strokeWidth: 1 }, React.createElement("title", null, c.label + " · " + p.label + " · " + fmt(hgt) + " / 列 · " + fmt(p.value / total) + " / 总")),
              pw * ph > minLabelArea && pw > 40 ? React.createElement("text", Object.assign({ x: px + pw / 2, y: py + ph / 2, dy: "0.32em", textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: dark ? CHART_HEX.paper : CHART_HEX.ink }), p.label + " " + pct(hgt)) : null);
          }),
          React.createElement("text", Object.assign({ x: x(xs + w / 2), y: height - m.bottom + 14, textAnchor: "middle" }, AXIS_LABEL, { fill: CHART_HEX.ink }), c.label),
          React.createElement("text", Object.assign({ x: x(xs + w / 2), y: m.top - 8, textAnchor: "middle" }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), pct(w)));
      }));
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0 } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height }, body));
}
