import React from "react";

/* Lucide (CDN) stands in for a brand icon set — see readme ICONOGRAPHY.
   Rendered as a CSS mask so the glyph always inherits currentColor. */
const BASE = "https://unpkg.com/lucide-static@0.441.0/icons/";

export function Icon({ name, size = 18, style: extra, ...rest }) {
  const url = "url(" + BASE + name + ".svg)";
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
