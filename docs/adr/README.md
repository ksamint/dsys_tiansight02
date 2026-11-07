# Architecture decision records · 架构决策记录

One file per decision, numbered, never rewritten: a superseded record keeps its text and gains a
`状态：已被 000N 取代` line. Each record states the context, the decision, the alternatives
refused, and the consequences, in that order, briefly. A record documents a decision the owner
has confirmed or a rule the gate enforces; a proposal that is still open is a plan in
`docs/`, not an ADR.

| # | Record | Status |
|---|---|---|
| 0001 | [One repository, one order of authority](0001-one-source-of-truth-order-of-authority.md) | 已采纳（追记 2026-11-06；决策本身 2026-10-14 / 2026-10-21） |
| 0002 | [Positioning record for 三大模型 · 三大基础](0002-positioning-record-three-models-three-foundations.md) | 已采纳 2026-11-06 · 文案已确认 2026-11-06 |

Downstream repositories keep their own records. The platform that serves
https://tiansight.apuch.cn records how it pins to this repository in its own ADRs: 0002 for the design system and
verbatim copy, 0006 for the positioning record (`ksamint/vanahom-fb-hom01`, `docs/adr/`).
