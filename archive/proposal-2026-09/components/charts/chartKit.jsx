import React from "react";

/* 侍天 chart grammar. Every d3 chart in this system draws through these helpers so
   axes, margins, tones and type are identical across the report, the site and slides.
   d3 is expected on window (CDN, v7) — see charts.card.html for the script tag. */

export const CHART_TONES = {
  bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)",
  caution: "var(--caution-500)", datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

/* Literal hex for d3 interpolation, which cannot read CSS custom properties. */
export const CHART_HEX = {
  bronze: "#76551F", growth: "#4E6B3F", loss: "#A34A2C",
  caution: "#B98B2A", datum: "#3F5A6B", muted: "#D6C6A4",
  grid: "rgba(118,85,31,.16)", rule: "rgba(118,85,31,.28)", ink: "#4A4136", mutedInk: "#8B8072"
};

export const CHART_MARGIN = { top: 16, right: 20, bottom: 34, left: 52 };

export const AXIS_LABEL = {
  fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".02em", fill: CHART_HEX.mutedInk
};
export const VALUE_LABEL = {
  fontFamily: "var(--font-numeral)", fontSize: 11, fill: CHART_HEX.ink
};

export function tone(name) { return CHART_HEX[name] || CHART_HEX.bronze; }

/* Resolve d3, waiting for a CDN script that may still be loading. */
export function useD3() {
  const [d3, setD3] = React.useState(function () { return typeof window !== "undefined" ? window.d3 : null; });
  React.useEffect(function () {
    if (d3) return;
    var t = setInterval(function () { if (window.d3) { setD3(window.d3); clearInterval(t); } }, 60);
    return function () { clearInterval(t); };
  }, [d3]);
  return d3;
}

/* Measure the container so charts fill their column without a hard-coded width. */
export function useWidth(fallback) {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(fallback || 560);
  React.useEffect(function () {
    var el = ref.current; if (!el) return;
    var fit = function () { var b = el.clientWidth; if (b > 80) setW(b); };
    fit();
    var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(el);
    window.addEventListener("resize", fit);
    return function () { window.removeEventListener("resize", fit); if (ro) ro.disconnect(); };
  }, []);
  return [ref, w];
}

/* Chart frame: caption, measured SVG, optional source note. */
export function ChartFrame({ caption, note, height, children, svgRef, width }) {
  return React.createElement("figure", { style: { margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: 0 } },
    caption ? React.createElement("figcaption", {
      style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }
    }, caption) : null,
    React.createElement("svg", { ref: svgRef, width: width, height: height, style: { display: "block", overflow: "visible" } }, children),
    note ? React.createElement("span", { style: { fontSize: "var(--text-3xs)", color: "var(--text-muted)" } }, note) : null
  );
}

/* Legend as HTML, NOT inside the SVG: an SVG legend with a hard-coded stride overflows
   narrow containers (svg uses overflow:visible, so it spills past the panel). Flex + wrap
   degrades correctly at any width. */
export function ChartLegend({ items = [], style: extra }) {
  if (!items.length) return null;
  return React.createElement("div", {
    style: Object.assign({ display: "flex", flexWrap: "wrap", gap: "6px 18px", paddingTop: 2 }, extra)
  }, items.map(function (it, i) {
    return React.createElement("span", {
      key: i,
      style: { display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)", whiteSpace: "nowrap" }
    },
      it.dashed
        ? React.createElement("span", { style: { width: 16, height: 0, borderTop: "2px dashed " + tone(it.tone), flexShrink: 0 } })
        : React.createElement("span", { style: { width: 10, height: 10, borderRadius: 1, background: tone(it.tone), flexShrink: 0 } }),
      React.createElement("span", null, it.label)
    );
  }));
}

/* Relative luminance of any CSS color d3 can parse — used to pick light vs dark ink on a
   filled cell. Both ends of a diverging scale are dark, so a mode flag is not enough. */
export function isDarkFill(d3, color) {
  try {
    var c = d3.color(color); if (!c) return false;
    var rgb = c.rgb();
    var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return (0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b)) < 0.42;
  } catch (e) { return false; }
}

/* Bottom + left axes drawn as hairlines with mono ticks. No gridlines by default. */
export function Axes({ x, y, width, height, margin = CHART_MARGIN, xTicks = 6, yTicks = 4, grid = false, xFormat, yFormat, band = false }) {
  const iw = width - margin.left - margin.right;
  const ih = height - margin.top - margin.bottom;
  const yt = y && y.ticks ? y.ticks(yTicks) : (y && y.domain ? y.domain() : []);
  const xt = band ? (x ? x.domain() : []) : (x && x.ticks ? x.ticks(xTicks) : []);
  return React.createElement("g", null,
    grid ? yt.map(function (v, i) {
      return React.createElement("line", { key: "g" + i, x1: margin.left, x2: margin.left + iw, y1: y(v), y2: y(v), stroke: CHART_HEX.grid, strokeWidth: 1 });
    }) : null,
    React.createElement("line", { x1: margin.left, x2: margin.left + iw, y1: margin.top + ih, y2: margin.top + ih, stroke: CHART_HEX.rule, strokeWidth: 1 }),
    yt.map(function (v, i) {
      return React.createElement("text", Object.assign({ key: "y" + i, x: margin.left - 10, y: y(v), dy: "0.32em", textAnchor: "end" }, VALUE_LABEL, { fontSize: 10 }),
        yFormat ? yFormat(v) : v);
    }),
    xt.map(function (v, i) {
      const cx = band ? x(v) + x.bandwidth() / 2 : x(v);
      return React.createElement("text", Object.assign({ key: "x" + i, x: cx, y: margin.top + ih + 18, textAnchor: "middle" }, AXIS_LABEL), xFormat ? xFormat(v) : v);
    })
  );
}
