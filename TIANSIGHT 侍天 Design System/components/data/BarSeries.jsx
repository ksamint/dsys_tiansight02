import React from "react";

const TONES = {
  bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)",
  caution: "var(--caution-500)", datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

export function BarSeries({ data = [], max, unit, showValues = true, labelWidth = 96, height = 14 }) {
  const peak = max != null ? max : Math.max.apply(null, data.map(function (d) { return Math.abs(d.value); }).concat([1]));
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    data.map(function (d, i) {
      return React.createElement("div", {
        key: i,
        style: { display: "grid", gridTemplateColumns: labelWidth + "px 1fr " + (showValues ? "72px" : "0px"), alignItems: "center", gap: "var(--space-4)" }
      },
        React.createElement("span", { style: { fontSize: "var(--text-xs)", color: "var(--ink-700)", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, d.label),
        React.createElement("span", { style: { display: "block", height, background: "var(--parchment-300)", borderRadius: "var(--radius-xs)", overflow: "hidden" } },
          React.createElement("span", {
            style: {
              display: "block", height: "100%", width: Math.max(1, Math.abs(d.value) / peak * 100) + "%",
              background: TONES[d.tone] || TONES.bronze, borderRadius: "var(--radius-xs)",
              transition: "width var(--dur-reveal) var(--ease-out)"
            }
          })
        ),
        showValues ? React.createElement("span", {
          style: { fontFamily: "var(--font-numeral)", fontVariantNumeric: "tabular-nums", fontSize: "var(--text-2xs)", color: "var(--ink-600)", textAlign: "right" }
        }, d.value, unit ? React.createElement("span", { style: { color: "var(--text-muted)" } }, unit) : null) : null
      );
    })
  );
}
