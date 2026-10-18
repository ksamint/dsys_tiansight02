import React from "react";
import { SlideFrame, SlideTitle, SlidePlaceholder } from "./SlideFrame.jsx";

/* 专家顾问团 (X · 增值专项). Portrait + short title, per brand: no photos have been
   supplied, so each seat renders a labelled placeholder until `photo` is passed. */
const DEFAULT_EXPERTS = [
  { name: "专家姓名", title: "淮扬菜出品顾问", field: "菜品结构 · 出餐标准" },
  { name: "专家姓名", title: "连锁运营顾问", field: "门店标准 · 人效" },
  { name: "专家姓名", title: "供应链顾问", field: "成本优化 · 损耗" },
  { name: "专家姓名", title: "会员增长顾问", field: "复购分层 · 渠道" }
];

export function ExpertTeamSlide({ eyebrow = "X · 增值专项", title = "专家顾问团，随层挂接", subtitle = "行业专家与侍天系统并行：判断有人背书，动作有人带教。", experts = DEFAULT_EXPERTS, page }) {
  return React.createElement(SlideFrame, { ground: "paper", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 40 } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        React.createElement("p", { style: { margin: 0, fontSize: 24, color: "var(--text-muted)", maxWidth: "36em" } }, subtitle)
      ),
      React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 36 } },
        experts.map(function (e, i) {
          return React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", gap: 20 } },
            React.createElement("div", { style: { width: "100%", maxWidth: 168 } },
              e.photo
                ? React.createElement("img", { src: e.photo, alt: e.name, style: { width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%", display: "block", filter: "saturate(.85)" } })
                : React.createElement(SlidePlaceholder, { label: "专家头像", round: true })
            ),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, e.name),
              React.createElement("span", { style: { fontSize: 21, color: "var(--text-accent)", lineHeight: "var(--leading-snug)" } }, e.title),
              e.field ? React.createElement("span", { style: { paddingTop: 10, borderTop: "1px solid var(--line-hairline)", fontSize: 19, color: "var(--text-muted)" } }, e.field) : null
            )
          );
        })
      )
    )
  );
}
