import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";
import { SlideChart, SlideGrade } from "./SlideChart.jsx";
import { Histogram } from "../components/charts/Histogram.jsx";

/* 样张为证 — one page of the report, told the way the 三部曲 prescribes: one sentence, the four
   elements, one chart. The 结论 card on the right IS the 样张: the finding, then the d3 figure
   that is its evidence (default: 午市 ticket distribution with the 38–58 元 band and its share,
   E1). The four elements sit in a label/value ledger on the left. Pass `chart={null}` for the
   text-only card, or any SlideChart-wrapped kit figure. */
const DEFAULT_ELEMENTS = [
  { k: "证据", v: "工作日午市点单集中在 38–58 元价格带，套餐渗透仅 34%。" },
  { k: "利润影响", v: "+18.2 万 / 季", tone: "growth" },
  { k: "执行动作", v: "重排午市套餐结构，主推高毛利招牌组合" },
  { k: "验收指标", v: "午市客单 +8%" }
];
/* Deterministic 样张 sample so the figure never changes between renders (mulberry32 + Box–Muller). */
function mulberry(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function sampleTickets(n, seed) {
  var rnd = mulberry(seed), out = [];
  var gauss = function () { var u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  for (var i = 0; i < n; i++) {
    var r = rnd(), v = r < .14 ? 31 + 4 * gauss() : r < .75 ? 47.5 + 5 * gauss() : r < .94 ? 68 + 7 * gauss() : 98 + 9 * gauss();
    out.push(Math.round(Math.min(118, Math.max(22, v))));
  }
  return out;
}
export const SAMPLE_TICKETS = sampleTickets(260, 20260319);
const BAND = [38, 58];
const share = Math.round(SAMPLE_TICKETS.filter(function (v) { return v >= BAND[0] && v < BAND[1]; }).length / SAMPLE_TICKETS.length * 100);
const DEFAULT_CHART = React.createElement(SlideChart, null,
  React.createElement(Histogram, {
    values: SAMPLE_TICKETS, bins: 14, height: 120, unit: "元", domain: [20, 120], legend: false, yTicks: 3,
    bands: [{ from: BAND[0], to: BAND[1], label: share + "% 的订单" }]
  }));
const DEFAULT_SCOPE = "口径：午市 = 11:00–14:00 堂食订单，n = " + SAMPLE_TICKETS.length + "。数据来源：收银流水 2026-03 至 05（样张）";

export function ProofSlide({ eyebrow = "以样张为证", title = "一份报告，就是一份决策文件", subtitle = "每条结论具备四要素：证据、利润影响、执行动作、验收指标。", conclusion = "午市套餐结构存在可加码空间", elements = DEFAULT_ELEMENTS, chart = DEFAULT_CHART, chartTitle = "午市订单客单分布 · 2026-03 至 05", grade = "E1", scope = DEFAULT_SCOPE, note = "可计算的，量化到位；不可计算的，如实说明。", page }) {
  return React.createElement(SlideFrame, { ground: "muted", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gridTemplateRows: "minmax(0,1fr)", gap: 56, alignItems: "stretch" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20, minWidth: 0, minHeight: 0 } },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          React.createElement(SlideTitle, { size: "sm" }, title),
          subtitle ? React.createElement("p", { style: { margin: 0, fontSize: 21, lineHeight: 1.5, color: "var(--text-muted)", textWrap: "pretty" } }, subtitle) : null
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", borderTop: "1px solid var(--line-hairline)" } },
          elements.map(function (e) {
            return React.createElement("div", { key: e.k, style: { display: "grid", gridTemplateColumns: "104px minmax(0,1fr)", gap: 16, alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--line-hairline)" } },
              React.createElement("span", { style: { fontSize: 19, letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-accent)", fontWeight: 500 } }, e.k),
              React.createElement("span", {
                style: {
                  fontSize: e.tone ? 30 : 21, lineHeight: e.tone ? 1.2 : 1.5, textWrap: "pretty",
                  fontFamily: e.tone ? "var(--font-numeral)" : "var(--font-body)", fontWeight: e.tone ? 500 : 400,
                  color: e.tone === "growth" ? "var(--growth-500)" : e.tone === "loss" ? "var(--loss-500)" : "var(--ink-800)"
                }
              }, e.v));
          })
        ),
        note ? React.createElement("p", { style: { margin: "auto 0 0", fontFamily: "var(--font-display)", fontSize: 21, letterSpacing: ".06em", color: "var(--ink-700)", whiteSpace: "nowrap" } }, note) : null
      ),
      React.createElement("div", {
        style: { background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderTop: "2px solid var(--bronze-500)", borderRadius: "var(--radius-md)", padding: "20px 24px 22px", display: "flex", flexDirection: "column", gap: 12, minWidth: 0, minHeight: 0 }
      },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--line-hairline)" } },
          React.createElement("span", { style: { width: 36, height: 36, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--bronze-500)" } }, "一"),
          React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 500, letterSpacing: ".06em", color: "var(--text-display)", lineHeight: 1.2, textWrap: "pretty" } }, conclusion)
        ),
        chart ? React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 } },
          React.createElement("span", { style: { fontSize: 19, letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-accent)", fontWeight: 500 } }, chartTitle),
          React.createElement(SlideGrade, { grade: grade })) : null,
        chart ? React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" } }, chart) : null,
        chart && scope ? React.createElement("span", { style: { fontSize: 19, lineHeight: 1.5, color: "var(--text-muted)", textWrap: "pretty" } }, scope) : null
      )
    )
  );
}
