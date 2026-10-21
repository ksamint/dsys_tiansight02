import React from "react";
import { SlideFrame, SlideTitle, SlidePlaceholder, dsAsset } from "./SlideFrame.jsx";

export function ContactSlide({ title = "携手侍天，持续领先。", body = "以最近 6 个月经营数据为始，7 日内交付经营诊断：增长机会、利润流失、行动次序、验收标准。", cta = "微信扫码联系侍天", qr, tagline = "Time is money. With TIANSIGHT, lose neither.", page }) {
  return React.createElement(SlideFrame, { ground: "ink", page: page, seal: false, footer: "侍天 TIANSIGHT / Table AI Alliance" },
    React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 80, alignItems: "center" } },
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 34 } },
        React.createElement(SlideTitle, { size: "lg", ground: "ink" }, title),
        React.createElement("p", { style: { margin: 0, maxWidth: "24em", fontSize: 25, lineHeight: "var(--leading-normal)", color: "rgba(239,230,210,.72)" } }, body),
        React.createElement("p", { style: { margin: 0, fontFamily: "var(--font-quote)", fontStyle: "italic", fontSize: 24, color: "var(--bronze-300)" } }, tagline)
      ),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: 260 } },
        React.createElement("div", { style: { width: 220, background: "var(--paper)", padding: 14, borderRadius: "var(--radius-md)" } },
          qr
            ? React.createElement("img", { src: qr, alt: cta, style: { width: "100%", display: "block" } })
            : React.createElement(SlidePlaceholder, { label: "微信二维码", style: { background: "var(--parchment-200)", border: "1px dashed var(--line-rule)" } })
        ),
        React.createElement("span", { style: { fontSize: 21, color: "rgba(239,230,210,.72)", textAlign: "center" } }, cta),
        React.createElement("img", { src: dsAsset("logo-seal.png"), alt: "侍天", width: 56, height: 56, style: { display: "block", filter: "invert(1) sepia(.35) saturate(.6) brightness(1.15)", opacity: .9 } })
      )
    )
  );
}
