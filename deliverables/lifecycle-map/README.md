# 餐饮经营全周期图谱

`index.html` is a single self-contained page (d3 7.9.0 and three.js r128 from cdnjs; Google Fonts with serif fallbacks). Open it directly or serve the repo.

Three views:

1. **全周期 · 扩张路径** — trunk of three stages (筹备 → 开业 → 单店稳定) that fans out, after the expansion gate, into three parallel paths (甲 多店复制 / 乙 多定位 / 丙 多市场适配, after Ansoff). Five lenses: 客户场景, 品牌 IP, 经营决策, 团队组织, 生态伙伴.
2. **单店视图 · 甘特** — store track on top (phases and milestones, month 0 = opening day), five swimlanes below, one row per decision; recurring decisions are rhythm strips, one tick per review.
3. **单店视图 · 立体** — the same Gantt as a 3D landscape; recurring decisions rise as one column per review.

`decisions.json` holds every number the page draws: 60 decisions (question, metric formula, 侍天 role, cadence, single-store month span), the expansion gate, phases and milestones. Edit it and paste the arrays back into the page script, or ask Claude to rebuild the page from it.

Data nature: band widths, single-store timings and cadence classes are 侍天 design values, not measurements. Metric formulas are generic definitions; each project re-confirms them on store data.

Previews: `previews/map.png`, `previews/gantt.png`, `previews/3d.png`.
