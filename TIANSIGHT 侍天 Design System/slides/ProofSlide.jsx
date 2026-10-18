import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const DEFAULT_ELEMENTS = [
  { k: "证据", v: "工作日午市点单集中在 38–58 元价格带，套餐渗透仅 34%。" },
  { k: "利润影响", v: "+18.2 万 / 季", tone: "growth" },
  { k: "执行动作", v: "重排午市套餐结构，主推高毛利招牌组合" },
  { k: "验收指标", v: "午市客单 +8%" }
];

export function ProofSlide({ eyebrow = "以样张为证", title = "一份报告，就是一份决策文件", conclusion = "午市套餐结构存在可加码空间", elements = DEFAULT_ELEMENTS, note = "可计算的，量化到位；不可计算的，如实说明。", page }) {
  return React.createElement(SlideFrame, { ground: "muted", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        React.createElement("p", { style: { margin: 0, fontSize: 24, color: "var(--text-muted)" } }, "每条结论具备四要素：证据、利润影响、执行动作、验收指标。")
      ),
      React.createElement("div", {
        style: { background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderTop: "2px solid var(--bronze-500)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", padding: 40, display: "flex", flexDirection: "column", gap: 30 }
      },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 20 } },
          React.createElement("span", { style: { width: 44, height: 44, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "var(--bronze-500)" } }, "一"),
          React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, conclusion)
        ),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 32, paddingTop: 26, borderTop: "1px solid var(--line-hairline)" } },
          elements.map(function (e) {
            return React.createElement("div", { key: e.k, style: { display: "flex", flexDirection: "column", gap: 12 } },
              React.createElement("span", { style: { fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, e.k),
              React.createElement("span", {
                style: {
                  fontSize: e.tone ? 30 : 21, lineHeight: "var(--leading-snug)",
                  fontFamily: e.tone ? "var(--font-numeral)" : "var(--font-body)", fontWeight: e.tone ? 500 : 400,
                  color: e.tone === "growth" ? "var(--growth-500)" : e.tone === "loss" ? "var(--loss-500)" : "var(--ink-800)"
                }
              }, e.v)
            );
          })
        )
      ),
      React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "var(--tracking-cjk-display)", color: "var(--ink-700)" } }, note)
    )
  );
}
