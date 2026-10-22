"""Adapt recovered compiled modules to the repository's foundation contracts."""


def patch_bundle(bundle: str) -> str:
    """Patch a distribution copy, rejecting drift; keep archived input unchanged."""
    # Incoming text-* names are colours; foundation names are typography sizes.
    for before, after, count in (
        ("var(--text-display)", "var(--charcoal)", 47),
        ("var(--text-body)", "var(--text)", 17),
        ("var(--text-caption)", "var(--color-caption)", 5),
    ):
        if bundle.count(before) != count:
            raise ValueError(f"Runtime colour contract changed: {before}")
        bundle = bundle.replace(before, after)

    patches = {
        # Mirrors components/charts/Waterfall.jsx's cumulative and label rounding.
        "components/charts/Waterfall.jsx": (
            ("const next = run + s.value;", "const next = Math.round((run + s.value) * 1e6) / 1e6;", 1),
            ('(b.kind === "total" ? "" : b.value > 0 ? "+" : "") + b.value)',
             '(b.kind === "total" ? "" : b.value > 0 ? "+" : "") + (Math.round(b.value * 10) / 10))', 1),
        ),
        # Mirrors components/data/Matrix2x2.jsx's readable muted-point colour.
        "components/data/Matrix2x2.jsx": (
            ('muted: "var(--parchment-400)"', 'muted: "var(--ink-muted)"', 1),
        ),
        # brand/guide.md permits inverse cards, never a full-page inverse ground.
        "slides/SlideFrame.jsx": (
            ('bg: "var(--surface-inverse)",\n    fg: "rgba(239,230,210,.72)",\n    head: "var(--text-on-inverse)"',
             'bg: "var(--surface)",\n    fg: "var(--text)",\n    head: "var(--charcoal)"', 1),
            ('const inverse = ground === "ink";', 'const inverse = false;', 1),
            ('color: ground === "ink" ? "var(--text-on-inverse)" : "var(--charcoal)"',
             'color: "var(--charcoal)"', 1),
        ),
        "slides/TitleSlide.jsx": (
            ('filter: "invert(1) sepia(.35) saturate(.6) brightness(1.15)"', 'filter: "none"', 1),
            ('color: l[1] ? "var(--bronze-300)" : "var(--parchment-100)"',
             'color: l[1] ? "var(--text-wordmark-gold)" : "var(--charcoal)"', 1),
            ('color: "rgba(239,230,210,.72)"', 'color: "var(--text-muted)"', 1),
            ('color: "rgba(239,230,210,.5)"', 'color: "var(--text-muted)"', 2),
            ('color: "var(--text-on-inverse)"', 'color: "var(--charcoal)"', 2),
            ('seal: false,\n    footer:', 'seal: false,\n    raiseFooter: true,\n    footer:', 1),
            ('''  }) : null, image ? React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: "34%",
      width: 160,
      marginRight: -160,
      background: "linear-gradient(90deg, #17130D 0%, rgba(23,19,13,0) 100%)"
    }
  }) : null, React.createElement("div", {''',
             '''  }) : null, React.createElement("div", {''', 1),
        ),
        # Keep the original photo on the right; text must not overlay a dark wash.
        "slides/StatementSlide.jsx": (
            ('inset: 0,\n      width: "100%",', 'top: 0,\n      right: 0,\n      bottom: 0,\n      width: "38%",', 1),
            ('''}), inv ? h("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(23,19,13,.9) 0%, rgba(23,19,13,.72) 48%, rgba(23,19,13,.25) 100%)"
    }
  }) : null, h("div", {''',
             '''}), h("div", {''', 1),
            ('paddingLeft: inv ? 24 : 96', 'paddingLeft: inv ? 0 : 96,\n      maxWidth: inv ? "58%" : undefined', 1),
            ('fontSize: 76,', 'fontSize: inv ? 60 : 76,', 1),
            ('color: inv ? "var(--bronze-300)" : "var(--text-accent)"', 'color: "var(--text-accent)"', 1),
            ('background: inv ? "var(--bronze-300)" : "var(--gold-500)"', 'background: "var(--gold)"', 1),
            ('color: inv ? "var(--text-on-inverse)" : "var(--charcoal)"', 'color: "var(--charcoal)"', 1),
            ('color: inv ? "rgba(239,230,210,.82)" : "var(--text-muted)"', 'color: "var(--text-muted)"', 1),
        ),
        "slides/ContactSlide.jsx": (
            ('color: "rgba(239,230,210,.72)"', 'color: "var(--text-muted)"', 3),
            ('color: "var(--bronze-300)"', 'color: "var(--gold)"', 2),
            ('filter: "invert(1) sepia(.35) saturate(.6) brightness(1.15)"', 'filter: "none"', 1),
        ),
    }
    # Page modules run before the public namespace is populated at the bundle end.
    for path in (
        "ui_kits/report/AnalysisPage.jsx",
        "ui_kits/report/DecisionPage.jsx",
        "ui_kits/report/MethodMapPage.jsx",
        "ui_kits/report/ReportShell.jsx",
        "ui_kits/report/TrendPage.jsx",
        "ui_kits/website/ClosingCTA.jsx",
        "ui_kits/website/FiveQuestions.jsx",
        "ui_kits/website/HomeHero.jsx",
        "ui_kits/website/Partners.jsx",
        "ui_kits/website/PartnersPage.jsx",
        "ui_kits/website/ReportProof.jsx",
        "ui_kits/website/ServiceLadder.jsx",
        "ui_kits/website/SiteHeader.jsx",
    ):
        patches[path] = (
            ("} = window.TIANSIGHTDesignSystem_e0a760;", "} = __ds_scope;", 1),
        )

    for path, replacements in patches.items():
        start_marker = f"// {path}\ntry {{ (() => {{\n"
        end_marker = f'__ds_ns.__errors.push({{ path: "{path}",'
        if bundle.count(start_marker) != 1 or bundle.count(end_marker) != 1:
            raise ValueError(f"Runtime module boundary changed: {path}")
        start = bundle.index(start_marker)
        end = bundle.index(end_marker, start)
        module = bundle[start:end]
        for before, after, count in replacements:
            if module.count(before) != count:
                raise ValueError(f"Runtime patch source changed: {path}: {before}")
            module = module.replace(before, after)
        bundle = bundle[:start] + module + bundle[end:]
    return bundle
