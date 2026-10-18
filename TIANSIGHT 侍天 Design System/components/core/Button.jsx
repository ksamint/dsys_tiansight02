import React from "react";

const SIZES = {
  sm: { padding: "7px 14px", font: "var(--text-xs)", gap: "6px" },
  md: { padding: "11px 22px", font: "var(--text-sm)", gap: "8px" },
  lg: { padding: "15px 30px", font: "var(--text-base)", gap: "10px" }
};

function palette(variant, hover, press) {
  if (variant === "primary") return {
    background: press ? "var(--bronze-700)" : hover ? "var(--bronze-600)" : "var(--bronze-500)",
    color: "var(--text-on-accent)", border: "1px solid transparent",
    boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)"
  };
  if (variant === "secondary") return {
    background: hover ? "var(--parchment-50)" : "var(--surface-card)",
    color: "var(--ink-800)",
    border: "1px solid " + (hover ? "var(--line-rule)" : "var(--line-hairline)"),
    boxShadow: hover ? "var(--shadow-sm)" : "none"
  };
  if (variant === "ghost") return {
    background: hover ? "var(--parchment-100)" : "transparent",
    color: press ? "var(--bronze-700)" : "var(--bronze-500)",
    border: "1px solid transparent", boxShadow: "none"
  };
  return {
    background: hover ? "var(--parchment-100)" : "var(--parchment-200)",
    color: "var(--ink-900)", border: "1px solid transparent",
    boxShadow: hover ? "var(--shadow-md)" : "none"
  };
}

export function Button({ children, variant = "primary", size = "md", icon, iconPosition = "right", fullWidth = false, disabled = false, href, onClick, type = "button", ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const p = palette(variant, hover && !disabled, press && !disabled);
  const style = {
    display: fullWidth ? "flex" : "inline-flex", width: fullWidth ? "100%" : "auto",
    alignItems: "center", justifyContent: "center", gap: s.gap,
    padding: s.padding, fontSize: s.font, fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-body)",
    lineHeight: 1.2, borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1, textDecoration: "none", whiteSpace: "nowrap",
    transform: press && !disabled ? "translateY(1px)" : "none",
    transition: "background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
    ...p
  };
  const handlers = disabled ? {} : {
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false), onClick
  };
  const body = [
    icon && iconPosition === "left" ? React.createElement("span", { key: "i", style: { display: "flex" } }, icon) : null,
    React.createElement("span", { key: "t" }, children),
    icon && iconPosition === "right" ? React.createElement("span", { key: "r", style: { display: "flex" } }, icon) : null
  ];
  if (href && !disabled) return React.createElement("a", { href, style, ...handlers, ...rest }, body);
  return React.createElement("button", { type, disabled, style, ...handlers, ...rest }, body);
}
