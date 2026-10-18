import React from "react";

const SIZES = { sm: 28, md: 34, lg: 42 };

export function IconButton({ icon, label, variant = "quiet", size = "md", disabled = false, onClick, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const d = SIZES[size] || SIZES.md;
  const quiet = variant === "quiet";
  return React.createElement("button", {
    type: "button", "aria-label": label, disabled, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      width: d, height: d, display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      color: quiet ? (hover ? "var(--bronze-600)" : "var(--ink-500)") : "var(--text-on-accent)",
      background: quiet ? (hover ? "var(--parchment-100)" : "transparent") : (hover ? "var(--bronze-600)" : "var(--bronze-500)"),
      border: variant === "outline" ? "1px solid var(--line-hairline)" : "1px solid transparent",
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)"
    },
    ...rest
  }, icon);
}
