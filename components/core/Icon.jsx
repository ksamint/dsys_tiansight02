import React from "react";

/* 侍天's own icon set — the 17 hairline glyphs from the brand sprite (assets/icons.svg),
   inlined so the component is self-contained at any directory depth. Stroke 1.5,
   round caps, no fills, always currentColor.
   Names not in the set fall back to Lucide via CDN mask and are a flagged
   substitution — see readme ICONOGRAPHY. */
const TS = {
  "arrow-right": "M4 12h15M13 6l6 6-6 6",
  "arrow-up-right": "M6 18L18 6M9 6h9v9",
  "arrow-left": "M20 12H5M11 6l-6 6 6 6",
  "arrow-down": "M12 4v15M6 13l6 6 6-6",
  "chevron-down": "M5 9l7 7 7-7",
  check: "M4 12.5l5 5L20 6.5",
  cross: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  external: "M14 4h6v6M20 4l-9 9M18 13v6H5V6h6",
  print: "M7 9V4h10v5M5 9h14v8h-3M8 14h8v6H8z",
  chart: "M4 20h16M6 16l4-5 4 3 5-7",
  store: "M4 10l1.5-5h13L20 10M5 10v10h14V10M10 20v-6h4v6",
  correction: "M12 7v5l3 2",
  route: "M7 18h6a4 4 0 0 0 0-8H11a4 4 0 0 1 0-8",
  compass: "M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4",
  data: "M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"
};
/* extra <circle>/<ellipse> members of the compound glyphs, kept exactly as the sprite draws them */
const TS_SHAPES = {
  compass: [["circle", { cx: 12, cy: 12, r: 8.5 }], ["circle", { cx: 12, cy: 12, r: 1 }]],
  correction: [["circle", { cx: 12, cy: 12, r: 8.5 }]],
  route: [["circle", { cx: 5, cy: 18, r: 2 }], ["circle", { cx: 19, cy: 6, r: 2 }]],
  data: [["ellipse", { cx: 12, cy: 6, rx: 7, ry: 2.5 }]],
  seal: [["circle", { cx: 12, cy: 12, r: 8.5 }], ["circle", { cx: 12, cy: 12, r: 5 }]]
};
/* Lucide names used by the kits, mapped onto the brand's own glyph where one exists */
const ALIAS = {
  x: "cross", close: "cross", "line-chart": "chart", "trending-up": "chart",
  "chevron-right": "arrow-right", target: "compass", "circle-dot": "seal",
  shield: "seal", clock: "correction", layers: "route", database: "data"
};
const LUCIDE = "https://unpkg.com/lucide-static@0.441.0/icons/";

export function Icon({ name, size = 18, strokeWidth = 1.5, style: extra, ...rest }) {
  const id = ALIAS[name] || name;
  const d = TS[id], shapes = TS_SHAPES[id];
  if (d || shapes) {
    return React.createElement("svg", {
      width: size, height: size, viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", strokeWidth: strokeWidth,
      strokeLinecap: "round", strokeLinejoin: "round",
      "aria-hidden": "true", focusable: "false",
      style: { display: "inline-block", flexShrink: 0, ...extra }, ...rest
    },
      (shapes || []).map(function (s, i) { return React.createElement(s[0], { key: i, ...s[1] }); }),
      d ? React.createElement("path", { d: d }) : null
    );
  }
  const url = "url(" + LUCIDE + name + ".svg)";
  return React.createElement("span", {
    "aria-hidden": "true", role: "presentation",
    style: {
      display: "inline-block", width: size, height: size, flexShrink: 0,
      background: "currentColor",
      WebkitMaskImage: url, maskImage: url,
      WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
      WebkitMaskPosition: "center", maskPosition: "center",
      WebkitMaskSize: "contain", maskSize: "contain",
      ...extra
    },
    ...rest
  });
}
