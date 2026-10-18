import React from "react";

const TONES = { default: "var(--ink-900)", bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)", caution: "var(--caution-500)", inverse: "var(--parchment-100)" };
const SIZES = { sm: "var(--text-2xl)", md: "var(--text-3xl)", lg: "var(--text-4xl)", xl: "var(--text-5xl)" };

export function Stat({ value, unit, label, note, tone = "default", size = "md", align = "left" }) {
  const inverse = tone === "inverse";
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)", textAlign: align, alignItems: align === "center" ? "center" : "flex-start" } },
    label ? React.createElement("span", {
      style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: inverse ? "rgba(239,230,210,.6)" : "var(--text-muted)" }
    }, label) : null,
    React.createElement("span", { style: { display: "flex", alignItems: "baseline", gap: "4px" } },
      React.createElement("span", {
        style: { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums", fontSize: SIZES[size] || SIZES.md, fontWeight: "var(--weight-medium)", lineHeight: 1, color: TONES[tone] || TONES.default }
      }, value),
      unit ? React.createElement("span", {
        style: { fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: inverse ? "rgba(239,230,210,.7)" : "var(--text-muted)" }
      }, unit) : null
    ),
    note ? React.createElement("span", { style: { fontSize: "var(--text-xs)", color: inverse ? "rgba(239,230,210,.6)" : "var(--text-muted)" } }, note) : null
  );
}
