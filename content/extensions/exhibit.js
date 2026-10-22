// Source-bound exhibit components.
(function(){
const h = (...a) => React.createElement(...a);
const C = { gold: "var(--gold)", key: "var(--gold-hi)", seal: "var(--seal)", ink: "var(--charcoal)", muted: "var(--ink-muted)", paper: "var(--paper)", hair: "var(--line)" };
const ZONES = [["收货", "验收称重"], ["储存", "冷藏冷冻"], ["加工", "生熟分开"], ["烹饪", "热厨工位"], ["出品", "检验装盘"], ["餐厅", "前厅"]];
const zoneChart = () => {
  const W = 120, G = 22, Y = 30, H = 96, x = (i) => i * (W + G), mid = (i) => x(i) + W / 2;
  const txt = (p, s, c) => h("text", Object.assign({ textAnchor: "middle", style: Object.assign({ fontFamily: "var(--font-body)" }, s) }, p), c);
  const box = (i, y, name, sub, front) => h("g", { key: name },
    h("rect", { x: x(i), y, width: W, height: H, rx: 2, fill: front ? "none" : C.paper, stroke: C.gold, strokeWidth: 1.2, strokeDasharray: front ? "5 4" : null }),
    txt({ x: mid(i), y: y + 42 }, { fontSize: 26, fontWeight: 600, fill: C.ink }, name), txt({ x: mid(i), y: y + 72 }, { fontSize: 22, fill: C.muted }, sub));
  const marker = (id, c) => h("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, h("path", { d: "M0 0L10 5L0 10z", fill: c }));
  const by = 236;
  return h("svg", { viewBox: "0 0 " + (x(5) + W) + " 400", style: { width: "100%", height: "auto", overflow: "visible" } },
    h("defs", null, marker("ex-a", C.gold), marker("ex-b", C.seal)),
    ZONES.map(([n, s], i) => box(i, Y, n, s, i === 5)),
    ZONES.slice(0, 5).map((_, i) => h("line", { key: i, x1: x(i) + W + 2, y1: Y + H / 2, x2: x(i + 1) - 3, y2: Y + H / 2, stroke: C.gold, strokeWidth: 2, markerEnd: "url(#ex-a)" })),
    box(4, by, "洗消", "清洗消毒"),
    h("path", { d: "M" + mid(5) + " " + (Y + H + 2) + " V" + (by + H / 2) + " H" + (x(4) + W + 3), fill: "none", stroke: C.seal, strokeWidth: 2, strokeDasharray: "7 5", markerEnd: "url(#ex-b)" }),
    txt({ x: mid(5) + 14, y: by - 14, textAnchor: "start" }, { fontSize: 22, fill: C.seal }, "收餐"),
    h("line", { x1: mid(4), y1: by - 2, x2: mid(4), y2: Y + H + 4, stroke: C.gold, strokeWidth: 1.4, strokeDasharray: "2 4", markerEnd: "url(#ex-a)" }),
    txt({ x: mid(4) - 12, y: by - 52, textAnchor: "end" }, { fontSize: 22, fill: C.gold }, "洁净餐具"),
    h("g", { transform: "translate(0 372)" },
      h("line", { x1: 0, y1: -6, x2: 44, y2: -6, stroke: C.gold, strokeWidth: 2 }), txt({ x: 56, y: 0, textAnchor: "start" }, { fontSize: 22, fill: C.muted }, "食物流向（单向）"),
      h("line", { x1: 300, y1: -6, x2: 344, y2: -6, stroke: C.seal, strokeWidth: 2, strokeDasharray: "7 5" }), txt({ x: 356, y: 0, textAnchor: "start" }, { fontSize: 22, fill: C.muted }, "餐具回收（独立通道）")));
};
// 图文要点页：由设计系统的 SlideFrame / SlideTitle 组成，左文右图。
const PhotoPoints = function PhotoPoints({ eyebrow, title, points = [], image, caption, page }) {
  const D = window.TIANSIGHTDesignSystem_e0a760;
  if (!D || !D.SlideFrame || !D.SlideTitle) return null;
  return h(D.SlideFrame, { ground: "parchment", eyebrow, page },
    h("div", { style: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "400px minmax(0,1fr)", gap: 48 } },
      h("div", { style: { display: "flex", flexDirection: "column", gap: 22, minHeight: 0 } },
        h(D.SlideTitle, { size: "sm", style: { whiteSpace: "pre-line" } }, title),
        h("ol", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", borderTop: "1.5px solid var(--gold-500)" } },
          points.map((p, i) => h("li", { key: i, style: { display: "grid", gridTemplateColumns: "44px minmax(0,1fr)", columnGap: 8, padding: "12px 0", borderBottom: "1px solid var(--line-hairline)" } },
            h("span", { style: { fontFamily: "var(--font-numeral)", fontSize: 20, color: "var(--text-accent)", paddingTop: 3 } }, String(i + 1).padStart(2, "0")),
            h("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
              h("span", { style: { fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--charcoal)", letterSpacing: "var(--tracking-cjk-body)" } }, p.label),
              h("span", { style: { fontSize: 20, lineHeight: 1.5, color: "var(--ink-800)", textWrap: "pretty" } }, p.body)))))),
      h("figure", { style: { margin: 0, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 } },
        h("div", { style: { flex: 1, minHeight: 0, borderRadius: "var(--radius)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
          h("img", { src: D.slideSrc ? D.slideSrc(image) : image, alt: caption || "", style: { width: "100%", height: "100%", objectFit: "contain", display: "block" } })),
        caption ? h("figcaption", { style: { fontSize: 19, color: "var(--text-muted)" } }, caption) : null)));
};

window.TIANSIGHT_EXT=window.TIANSIGHT_EXT||{};window.TIANSIGHT_EXT.exhibit={PhotoPoints,zoneChart};
})();
