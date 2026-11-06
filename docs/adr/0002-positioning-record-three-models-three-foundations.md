# ADR 0002 · 三大模型 · 三大基础只有一份记录：`content/positioning.json`

- 状态：已采纳 2026-11-06。记录本身 `status: draft`，文案待业主确认；确认后改为 `approved` 并填 `approval`，再按 `docs/maintaining.md` §8 走 deck 发布审批。
- 关联：ADR 0001 · `scripts/positioning_lib.py` · `scripts/build_positioning.py` · `content/decks/intro.json` · `website/index.html`

## 背景

业主于 2026-11-06 口述新的定位框架：三大模型（经营模型：开发 · 诊断 · 优化，对应新店开业 · 老店复盘 · 弱店转强；利润模型：运营数据与财务数据合一，预测需求、优化人力物料，由每月算账升级为每天复盘；人才模型：老板、店长、前厅后厨、外部伙伴与 AI 智能体，招选预留，向 AI 原生餐饮组织转型），以及侍天自研的三大基础（餐饮主体知识库、餐饮全生命周期决策树、餐饮人才发展能力表）。

这套框架要同时进官网与企业介绍。此前的定位文案只有逐字稿（`guidelines/company-intro-2026-09.md`、`guidelines/company-intro-v3.md`）与幻灯片 props 两种形态，官网另有一份手写 HTML；`website/index.html` 还停留在已退役的「经营五问」框架，与线上官网（平台仓库按 2026-09 逐字稿重建）不一致。

## 决策

1. **一份结构化记录**：`content/positioning.json`（schema `tiansight.positioning/1`）是三大模型与三大基础全部文案的唯一来源，位于内容层（ADR 0001 第 4 层），与 `team.json`、`contact.json`、`partners.json`、`cases/` 并列。记录含 `lead`、三个 `models`（各自的 `tagline`、`aim`、`headline` 与子维度：经营模型三个场景 × 问题 / 输入 / 产出 / 节奏 / 验收；利润模型四个维度与节奏升级；人才模型六类角色与四个做法）、`foundations.items` 三条（各自 `supports` 哪些模型、`state` 在用或编制中、`seeds` 现有来源），以及 `refs` 把场景映射到四个服务模块与四阶段。`scripts/positioning_lib.py` 校验结构（顺序、数量、映射）。
2. **幻灯片引用，不抄写**：新增引用 `{"$positioning": "<view>"}`，由 `content_lib.resolve` 调用 `positioning_lib.view` 生成组件 props；同级字段只允许布局键（`page` `active` `highlight` `figure`），携带文案的覆盖被门禁拒绝。七个视图：`models:steps` `operating:matrix` `profit:tiers` `profit:shift` `talent:roles` `talent:tiers` `foundations:cards`。企业介绍 `intro` 插入七页（总览在「问题」之后；详情与三大基础在「第二大脑 · 四个部分」之后）。记录一改，所有引用它的 deck 的 `contentVersion` 随之改变，`latestApproved` 自动回到 null。
3. **官网分区由构建器生成**：`scripts/build_positioning.py` 把记录渲染为 `website/index.html` 中 `<!-- positioning:start -->` … `<!-- positioning:end -->` 之间的 `#models` 分区（三模型切换 + 三大基础），`--check` 进入 `scripts/check.py` 8d 循环；该分区取代已退役的「经营五问」分区。记录为 `draft` 时分区末尾带「文案为审阅稿」一行，`approved` 后自动消失。
4. **下游钉提交**：平台仓库（`ksamint/vanahom-fb-hom01`）把本记录按提交 vendored 到 `config/tiansight-positioning.json`，首页 `#models` 分区的文案用脚本对照该副本断言；升级设计系统时一并刷新。平台不得改写文案，只能换提交。
5. **既有框架不退役**：四阶段、四个服务模块、第二大脑四部分、服务模式三层级照旧；三大模型是「建什么模型」，四阶段是「何时」，服务模块是「怎么卖」，第二大脑是「用什么系统」。记录用 `refs` 指向它们，不重复它们的文案。

## 备选方案

- **直接改 `guidelines/company-intro-2026-09.md`**：那是客户逐字稿，按 README 只能原样引用；新框架尚未经业主逐字确认，不能冒充逐字稿。拒绝。
- **把文案写进七张幻灯片 props 并手抄到官网**：同一句话三份，正是 ADR 0001 要消灭的状态。拒绝。
- **在平台仓库维护，再反向同步**：违反授权顺序；平台是消费者。拒绝。
- **等文案确认后再建结构**：结构先行可以让业主在构建产物上审阅，确认即改 `status`，不需返工。采纳为 `draft` 状态。

## 后果

- 官网 `website/index.html`、企业介绍 `build/intro/*`、平台首页三处的三大模型文案来自同一文件；校对一次，改一处。
- 新增门禁：记录结构校验（`content_lib --check`）、分区新鲜度（`check.py` 8d `positioning`）、合同回归（`scripts/test_content.py`）。
- 代价：`FiveQuestionsSlide` / `MatrixTableSlide` / `LadderSlide` / `CardGridSlide` 的 props 形状由视图函数承担，组件 props 改名时要同步视图。
- 待办：业主确认文案；`餐饮人才发展能力表` 目前 `state: 编制中`，只有平台决策本体的三条能力带作为种子；销售提案 `sales` 尚未引用三大模型，待业主决定是否加入。
