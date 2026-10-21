# Shared content and exhibit research · 2026-10-21

## Canonical content

The approved corporate introduction remains primary: `deliverables/company-intro-v3/gen/vals.json`
previously held the four profiles and roster. Their exact wording was moved to `content/team.json`.
The approved corporate `gen/gen.py` and `archive/claude-design-system-v13/templates/company-intro/CompanyIntro.dc.html`
provided the contact copy now in `content/contact.json`. `scripts/build_content.py` generates the
two `window.TIANSIGHT_*` browser files; do not edit those generated files directly.

| Shared field | Previous corporate source | Migration rule |
|---|---|---|
| `people[].group` | `people[].props.eyebrow`, without `团队 · ` | Derive the same corporate eyebrow when rendering. |
| `name`, `latin`, `photo`, `roles`, `bio`, `highlights` | `people[].props` | Preserve exact wording and order; omit page numbers from shared content. |
| `people[].seat` | `roster[]`, matched by name | Preserve title and field; name and photo belong to the person. |
| Team title/subtitle | Corporate `CompanyIntro.dc.html` team slide | Preserve existing published strings. |
| Contact title/body/QR/URL | Corporate contact template | Preserve existing strings and `wechat-qr.png`; the generator keeps its current line break. |
| Contact English/QR label | Corporate generator contact slide | Preserve exact strings. |

The ZIP's expanded 李权超 roles, biography and highlights differ from the corporate introduction.
They do not replace the canonical profile: retain the existing three roles, biography and five
highlights. The ZIP's other three full profiles match the corporate source. Its founder `brief`
fields are additional sales copy, not replacements for the approved full profiles.

The corporate generator reads the shared JSON directly. The exhibit reads the generated JS and
chooses its own profile order. The ZIP catalog also describes a kitchen-specific derivative;
its topical pages and sequence can differ, but shared team/contact changes flow from the
corporate source to both derivatives. No kitchen-specific deck source was present in the
repository at migration time. Historical Claude export templates remain snapshots, not the
source for new shared content; re-export them from the canonical content when refreshed.

Photo and QR keys are relative to the selected component runtime's `assets/` directory.
They are not independent copies of the image assets.

## Research audit

All six quantitative external claims occur in the supplied
`src/TiansightDeck-Exhibit.dc.html` research slide (lines 121–125). They describe external
experiments, not results achieved by 侍天 TIANSIGHT or guaranteed effects for a client.

| Supplied claim | Primary-source finding | Publishable treatment |
|---|---|---|
| `+16–24%` healthy choices under bright light | The [publisher abstract](https://journals.sagepub.com/doi/full/10.1509/jmr.14.0115) supports the direction, but does not expose the numeric results. The [Cornell research team's release](https://www.eurekalert.org/news-releases/641804) reports the range. | Prefer `选择影响` / `明暗光线会影响食物选择`; do not treat this as sales growth. |
| `+39%` calories ordered under dim light | Same team's release: records for 160 patrons in four casual chain restaurant locations; calories ordered, not calories eaten or sales. The publisher's accessible abstract does not verify the number. | Prefer `现场验证` / `按目标菜品比较点单占比`. If quoting the release numerically, explicitly identify those four restaurants, the ordering measure, and the release as the source. |
| `≈2×` willingness to pay for careful plating | [Michel et al., Flavour 3:7 (2014)](https://link.springer.com/article/10.1186/2044-7248-3-7), Results: 60 laboratory participants, same salad ingredients in three presentations; stated willingness to pay for Kandinsky-inspired plating roughly doubled against both alternatives. | Keep `≈2×`; label `艺术摆盘沙拉 · 陈述愿付价格`; context `60 人实验，相同食材，对比普通与整齐摆盘`. This is neither realized selling price nor all forms of neat plating. |
| `+18%` taste rating | The same article reports 18% but gives means 6.8 before versus 8.3 after, and elsewhere describes a different comparison. The denominator/comparison is internally inconsistent. | Replace the percentage with `口味感知` / `摆盘可影响主观口味评价`; do not recompute an alternative headline. |
| `+17.3%` customer satisfaction | An earlier working-paper version used 17.3% customer-reported quality. The [final published paper](https://pubsonline.informs.org/doi/10.1287/mnsc.2015.2411), Management Science 63(6), reports **22.2%**, with **two-way visual transparency** between customers and workers in food-service experiments. | Use column `双向可见`, value `+22.2%`, label `顾客报告的餐品质量`. Do not relabel as general satisfaction. |
| `+13.2%` serving speed | The old draft measured reduced throughput time, not increased speed. The final paper reports **19.2% less throughput time** under the visibility intervention. The [Harvard repository record](https://dash.harvard.edu/entities/publication/73120378-ddad-6bd4-e053-0100007fdf3b) corroborates the final figures. | Use `−19.2%`, label `订单完成用时`, with the same two-way visibility and experiment context. |

Suggested research slide title: `外部研究，为现场验证提供方向`.
Suggested scope note: `外部实验结果；双向可见指顾客与制作人员互相看得见。实际效果需按门店基线验证。`
Suggested source line: `Biswas 等，JMR 2017（光线方向）；Michel 等，Flavour 2014；Buell、Kim、Tsay，Management Science 2017。`

The source catalog's Wansink 2012 reminder is stale: no separate 2012 numeric claim appears
in the supplied editable exhibit. Do not add a missing claim or imply that paper was checked.

## Methods and engagement scope

Keep all four lighting/visual methods. Express their outcomes as objectives to validate:

- Title: `光与视觉，把改善目标放进现场验证`.
- Column: `现场验证目标`.
- 调光线: `分区调整亮度与显色，验证招牌菜的可见度与点单表现`.
- 定摆盘: `建立摆盘与盛器标准样，验证价格感知与出品一致性`.
- 造氛围: `调整柔光与声环境，验证顾客用餐评价`.
- 做对照: `约定基线与观察期，对照点单占比、客单价与顾客反馈`.

Keep the three diagnosis deliverable types: `展陈诊断报告`, `优先改造清单`, `前后对照指标`.
Replace fixed quantities `1 份`, `3 项`, `1 套` with `按项目约定` for each, and use
`诊断范围、优先项数量与验收指标，在合作前共同确认。` as the scope note.
Replace the subtitle's fixed three-place promise with
`看现场、看菜单、看点单，先找出最值得改的环节。`, and the report-step text with
`明确优先改什么、谁来执行、以什么验收。`

Equipment partner scale, project history and personal career claims are partner/approved
corporate materials, not external research. This audit adds no new validation or claims for them.
