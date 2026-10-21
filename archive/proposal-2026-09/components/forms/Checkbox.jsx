import React from "react";

export function Checkbox({ label, description, checked, defaultChecked, onChange, disabled = false, id, ...rest }) {
  const uid = id || React.useId();
  return React.createElement("label", {
    htmlFor: uid,
    style: { display: "flex", gap: "var(--space-3)", alignItems: "flex-start", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1 }
  },
    React.createElement("input", {
      type: "checkbox", id: uid, checked, defaultChecked, onChange, disabled,
      style: { width: 15, height: 15, marginTop: 3, accentColor: "var(--bronze-500)", flexShrink: 0, borderRadius: "var(--radius-xs)" },
      ...rest
    }),
    React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: "2px" } },
      React.createElement("span", { style: { fontSize: "var(--text-sm)", color: "var(--ink-800)" } }, label),
      description ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: "var(--text-muted)" } }, description) : null
    )
  );
}
