import React from "react";
import { Card } from "./Card.jsx";
import { Badge } from "./Badge.jsx";

export function PlanCard({ tier, name, tagline, deliverable, mode, action, emphasized = false }) {
  return React.createElement(Card, { padding: "lg", emphasized, interactive: true, style: { display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" } },
    React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" } },
      React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" } }, tier),
      mode ? React.createElement(Badge, { tone: emphasized ? "bronze" : "neutral", variant: emphasized ? "solid" : "soft" }, mode) : null
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)" } },
      React.createElement("h3", { style: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" } }, name),
      tagline ? React.createElement("p", { style: { margin: 0, fontSize: "var(--text-md)", color: "var(--text-body)" } }, tagline) : null
    ),
    React.createElement("div", { style: { marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--line-hairline)", display: "flex", flexDirection: "column", gap: "var(--space-2)" } },
      React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)" } }, "\u8001\u677f\u5f97\u5230"),
      React.createElement("p", { style: { margin: 0, fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)", color: "var(--text-body)" } }, deliverable)
    ),
    action ? React.createElement("div", null, action) : null
  );
}
