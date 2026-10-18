import React from "react";

const CN = ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d"];

export function StepMarker({ index = 1, numeral, label, sublabel, active = false, size = 44, tone = "default" }) {
  const inverse = tone === "inverse";
  const ch = numeral || CN[index - 1] || String(index);
  return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-4)" } },
    React.createElement("span", {
      style: {
        width: size, height: size, flexShrink: 0, borderRadius: "var(--radius-seal)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontSize: Math.round(size * 0.42),
        fontWeight: "var(--weight-medium)", lineHeight: 1,
        border: "1px solid " + (active ? "var(--line-strong)" : inverse ? "var(--line-inverse)" : "var(--line-rule)"),
        background: active ? "var(--bronze-500)" : "transparent",
        color: active ? "var(--text-on-accent)" : inverse ? "var(--text-on-inverse)" : "var(--bronze-500)",
        transition: "all var(--dur-base) var(--ease-standard)"
      }
    }, ch),
    label ? React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "2px" } },
      React.createElement("span", {
        style: { fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: inverse ? "var(--text-on-inverse)" : "var(--text-display)" }
      }, label),
      sublabel ? React.createElement("span", { style: { fontSize: "var(--text-xs)", color: inverse ? "rgba(239,230,210,.65)" : "var(--text-muted)" } }, sublabel) : null
    ) : null
  );
}
