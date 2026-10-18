import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";
import { SlideChart } from "./SlideChart.jsx";
import { TrendLine } from "../components/charts/TrendLine.jsx";

const CN = ["一", "二", "三", "四", "五"];
/* 伙伴案例 — one engagement told the way the report tells a conclusion: 现状 → 动作 → 结果.
   The result panel is the report's 验收 read: the 主指标's monthly path (d3 TrendLine, with the
   动作落地 mark and the 约定目标 line agreed at diagnosis), its before → after pair in the header,
   and the 护栏指标 as before → after pairs beneath. `metrics[0]` is the 主指标; the rest are
   护栏. Every number is a window average and the 口径 line says which windows. Only verbatim
   partner names from the brand's list may replace `brand`; until a partner confirms, `sample`
   keeps the 样例 badge visible so the deck never claims a result that has not happened. */
const DEFAULT_ACTIONS = ["重排午市套餐结构，主推高毛利招牌组合", "响油鳝糊改配方，冷碟拼盘列为下架候选，逐月核对", "午市客单与套餐渗透纳入月度复盘，责任到人"];
const DEFAULT_METRICS = [
  { label: "午市套餐渗透率", before: "34%", after: "51%", delta: "+17 pt", tone: "growth" },
  { label: "午市客单价", before: "72 元", after: "78 元", delta: "+8%", tone: "growth" },
  { label: "午市毛利率", before: "62%", after: "66%", delta: "+4 pt", tone: "growth" }
];
const DEFAULT_TREND = {
  unit: "%",
  points: [{ label: "03月", value: 33 }, { label: "04月", value: 35 }, { label: "05月", value: 34 }, { label: "06月", value: 48 }, { label: "07月", value: 52 }, { label: "08月", value: 53 }],
  mark: { label: "动作落地", at: "06月", place: "bottom" },
  target: { label: "约定目标", value: 50 }
};
const toneColor = function (t) { return t === "growth" ? "var(--growth-500)" : t === "loss" ? "var(--loss-500)" : "var(--ink-900)"; };

export function CaseSlide({ eyebrow = "伙伴案例", brand = "新派淮扬菜单店", stage = "经营之中 · 运营业绩优化落地辅导", situation = "工作日午市点单集中在 38–58 元价格带，套餐渗透仅 34%；两道高毛利招牌菜渗透偏低，午市毛利被拖低。", actions = DEFAULT_ACTIONS, metrics = DEFAULT_METRICS, trend = DEFAULT_TREND, scope = "口径：午市 = 11:00–14:00 堂食订单；前后为 2026-03 至 05 与 2026-06 至 08 两个窗口的月均。", sample = true, page }) {
  const lbl = { fontSize: 19, letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-accent)", fontWeight: 500 };
  const mono = { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums" };
  const main = trend && metrics.length ? metrics[0] : null;
  const rows = trend ? metrics.slice(1) : metrics;
  const pair = function (m, size) {
    const c = toneColor(m.tone);
    return React.createElement("span", { style: Object.assign({ display: "inline-flex", alignItems: "baseline", gap: 10, whiteSpace: "nowrap" }, mono) },
      React.createElement("span", { style: { fontSize: 19, color: "var(--text-muted)" } }, m.before),
      React.createElement("span", { style: { fontSize: 19, color: "var(--text-muted)" } }, "→"),
      React.createElement("span", { style: { fontSize: size, fontWeight: 500, lineHeight: 1, color: c } }, m.after),
      m.delta ? React.createElement("span", { style: { fontSize: 19, color: c } }, m.delta) : null);
  };
  return React.createElement(SlideFrame, { ground: "muted", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 22 } },
      React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, paddingBottom: 14, borderBottom: "1.5px solid var(--line-rule)" } },
        React.createElement(SlideTitle, { size: "sm" }, brand),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, flexShrink: 0 } },
          stage ? React.createElement("span", { style: { fontSize: 20, color: "var(--text-muted)", whiteSpace: "nowrap" } }, stage) : null,
          sample ? React.createElement("span", { style: { padding: "4px 14px", borderRadius: "var(--radius-pill)", border: "1px solid var(--line-card)", fontSize: 19, color: "var(--text-caption)", letterSpacing: "var(--tracking-cjk-body)", whiteSpace: "nowrap" } }, "样例数据 · 待伙伴确认") : null
        )
      ),
      React.createElement("div", { style: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,.95fr)", gap: 56, alignItems: "start" } },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 22 } },
          React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
            React.createElement("span", { style: lbl }, "现状"),
            React.createElement("p", { style: { margin: 0, fontSize: 22, lineHeight: "var(--leading-normal)", color: "var(--text-body)", textWrap: "pretty" } }, situation)
          ),
          React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
            React.createElement("span", { style: lbl }, "动作"),
            React.createElement("ol", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 } },
              actions.map(function (a, i) {
                return React.createElement("li", { key: i, style: { display: "flex", alignItems: "flex-start", gap: 14, fontSize: 21, lineHeight: "var(--leading-snug)", color: "var(--ink-800)" } },
                  React.createElement("span", { style: { width: 30, height: 30, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, color: "var(--bronze-500)" } }, CN[i] || String(i + 1)),
                  React.createElement("span", { style: { paddingTop: 2 } }, a)
                );
              })
            )
          )
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 } },
          main ? React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" } },
            React.createElement("span", { style: lbl }, "主指标 · " + main.label),
            pair(main, 26)
          ) : React.createElement("span", { style: lbl }, "结果 · 前后对照"),
          trend ? React.createElement(SlideChart, null,
            React.createElement(TrendLine, {
              height: 112, unit: trend.unit || "", grid: true,
              series: [{ tone: "gold", emphasis: true, area: true, points: trend.points }],
              refs: trend.target ? [trend.target] : [],
              marks: trend.mark ? [trend.mark] : []
            })) : null,
          rows.length ? React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(" + rows.length + ", minmax(0,1fr))", gap: 24, paddingTop: 12, borderTop: "1px solid var(--line-hairline)" } },
            rows.map(function (m, i) {
              return React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 } },
                React.createElement("span", { style: { fontSize: 19, color: "var(--text-muted)" } }, (trend ? "护栏 · " : "") + m.label),
                pair(m, 28));
            })) : null
        )
      ),
      scope ? React.createElement("p", { style: { margin: 0, fontSize: 19, lineHeight: 1.5, color: "var(--text-muted)" } }, scope) : null
    )
  );
}
