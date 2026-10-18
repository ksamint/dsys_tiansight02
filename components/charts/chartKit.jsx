import React from "react";

/* 侍天 chart grammar. Every d3 chart in this system draws through these helpers so
   axes, margins, tones and type are identical across the report, the site and slides.
   d3 v7 is expected on window (CDN); Sankey additionally needs d3-sankey (see Sankey.jsx).
   Grammar follows 《智能分析流水线与可视化图型体系》Part B: pick the reader's TASK first,
   then the mark, then the chart — never the other way round. */

/* Tones. Default set (guide §5): 1 series = 明金, 2 = + 玄墨, 3 = + 朱红.
   Semantic set is report-only, for when 增长 must be told from 关注. */
export const CHART_TONES = {
  key: "var(--gold-hi)", charcoal: "var(--charcoal)", seal: "var(--seal)",
  gold: "var(--gold)", bronze: "var(--gold)",
  growth: "var(--growth-500)", loss: "var(--loss-500)", caution: "var(--caution-500)",
  datum: "var(--datum-500)", muted: "var(--parchment-400)"
};

/* Literal hex for d3 interpolation, which cannot read CSS custom properties.
   Values mirror tokens/colors.css exactly. */
export const CHART_HEX = {
  key: "#D4A862", charcoal: "#17130D", seal: "#8C3228",
  gold: "#76551F", bronze: "#76551F",
  growth: "#4E6B3F", loss: "#8C3228", caution: "#B98B2A", datum: "#6E6355", muted: "#D6C6A4",
  goldLight: "#F3E7CF", goldDeep: "#3F2D0F", paper: "#FFFDF8", field: "#EFE6D2",
  grid: "rgba(23,19,13,.18)", rule: "rgba(23,19,13,.34)", ink: "#3A332A", mutedInk: "#706758"
};
/* Ordered series palette: 明金 → 玄墨 → 朱红, then muted steps. Never a rainbow. */
export const SERIES_ORDER = ["key", "charcoal", "seal", "datum", "muted"];
/* Single-hue sequential ramp (quantity) and the one diverging pair (loss ↔ growth). */
export const SEQUENTIAL = ["#F3E7CF", "#D4A862", "#A8842F", "#76551F", "#3F2D0F"];
export const DIVERGING = ["#8C3228", "#F4F0E7", "#4E6B3F"];

export const CHART_MARGIN = { top: 16, right: 20, bottom: 34, left: 52 };

export const AXIS_LABEL = { fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".02em", fill: CHART_HEX.mutedInk };
export const VALUE_LABEL = { fontFamily: "var(--font-numeral)", fontSize: 11, fill: CHART_HEX.ink };

export function tone(name) { return CHART_HEX[name] || CHART_HEX.gold; }
export function seriesTone(i) { return CHART_HEX[SERIES_ORDER[i % SERIES_ORDER.length]]; }

/* L1 reading tasks → first-choice chart in this kit (spec B2 / B6). */
export const TASK_CHARTS = {
  comparison: { label: "比较", charts: ["BarSeries", "Dumbbell", "FacetBars"] },
  ranking: { label: "排序", charts: ["BarSeries", "SlopeChart"] },
  composition: { label: "构成", charts: ["StackedBars", "Treemap", "Donut"] },
  distribution: { label: "分布", charts: ["Histogram", "BoxPlot"] },
  trend: { label: "趋势", charts: ["TrendLine", "Sparkline", "SlopeChart"] },
  relationship: { label: "关系", charts: ["Scatter", "Heatmap", "Matrix2x2"] },
  deviation: { label: "偏差", charts: ["DivergingBars", "Waterfall"] },
  flow: { label: "流转", charts: ["Sankey", "Waterfall", "Funnel"] },
  hierarchy: { label: "层级", charts: ["Treemap"] },
  network: { label: "网络", charts: ["Heatmap"] },
  interval: { label: "时段", charts: ["Gantt"] },
  uncertainty: { label: "不确定性", charts: ["ForecastCorridor"] }
};
/* Decision matrix B6: task × data shape → chart name. shape ∈ q1 | q2 | qc | qt | cc */
export function chartFor(task, shape) {
  const M = {
    comparison: { q2: "Scatter", qc: "BarSeries", qt: "TrendLine", cc: "FacetBars" },
    ranking: { qc: "BarSeries", qt: "SlopeChart" },
    composition: { qc: "StackedBars", qt: "StackedBars", cc: "Treemap" },
    distribution: { q1: "Histogram", q2: "Scatter", qc: "BoxPlot", qt: "FacetBars", cc: "Heatmap" },
    relationship: { q2: "Scatter", qc: "BoxPlot", qt: "FacetBars", cc: "Heatmap" },
    deviation: { qc: "DivergingBars", qt: "TrendLine" },
    flow: { qc: "Funnel", cc: "Sankey" },
    hierarchy: { qc: "Treemap" },
    network: { cc: "Heatmap" },
    interval: { qt: "Gantt" },
    uncertainty: { qt: "ForecastCorridor" }
  };
  return (M[task] || {})[shape] || null;
}

/* Dimension analysis: roll a flat fact table up by 1–2 dimensions.
   rollupDims(rows, ["市别","区域"], "带率", "mean") →
   [{ dim: "午市", items: [{ label: "城北", value: 0.31, n: 120 }, …] }, …] */
export function rollupDims(rows, dims, measure, agg) {
  agg = agg || "sum";
  const val = typeof measure === "function" ? measure : function (r) { return +r[measure] || 0; };
  const reduce = function (list) {
    if (!list.length) return 0;
    const vs = list.map(val);
    if (agg === "count") return list.length;
    if (agg === "mean") return vs.reduce(function (a, b) { return a + b; }, 0) / vs.length;
    if (agg === "max") return Math.max.apply(null, vs);
    if (agg === "min") return Math.min.apply(null, vs);
    if (agg === "median") { const s = vs.slice().sort(function (a, b) { return a - b; }); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
    return vs.reduce(function (a, b) { return a + b; }, 0);
  };
  const d0 = dims[0], d1 = dims[1];
  const outer = {};
  rows.forEach(function (r) { const k = d0 ? String(r[d0]) : "全部"; (outer[k] = outer[k] || []).push(r); });
  return Object.keys(outer).map(function (k) {
    const list = outer[k];
    if (!d1) return { dim: k, items: [{ label: k, value: reduce(list), n: list.length }] };
    const inner = {};
    list.forEach(function (r) { const j = String(r[d1]); (inner[j] = inner[j] || []).push(r); });
    return { dim: k, items: Object.keys(inner).map(function (j) { return { label: j, value: reduce(inner[j]), n: inner[j].length }; }) };
  });
}
export const Rollup = rollupDims;

/* 维度分析 contract — keys verbatim from vanahom-fb-hom01
   docs/methodologies/analysis-dimensions-field-contract-v1.md (矩阵洞察 v3 CATEGORY_DIMENSIONS +
   SKU_DIM_META). Methodology and code must not drift on these names. */
export const DIMENSION_LABELS = {
  category: "品类", station: "档口", primary_scene: "主场景", scene: "场景标签", flavor: "主味型",
  flavor_secondary: "辅味型", style: "感官风格", ingredient: "食材品类", craft: "工艺", price_band: "价格带",
  margin_band: "毛利带", brand_fit_band: "品牌匹配", operation_band: "运营复杂度", adaptation_status: "适配状态",
  role: "主辅佐引", role_proxy: "经营角色（代理）", months_present: "出现月份", analysis_cohort: "分析域"
};
/* Data grade of each dimension: RAW (POS / menu master), ANN (annotated, editable), DER (derived, read-only). */
export const DIMENSION_GRADE = {
  category: "RAW", station: "ANN", scene: "ANN", flavor: "ANN", craft: "ANN", ingredient: "ANN", role: "ANN",
  primary_scene: "DER", flavor_secondary: "DER", style: "DER", price_band: "DER", margin_band: "DER",
  brand_fit_band: "DER", operation_band: "DER", adaptation_status: "DER", role_proxy: "DER", months_present: "RAW", analysis_cohort: "DER"
};
/* The seven structure presets (V3_STRUCTURE_PRESETS) — row × column of the 九宫格. */
export const STRUCTURE_PRESETS = [
  ["ingredient", "flavor"], ["ingredient", "craft"], ["ingredient", "price_band"], ["ingredient", "primary_scene"],
  ["flavor", "primary_scene"], ["craft", "primary_scene"], ["price_band", "primary_scene"]
];
/* Cross-tab a SKU list by two dimensions. Returns { rows, cols, cells: { "r\u0000c": { n, value, items } } }.
   Default measure is the SKU count (九宫 denominator = 菜品 cohort only — filter upstream). */
export function crossTab(list, rowDim, colDim, measure, agg) {
  const rows = [], cols = [], cells = {};
  const val = measure ? (typeof measure === "function" ? measure : function (r) { return +r[measure] || 0; }) : null;
  list.forEach(function (r) {
    const a = r[rowDim] == null || r[rowDim] === "" ? "未标" : String(r[rowDim]), b = r[colDim] == null || r[colDim] === "" ? "未标" : String(r[colDim]);
    if (rows.indexOf(a) < 0) rows.push(a); if (cols.indexOf(b) < 0) cols.push(b);
    const k = a + "\u0000" + b, c = cells[k] || (cells[k] = { n: 0, sum: 0, items: [] });
    c.n += 1; c.items.push(r); if (val) c.sum += val(r);
  });
  Object.keys(cells).forEach(function (k) { const c = cells[k]; c.value = !val ? c.n : agg === "mean" ? c.sum / c.n : c.sum; });
  return { rows: rows, cols: cols, cells: cells };
}

/* Resolve d3, waiting for a CDN script that may still be loading. `need` names a plugin
   that must also be present on d3 (e.g. "sankey"). */
export function useD3(need) {
  const ok = function (d) { return d && (!need || typeof d[need] === "function"); };
  const [d3, setD3] = React.useState(function () { return typeof window !== "undefined" && ok(window.d3) ? window.d3 : null; });
  React.useEffect(function () {
    if (d3) return;
    var t = setInterval(function () { if (ok(window.d3)) { setD3(window.d3); clearInterval(t); } }, 60);
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

/* High-performance layer: a device-pixel-ratio-aware <canvas> drawn once per data/size
   change, positioned under the SVG axes. Used by Scatter and Gantt above their SVG
   thresholds so 10,000+ marks paint in one frame instead of 10,000 DOM nodes. */
export function CanvasLayer({ width, height, draw, deps }) {
  const ref = React.useRef(null);
  React.useEffect(function () {
    var c = ref.current; if (!c || !draw) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr); c.height = Math.round(height * dpr);
    var ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
    draw(ctx, { width: width, height: height, dpr: dpr });
  }, [width, height].concat(deps || []));
  return React.createElement("canvas", { ref: ref, "aria-hidden": "true", style: { position: "absolute", left: 0, top: 0, width: width, height: height, pointerEvents: "none" } });
}

/* Evidence / quality corner badge (spec A5: every chart carries 口径 + quality flag).
   grade: E1 直接计量 · E2 抽样观测 · E3 外部参照 · E4 设计推断; degraded marks a proxy field. */
export function QualityBadge({ grade, degraded, label }) {
  if (!grade && !degraded && !label) return null;
  const warn = degraded || grade === "E4";
  return React.createElement("span", {
    title: grade ? "EGA." + grade : undefined,
    style: { display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 0, lineHeight: 1.4,
      color: warn ? "var(--seal)" : "var(--gold-deep)", border: "1px solid " + (warn ? "var(--seal)" : "var(--line-card)"), borderRadius: "var(--radius-pill)", padding: "1px 8px", whiteSpace: "nowrap" }
  }, [grade ? "EGA." + grade : null, degraded ? "降级 · 代理字段" : null, label].filter(Boolean).join(" · "));
}

/* Chart frame: caption row (with optional quality badge), measured SVG over optional
   canvas layers, then the source / 口径 note. Every real figure carries a note. */
export function ChartFrame({ caption, note, scope, grade, degraded, height, children, layers, svgRef, width }) {
  return React.createElement("figure", { style: { margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: 0 } },
    caption || grade || degraded ? React.createElement("figcaption", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" } },
      React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-caption)" } }, caption),
      React.createElement(QualityBadge, { grade: grade, degraded: degraded })) : null,
    React.createElement("div", { style: { position: "relative", width: width, height: height } },
      layers || null,
      React.createElement("svg", { ref: svgRef, width: width, height: height, style: { display: "block", overflow: "visible", position: "relative" } }, children)),
    note || scope ? React.createElement("span", { style: { fontSize: "var(--text-3xs)", color: "var(--text-muted)", lineHeight: 1.5 } },
      [scope ? "口径：" + scope : null, note].filter(Boolean).join(" · ")) : null
  );
}

/* Legend as HTML, NOT inside the SVG: flex + wrap degrades correctly at any width. */
export function ChartLegend({ items = [], style: extra }) {
  if (!items.length) return null;
  return React.createElement("div", { style: Object.assign({ display: "flex", flexWrap: "wrap", gap: "6px 18px", paddingTop: 2 }, extra) },
    items.map(function (it, i) {
      return React.createElement("span", { key: i, style: { display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0, fontFamily: "var(--font-body)", fontSize: 11, color: "var(--ink-600)", whiteSpace: "nowrap" } },
        it.dashed
          ? React.createElement("span", { style: { width: 16, height: 0, borderTop: "2px dashed " + tone(it.tone), flexShrink: 0 } })
          : it.band
            ? React.createElement("span", { style: { width: 16, height: 10, background: tone(it.tone), opacity: .25, flexShrink: 0 } })
            : React.createElement("span", { style: { width: 10, height: 10, borderRadius: 1, background: tone(it.tone), flexShrink: 0 } }),
        React.createElement("span", null, it.label));
    }));
}

/* Relative luminance of any CSS color d3 can parse — light vs dark ink on a filled cell. */
export function isDarkFill(d3, color) {
  try {
    var c = d3.color(color); if (!c) return false;
    var rgb = c.rgb();
    var f = function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return (0.2126 * f(rgb.r) + 0.7152 * f(rgb.g) + 0.0722 * f(rgb.b)) < 0.42;
  } catch (e) { return false; }
}

/* Bottom + left axes drawn as hairlines with mono ticks. No gridlines by default.
   Bars always start at zero (anti-pattern B7: never a truncated baseline on length marks). */
export function Axes({ x, y, width, height, margin = CHART_MARGIN, xTicks = 6, yTicks = 4, grid = false, xFormat, yFormat, band = false, yBand = false }) {
  const iw = width - margin.left - margin.right;
  const ih = height - margin.top - margin.bottom;
  const yt = yBand ? (y ? y.domain() : []) : (y && y.ticks ? y.ticks(yTicks) : (y && y.domain ? y.domain() : []));
  const xt = band ? (x ? x.domain() : []) : (x && x.ticks ? x.ticks(xTicks) : []);
  return React.createElement("g", null,
    grid && !yBand ? yt.map(function (v, i) {
      return React.createElement("line", { key: "g" + i, x1: margin.left, x2: margin.left + iw, y1: y(v), y2: y(v), stroke: CHART_HEX.grid, strokeWidth: 1 });
    }) : null,
    React.createElement("line", { x1: margin.left, x2: margin.left + iw, y1: margin.top + ih, y2: margin.top + ih, stroke: CHART_HEX.rule, strokeWidth: 1 }),
    yt.map(function (v, i) {
      const cy = yBand ? y(v) + y.bandwidth() / 2 : y(v);
      return React.createElement("text", Object.assign({ key: "y" + i, x: margin.left - 10, y: cy, dy: "0.32em", textAnchor: "end" }, yBand ? AXIS_LABEL : Object.assign({}, VALUE_LABEL, { fontSize: 10 })),
        yFormat ? yFormat(v) : v);
    }),
    xt.map(function (v, i) {
      const cx = band ? x(v) + x.bandwidth() / 2 : x(v);
      return React.createElement("text", Object.assign({ key: "x" + i, x: cx, y: margin.top + ih + 18, textAnchor: "middle" }, band ? AXIS_LABEL : Object.assign({}, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk })), xFormat ? xFormat(v) : v);
    })
  );
}
