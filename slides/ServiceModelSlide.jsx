import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四"];
/* 服务模式 — three tiers chosen by 餐饮类型 and 经营阶段, read as a ledger: one column per
   tier, one row per 服务内容 / 客户价值 / 核心优势. Copy is lifted from the 2026-09 company
   intro (guidelines/company-intro-2026-09.md); `highlight` raises the tier being proposed.
   The fee sentence stays conditional — 可与…挂钩, never a guarantee. Cells are kept to two
   lines (≤34 CJK chars at the ~333px column) so the ledger + note fit the 720px frame. */
const DEFAULT_TIERS = [
  { name: "经营诊断", fit: "新概念与单店 · 任何阶段的起点",
    content: "交出最近 6 个月经营数据，7 日内拿到诊断：增长在哪、利润漏在哪、先改哪三件。",
    value: "看清现状与优先次序，再决定是否进入持续跟进或专家上门。",
    edge: "结论有证据：每个建议明确依据、动作与验证方式，不凭单一销量砍菜。" },
  { name: "运营业绩优化落地辅导", fit: "经营之中的单店与小型连锁",
    content: "结合真实点单、成本、出品与顾客反馈调整菜品、定价与组合；每月复盘核对。",
    value: "顾客更容易点到满意的一餐，出品更稳，浪费减少，门店留下更多贡献。",
    edge: "教练式督导：建议落到负责人、时间与执行检查；费用可与改善挂钩。" },
  { name: "第二大脑陪跑", fit: "复制扩张中的连锁品牌",
    content: "菜单推演、经营看板、教练式督导与持续复盘长期结合；标准与方法沉淀到岗位。",
    value: "好方法进入组织，更多门店稳定交付，保留因商圈与店型而异的调整空间。",
    edge: "专家判断与数据推演并行，每轮改善可核对；不把预期收益写成已发生的结果。" }
];
const DEFAULT_ROWS = [{ key: "content", label: "服务内容" }, { key: "value", label: "客户价值" }, { key: "edge", label: "核心优势" }];

export function ServiceModelSlide({ eyebrow = "服务模式", title = "三个层级，按餐饮类型与阶段选择。", tiers = DEFAULT_TIERS, rows = DEFAULT_ROWS, highlight = -1, note = "对于具备数据基础和执行条件的项目，服务费用可与双方确认的改善结果挂钩。", page }) {
  const n = Math.max(tiers.length, 1);
  const cell = function (on, extra) {
    return Object.assign({ padding: "11px 16px", background: on ? "var(--surface-card)" : "transparent", borderTop: "1px solid var(--line-hairline)" }, extra);
  };
  return React.createElement(SlideFrame, { ground: "parchment", eyebrow: eyebrow, page: page, pad: 56 },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 18 } },
      React.createElement(SlideTitle, { size: "sm" }, title),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "96px repeat(" + n + ", minmax(0,1fr))", gridAutoRows: "auto", borderBottom: "1px solid var(--line-hairline)" } },
        React.createElement("div", { style: { padding: "12px 0" } }),
        tiers.map(function (t, i) {
          const on = i === highlight;
          return React.createElement("div", { key: "h" + i, style: { padding: "12px 16px", background: on ? "var(--surface-card)" : "transparent", borderTop: "2px solid " + (on ? "var(--bronze-500)" : "transparent"), display: "flex", flexDirection: "column", gap: 6 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              React.createElement("span", { style: { width: 32, height: 32, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 17, color: "var(--bronze-500)" } }, t.numeral || CN[i] || String(i + 1)),
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, lineHeight: 1.2, letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-display)", whiteSpace: "nowrap" } }, t.name)
            ),
            t.fit ? React.createElement("span", { style: { fontSize: 19, color: "var(--text-accent)" } }, t.fit) : null
          );
        }),
        rows.map(function (r) {
          return [
            React.createElement("div", { key: r.key + "-l", style: { padding: "11px 12px 11px 0", borderTop: "1px solid var(--line-hairline)", fontSize: 19, fontWeight: 500, color: "var(--text-accent)", letterSpacing: "var(--tracking-cjk-body)" } }, r.label)
          ].concat(tiers.map(function (t, i) {
            return React.createElement("div", { key: r.key + i, style: cell(i === highlight, { fontSize: 19, lineHeight: 1.4, color: "var(--text-body)", textWrap: "pretty" }) }, t[r.key]);
          }));
        })
      ),
      note ? React.createElement("p", { style: { margin: 0, fontSize: 19, lineHeight: 1.4, color: "var(--text-muted)" } }, note) : null
    )
  );
}
