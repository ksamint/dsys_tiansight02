The 90 天行动清单 table — every row must carry an owner, a deadline and an acceptance metric.

```jsx
<LedgerTable caption="90 天行动清单"
  columns={[{ key: "action", label: "动作" }, { key: "owner", label: "责任人" },
            { key: "due", label: "期限", mono: true }, { key: "kpi", label: "验收指标" }]}
  rows={[{ action: "重排午市套餐结构", owner: "运营总监", due: "D+30", kpi: "午市客单 +8%" }]}
  footer="数据来源：收银流水 2025-03 至 2025-08，含平台结算单。" />
```
