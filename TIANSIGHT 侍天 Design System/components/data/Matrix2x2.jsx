import React from "react";

const TONES = {
  bronze: "var(--bronze-500)", growth: "var(--growth-500)", loss: "var(--loss-500)",
  caution: "var(--caution-500)", datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

export function Matrix2x2({ xAxis, yAxis, quadrants = [], points = [], height = 300 }) {
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)" } },
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "22px 1fr", gap: "var(--space-3)" } },
      React.createElement("span", {
        style: { writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)", justifySelf: "center", alignSelf: "center" }
      }, yAxis),
      React.createElement("div", {
        style: {
          position: "relative", height, border: "1px solid var(--line-rule)",
          background: "var(--surface-card)", borderRadius: "var(--radius-sm)", overflow: "hidden"
        }
      },
        React.createElement("span", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--line-hairline)" } }),
        React.createElement("span", { style: { position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "var(--line-hairline)" } }),
        quadrants.map(function (q, i) {
          const pos = [
            { top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }
          ][i] || {};
          return React.createElement("span", {
            key: i,
            style: Object.assign({
              position: "absolute", fontSize: "var(--text-2xs)", lineHeight: 1.5, maxWidth: "42%",
              color: TONES[q.tone] || "var(--text-muted)", textAlign: pos.right != null ? "right" : "left"
            }, pos)
          }, q.label);
        }),
        points.map(function (p, i) {
          return React.createElement("span", {
            key: i,
            style: {
              position: "absolute", left: p.x * 100 + "%", bottom: p.y * 100 + "%",
              transform: "translate(-50%, 50%)", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap"
            }
          },
            React.createElement("span", {
              style: {
                width: p.size || 9, height: p.size || 9, borderRadius: "var(--radius-pill)",
                background: TONES[p.tone] || TONES.bronze, flexShrink: 0, boxShadow: "0 0 0 3px var(--surface-card)"
              }
            }),
            React.createElement("span", { style: { fontSize: "var(--text-3xs)", color: "var(--ink-600)" } }, p.label)
          );
        })
      )
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "22px 1fr" } },
      React.createElement("span", null),
      React.createElement("span", {
        style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center" }
      }, xAxis)
    )
  );
}
