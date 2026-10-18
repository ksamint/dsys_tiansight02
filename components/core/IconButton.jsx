import React from "react";

const SIZES = { sm: 28, md: 34, lg: 42 };

/* Same palette as Button: primary is the 素墨 ink field with a gold hairline (never a gold
   fill); quiet and outline hovers darken along the gold ramp; no shadows anywhere. */
export function IconButton({ icon, label, variant = "quiet", size = "md", disabled = false, onClick, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const d = SIZES[size] || SIZES.md;
  const on = !disabled && (hover || press);
  const ramp = press && !disabled ? "var(--gold-700)" : hover && !disabled ? "var(--gold-600)" : "var(--gold)";
  const p = variant === "primary" ? {
    background: press && !disabled ? "var(--parchment-300)" : on ? "var(--gold-100)" : "var(--ink-primary)",
    color: "var(--charcoal)", border: "1px solid " + ramp
  } : variant === "outline" ? {
    background: "var(--paper)", color: on ? ramp : "var(--charcoal)",
    border: "1px solid " + (on ? ramp : "var(--line-card)")
  } : {
    background: "transparent", color: on ? ramp : "var(--ink-muted)", border: "1px solid transparent"
  };
  return React.createElement("button", {
    type: "button", "aria-label": label, disabled, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
    style: {
      width: d, height: d, display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius)", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, boxShadow: "none",
      transform: press && !disabled ? "translateY(1px)" : "none",
      transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
      ...p
    },
    ...rest
  }, icon);
}
