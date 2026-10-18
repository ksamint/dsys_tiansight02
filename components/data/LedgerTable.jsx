import React from "react";

const TONES = {
  bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)",
  caution: "var(--caution-500)", datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

export function LedgerTable({ columns = [], rows = [], caption, dense = false, footer }) {
  const pad = dense ? "8px 12px" : "12px 14px";
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    caption ? React.createElement("span", {
      style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }
    }, caption) : null,
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", background: "var(--surface-card)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-sm)" } },
      React.createElement("thead", null,
        React.createElement("tr", null, columns.map(function (c, i) {
          return React.createElement("th", {
            key: i,
            style: {
              padding: pad, textAlign: c.align || "left", fontFamily: "var(--font-body)",
              fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)", letterSpacing: ".08em",
              textTransform: "uppercase", color: "var(--text-muted)",
              borderBottom: "1.5px solid var(--line-rule)", whiteSpace: "nowrap"
            }
          }, c.label);
        }))
      ),
      React.createElement("tbody", null, rows.map(function (r, ri) {
        return React.createElement("tr", { key: ri },
          columns.map(function (c, ci) {
            const cell = r[c.key];
            const tone = r[c.key + "Tone"];
            return React.createElement("td", {
              key: ci,
              style: {
                padding: pad, textAlign: c.align || "left",
                borderBottom: ri === rows.length - 1 ? "none" : "1px solid var(--line-hairline)",
                fontFamily: c.mono ? "var(--font-numeral)" : "var(--font-body)",
                fontVariantNumeric: c.mono ? "tabular-nums" : "normal",
                fontSize: c.mono ? "var(--text-xs)" : "var(--text-sm)",
                color: tone ? TONES[tone] : "var(--ink-800)",
                verticalAlign: "top", lineHeight: "var(--leading-snug)"
              }
            }, cell);
          })
        );
      }))
    ),
    footer ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, footer) : null
  );
}
