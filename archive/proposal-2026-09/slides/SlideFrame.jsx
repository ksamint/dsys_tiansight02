import React from "react";

/* Resolve brand assets from wherever _ds_bundle.js was loaded, so slides work in the
   card grid, in templates/, and in a consuming project's _ds/ tree alike. */
function dsAsset(file) {
  try {
    var s = document.querySelector('script[src*="_ds_bundle.js"]');
    if (s) return s.getAttribute("src").replace(/_ds_bundle\.js.*$/, "") + "assets/" + file;
  } catch (e) {}
  return "../assets/" + file;
}
export { dsAsset };

const GROUNDS = {
  parchment: { bg: "var(--surface-page)", fg: "var(--text-body)", head: "var(--text-display)" },
  paper: { bg: "var(--surface-card)", fg: "var(--text-body)", head: "var(--text-display)" },
  muted: { bg: "var(--parchment-100)", fg: "var(--text-body)", head: "var(--text-display)" },
  ink: { bg: "var(--surface-inverse)", fg: "rgba(239,230,210,.72)", head: "var(--text-on-inverse)" }
};

/* 1280×720 slide shell. Owns the ground, the 72px margin, the hairline footer,
   the seal and the page number — so no slide re-invents deck furniture. */
export function SlideFrame({ children, ground = "parchment", eyebrow, page, footer, grain = false, seal = true, pad = 72 }) {
  const g = GROUNDS[ground] || GROUNDS.parchment;
  const inverse = ground === "ink";
  return React.createElement("div", {
    className: grain ? "ts-paper" : undefined,
    style: {
      position: "relative", width: 1280, height: 720, boxSizing: "border-box", overflow: "hidden",
      background: grain ? undefined : g.bg, color: g.fg,
      fontFamily: "var(--font-body)", display: "flex", flexDirection: "column",
      padding: pad + "px " + pad + "px " + (pad - 20) + "px"
    }
  },
    eyebrow ? React.createElement("div", {
      style: {
        fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", textTransform: "uppercase",
        letterSpacing: "var(--tracking-caps)", color: inverse ? "rgba(239,230,210,.65)" : "var(--text-accent)",
        marginBottom: 28, flexShrink: 0
      }
    }, eyebrow) : null,
    React.createElement("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" } }, children),
    React.createElement("div", {
      style: {
        flexShrink: 0, marginTop: 26, paddingTop: 16,
        borderTop: "1px solid " + (inverse ? "var(--line-inverse)" : "var(--line-hairline)"),
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        fontSize: "var(--text-2xs)", color: inverse ? "rgba(239,230,210,.5)" : "var(--text-muted)"
      }
    },
      React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 10 } },
        seal ? React.createElement("img", {
          src: dsAsset("logo-seal.png"), alt: "", width: 20, height: 20,
          style: { display: "block", filter: inverse ? "invert(1) sepia(.35) saturate(.6) brightness(1.15)" : "none", opacity: inverse ? .9 : .8 }
        }) : null,
        React.createElement("span", null, footer || "侍天 TIANSIGHT · 餐饮第二大脑")
      ),
      page != null ? React.createElement("span", { style: { fontFamily: "var(--font-numeral)", letterSpacing: 0 } }, String(page).padStart(2, "0")) : null
    )
  );
}

/* Slide-scale heading — display serif, tuned so 1280×720 text never drops below 24px. */
export function SlideTitle({ children, size = "lg", ground = "parchment", style: extra }) {
  const px = size === "xl" ? 88 : size === "lg" ? 62 : size === "md" ? 46 : 36;
  return React.createElement("h2", {
    style: {
      margin: 0, fontFamily: "var(--font-display)", fontSize: px,
      fontWeight: "var(--weight-medium)", lineHeight: 1.16,
      letterSpacing: "var(--tracking-cjk-display)",
      color: ground === "ink" ? "var(--text-on-inverse)" : "var(--text-display)", ...extra
    }
  }, children);
}

/* Labelled placeholder for imagery the brand has not supplied (portraits, QR, photos). */
export function SlidePlaceholder({ label, aspect = "1 / 1", radius = "var(--radius-md)", round = false, style: extra }) {
  return React.createElement("div", {
    style: {
      aspectRatio: aspect, width: "100%", background: "var(--parchment-300)",
      border: "1px dashed var(--line-rule)", borderRadius: round ? "50%" : radius,
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
      fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", color: "var(--ink-500)",
      letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", padding: 12, ...extra
    }
  }, label);
}
