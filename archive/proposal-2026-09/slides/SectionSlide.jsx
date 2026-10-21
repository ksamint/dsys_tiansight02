import React from "react";
import { SlideFrame, SlideTitle } from "./SlideFrame.jsx";

const CN = ["一", "二", "三", "四", "五", "六"];

/* Section divider. The oversized outline seal circle is the brand's one permitted
   large ornament — bleeding off the right edge at 4–8% bronze. */
export function SectionSlide({ index = 1, numeral, title, subtitle, page }) {
  return React.createElement(SlideFrame, { ground: "muted", page: page },
    React.createElement("div", { style: { position: "absolute", right: -170, top: -110, width: 620, height: 620, borderRadius: "50%", border: "1.5px solid rgba(118,85,31,.10)", pointerEvents: "none" } }),
    React.createElement("div", { style: { position: "absolute", right: -50, top: 60, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(118,85,31,.07)", pointerEvents: "none" } }),
    React.createElement("div", { style: { position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 } },
      React.createElement("span", {
        style: { width: 78, height: 78, borderRadius: "50%", border: "1.5px solid var(--bronze-500)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 500, color: "var(--bronze-500)" }
      }, numeral || CN[index - 1] || String(index)),
      React.createElement(SlideTitle, { size: "lg" }, title),
      subtitle ? React.createElement("p", { style: { margin: 0, maxWidth: "26em", fontSize: 25, lineHeight: "var(--leading-normal)", color: "var(--text-body)" } }, subtitle) : null
    )
  );
}
