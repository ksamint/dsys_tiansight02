import React from "react";
import { ChartFrame, ChartLegend, tone, useD3, useWidth, AXIS_LABEL, VALUE_LABEL, CHART_HEX, SERIES_ORDER } from "./chartKit.jsx";

/* 流转 · Sankey, built to the standard of the reference d3 flow diagrams (Bostock's energy
   Sankey, the ODI / Reuters funnel pieces): links are source→target gradients, hovering
   or clicking a node isolates its full upstream and downstream paths and prints the in/out
   ledger, hovering a link prints its value and its share of the source's outflow, each
   column carries a stage header, labels sit on the outer side of their column, nodes print
   value + share of the first stage, and flow that leaves a node unaccounted is shown as a
   朱红 "未分配" tail so conservation is visible, not assumed. Links draw in once on reveal
   (--dur-reveal) and never animate again. Requires d3-sankey on top of d3:
   <script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script> */
export function Sankey({ nodes = [], links = [], height = 360, caption, note, scope, grade, unit = "", format, nodeWidth = 14, nodePadding = 16, align = "justify", stages = [], groupTone = {}, showShare = true, showBalance = true, minLabelHeight = 9, linkOpacity = .38, sortLinks = true, reveal = true }) {
  const d3 = useD3("sankey");
  const plain = useD3();
  const [wrapRef, width] = useWidth(640);
  const [hover, setHover] = React.useState(null);
  const [pin, setPin] = React.useState(null);
  const [drawn, setDrawn] = React.useState(!reveal);
  const uid = React.useMemo(function () { return "sk" + Math.random().toString(36).slice(2, 8); }, []);
  React.useEffect(function () { if (reveal && d3 && !drawn) { var t = setTimeout(function () { setDrawn(true); }, 40); return function () { clearTimeout(t); }; } }, [d3, reveal, drawn]);
  const m = { top: stages.length ? 30 : 10, right: 12, bottom: 10, left: 12 };
  const fmt = format || function (v) { return Math.round(v).toLocaleString() + unit; };
  const pct = function (v) { return (Math.round(v * 1000) / 10) + "%"; };
  let body = null, tip = null, legend = [];
  if (d3 && nodes.length && links.length) {
    const aligns = { justify: d3.sankeyJustify, left: d3.sankeyLeft, right: d3.sankeyRight, center: d3.sankeyCenter };
    const gen = d3.sankey().nodeId(function (d) { return d.id; }).nodeWidth(nodeWidth).nodePadding(nodePadding).nodeAlign(aligns[align] || d3.sankeyJustify)
      .extent([[m.left, m.top], [width - m.right, height - m.bottom]]);
    if (sortLinks) gen.linkSort(function (a, b) { return b.value - a.value; });
    const g = gen({ nodes: nodes.map(function (n) { return Object.assign({}, n); }), links: links.map(function (l) { return Object.assign({}, l); }) });
    const path = d3.sankeyLinkHorizontal();
    const depth0 = d3.min(g.nodes, function (n) { return n.depth; }), maxDepth = d3.max(g.nodes, function (n) { return n.depth; });
    const total = d3.sum(g.nodes.filter(function (n) { return n.depth === depth0; }), function (n) { return n.value; }) || 1;
    const groups = []; g.nodes.forEach(function (n) { if (n.group && groups.indexOf(n.group) < 0) groups.push(n.group); });
    const colorOf = function (n) { if (n.tone) return tone(n.tone); if (n.group) return groupTone[n.group] ? tone(groupTone[n.group]) : CHART_HEX[SERIES_ORDER[groups.indexOf(n.group) % SERIES_ORDER.length]]; return CHART_HEX.gold; };
    legend = groups.map(function (gr) { return { label: gr, tone: groupTone[gr] || SERIES_ORDER[groups.indexOf(gr) % SERIES_ORDER.length] }; });
    /* connected set for the focused node: every link on any path through it */
    const focus = pin || hover;
    let onLinks = null, onNodes = null;
    if (focus && focus.kind === "node") {
      onLinks = new Set(); onNodes = new Set([focus.node.index]);
      const walk = function (n, dir) { (dir === "down" ? n.sourceLinks : n.targetLinks).forEach(function (l) { if (onLinks.has(l.index)) return; onLinks.add(l.index); const nx = dir === "down" ? l.target : l.source; onNodes.add(nx.index); walk(nx, dir); }); };
      walk(focus.node, "down"); walk(focus.node, "up");
    } else if (focus && focus.kind === "link") { onLinks = new Set([focus.link.index]); onNodes = new Set([focus.link.source.index, focus.link.target.index]); }
    const dim = function (isOn) { return onLinks ? (isOn ? 1 : .18) : 1; };
    const balance = function (n) { const inn = d3.sum(n.targetLinks, function (l) { return l.value; }), out = d3.sum(n.sourceLinks, function (l) { return l.value; }); return { inn: inn, out: out, gap: n.targetLinks.length && n.sourceLinks.length ? inn - out : 0 }; };
    const stageX = d3.range(depth0, maxDepth + 1).map(function (dpt) { const col = g.nodes.filter(function (n) { return n.depth === dpt; }); return col.length ? (col[0].x0 + col[0].x1) / 2 : null; });
    body = React.createElement(React.Fragment, null,
      React.createElement("defs", null, g.links.map(function (l) {
        return React.createElement("linearGradient", { key: "g" + l.index, id: uid + "-l" + l.index, gradientUnits: "userSpaceOnUse", x1: l.source.x1, x2: l.target.x0 },
          React.createElement("stop", { offset: "0%", stopColor: l.tone ? tone(l.tone) : colorOf(l.source) }),
          React.createElement("stop", { offset: "100%", stopColor: l.tone ? tone(l.tone) : colorOf(l.target) }));
      })),
      stages.map(function (s, i) { return stageX[i] == null ? null : React.createElement("text", Object.assign({ key: "s" + i, x: stageX[i], y: m.top - 12, textAnchor: "middle" }, AXIS_LABEL, { fontSize: 10, letterSpacing: ".16em", fill: CHART_HEX.gold }), s); }),
      g.links.map(function (l) {
        const on = !onLinks || onLinks.has(l.index);
        return React.createElement("path", { key: "l" + l.index, d: path(l), fill: "none", stroke: "url(#" + uid + "-l" + l.index + ")", strokeWidth: Math.max(1, l.width),
          strokeOpacity: on ? (onLinks ? .72 : linkOpacity) : .06, pathLength: 1, strokeDasharray: reveal ? 1 : null, strokeDashoffset: reveal ? (drawn ? 0 : 1) : null,
          style: { transition: (reveal ? "stroke-dashoffset var(--dur-reveal) var(--ease-out) " + Math.min(l.index * 40, 400) + "ms, " : "") + "stroke-opacity var(--dur-fast) var(--ease-standard)", cursor: "pointer" },
          onMouseEnter: function () { setHover({ kind: "link", link: l }); }, onMouseLeave: function () { setHover(null); } },
          React.createElement("title", null, (l.source.label || l.source.id) + " → " + (l.target.label || l.target.id) + " · " + fmt(l.value)));
      }),
      g.nodes.map(function (n) {
        const on = !onNodes || onNodes.has(n.index), c = colorOf(n), h = Math.max(1, n.y1 - n.y0), right = n.depth > (depth0 + maxDepth) / 2 || n.depth === maxDepth;
        const b = balance(n), lx = right ? n.x0 - 8 : n.x1 + 8, anchor = right ? "end" : "start", showLbl = h >= minLabelHeight || on && onNodes;
        return React.createElement("g", { key: "n" + n.index, opacity: dim(on), style: { transition: "opacity var(--dur-fast) var(--ease-standard)", cursor: "pointer" },
          onMouseEnter: function () { setHover({ kind: "node", node: n }); }, onMouseLeave: function () { setHover(null); },
          onClick: function () { setPin(pin && pin.node && pin.node.index === n.index ? null : { kind: "node", node: n }); } },
          React.createElement("rect", { x: n.x0, y: n.y0, width: n.x1 - n.x0, height: h, fill: c, stroke: pin && pin.node && pin.node.index === n.index ? CHART_HEX.charcoal : CHART_HEX.paper, strokeWidth: 1 }),
          showBalance && b.gap > 0.5 ? React.createElement("rect", { x: n.x0, y: n.y1 - h * (b.gap / (b.inn || 1)), width: n.x1 - n.x0, height: h * (b.gap / (b.inn || 1)), fill: CHART_HEX.seal }, React.createElement("title", null, "未分配 " + fmt(b.gap))) : null,
          showLbl ? React.createElement("text", Object.assign({ x: lx, y: (n.y0 + n.y1) / 2, dy: h < 22 ? "0.32em" : "-0.15em", textAnchor: anchor }, AXIS_LABEL, { fill: CHART_HEX.ink, fontWeight: onNodes && focus.kind === "node" && focus.node.index === n.index ? 600 : 400 }), n.label || n.id) : null,
          showLbl && h >= 22 ? React.createElement("text", Object.assign({ x: lx, y: (n.y0 + n.y1) / 2, dy: "1.05em", textAnchor: anchor }, VALUE_LABEL, { fontSize: 10, fill: CHART_HEX.mutedInk }), fmt(n.value) + (showShare ? " · " + pct(n.value / total) : "")) : null);
      }));
    if (focus) {
      const rows = focus.kind === "node"
        ? [[focus.node.label || focus.node.id, fmt(focus.node.value) + " · " + pct(focus.node.value / total) + " of " + (stages[0] || "起点")]]
          .concat(focus.node.targetLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return ["← " + (l.source.label || l.source.id), fmt(l.value) + " · " + pct(l.value / focus.node.value)]; }))
          .concat(focus.node.sourceLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return ["→ " + (l.target.label || l.target.id), fmt(l.value) + " · " + pct(l.value / focus.node.value)]; }))
          .concat(balance(focus.node).gap > 0.5 ? [["未分配", fmt(balance(focus.node).gap)]] : [])
        : [[(focus.link.source.label || focus.link.source.id) + " → " + (focus.link.target.label || focus.link.target.id), fmt(focus.link.value)], ["占 " + (focus.link.source.label || focus.link.source.id) + " 流出", pct(focus.link.value / (d3.sum(focus.link.source.sourceLinks, function (l) { return l.value; }) || 1))], ["占总量", pct(focus.link.value / total)]];
      tip = React.createElement("div", { style: { position: "absolute", left: 0, bottom: 0, maxWidth: 260, background: "var(--paper)", border: "1px solid var(--line-card)", padding: "8px 10px", display: "grid", gridTemplateColumns: "auto auto", gap: "3px 14px", pointerEvents: "none", boxShadow: "var(--shadow-2)" } },
        rows.map(function (r, i) { return React.createElement(React.Fragment, { key: i },
          React.createElement("span", { style: { fontFamily: "var(--font-body)", fontSize: 11, color: i === 0 ? "var(--text-display)" : "var(--ink-700)", fontWeight: i === 0 ? 500 : 400 } }, r[0]),
          React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 10.5, color: r[0] === "未分配" ? "var(--seal)" : "var(--ink-700)", textAlign: "right" } }, r[1])); }));
    }
  } else if (plain && !d3) {
    body = React.createElement("text", Object.assign({ x: 12, y: 24 }, AXIS_LABEL, { fill: CHART_HEX.seal }), "Sankey 需要加载 d3-sankey（见 Sankey.prompt.md）");
  }
  return React.createElement("div", { ref: wrapRef, style: { width: "100%", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }, onMouseLeave: function () { setHover(null); } },
    React.createElement(ChartFrame, { caption: caption, note: note, scope: scope, grade: grade, width: width, height: height, layers: tip }, body),
    legend.length || showBalance ? React.createElement(ChartLegend, { items: legend.concat(showBalance ? [{ label: "未分配（流入 − 流出）", tone: "seal" }] : []).concat([{ label: pin ? "已固定 · 点击节点取消" : "悬停看路径 · 点击固定", tone: "muted", dashed: true }]) }) : null);
}
