# ADR 0002 · 1 + 3 + 3 只有一份记录：`content/positioning.json`

- 状态：已采纳 2026-11-06，2026-11-07 按业主口述改为 1 + 3 + 3 结构（schema `tiansight.positioning/2`）。记录文案由业主确认（`status: approved`）；企业介绍 deck 的发布审批仍按 `docs/maintaining.md` §8 由生产评审单独进行。
- 关联：ADR 0001 · `scripts/positioning_lib.py` · `scripts/build_positioning.py` · `content/decks/intro.json` · `website/index.html`

## 背景

业主的定位框架要同时进官网与企业介绍，且一处修改要处处生效。2026-11-06 的第一版是「三大模型 · 三大基础」，含人才模型与大量解释句。2026-11-07 业主改为：

- **1** 个基座：Table AI + OPC Global，全球专家与联盟生态基座；
- **3** 个模型及结果：经营模型 → 赚到钱，利润模型 → 留下利润，能力模型 → 持续发展（能力模型取代人才模型，聚焦人和组织的能力评估、发展与协同）；
- **3** 个底座：知识库、决策树、能力表，依次对应三个模型；
- 不要解释性文字。

## 决策

1. **一份结构化记录**：`content/positioning.json` 是 1 + 3 + 3 全部文案的唯一来源，位于内容层（ADR 0001 第 4 层）。它只存名称与短标签：`lead`（公式与一句标题）、`base`、三个 `models`（`outcome`、`keys`，以及各自的图示数据：经营的三个场景、利润的两个数据源与四步流向及复盘节奏、能力的人与组织、六类角色与组织转型）、三个 `foundations`（`under` 指向所在模型）。
2. **公式不对外显示**（业主 2026-11-07）：「1 + 3 + 3」只是记录的结构名，保存在 `lead.formula`，任何幻灯片、网页与下游页面都不显示它；视图与生成器只输出模型、底座与基座本身。合同测试断言视图不含该公式。
3. **门禁拒绝解释句**：`scripts/positioning_lib.py` 校验结构与顺序，并拒绝超过 16 字或带句末标点的标签。要写长句，就不属于这份记录。
4. **幻灯片引用，不抄写**：引用 `{"$positioning": "<view>"}` 由 `content_lib.resolve` 生成组件 props，同级字段只允许布局键。五个视图：`system:matrix`（三个模型、底座与基座总览）、`operating:steps`、`profit:steps`、`capability:steps`、`foundations:cards`。企业介绍与销售提案都引用这五页：企业介绍的总览在「问题」之后，销售提案的总览在「主张」之后；其余四页都在「第二大脑」之后。记录一改，所有引用它的 deck 的 `contentVersion` 随之改变，`latestApproved` 回到 null。
5. **官网分区由构建器生成**：`scripts/build_positioning.py` 把记录渲染为 `website/index.html` 中 `#models` 分区：立柱图（结果、模型、底座、基座四层，竖线贯通，不显示数字）与三个章节信息图（经营的三条示意曲线、利润的数据流与 30 日节奏、能力的评估 → 发展 → 协同循环与六类角色）。`--check` 在 `scripts/check.py` 8d。
6. **下游钉提交**：平台仓库（`ksamint/vanahom-fb-hom01`，其 ADR 0006）把本记录按提交 vendored 到 `config/tiansight-positioning.json`，用同样的结构生成首页 `#models` 分区。平台不得改写文案，只能换提交。

## 备选方案

- **直接改 `guidelines/company-intro-2026-09.md`**：那是客户逐字稿，只能原样引用。拒绝。
- **把文案写进幻灯片 props 并手抄到官网**：同一句话三份。拒绝。
- **保留解释句、只在官网隐藏**：解释句会回到 deck 与下游；改为在记录层禁止。
- **底座按交叉支撑关系画网状图**：业主给的是逐一对应的三列，按顺序对齐。

## 后果

- 官网、企业介绍、销售提案与平台首页的 1 + 3 + 3 来自同一文件；改一处，四处随之更新。
- 门禁：记录结构与标签长度（`content_lib --check`）、分区新鲜度（`check.py` 8d `positioning`）、合同回归（`scripts/test_content.py`）。
- 2026-11-06 版的两页（利润节奏升级、人才招选预留）已从库中移除；其余五页沿用原 UUID，改为新视图。
