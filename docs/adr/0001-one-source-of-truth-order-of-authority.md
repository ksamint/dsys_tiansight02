# ADR 0001 · 一个仓库，一条授权顺序：侍天 TIANSIGHT 的唯一事实来源

- 状态：已采纳。决策由业主于 2026-10-14（显示名、地址、报告用色）与 2026-10-21（幻灯片库整合原则）确认；本记录于 2026-11-06 追记，把散落在 `docs/maintaining.md` §1 与 `docs/consolidation-plan.md` §0 的裁定收为一条可引用的决策。
- 关联：`docs/maintaining.md` §1 · `docs/consolidation-plan.md` §0 · `docs/architecture.md` · `AGENTS.md`

## 背景

品牌、文案、幻灯片、官网与报告模板曾分散在 Claude 工件、私有归档与多个导出包里，同一句话有三个版本，同一张图有四份字节。下游产品（官网与平台 `ksamint/vanahom-fb-hom01`）各自手抄样式与文案，升级时无从校验。

## 决策

1. **本仓库是侍天 TIANSIGHT 的唯一事实来源**：基础层（品牌 token、组件、字体）、内容层（幻灯片库、案例、团队、联系、伙伴、定位记录）、分发层与消费者都在这里，Claude 工件只从这里再导出，不先编辑。
2. **七层授权顺序**（`docs/maintaining.md` §1）：IPTrust 实时品牌记录 → 签入快照 `brand/source.json` → 基础 `brand/` → 内容 `content/` → 分发 `dist/` → 消费者（`deck/`、`website/`、`report/`、`people/`、`deliverables/`）→ Claude 导出。每一层只从上一层派生；要改的值在哪一层，就在那一层改，再重生下层。
3. **一张幻灯片只存在一次**，以永久 UUID 为键存于 `content/slides/`；deck 只引用，不复制。案例、团队、联系、伙伴是共享规范数据，通过 `$case` `$team` `$contact` `$partners` 引用解析一次（`scripts/content_lib.py`）。
4. **仓库就是内容 API**：下游在某个 git 提交上读取契约文件（`content/deck-catalog.json`、`content/slides.index.json`、`content/slides/*.json`、`assets/index.json`、`dist/components/current.json`、`dist/product/manifest.json`），用同一条构建命令生成，而不是另存一份。
5. **门禁即裁定**：`scripts/check.py` 把上述规则变成失败条件（token 之外无原始色值、生成文件必须与构建器一致、hold 幻灯片不出库、公开仓库不含客户数据）。写在文档里却不在门禁里的规则，视为未裁定。

## 备选方案

- **以 Claude Design System 工件为准、仓库只做镜像**：工件不可 diff、不可门禁、不可被 CI 读取；拒绝。
- **每个消费者保存自己的文案与样式**：正是整合前的状态；拒绝。
- **在下游平台仓库维护品牌与定位**：平台是消费者，且按其 ADR 0002 已把设计系统与文案来源钉到本仓库；拒绝。

## 后果

- 官网与平台的样式通过 `dist/product/manifest.json` 锁定到本仓库提交；文案以 `guidelines/company-intro-2026-09.md` 逐字稿与 `content/` 记录为准，下游用页面断言防漂移。
- 任何新的定位内容必须先进入 `content/`，再派生到 deck 与官网（见 ADR 0002）。
- 仓库公开，敏感数据的边界由 `docs/maintaining.md` §6 与门禁 8k 守住。
