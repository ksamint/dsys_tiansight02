import React from "react";

/* 专家顾问团 seat (X · 增值专项): portrait + short 头衔. No photos were supplied, so
   an absent `photo` renders a labelled placeholder — never a drawn avatar or an emoji. */
export function ExpertCard({ name, title, field, photo, tags = [], layout = "stack", size = 132, interactive = false, onClick }) {
  const [hover, setHover] = React.useState(false);
  const row = layout === "row";
  const portrait = photo
    ? React.createElement("img", {
        src: photo, alt: name,
        style: { width: size, height: size, objectFit: "cover", borderRadius: "50%", display: "block", flexShrink: 0, filter: "saturate(.85)" }
      })
    : React.createElement("div", {
        "aria-label": name + " 头像待补",
        style: {
          width: size, height: size, flexShrink: 0, borderRadius: "50%",
          background: "var(--parchment-300)", border: "1px dashed var(--line-rule)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-caps)",
          textTransform: "uppercase", color: "var(--ink-500)", textAlign: "center"
        }
      }, "专家头像");
  return React.createElement("div", {
    onClick: onClick,
    onMouseEnter: interactive ? function () { setHover(true); } : undefined,
    onMouseLeave: interactive ? function () { setHover(false); } : undefined,
    style: {
      display: "flex", flexDirection: row ? "row" : "column", gap: row ? "var(--space-5)" : "var(--space-4)",
      alignItems: row ? "center" : "flex-start", minWidth: 0,
      cursor: interactive ? "pointer" : "default",
      opacity: interactive && hover ? .88 : 1,
      transition: "opacity var(--dur-fast) var(--ease-standard)"
    }
  },
    portrait,
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 } },
      React.createElement("span", {
        style: { fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-display)" }
      }, name),
      React.createElement("span", { style: { fontSize: "var(--text-sm)", color: "var(--text-accent)", lineHeight: "var(--leading-snug)" } }, title),
      field ? React.createElement("span", {
        style: { paddingTop: 8, borderTop: "1px solid var(--line-hairline)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }
      }, field) : null,
      tags.length ? React.createElement("span", { style: { display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 4 } },
        tags.map(function (t) {
          return React.createElement("span", {
            key: t,
            style: { padding: "2px 8px", fontSize: "var(--text-3xs)", color: "var(--ink-600)", background: "var(--parchment-100)", border: "1px solid var(--line-hairline)", borderRadius: "var(--radius-xs)" }
          }, t);
        })
      ) : null
    )
  );
}
