Flow with conservation — 曝光 → 到店 → 成交, 源文件 → 分析模块, 对账 differences — built to the standard of the reference d3 flow diagrams: gradient links, hover or click a node to isolate every path through it and read its in/out ledger, hover a link for its value and share of the source's outflow, stage headers per column, and a 朱红 tail on any node whose inflow exceeds its outflow so leakage is visible.

```html
<script src="https://unpkg.com/d3@7.9.0/dist/d3.min.js"></script>
<script src="https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js"></script>
```
```jsx
<Sankey caption="渠道流向" unit=" 单" stages={["来源", "触达", "到店", "结果"]} groupTone={{ 线上: "key", 线下: "gold", 结果: "charcoal" }}
  nodes={[{ id: "点评", group: "线上" }, { id: "抖音", group: "线上" }, { id: "自然到店", group: "线下" }, { id: "到店", group: "结果" }, { id: "成交", group: "结果" }, { id: "未完成", tone: "loss" }]}
  links={[{ source: "点评", target: "到店", value: 620 }, { source: "抖音", target: "到店", value: 200 }, { source: "自然到店", target: "到店", value: 610 }, { source: "到店", target: "成交", value: 1120 }, { source: "到店", target: "未完成", value: 310, tone: "loss" }]} />
```

Keep one unit on every link; keep 未知 / 未完成 as explicit nodes rather than dropping them. Ungrouped nodes are gold; `group` colours by category (明金 → 玄墨 → 朱红 …), `tone: "loss"` marks leakage links. Links draw in once on reveal and never animate again; highlighting is instant. Renders a 朱红 notice if d3-sankey is missing.
