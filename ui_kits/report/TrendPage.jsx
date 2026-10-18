const { TrendLine, StackedBars, Waterfall, Heatmap, Donut, Gauge, Funnel, Sparkline, MetricRow, Badge } = window.TIANSIGHTDesignSystem_703ad4;

const M = ["03", "04", "05", "06", "07", "08"];
const mk = function (a) { return M.map(function (m, i) { return { label: m, value: a[i] }; }); };

function TrendPage() {
  const rows = ["旗舰店", "C 店", "F 店", "D 店", "E 店"];
  const seed = [4.2,2.1,-1.4,3.8,5.1,6.2, 1.2,0.4,-2.2,1.9,2.4,3.1, 0.8,1.1,0.2,-0.6,1.4,2.0, -3.4,-4.1,-2.8,-1.2,0.6,1.4, -5.1,-4.4,-3.9,-4.8,-2.2,-1.6];
  const vals = {};
  rows.forEach(function (r, ri) { M.forEach(function (c, ci) { vals[r + "|" + c] = seed[ri * 6 + ci]; }); });
  return React.createElement(React.Fragment, null,
    React.createElement(PageHead, {
      eyebrow: "分析维度 / 趋势与归因", title: "逐月走势，逐店对比",
      subtitle: "同一口径下的走势、结构、归因与达成；每张图都可下钻到原始凭证。", meta: "D3 CHARTS · V4.2"
    }),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "var(--space-6)" } },
      React.createElement(Panel, { caption: "走势", title: "逐月营收", note: "本店 vs 同业均值" },
        React.createElement(TrendLine, {
          height: 240, unit: "万",
          series: [
            { name: "本店", tone: "growth", area: true, emphasis: true, points: mk([72, 78, 74, 83, 89, 92]) },
            { name: "同业均值", tone: "muted", dashed: true, points: mk([70, 71, 73, 74, 75, 76]) }
          ]
        })
      ),
      React.createElement(Panel, { caption: "结构", title: "渠道结构占比", note: "归一化至 100%" },
        React.createElement(StackedBars, {
          height: 240, normalize: true, keys: ["堂食", "外卖", "团购"],
          tones: { 堂食: "growth", 外卖: "caution", 团购: "loss" },
          data: M.map(function (m, i) { return { label: m, 堂食: 52 + i, 外卖: 30 - i * .5, 团购: 18 - i * .5 }; })
        })
      ),
      React.createElement(Panel, { caption: "归因", title: "利润流失归因", note: "单位：万 / 季", span: true },
        React.createElement(Waterfall, {
          height: 290, start: 486, unit: "万",
          steps: [
            { label: "折扣叠加", value: -24.6 }, { label: "食材损耗", value: -12.1 },
            { label: "人效排班", value: -6.4 }, { label: "套餐结构", value: 18.2 }, { label: "会员唤醒", value: 13.1 }
          ]
        })
      ),
      React.createElement(Panel, { caption: "逐店逐月", title: "同比变化", note: "绿为改善，红为恶化", span: true },
        React.createElement(Heatmap, { diverging: true, unit: "%", rows: rows, columns: M, values: vals })
      ),
      React.createElement(Panel, { caption: "客群", title: "构成与转化" },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-6)" } },
          React.createElement(Donut, {
            size: 170, thickness: 24, centerValue: "31.2%", centerLabel: "会员占比",
            data: [
              { label: "会员", value: 31.2, tone: "growth" },
              { label: "平台新客", value: 44.1, tone: "caution" },
              { label: "散客", value: 24.7, tone: "muted" }
            ]
          }),
          React.createElement(Funnel, {
            stages: [
              { label: "曝光", value: 12400 }, { label: "进店", value: 3180 },
              { label: "下单", value: 2260 }, { label: "复购", value: 705 }
            ]
          })
        )
      ),
      React.createElement(Panel, { caption: "达成", title: "关键指标达成" },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-5)" } },
          React.createElement("div", { style: { display: "flex", gap: "var(--space-6)", flexWrap: "wrap" } },
            React.createElement(Gauge, { size: 160, value: 92, target: 100, unit: "%", label: "午市客单" }),
            React.createElement(Gauge, { size: 160, value: 104, target: 100, unit: "%", label: "折扣控制" })
          ),
          React.createElement("div", null,
            React.createElement(MetricRow, {
              dense: true, label: "午市客流", sublabel: "旗舰店 · 工作日", value: "132", unit: "人/日", delta: "+8.4%", deltaTone: "growth",
              note: React.createElement(Sparkline, { values: [112, 118, 109, 124, 131, 132], toneName: "growth" })
            }),
            React.createElement(MetricRow, {
              dense: true, label: "折扣让利", value: "4.9", unit: "%", delta: "-1.8pt", deltaTone: "loss",
              note: React.createElement(Sparkline, { values: [6.7, 6.4, 6.1, 5.6, 5.2, 4.9], toneName: "loss" })
            })
          )
        )
      )
    )
  );
}

Object.assign(window, { TrendPage });
