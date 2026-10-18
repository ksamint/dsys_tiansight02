import React from "react";
import { SlideFrame, SlideTitle, SlidePlaceholder } from "./SlideFrame.jsx";

/* People roster — portrait + name + one-line 头衔 + 专长. Default content is the 专家顾问团
   placeholder roster (no photos have been supplied, so each seat renders a labelled
   placeholder until `photo` is passed). With one or two people (the 创始团队 in the sales
   deck) seats lay out portrait-left so the slide does not read half-empty. */
const DEFAULT_EXPERTS = [
  { name: "专家姓名", title: "淮扬菜出品顾问", field: "菜品结构 · 出餐标准" },
  { name: "专家姓名", title: "连锁运营顾问", field: "门店标准 · 人效" },
  { name: "专家姓名", title: "供应链顾问", field: "成本优化 · 损耗" },
  { name: "专家姓名", title: "会员增长顾问", field: "复购分层 · 渠道" }
];

export function ExpertTeamSlide({ eyebrow = "专家顾问团", title = "判断有人背书，动作有人带教。", subtitle = "行业专家与侍天并行。", experts = DEFAULT_EXPERTS, page }) {
  const wide = experts.length <= 2;
  const cols = Math.min(Math.max(experts.length, 1), 4);
  return React.createElement(SlideFrame, { ground: "paper", eyebrow: eyebrow, page: page },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 40 } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
        React.createElement(SlideTitle, { size: "md" }, title),
        subtitle ? React.createElement("p", { style: { margin: 0, fontSize: 24, color: "var(--text-muted)", maxWidth: "36em" } }, subtitle) : null
      ),
      React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "repeat(" + cols + ", minmax(0,1fr))", gap: wide ? 64 : 36, alignContent: wide ? "center" : "start" } },
        experts.map(function (e, i) {
          return React.createElement("div", { key: i, style: wide ? { display: "grid", gridTemplateColumns: "168px minmax(0,1fr)", gap: 32, alignItems: "start" } : { display: "flex", flexDirection: "column", gap: 20 } },
            React.createElement("div", { style: { width: "100%", maxWidth: 168 } },
              e.photo
                ? React.createElement("img", { src: e.photo, alt: e.name, style: { width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "50%", display: "block", filter: "saturate(.85)" } })
                : React.createElement(SlidePlaceholder, { label: wide ? "头像" : "专家头像", round: true })
            ),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: wide ? 34 : 30, fontWeight: 500, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, e.name),
              React.createElement("span", { style: { fontSize: 21, color: "var(--text-accent)", lineHeight: "var(--leading-snug)", textWrap: "pretty" } }, e.title),
              e.field ? React.createElement("span", { style: { paddingTop: 10, borderTop: "1px solid var(--line-hairline)", fontSize: 19, lineHeight: "var(--leading-snug)", color: "var(--text-muted)" } }, e.field) : null
            )
          );
        })
      )
    )
  );
}
