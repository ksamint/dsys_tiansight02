import React from "react";

const TONES = {
  bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)",
  caution: "var(--caution-500)", datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

export function MetricRow({ label, sublabel, value, unit, delta, deltaTone = "growth", note, dense = false }) {
  return React.createElement("div", {
    style: {
      display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline",
      gap: "var(--space-4)", padding: (dense ? "10px" : "14px") + " 0",
      borderBottom: "1px solid var(--line-hairline)"
    }
  },
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } },
      React.createElement("span", { style: { fontSize: "var(--text-sm)", color: "var(--ink-800)" } }, label),
      sublabel ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, sublabel) : null,
      note ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, note) : null
    ),
    React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-3)" } },
      React.createElement("span", {
        style: { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums", fontSize: "var(--text-lg)", fontWeight: "var(--weight-medium)", color: "var(--ink-900)" }
      }, value, unit ? React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", color: "var(--text-muted)", marginLeft: 3 } }, unit) : null),
      delta != null ? React.createElement("span", {
        style: { fontFamily: "var(--font-numeral)", fontSize: "var(--text-2xs)", color: TONES[deltaTone] || TONES.datum, minWidth: 52, textAlign: "right" }
      }, delta) : null
    )
  );
}
