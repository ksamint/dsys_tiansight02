import React from "react";

const PAD = { sm: "var(--space-4)", md: "var(--space-6)", lg: "var(--space-7)" };

export function Card({ children, padding = "md", tone = "paper", emphasized = false, interactive = false, onClick, style: extra, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const inverse = tone === "inverse";
  const lift = interactive && hover;
  const style = {
    background: inverse ? "var(--surface-inverse)" : tone === "muted" ? "var(--surface-card-muted)" : "var(--surface-card)",
    color: inverse ? "var(--text-on-inverse)" : "var(--text-body)",
    border: "1px solid " + (inverse ? "var(--line-inverse)" : lift ? "var(--gold)" : "var(--line-card)"),
    borderTop: emphasized ? "2px solid var(--gold)" : undefined,
    borderRadius: "var(--radius)",
    padding: PAD[padding] || PAD.md,
    /* cards stay bordered — shadow is for dialogs and overlays only (brand-guide §1, v0.7) */
    boxShadow: "none",
    transition: "border-color var(--dur-fast) var(--ease-standard)",
    cursor: interactive ? "pointer" : "default",
    ...extra
  };
  return React.createElement("div", {
    style, onClick,
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    ...rest
  }, children);
}
