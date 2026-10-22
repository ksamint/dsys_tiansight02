import React from "react";

export function Divider({ variant = "hair", inverse = false, vertical = false, spacing = "var(--space-7)", ...rest }) {
  const w = variant === "strong" ? 2 : variant === "rule" ? 1.5 : 1;
  const color = inverse ? "var(--line-inverse)" : variant === "hair" ? "var(--line-hairline)" : variant === "rule" ? "var(--line-rule)" : "var(--line-strong)";
  if (vertical) return React.createElement("div", { style: { width: w, alignSelf: "stretch", background: color, margin: "0 " + spacing }, ...rest });
  return React.createElement("div", { style: { height: w, background: color, margin: spacing + " 0" }, ...rest });
}
