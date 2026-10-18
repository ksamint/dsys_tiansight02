import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";

export function SectionHeading({ eyebrow, title, subtitle, action, align = "left", tone = "default", rule = true, size = "lg" }) {
  const inverse = tone === "inverse";
  const titleSize = size === "sm" ? "var(--text-xl)" : size === "md" ? "var(--text-2xl)" : "var(--text-3xl)";
  return React.createElement("div", {
    style: {
      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      gap: "var(--space-7)", flexWrap: "wrap",
      textAlign: align, paddingBottom: rule ? "var(--space-4)" : 0,
      borderBottom: rule ? "1.5px solid " + (inverse ? "var(--line-inverse)" : "var(--line-rule)") : "none",
      justifyContent: align === "center" ? "center" : "space-between"
    }
  },
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: align === "center" ? "var(--measure)" : "none" } },
      eyebrow ? React.createElement(Eyebrow, { tone: inverse ? "inverse" : "bronze" }, eyebrow) : null,
      React.createElement("h2", {
        style: {
          margin: 0, fontFamily: "var(--font-display)", fontSize: titleSize,
          fontWeight: "var(--weight-medium)", lineHeight: "var(--leading-snug)",
          letterSpacing: "var(--tracking-cjk-display)",
          color: inverse ? "var(--text-on-inverse)" : "var(--text-display)"
        }
      }, title),
      subtitle ? React.createElement("p", {
        style: {
          margin: 0, fontSize: "var(--text-md)", lineHeight: "var(--leading-normal)",
          color: inverse ? "rgba(239,230,210,.72)" : "var(--text-muted)", maxWidth: "var(--measure)"
        }
      }, subtitle) : null
    ),
    action ? React.createElement("div", { style: { flexShrink: 0, paddingBottom: "4px" } }, action) : null
  );
}
