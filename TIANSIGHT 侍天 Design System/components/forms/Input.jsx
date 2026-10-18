import React from "react";

export function Input({ label, hint, error, prefix, suffix, size = "md", disabled = false, required = false, id, style: extra, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const pad = size === "sm" ? "7px 10px" : "10px 12px";
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)", ...extra } },
    label ? React.createElement("label", {
      htmlFor: uid,
      style: { fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--ink-700)" }
    }, label, required ? React.createElement("span", { style: { color: "var(--loss-500)", marginLeft: 4 } }, "*") : null) : null,
    React.createElement("div", {
      style: {
        display: "flex", alignItems: "center", gap: "8px", padding: pad,
        background: disabled ? "var(--parchment-100)" : "var(--surface-card)",
        border: "1px solid " + (error ? "var(--loss-500)" : focus ? "var(--line-strong)" : "var(--line-hairline)"),
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "0 0 0 2px var(--focus-ring)" : "none",
        opacity: disabled ? 0.55 : 1,
        transition: "border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)"
      }
    },
      prefix ? React.createElement("span", { style: { color: "var(--text-muted)", display: "flex" } }, prefix) : null,
      React.createElement("input", {
        id: uid, disabled, required,
        onFocus: () => setFocus(true), onBlur: () => setFocus(false),
        style: {
          flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--font-body)", fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
          color: "var(--ink-800)", letterSpacing: "var(--tracking-cjk-body)"
        },
        ...rest
      }),
      suffix ? React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "var(--text-xs)", display: "flex" } }, suffix) : null
    ),
    error || hint ? React.createElement("span", {
      style: { fontSize: "var(--text-2xs)", color: error ? "var(--loss-500)" : "var(--text-muted)" }
    }, error || hint) : null
  );
}
