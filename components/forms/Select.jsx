import React from "react";

export function Select({ label, hint, error, options = [], size = "md", disabled = false, id, style: extra, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)", ...extra } },
    label ? React.createElement("label", { htmlFor: uid, style: { fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)", color: "var(--ink-700)" } }, label) : null,
    React.createElement("div", { style: { position: "relative", display: "flex" } },
      React.createElement("select", {
        id: uid, disabled,
        onFocus: () => setFocus(true), onBlur: () => setFocus(false),
        style: {
          appearance: "none", WebkitAppearance: "none", width: "100%",
          padding: size === "sm" ? "7px 32px 7px 10px" : "10px 34px 10px 12px",
          fontFamily: "var(--font-body)", fontSize: size === "sm" ? "var(--text-xs)" : "var(--text-sm)",
          color: "var(--ink-800)", background: disabled ? "var(--parchment-100)" : "var(--surface-card)",
          border: "1px solid " + (error ? "var(--loss-500)" : focus ? "var(--line-strong)" : "var(--line-hairline)"),
          borderRadius: "var(--radius-md)", outline: "none",
          boxShadow: focus ? "0 0 0 2px var(--focus-ring)" : "none",
          opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer"
        },
        ...rest
      }, options.map(function (o) {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return React.createElement("option", { key: v, value: v }, l);
      })),
      React.createElement("span", {
        "aria-hidden": "true",
        style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--bronze-500)", fontSize: "10px" }
      }, "\u25be")
    ),
    error || hint ? React.createElement("span", { style: { fontSize: "var(--text-2xs)", color: error ? "var(--loss-500)" : "var(--text-muted)" } }, error || hint) : null
  );
}
