import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const DEFAULT_PARTNERS = ["苏帮袁", "清水亭", "3699 河鲜小馆", "游园京梦", "吴裕泰", "韵 1980 新派淮扬菜", "潮发潮汕牛肉", "更多伙伴"];
const DEFAULT_QUOTE = { text: "报告分析得非常细，最关键的是结论有证据，不靠猜，也没有 AI 幻觉。大力推荐。", by: "张总", role: "餐饮老板" };

/* Partner names are set in TYPE — no logo artwork has been supplied. Pass `logos`
   as [{name, src}] once real marks exist and they render in place of the type. */
export function PartnerWallSlide({ eyebrow = "伙伴背书", title = "这些品牌，已与侍天同行", subtitle = "从单店到连锁，从新派淮扬菜到老字号。", partners = DEFAULT_PARTNERS, logos, quote = DEFAULT_QUOTE, page }) {
  const items = logos && logos.length ? logos : partners.map(function (p) { return { name: p }; });
  return React.createElement(SlideFrame, { ground: "parchment", grain: true, eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 34 } },
      React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, paddingBottom: 20, borderBottom: "1.5px solid var(--line-rule)" } },
        React.createElement(SlideTitle, { size: "md" }, title),
        React.createElement("span", { style: { fontSize: 22, color: "var(--text-muted)", flexShrink: 0 } }, subtitle)
      ),
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 1, background: "var(--line-hairline)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" } },
        items.map(function (it, i) {
          return React.createElement("div", {
            key: it.name,
            style: { background: "var(--surface-card)", height: 108, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center" }
          }, it.src
            ? React.createElement("img", { src: it.src, alt: it.name, style: { maxWidth: "80%", maxHeight: 56, objectFit: "contain" } })
            : React.createElement("span", {
                style: {
                  fontFamily: "var(--font-display)", fontSize: it.name.length > 6 ? 21 : 26, fontWeight: 500,
                  letterSpacing: "var(--tracking-cjk-display)", lineHeight: 1.25,
                  color: i === items.length - 1 ? "var(--text-muted)" : "var(--ink-800)"
                }
              }, it.name));
        })
      ),
      quote ? React.createElement("figure", { style: { margin: 0, marginTop: "auto", display: "flex", flexDirection: "column", gap: 18 } },
        React.createElement("blockquote", {
          style: { margin: 0, fontFamily: "var(--font-display)", fontSize: 30, lineHeight: "var(--leading-snug)", letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-display)", maxWidth: "30em" }
        }, "\u201c", quote.text, "\u201d"),
        React.createElement("figcaption", { style: { display: "flex", alignItems: "center", gap: 14, fontSize: 20, color: "var(--text-muted)" } },
          React.createElement("span", { style: { width: 24, height: 1, background: "var(--line-strong)" } }),
          (quote.role ? quote.role + " " : "") + quote.by
        )
      ) : null
    )
  );
}
