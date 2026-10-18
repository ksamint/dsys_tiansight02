import React from "react";

/* [soft ground, text, outline/hairline]. The filled ("solid") badge follows the guide §5:
   素墨 ink-primary fill + 玄墨 text, for prices and tiers — gold is only ever the outline hairline. */
const TONES = {
  gold: ["var(--gold-100)", "var(--gold-600)", "var(--gold)"],
  bronze: ["var(--gold-100)", "var(--gold-600)", "var(--gold)"],
  neutral: ["var(--parchment-100)", "var(--ink-600)", "var(--line-rule)"],
  growth: ["var(--growth-200)", "var(--growth-500)", "var(--growth-500)"],
  loss: ["var(--loss-200)", "var(--loss-500)", "var(--loss-500)"],
  caution: ["var(--caution-200)", "var(--caution-500)", "var(--caution-500)"]
};

export function Badge({ children, tone = "gold", variant = "soft", size = "md", mono = false, ...rest }) {
  const t = TONES[tone] || TONES.gold;
  const solid = variant === "solid";
  const outline = variant === "outline";
  return React.createElement("span", {
    style: {
      display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", flexShrink: 0,
      padding: size === "sm" ? "2px 7px" : "3px 10px",
      fontFamily: mono || solid ? "var(--font-mono)" : "var(--font-body)",
      fontSize: size === "sm" ? "var(--text-3xs)" : "var(--type-badge)",
      fontWeight: "var(--weight-medium)", letterSpacing: mono || solid ? 0 : ".04em", lineHeight: 1.5,
      borderRadius: outline ? "var(--radius-pill)" : "var(--radius)",
      background: solid ? "var(--ink-primary)" : outline ? "transparent" : t[0],
      color: solid ? "var(--charcoal)" : t[1],
      border: "1px solid " + (outline ? t[2] : "transparent")
    },
    ...rest
  }, children);
}
