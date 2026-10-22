import React from "react";

/* 伙伴案例: one partner's story. Numbers are before/after pairs so the claim is
   verifiable — matching the brand rule that every result carries its evidence. */
export function PartnerCase({ brand, kind, stores, since, summary, metrics = [], quote, actions = [], logo }) {
  return React.createElement("article", {
    style: {
      background: "var(--surface-card)", border: "1px solid var(--line-hairline)",
      borderTop: "2px solid var(--bronze-500)", borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-sm)", padding: "var(--space-7)",
      display: "flex", flexDirection: "column", gap: "var(--space-6)"
    }
  },
    React.createElement("header", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-6)", flexWrap: "wrap" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-5)" } },
        logo ? React.createElement("img", { src: logo, alt: brand, style: { height: 44, maxWidth: 140, objectFit: "contain" } }) : null,
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
          React.createElement("span", {
            style: { fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }
          }, brand),
          React.createElement("span", { style: { fontSize: "var(--text-xs)", color: "var(--text-muted)" } },
            [kind, stores ? stores + " 家门店" : null, since ? "自 " + since : null].filter(Boolean).join(" · "))
        )
      )
    ),
    summary ? React.createElement("p", { style: { margin: 0, fontSize: "var(--text-md)", lineHeight: "var(--leading-normal)", color: "var(--text-body)", maxWidth: "40em" } }, summary) : null,
    metrics.length ? React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "repeat(" + Math.min(metrics.length, 4) + ", minmax(0,1fr))", gap: "var(--space-6)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-hairline)" }
    }, metrics.map(function (m) {
      return React.createElement("div", { key: m.label, style: { display: "flex", flexDirection: "column", gap: 8 } },
        React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" } }, m.label),
        React.createElement("span", { style: { display: "flex", alignItems: "baseline", gap: 8, fontFamily: "var(--font-numeral)" } },
          React.createElement("span", { style: { fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "line-through" } }, m.before),
          React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, "\u2192"),
          React.createElement("span", { style: { fontSize: "var(--text-2xl)", fontWeight: 500, color: m.tone === "loss" ? "var(--loss-500)" : "var(--growth-500)" } }, m.after)
        ),
        m.delta ? React.createElement("span", { style: { fontFamily: "var(--font-numeral)", fontSize: "var(--text-2xs)", color: m.tone === "loss" ? "var(--loss-500)" : "var(--growth-500)" } }, m.delta) : null
      );
    })) : null,
    actions.length ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-hairline)" } },
      React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, "\u6267\u884c\u4e86\u4ec0\u4e48"),
      actions.map(function (a, i) {
        return React.createElement("div", { key: i, style: { display: "flex", gap: 12, fontSize: "var(--text-sm)", color: "var(--ink-800)" } },
          React.createElement("span", { style: { fontFamily: "var(--font-numeral)", color: "var(--bronze-500)", flexShrink: 0 } }, String(i + 1).padStart(2, "0")),
          React.createElement("span", null, a)
        );
      })
    ) : null,
    quote ? React.createElement("figure", { style: { margin: 0, paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-hairline)", display: "flex", flexDirection: "column", gap: 14 } },
      React.createElement("blockquote", {
        style: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", lineHeight: "var(--leading-normal)", color: "var(--text-display)" }
      }, "\u201c", quote.text, "\u201d"),
      React.createElement("figcaption", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: "var(--text-xs)", color: "var(--text-muted)" } },
        React.createElement("span", { style: { width: 18, height: 1, background: "var(--line-strong)" } }),
        (quote.role ? quote.role + " " : "") + quote.by)
    ) : null
  );
}
