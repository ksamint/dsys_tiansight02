import React from "react";

/* Wordmark rule: TIANSIGHT reads as INSIGHT — the I N S I G H T letters are gold,
   the T and the A are ink. Never set the wordmark in a single flat color.
   The split has to survive at 14px, so it carries BOTH a value contrast (light gold
   against near-black ink — bronze-500 is too dark to separate on parchment) and a
   weight contrast (ink letters 700, gold letters 400). */
const WORDMARK = [["T", 0], ["I", 1], ["A", 0], ["N", 1], ["S", 1], ["I", 1], ["G", 1], ["H", 1], ["T", 1]];

function Wordmark({ fontSize, inverse }) {
  const ink = inverse ? "var(--parchment-100)" : "var(--ink-900)";
  const gold = inverse ? "var(--bronze-300)" : "var(--gold-400)";
  return React.createElement("span", {
    "aria-label": "TIANSIGHT",
    style: {
      fontFamily: "var(--font-quote)", fontSize,
      textTransform: "uppercase", letterSpacing: "var(--tracking-caps-wide)", lineHeight: 1.1, whiteSpace: "nowrap"
    }
  }, WORDMARK.map(function (l, i) {
    return React.createElement("span", {
      key: i,
      style: { color: l[1] ? gold : ink, fontWeight: l[1] ? "var(--weight-regular)" : "var(--weight-bold)" }
    }, l[0]);
  }));
}

export { Wordmark };

function defaultSealSrc() {
  try {
    var s = document.querySelector('script[src*="_ds_bundle.js"]');
    if (s) return s.getAttribute("src").replace(/_ds_bundle\.js.*$/, "") + "assets/logo-seal.png";
  } catch (e) {}
  return "assets/logo-seal.png";
}

export function Seal({ size = 36, src = defaultSealSrc(), wordmark = false, subtitle, inverse = false, align = "row" }) {
  const stack = align === "column";
  return React.createElement("div", {
    style: {
      display: "flex", flexDirection: stack ? "column" : "row",
      alignItems: "center", gap: stack ? "var(--space-4)" : "var(--space-3)", textAlign: stack ? "center" : "left"
    }
  },
    React.createElement("img", {
      src, alt: "侍天 TIANSIGHT", width: size, height: size,
      style: { display: "block", width: size, height: size, opacity: inverse ? 0.92 : 1, filter: inverse ? "invert(1) sepia(.35) saturate(.6) brightness(1.15)" : "none" }
    }),
    wordmark ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "3px" } },
      React.createElement(Wordmark, { fontSize: stack ? "var(--text-lg)" : "var(--text-sm)", inverse: inverse }),
      subtitle ? React.createElement("span", {
        style: {
          fontFamily: "var(--font-body)", fontSize: "var(--text-3xs)",
          letterSpacing: "var(--tracking-caps)", textTransform: "uppercase",
          color: inverse ? "rgba(239,230,210,.6)" : "var(--text-muted)"
        }
      }, subtitle) : null
    ) : null
  );
}
