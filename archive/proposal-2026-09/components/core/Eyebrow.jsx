import React from "react";

export function Eyebrow({ children, tone = "bronze", as = "div", ...rest }) {
  const color = tone === "muted" ? "var(--text-muted)" : tone === "inverse" ? "rgba(239,230,210,.7)" : "var(--text-accent)";
  return React.createElement(as, {
    style: {
      fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)",
      textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color, lineHeight: 1.4
    },
    ...rest
  }, children);
}
