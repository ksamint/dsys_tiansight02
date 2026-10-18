import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";
import { SlideChart, SlideGrade } from "./SlideChart.jsx";
import { Scatter } from "../components/charts/Scatter.jsx";
import { Waterfall } from "../components/charts/Waterfall.jsx";
import { ForecastCorridor } from "../components/charts/ForecastCorridor.jsx";

/* 图谱 slide: one d3 figure, one 结论, one 动作. Three built-in figures answer the diagnosis
   promise 增长在哪里 · 利润漏在哪里 · 先改哪三件 with the kit's own charts — pick with `figure`,
   or pass any chart as `chart` (wrap kit charts in SlideChart). The slide prints caption, EGA
   grade and 口径 at slide type (19px); the kit chart carries only its marks and axes. Sample
   data is 样张 data and every 口径 says so. */
const SAMPLE = "（样张）";
const DISHES = [
  { label: "文思豆腐", x: 74, y: 68, r: 920, tone: "growth" },
  { label: "清炒河虾仁", x: 41, y: 66, r: 490, tone: "growth" },
  { label: "松鼠鳜鱼", x: 55, y: 60, r: 660, tone: "gold" },
  { label: "蟹粉狮子头", x: 28, y: 72, r: 340, tone: "caution" },
  { label: "响油鳝糊", x: 68, y: 27, r: 810, tone: "loss" },
  { label: "冷碟拼盘", x: 20, y: 30, r: 240, tone: "datum" },
  { x: 12, y: 44, r: 150 }, { x: 16, y: 52, r: 190 }, { x: 22, y: 58, r: 260 }, { x: 26, y: 38, r: 300 },
  { x: 31, y: 61, r: 380 }, { x: 33, y: 47, r: 400 }, { x: 36, y: 30, r: 420 }, { x: 44, y: 54, r: 520 },
  { x: 47, y: 63, r: 560 }, { x: 52, y: 41, r: 600 }, { x: 58, y: 57, r: 700 }, { x: 62, y: 49, r: 740 },
  { x: 9, y: 62, r: 110 }, { x: 18, y: 27, r: 210 }
].map(function (p) { return p.tone ? p : Object.assign({ tone: "datum" }, p); });
const pct = function (v) { return v + "%"; };

export const CHART_FIGURES = {
  scatter: {
    label: "渗透率矩阵", title: "增长在何处，利润失于何处",
    caption: "渗透率矩阵 · 午市菜品 · 纵轴 毛利率 · 气泡面积 = 月均销量", grade: "E1",
    takeaway: "招牌菜渗透高、毛利稳；响油鳝糊与冷碟拼盘拖低整体毛利。",
    action: "重排午市套餐结构，主推高毛利招牌组合",
    source: "口径：渗透率 = 点该菜的订单数 ÷ 午市总订单数；虚线为全店中位数，象限 = 毛利高低 × 渗透高低。来源：收银流水 2026-03 至 08" + SAMPLE,
    padRight: 24,
    render: function () {
      return React.createElement(Scatter, {
        points: DISHES, height: 180, maxR: 11,
        xLabel: "点单渗透率", xFormat: pct, yFormat: pct,
        quadrants: { x: 35, y: 55 }, quadrantLabels: ["值得推", "招牌 · 守住", "下架候选", "改配方"],
        emphasis: ["响油鳝糊", "冷碟拼盘"]
      });
    }
  },
  waterfall: {
    label: "利润归因", title: "哪里发生了变化，影响有多大",
    caption: "午市毛利归因 · 去年同期 → 当期 · 月均", grade: "E1",
    takeaway: "客流与菜品结构各漏掉一块，合计 6 万 / 月；客单与套餐补回 2.4 万，不足以对冲。",
    action: "先改菜品结构：两道低毛利高渗透菜改配方或调价",
    source: "口径：午市堂食毛利 = 收入 − 食材成本，月均，万元；按六项驱动逐项拆分。来源：收银流水与进货单，2025 与 2026 年 03 至 05 月" + SAMPLE,
    padRight: 0,
    render: function () {
      return React.createElement(Waterfall, {
        start: 41.2, startLabel: "去年同期", endLabel: "当期", unit: "万元 / 月", height: 180,
        steps: [{ label: "客流", value: -3.4 }, { label: "客单", value: 1.8 }, { label: "结构", value: -2.6 }, { label: "成本", value: -1.5 }, { label: "折扣", value: -0.9 }, { label: "套餐", value: 0.6 }]
      });
    }
  },
  corridor: {
    label: "菜单推演", title: "先推演，再拍板",
    caption: "菜单推演 · 午市毛利 · 方案 B", grade: "E4",
    takeaway: "方案 B 三个月推演：P50 每月多留 2–4 万，P10 仍高于基线；区间即结论，不把预期写成已发生的收益。",
    action: "午市先试行方案 B 一个月，9 月实测与推演区间逐月核对",
    source: "口径：区间为方案 B 的推演，基线为不改菜单的延续估计，9 月为落地后实测；万元 / 月。来源：菜单推演 · 收银流水 2026-05 至 09" + SAMPLE,
    padRight: 56,
    render: function () {
      return React.createElement(ForecastCorridor, {
        height: 140, unit: "万",
        history: [{ label: "5月", value: 35.9 }, { label: "6月", value: 36.4 }, { label: "7月", value: 35.1 }, { label: "8月", value: 36.0 }],
        forecast: [{ label: "9月", p10: 36.5, p50: 38.4, p90: 40.1 }, { label: "10月", p10: 36.8, p50: 39.6, p90: 42.0 }, { label: "11月", p10: 37.0, p50: 40.3, p90: 43.4 }],
        baseline: [{ label: "8月", value: 36.0 }, { label: "9月", value: 36.1 }, { label: "10月", value: 36.2 }, { label: "11月", value: 36.4 }],
        actual: [{ label: "9月", value: 38.9 }]
      });
    }
  }
};

export function ChartSlide({ eyebrow = "分析维度 · 经营洞察图谱", figure = "scatter", title, chartTitle, grade, chart, takeaway, action, source, page }) {
  const f = CHART_FIGURES[figure] || CHART_FIGURES.scatter;
  const custom = chart != null;
  const body = custom ? chart : React.createElement(SlideChart, { padRight: f.padRight }, f.render());
  const t = title != null ? title : f.title;
  const ct = chartTitle !== undefined ? chartTitle : (custom ? null : f.caption);
  const gr = grade !== undefined ? grade : (custom ? null : f.grade);
  const tk = takeaway !== undefined ? takeaway : (custom ? null : f.takeaway);
  const ac = action !== undefined ? action : (custom ? null : f.action);
  const src = source !== undefined ? source : (custom ? null : f.source);
  const cap = { fontSize: 19, letterSpacing: "var(--tracking-cjk-body)", fontWeight: 500 };
  return React.createElement(SlideFrame, { ground: "paper", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,.65fr)", gap: 60, alignItems: "stretch" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0, minHeight: 0 } },
        ct || gr ? React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 } },
          React.createElement("span", { style: Object.assign({ color: "var(--text-accent)" }, cap) }, ct),
          React.createElement(SlideGrade, { grade: gr })) : null,
        React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" } }, body),
        src ? React.createElement("span", { style: { fontSize: 19, lineHeight: 1.5, color: "var(--text-muted)", textWrap: "pretty" } }, src) : null
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 28, paddingLeft: 44, borderLeft: "1px solid var(--line-hairline)", minWidth: 0 } },
        React.createElement(SlideTitle, { size: "sm" }, t),
        tk ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          React.createElement("span", { style: Object.assign({ color: "var(--text-muted)" }, cap) }, "结论"),
          React.createElement("span", { style: { fontSize: 23, lineHeight: "var(--leading-normal)", color: "var(--ink-800)", textWrap: "pretty" } }, tk)
        ) : null,
        ac ? React.createElement("div", { style: { marginTop: "auto", paddingTop: 22, borderTop: "1.5px solid var(--line-rule)", display: "flex", flexDirection: "column", gap: 10 } },
          React.createElement("span", { style: Object.assign({ color: "var(--text-accent)" }, cap) }, "先改这件"),
          React.createElement("span", { style: { fontSize: 23, lineHeight: "var(--leading-normal)", color: "var(--ink-800)", textWrap: "pretty" } }, ac)
        ) : null
      )
    )
  );
}
