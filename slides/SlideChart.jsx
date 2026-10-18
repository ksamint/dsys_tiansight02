import React from "react";

/* Slide adapter for the d3 chart kit. Kit charts set their type at report scale — 10px
   ticks, 11px labels, 12px caption — right on a printed page, illegible projected.
   SlideChart renders the chart at 1/scale of the column width and enlarges the result with
   a transform, so at the default 1.9 a 10px tick lands at 19px, the deck's minimum, without
   a second set of chart components. SVG scales crisply; the HTML caption, EGA badge, legend
   and 口径 line scale with it. Chart `height` props are therefore in *rendered* px —
   displayed height = height × scale. `padRight` reserves rendered px for labels that hang
   off the right edge (ForecastCorridor's P10/P50/P90, Scatter labels near the top value). */
export function SlideChart({ children, scale = 1.9, padRight = 0, style: extra }) {
  const outer = React.useRef(null), inner = React.useRef(null);
  const [w, setW] = React.useState(0);
  const [h, setH] = React.useState(0);
  const fit = function () {
    if (outer.current) setW(outer.current.clientWidth);
    if (inner.current) setH(Math.ceil(inner.current.offsetHeight * scale));
  };
  /* Measure after every commit: the chart mounts in the same commit as the width it needs, so
     the ResizeObserver alone is not enough in every host — this keeps the outer box honest. */
  React.useLayoutEffect(fit);
  React.useEffect(function () {
    var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    if (ro) { if (outer.current) ro.observe(outer.current); if (inner.current) ro.observe(inner.current); }
    window.addEventListener("resize", fit);
    var t = setTimeout(fit, 400); /* d3 arriving late re-renders the chart body only */
    return function () { window.removeEventListener("resize", fit); clearTimeout(t); if (ro) ro.disconnect(); };
  }, [scale]);
  const iw = w > 0 ? Math.max(120, Math.round(w / scale) - padRight) : 0;
  return React.createElement("div", { ref: outer, style: Object.assign({ width: "100%", minWidth: 0, flexShrink: 0, position: "relative", height: h || undefined }, extra) },
    React.createElement("div", { ref: inner, style: { width: iw || "100%", transform: "scale(" + scale + ")", transformOrigin: "0 0" } }, iw ? children : null));
}

/* EGA evidence badge at slide type (the kit's 10px QualityBadge is not used on slides — charts
   on slides carry no kit caption / 口径; the slide prints both at 19px). E4 and degraded = 朱红. */
export function SlideGrade({ grade, degraded, label }) {
  if (!grade && !degraded && !label) return null;
  const warn = degraded || grade === "E4";
  const text = [grade ? "EGA." + grade : null, degraded ? "降级 · 代理字段" : null, label].filter(Boolean).join(" · ");
  return React.createElement("span", { style: { display: "inline-flex", alignItems: "center", fontFamily: "var(--font-numeral)", fontSize: 16, lineHeight: 1.4, letterSpacing: 0, whiteSpace: "nowrap", padding: "2px 12px", borderRadius: "var(--radius-pill)", color: warn ? "var(--seal)" : "var(--gold-deep)", border: "1px solid " + (warn ? "var(--seal)" : "var(--line-card)") } }, text);
}
