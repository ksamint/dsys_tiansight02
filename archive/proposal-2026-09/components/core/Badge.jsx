import React from "react";

const TONES = {
  bronze: ["var(--bronze-100)", "var(--bronze-600)", "var(--bronze-500)"],
  neutral: ["var(--parchment-100)", "var(--ink-600)", "var(--line-rule)"],
  growth: ["var(--growth-200)", "var(--growth-500)", "var(--growth-500)"],
  loss: ["var(--loss-200)", "var(--loss-500)", "var(--loss-500)"],
  caution: ["var(--caution-200)", "var(--caution-500)", "var(--caution-500)"]
};

export function Badge({ children, tone = "bronze", variant = "soft", size = "md", ...rest }) {
  const t = TONES[tone] || TONES.bronze;
  const solid = variant === "solid";
  const outline = variant === "outline";
  return React.createElement("span", {
    style: {
      display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", flexShrink: 0,
      padding: size === "sm" ? "2px 7px" : "3px 10px",
      fontFamily: "var(--font-body)", fontSize: size === "sm" ? "var(--text-3xs)" : "var(--text-2xs)",
      fontWeight: "var(--weight-medium)", letterSpacing: ".04em", lineHeight: 1.5,
      borderRadius: "var(--radius-xs)",
      background: solid ? t[2] : outline ? "transparent" : t[0],
      color: solid ? "var(--text-on-accent)" : t[1],
      border: "1px solid " + (outline ? t[2] : "transparent")
    },
    ...rest
  }, children);
}
