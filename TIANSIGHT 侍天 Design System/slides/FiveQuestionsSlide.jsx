import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四", "五"];
const DEFAULT_STEPS = [
  { label: "现状", q: "现在怎样", aim: "看清经营" },
  { label: "机会", q: "机会在哪", aim: "发现增长点" },
  { label: "优先", q: "先做什么", aim: "判断顺序" },
  { label: "行动", q: "谁来负责", aim: "形成清单" },
  { label: "结果", q: "是否有效", aim: "验证结果" }
];

export function FiveQuestionsSlide({ eyebrow = "经营五问", title = "五问既明，百事可决", note = "逐店逐月，循环推演。经验证有效的做法沉淀为门店标准，不随人员流动而流失。", steps = DEFAULT_STEPS, active, page }) {
  return React.createElement(SlideFrame, { ground: "parchment", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 52 } },
      React.createElement(SlideTitle, { size: "md" }, title),
      React.createElement("div", { style: { position: "relative", display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 24 } },
        React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 28, right: 28, top: 27, height: 1, background: "var(--line-rule)" } }),
        steps.map(function (s, i) {
          const on = active === i;
          return React.createElement("div", { key: s.label, style: { position: "relative", display: "flex", flexDirection: "column", gap: 18 } },
            React.createElement("span", {
              style: {
                width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 500,
                border: "1px solid " + (on ? "var(--bronze-500)" : "var(--line-rule)"),
                background: on ? "var(--bronze-500)" : "var(--surface-page)",
                color: on ? "var(--text-on-accent)" : "var(--bronze-500)"
              }
            }, CN[i]),
            React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 8 } },
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, s.label),
              React.createElement("span", { style: { fontSize: 20, color: "var(--text-accent)" } }, s.q),
              React.createElement("span", { style: { fontSize: 20, color: "var(--text-muted)" } }, s.aim)
            )
          );
        })
      ),
      React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "var(--tracking-cjk-display)", color: "var(--ink-700)" } }, note)
    )
  );
}
