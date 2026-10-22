import React from "react";

export function Quote({ children, author, role, tone = "default", size = "md" }) {
  const inverse = tone === "inverse";
  return React.createElement("figure", { style: { margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-5)" } },
    React.createElement("blockquote", {
      style: {
        margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--weight-regular)",
        fontSize: size === "lg" ? "var(--text-2xl)" : size === "sm" ? "var(--text-md)" : "var(--text-lg)",
        lineHeight: "var(--leading-normal)", letterSpacing: "var(--tracking-cjk-body)",
        color: inverse ? "var(--text-on-inverse)" : "var(--text-display)"
      }
    }, "\u201c", children, "\u201d"),
    author ? React.createElement("figcaption", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)" } },
      React.createElement("span", { style: { width: 18, height: 1, background: inverse ? "var(--line-inverse)" : "var(--line-strong)" } }),
      React.createElement("span", { style: { fontSize: "var(--text-xs)", color: inverse ? "rgba(239,230,210,.7)" : "var(--text-muted)" } }, role ? role + " " + author : author)
    ) : null
  );
}
