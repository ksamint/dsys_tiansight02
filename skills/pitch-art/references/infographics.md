# Infographic recipes (1920×1080 canvas)

Coordinates assume 128 px side margins and a 160 px bottom margin (content box 1664 × 792). A header (eyebrow 24 px + headline 72 px) takes about 134 px plus a 48 px gap, leaving about 610 px for the figure.

General rules:

- Draw lines and curves in one SVG sized exactly to its host (`width`/`height` = `viewBox`), listed first in the host. Keep text out of the SVG; place labels as real text boxes over it.
- If boxes are positioned absolutely, keep each host under its element limit (e.g. 24 pinned children); use flow rows for repeated items and let the SVG draw only the gaps between them.
- One accent message per figure; everything else neutral. Labels sit on or beside their mark; no legend when direct labels fit. No gridlines beyond the baseline, no shadows, no gradients.
- Icons: 48-unit paths scaled with `transform="scale(size/48)"`, stroke 1.8, round caps and joins, no fill. Same color per slide (brand gold; accent for the highlighted item).

## Contents

1. Pain → banner
2. Profit equation with levers
3. Cost-of-change curve
4. Illustrative waterfall
5. Opportunity matrix
6. Replication hub
7. Phase timeline
8. Cycle loop
9. Deliverables tree
10. Layered methodology
11. Three-step start
12. Profile rows
13. Icon path library
14. Benchmark bars
15. Gap bars around zero
16. Range bars with total
17. Payback band
18. Before vs after
19. KPI tiles
20. Roadmap columns
21. Week Gantt

## 1. Pain → banner

Three equal cards (icon 120, title 44, phrase 32 ≤ 8 characters), a row of three accent down-arrows (40 × 72) centered under them, then a full-width accent banner with the consequence in 56 px light text ("利润流失 · 商机错失"). Height ≈ 350 + 20 + 72 + 20 + 130.

## 2. Profit equation with levers

Three aligned rows sharing exact column widths:

- Row 0: bracket labels over term groups, e.g. "增长机会" (accent underline) over A × B and "成本控制" (gold underline) over − C − D.
- Row 1: label column 160, result box (accent border, 64 px), operators 56 wide at 64 px, term boxes 200–260 wide at 44 px.
- Row 2: under each term an up-arrow, a 72 px icon and the lever name (32 px). Accent arrows under growth terms, gold under cost terms.

## 3. Cost-of-change curve

Host 1664 × 560. SVG 1664 × 400: shaded rect over the early phases (intervention zone), baseline at y 388, ticks every 333 px, an accent curve rising from bottom-left to top-right with dots at phase centers (166, 499, 832, 1165, 1498). Phase labels at top 408; risk pills (accent outline) at top 476 under each phase; "intervention" label inside the shaded zone; "cost to fix" label near the curve end.

Smooth path through points: Catmull-Rom to cubic Bézier, control points `p1 + (p2 − p0)/6` and `p2 − (p3 − p1)/6`.

## 4. Illustrative waterfall

Six columns of 277 px, bars 160 wide centered. Baseline y 440. Bar 1 = revenue (light gold, full height); bars 2–4 = leaks (accent), each starting where the previous ended; bar 5 = current profit (dark); bar 6 = current profit plus an accent block for recovered profit with a bold accent label above. Dashed connectors between bar tops. Labels under the baseline (leak labels in accent). Optional row of action pills under the leaks ("侍天动作"). No numbers; tag "示意" unless backed by data.

## 5. Opportunity matrix

Grid: label column 240 + four equal columns. Header row tinted. Cells: "existing" pill (light gold fill, gold border) or "opportunity" pill (accent fill, light bold text) or empty. Legend row below plus "示意 · 以现场调研为准" if inferred. Keep opportunities plausible and tied to real spaces or segments.

## 6. Replication hub

Row: pilot card (340, accent star icon, name) → gold arrow (96 × 48) → standard package card (640, 2 × 2 icon tiles) → accent arrow → grid of 3 × 2 building icons titled in accent ("多店复制"). Caption line underneath for local adaptation.

## 7. Phase timeline

Host 1664 × 340. Phase bands (tinted pills) across the top spanning their nodes; a 3 px line at the node centerline (y ≈ 196); 112 px circle nodes with 64 px icons; an accent diamond for the milestone (e.g. opening); labels 32 px under each node, slot width 208. Optional photo band below: images aligned under each phase band, 180 px tall, no captions.

## 8. Cycle loop

Host 1000 × 560. Ring r = 230 centered (500, 280). Four node pills (200 wide) centered on N/E/S/W ring points; accent arrowheads on the ring at 45°, 135°, 225°, 315° pointing clockwise (tangent `(−sin θ, cos θ)` in screen coordinates). Center: accent title (44) and a muted subtitle; keep the center text narrower than the gap between the W and E pills.

## 9. Deliverables tree

Host 1664 × 600, four levels left to right:

- Root (dark box 240 × 160) at x 0, vertically centered.
- Phase boxes (160 × 96) at x 300, each centered on the middle of its modules.
- Module rows as flow content starting at x 520: module box 260 × 64, gap 60, three deliverable pills 260 × ≤ 64 with 16 gaps (ends at x 1652). Rows 64 tall with 20 gaps → centers at 50, 134, 218, … (host padding-top 18).
- SVG connectors only in empty space: root → bus at x 270 → phases; phase → bus at x 490 → modules; module → first pill; short ticks between pills.
- 3–5 key deliverables in accent outline + bold, explained by a legend in the header row ("关键交付 · 直接影响利润与商机").

## 10. Layered methodology

Three rows, each with a 200 px label column (gold right rule): row 1 a set of numbered question cards (two balanced lines each, tag under each card, the money question in accent); row 2 a process chain (three boxes with arrows, last in accent); row 3 a tinted bar of supporting system parts with icons.

## 11. Three-step start

Three cards with arrows between, each: numeral circle + 96 px icon, title 44, rule, three check-icon items (32 px, ≤ 10 characters). The final step ("启动服务") in accent border and title.

## 12. Profile rows

Card per person: portrait 200 × 263 flush left (object-fit cover), then name 44 + romanized name 24 + role 28 on one line, two tag pills 24, and three proof lines 28 px with gold "·" bullets. Highlight the one credential that matters to this client. Two people per slide.

## 13. Icon path library (48-unit grid)

```
compass   <circle cx="24" cy="24" r="17"/><path d="M30.5 17.5L26.8 26.8L17.5 30.5L21.2 21.2Z"/>
menu      <rect x="12" y="7" width="24" height="34" rx="1"/><path d="M18 16H30M18 23H30M18 30H26"/>
sliders   <path d="M9 14H39M9 24H39M9 34H39"/><circle cx="18" cy="14" r="3.5" fill="BG"/><circle cx="31" cy="24" r="3.5" fill="BG"/><circle cx="22" cy="34" r="3.5" fill="BG"/>
chef hat  <path d="M15 30C9 29 7 24 9 20C11 16 15 15 18 16C19 12 22 10 24 10C26 10 29 12 30 16C33 15 37 16 39 20C41 24 39 29 33 30V39H15Z"/><path d="M15 34H33"/>
plan      <rect x="7" y="10" width="34" height="28"/><path d="M7 24H21V38M21 10V17M31 24V38M31 24H41"/>
search    <circle cx="21" cy="21" r="12"/><path d="M30 30L40 40"/>
checklist <rect x="11" y="9" width="26" height="32" rx="1"/><path d="M19 9V6H29V9M17 24L22 29L31 19M17 35H31"/>
cycle     <path d="M37 19A14 14 0 0 0 11.5 17"/><path d="M11 29A14 14 0 0 0 36.5 31"/><path d="M11 10V17H18M37 38V31H30"/>
building  <rect x="12" y="7" width="24" height="34"/><path d="M18 14H21M27 14H30M18 21H21M27 21H30M18 28H21M27 28H30M21 41V35H27V41"/>
star      <path d="M24 6L29.3 17.2L41.5 18.6L32.5 27L35 39L24 33L13 39L15.5 27L6.5 18.6L18.7 17.2Z"/>
document  <path d="M13 6H29L37 14V42H13Z"/><path d="M29 6V14H37M19 24H31M19 31H31M19 37H26"/>
flag      <path d="M12 43V7M12 9H34L29 16L34 23H12"/>
target    <circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="3"/>
check     <path d="M10 25L20 35L38 14"/>
check-o   <circle cx="24" cy="24" r="17"/><path d="M16 24L22 30L32 18"/>
coin ¥    <circle cx="24" cy="24" r="17"/><path d="M17 14L24 23L31 14M24 23V35M18 26H30M18 31H30"/>
people    <circle cx="18" cy="17" r="6"/><path d="M7 38C7 31 12 27 18 27S29 31 29 38"/><circle cx="33" cy="19" r="5"/><path d="M31 27C37 27 41 31 41 37"/>
clock     <circle cx="24" cy="24" r="17"/><path d="M24 14V24L31 28"/>
trend up  <path d="M7 36L18 25L26 32L40 18"/><path d="M31 18H40V27"/>
bars      <path d="M8 40H40"/><path d="M14 40V28M22 40V18M30 40V24M38 40V12"/>
warning   <path d="M24 7L42 39H6Z"/><path d="M24 18V28M24 33.5V34"/>
```

`BG` = the background color behind the icon, so slider knobs mask the line.

## 14. Benchmark bars

Horizontal bars, one row per peer (≤ 6 rows, 64 px tall, 24 gap), sorted descending. Name column 280 left-aligned; bar track 1100; value label 28 px just past the bar end. Peers in neutral, the client bar in accent with its name bold; an optional dashed median line with a 24 px label at its top. Unit once, in the takeaway or the first label.

## 15. Gap bars around zero

Vertical bars around a zero line at the figure's middle (host 1664 × 520). Up to 8 categories, bars 96 wide. Negative bars in accent when the loss is the point; value labels on the empty side of the zero line (above for positive, below for negative); category labels under the lower edge of the host, never on the zero line.

## 16. Range bars with total

One row per lever (≤ 5, 80 px tall, 24 gap): name column 360 (name 32 + base 24 muted, e.g. "仅事件日"). Bar from 0 to low in solid accent, low to high in light accent; "298–496 万元" at the bar end, 32 px bold. A rule, then a total row in dark with the summed range. If levers overlap, drop the total row and note "不可加总".

## 17. Payback band

Host 1664 × 560, months 1–12 on x (ticks every 128 px from x 128). Cumulative value as a light-accent band (low to high) with accent edges; investment tiers as flat or stepped lines in dark/gray, each labelled at the right end. Payback points as accent dots where the low edge crosses each line, labelled "第 N 月". Side table (or row under): tier · first-year value ÷ investment · payback month. Footer "不作收益承诺".

## 18. Before vs after

Two options, pick by count. Two to four metrics: paired bars per metric, before in neutral, after in accent, delta label above the pair ("−18%"). Five or more units: slope chart, two columns 800 apart, one line per unit, the units that matter in accent and labelled at the right end, the rest gray and unlabelled.

## 19. KPI tiles

Three or four equal tiles in a row (gap 48). Each: number 96 px in accent (or dark when not the message), unit 32 after it, label 28 under (≤ 8 CJK), a 24 px muted line for window or baseline ("基线 18% · 2026 Q3"). Hairline top rule; no box fill. Main metric first; guardrails in dark.

## 20. Roadmap columns

One column per month or phase (≤ 6, equal widths with 24 gap). Top: month band pill. Then the target as a big number (64, the final month in accent), scope line 28 ("5 家试点店"), three action lines 28 with gold dots, and a milestone row at the bottom with a diamond and ≤ 8 CJK. A thin arrow line joins the targets left to right.

## 21. Week Gantt

Host 1664 × 600. Label column 320 (module name 28); grid of 24 week columns (55 px) under six month bands (220 each, alternating tint). Bars 28 tall, centered in 56 px rows; accent for modules that produce value directly, gold-light for enabling work. Review milestones as accent diamonds (20) on a top row with labels 24. Week numbers only on the band edges, not every column.

