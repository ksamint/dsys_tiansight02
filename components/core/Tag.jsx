import React from "react";

export function Tag({ children, active = false, onClick, onRemove, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;
  return React.createElement("span", {
    onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px",
      fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
      fontWeight: active ? "var(--weight-medium)" : "var(--weight-regular)",
      color: active ? "var(--bronze-600)" : "var(--ink-600)",
      background: active ? "var(--parchment-100)" : hover && clickable ? "var(--parchment-100)" : "transparent",
      border: "1px solid " + (active ? "var(--line-strong)" : "var(--line-hairline)"),
      borderRadius: "var(--radius-pill)", cursor: clickable ? "pointer" : "default",
      transition: "all var(--dur-fast) var(--ease-standard)"
    },
    ...rest
  }, children,
    onRemove ? React.createElement("span", { onClick: onRemove, style: { cursor: "pointer", color: "var(--text-muted)", fontSize: "var(--text-2xs)" } }, "\u00d7") : null
  );
}
