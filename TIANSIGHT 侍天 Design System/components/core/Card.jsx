import React from "react";

const PAD = { sm: "var(--space-4)", md: "var(--space-6)", lg: "var(--space-7)" };

export function Card({ children, padding = "md", tone = "paper", emphasized = false, interactive = false, onClick, style: extra, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const inverse = tone === "inverse";
  const lift = interactive && hover;
  const style = {
    background: inverse ? "var(--surface-inverse)" : tone === "muted" ? "var(--surface-card-muted)" : "var(--surface-card)",
    color: inverse ? "var(--text-on-inverse)" : "var(--text-body)",
    border: "1px solid " + (inverse ? "var(--line-inverse)" : lift ? "var(--line-rule)" : "var(--line-hairline)"),
    borderTop: emphasized ? "2px solid var(--bronze-500)" : undefined,
    borderRadius: "var(--radius-md)",
    padding: PAD[padding] || PAD.md,
    boxShadow: lift ? "var(--shadow-md)" : inverse ? "none" : "var(--shadow-sm)",
    transition: "box-shadow var(--dur-base) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-base) var(--ease-standard)",
    transform: lift ? "translateY(-2px)" : "none",
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
