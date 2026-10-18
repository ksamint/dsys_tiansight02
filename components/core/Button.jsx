import React from "react";

const SIZES = {
  sm: { padding: "7px 14px", font: "var(--text-xs)", gap: "6px" },
  md: { padding: "11px 22px", font: "var(--text-sm)", gap: "8px" },
  lg: { padding: "15px 30px", font: "var(--text-base)", gap: "10px" }
};

/* Published foundation (brand-guide §0, §5; v0.7 ruling Q1): the primary button is the
   素墨 ink field with a gold hairline — gold is structure, never the fill. Hover and press
   darken along the gold ramp (one step, two steps); no shadows on any button. */
function palette(variant, hover, press) {
  const ramp = press ? "var(--gold-700)" : hover ? "var(--gold-600)" : "var(--gold)";
  if (variant === "primary") return {
    background: press ? "var(--parchment-300)" : hover ? "var(--gold-100)" : "var(--ink-primary)",
    color: "var(--charcoal)", border: "1px solid " + ramp, boxShadow: "none"
  };
  if (variant === "secondary") return {
    background: "var(--paper)",
    color: hover || press ? ramp : "var(--charcoal)",
    border: "1px solid " + (hover || press ? ramp : "var(--line-card)"), boxShadow: "none"
  };
  if (variant === "ghost") return {
    background: "transparent", color: ramp,
    border: "1px solid transparent", boxShadow: "none"
  };
  /* inverse — for the single charcoal card */
  return {
    background: press ? "var(--gold-700)" : hover ? "var(--gold-600)" : "var(--gold)",
    color: "var(--surface)", border: "1px solid transparent", boxShadow: "none"
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
    lineHeight: 1.2, borderRadius: "var(--radius)", cursor: disabled ? "not-allowed" : "pointer",
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
