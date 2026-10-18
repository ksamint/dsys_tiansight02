import React from "react";

export function Switch({ label, description, checked = false, onChange, disabled = false, id }) {
  const uid = id || React.useId();
  return React.createElement("label", {
    htmlFor: uid,
    style: { display: "flex", gap: "var(--space-4)", alignItems: "center", justifyContent: "space-between", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1 }
  },
    React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "2px" } },
      React.createElement("span", { style: { fontSize: "var(--text-sm)", color: "var(--ink-800)" } }, label),
      description ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, description) : null
    ),
    React.createElement("span", { style: { position: "relative", display: "inline-flex", flexShrink: 0 } },
      React.createElement("input", {
        type: "checkbox", role: "switch", id: uid, checked, onChange, disabled,
        style: { position: "absolute", opacity: 0, width: 40, height: 22, margin: 0, cursor: "inherit" }
      }),
      React.createElement("span", {
        style: {
          width: 40, height: 22, borderRadius: "var(--radius-pill)",
          background: checked ? "var(--bronze-500)" : "var(--parchment-300)",
          border: "1px solid " + (checked ? "var(--bronze-500)" : "var(--line-hairline)"),
          transition: "background var(--dur-base) var(--ease-standard)", display: "block"
        }
      }),
      React.createElement("span", {
        style: {
          position: "absolute", top: 3, left: checked ? 21 : 3, width: 16, height: 16,
          borderRadius: "var(--radius-pill)", background: "var(--paper)",
          boxShadow: "var(--shadow-xs)", transition: "left var(--dur-base) var(--ease-standard)"
        }
      })
    )
  );
}
