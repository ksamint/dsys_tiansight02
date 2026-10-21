---
name: tiansight-design
description: Use this skill to generate well-branded interfaces and assets for 侍天 TIANSIGHT (智慧餐饮 / 餐饮第二大脑), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read README.md and docs/component-runtime.md within this skill, and explore the other available files. `guidelines/brand-guide.md` is the brand's own published guide and wins over anything else if the two disagree; `tokens/colors.css` declares the nine authoritative palette values at the top.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Current component runtime: `dist/components/current.json` → `2026.10.21-e0a760` (105 exports). Use the versioned local runtime and shared content; historical JSX and artifact exports are archived references. The original JSX for the new bundle was not supplied. Preserve `brand/` foundation authority and follow `AGENTS.md` for build and validation commands.

Current deck entry points: read `content/deck-catalog.json` and `content/slides.index.json`,
compose manifests using canonical slide IDs, and build with `python3 scripts/build_deck.py`.
See `docs/architecture.md`; never copy shared slide or case content into a new deck.
