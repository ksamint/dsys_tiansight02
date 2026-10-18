import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四", "五"];
/* 老板看到的价值 — the four concrete changes an owner can check, the 三不 line that bounds
   the claim, and the proof line. Copy verbatim from the 2026-09 intro. */
const DEFAULT_ITEMS = ["顾客是否更容易点到满意的一餐", "出品是否更稳定", "浪费是否减少", "门店是否留下更多经营贡献"];

export function ValueSlide({ eyebrow = "老板看到的价值", title = "价值，落在具体的经营变化上。", items = DEFAULT_ITEMS, note = "侍天不替老板拍板，不凭单一销量砍菜，也不把预期收益写成已经发生的结果。", proof = "每次拍板有依据，每项行动有人落实，每轮改善可以核对。", page }) {
  return React.createElement(SlideFrame, { ground: "parchment", grain: true, eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 72, alignItems: "center" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        note ? React.createElement("p", { style: { margin: 0, fontSize: 24, lineHeight: "var(--leading-normal)", color: "var(--text-body)", maxWidth: "22em", textWrap: "pretty" } }, note) : null,
        proof ? React.createElement("p", { style: { margin: 0, paddingTop: 22, borderTop: "1.5px solid var(--line-rule)", fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-accent)", textWrap: "pretty" } }, proof) : null
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", borderTop: "1.5px solid var(--line-rule)" } },
        items.map(function (t, i) {
          return React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 20, padding: "22px 0", borderBottom: "1px solid var(--line-hairline)" } },
            React.createElement("span", { style: { width: 44, height: 44, flexShrink: 0, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "var(--bronze-500)" } }, CN[i] || String(i + 1)),
            React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 500, lineHeight: 1.3, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, t)
          );
        })
      )
    )
  );
}
