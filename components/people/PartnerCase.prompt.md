One partner's case study — the evidence-carrying version of a testimonial.

```jsx
<PartnerCase brand="韵 1980 新派淮扬菜" kind="新派淮扬菜" stores={7} since="2024-09"
  summary="午市结构与折扣叠加同时改动，两个季度内利润率回到目标区间。"
  metrics={[{ label: "午市客单", before: "68 元", after: "74 元", delta: "+8.8%" },
            { label: "折扣率", before: "6.7%", after: "4.9%", delta: "-1.8pt", tone: "loss" }]}
  actions={["重排午市套餐结构", "收紧平台满减叠加"]}
  quote={{ text: "报告分析得非常细，结论有证据。", by: "张总", role: "餐饮老板" }} />
```

Every metric needs a real baseline — a bare "after" number breaks the brand's evidence rule.
Partner names come from the supplied list only.
