import React from "react";
import { crossTab, useD3, isDarkFill, DIMENSION_LABELS, DIMENSION_GRADE, SEQUENTIAL, CHART_HEX, QualityBadge } from "./chartKit.jsx";

/* 九宫格 · dimension × dimension matrix (味型 × 工艺 and the other six structure presets).
   Mirrors the v4.2 report's `heatmap_nine`: an HTML table, cell shade = count (or a
   measure), an empty cell prints "·" and is a 研发补缺 candidate, and clicking a cell
   lists the SKUs behind it. Denominator is the 菜品 cohort only — 外购酒水 / 茶水 carry no
   味型 or 工艺 and must be filtered out before they reach here. */
export function NineGrid({ items = [], rowDim = "flavor", colDim = "craft", measure, agg = "sum", caption, note, scope, grade, unit = "", format, labelKey = "name", maxRows = 14, maxCols = 10, interactive = true, onSelect, showGaps = true }) {
  const d3 = useD3();
  const [sel, setSel] = React.useState(null);
  const t = crossTab(items, rowDim, colDim, measure, agg);
  const fmt = format || function (v) { return measure ? (Math.round(v * 10) / 10).toLocaleString() + unit : String(v); };
  const rowTotal = function (r) { return t.cols.reduce(function (a, c) { const k = t.cells[r + "\u0000" + c]; return a + (k ? k.value : 0); }, 0); };
  const colTotal = function (c) { return t.rows.reduce(function (a, r) { const k = t.cells[r + "\u0000" + c]; return a + (k ? k.value : 0); }, 0); };
  const rows = t.rows.slice().sort(function (a, b) { return rowTotal(b) - rowTotal(a); }).slice(0, maxRows);
  const cols = t.cols.slice().sort(function (a, b) { return colTotal(b) - colTotal(a); }).slice(0, maxCols);
  const max = rows.reduce(function (m, r) { return cols.reduce(function (m2, c) { const k = t.cells[r + "\u0000" + c]; return Math.max(m2, k ? k.value : 0); }, m); }, 0) || 1;
  const shade = function (v) { if (!v) return "transparent"; const i = Math.min(SEQUENTIAL.length - 1, Math.floor((v / max) * SEQUENTIAL.length)); return SEQUENTIAL[i]; };
  const gaps = rows.reduce(function (n, r) { return n + cols.filter(function (c) { return !t.cells[r + "\u0000" + c]; }).length; }, 0);
  const th = { fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", padding: "4px 6px", textAlign: "center", borderBottom: "1px solid var(--line-rule)", whiteSpace: "nowrap", fontWeight: 400 };
  const cell = t.cells;
  const pick = function (r, c) { if (!interactive) return; const k = cell[r + "\u0000" + c]; const next = sel && sel.r === r && sel.c === c ? null : { r: r, c: c, items: k ? k.items : [] }; setSel(next); if (onSelect) onSelect(next); };
  return React.createElement("figure", { style: { margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: 0 } },
    React.createElement("figcaption", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" } },
      React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-caption)" } },
        caption || (DIMENSION_LABELS[rowDim] || rowDim) + " × " + (DIMENSION_LABELS[colDim] || colDim)),
      React.createElement("span", { style: { display: "inline-flex", gap: 6, alignItems: "center" } },
        React.createElement(QualityBadge, { label: (DIMENSION_LABELS[rowDim] || rowDim) + " " + (DIMENSION_GRADE[rowDim] || "") + " · " + (DIMENSION_LABELS[colDim] || colDim) + " " + (DIMENSION_GRADE[colDim] || "") }),
        React.createElement(QualityBadge, { grade: grade }))),
    React.createElement("div", { style: { overflowX: "auto" } },
      React.createElement("table", { style: { borderCollapse: "collapse", width: "100%", background: "var(--paper)", border: "1px solid var(--line-card)" } },
        React.createElement("thead", null, React.createElement("tr", null,
          React.createElement("th", { style: Object.assign({}, th, { textAlign: "left" }) }, (DIMENSION_LABELS[rowDim] || rowDim) + " ↓ · " + (DIMENSION_LABELS[colDim] || colDim) + " →"),
          cols.map(function (c) { return React.createElement("th", { key: c, style: th }, c); }),
          React.createElement("th", { style: Object.assign({}, th, { fontFamily: "var(--font-mono)" }) }, "Σ"))),
        React.createElement("tbody", null, rows.map(function (r) {
          return React.createElement("tr", { key: r },
            React.createElement("th", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-display)", padding: "5px 8px", textAlign: "left", borderBottom: "1px solid var(--line-hairline)", fontWeight: 500, whiteSpace: "nowrap" } }, r),
            cols.map(function (c) {
              const k = cell[r + "\u0000" + c], v = k ? k.value : 0, bg = shade(v), dark = d3 ? isDarkFill(d3, bg) : false;
              const on = sel && sel.r === r && sel.c === c;
              return React.createElement("td", { key: c, onClick: function () { pick(r, c); }, title: r + " × " + c + (k ? " · " + fmt(v) : " · 空格"),
                style: { textAlign: "center", padding: "6px 4px", fontFamily: "var(--font-mono)", fontSize: 11.5, borderBottom: "1px solid var(--line-hairline)", borderLeft: "1px solid var(--line-hairline)",
                  background: bg, color: !k ? "var(--text-muted)" : dark ? "var(--paper)" : "var(--charcoal)", cursor: interactive ? "pointer" : "default",
                  outline: on ? "2px solid var(--gold)" : "none", outlineOffset: -2, minWidth: 34 } },
                k ? fmt(v) : showGaps ? "·" : "");
            }),
            React.createElement("td", { style: { textAlign: "right", padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-muted)", borderBottom: "1px solid var(--line-hairline)", borderLeft: "1px solid var(--line-rule)" } }, fmt(rowTotal(r))));
        })))),
    sel ? React.createElement("div", { style: { border: "1px solid var(--line-card)", background: "var(--paper)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 } },
      React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-display)", fontWeight: 500 } }, sel.r + " × " + sel.c + " · " + (sel.items.length ? sel.items.length + " 项" : "空格 — 研发补缺候选")),
      sel.items.length ? React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, sel.items.slice(0, 24).map(function (it, i) {
        return React.createElement("span", { key: i, style: { fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-700)", border: "1px solid var(--line-hairline)", padding: "1px 7px", background: "var(--surface)" } }, typeof it === "string" ? it : it[labelKey] || it.name || it.sku || "—");
      }), sel.items.length > 24 ? React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" } }, "+" + (sel.items.length - 24)) : null) : null) : null,
    React.createElement("span", { style: { fontSize: "var(--text-3xs)", color: "var(--text-muted)", lineHeight: 1.5 } },
      [scope ? "口径：" + scope : null, showGaps ? "「·」= 空格，" + gaps + " 处研发补缺候选" : null, "颜色深浅 = " + (measure ? "度量" : "规格行数") + "，只分定序不读精确值", note].filter(Boolean).join(" · ")));
}
