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
        # Native-figure decks pass no photographs (owner 2026-11-07): draw a seal monogram or a
        # service-module track instead of the empty grey placeholder. Photo paths are unchanged.
        "slides/ProfileSlide.jsx": (
            ('function ProfileSlide(props) {', '''function sealMonogram(name, size) {
  return h("div", {
    style: { height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }
  }, h("span", {
    "aria-hidden": "true",
    style: { width: size, height: size, padding: 8, boxSizing: "border-box", borderRadius: "50%", border: "1.5px solid var(--bronze-500)", display: "flex" }
  }, h("span", {
    style: { flex: 1, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: Math.round(size * 0.42), lineHeight: 1, color: "var(--charcoal)" }
  }, String(name || "").slice(0, 1))));
}
function ProfileSlide(props) {''', 1),
            ('''}) : h(__ds_scope.SlidePlaceholder, {
    label: "人像",
    aspect: "auto",
    style: {
      height: "100%",
      border: "none"
    }
  })), p.roles''', '''}) : sealMonogram(p.name, 228)), p.roles''', 1),
        ),
        "slides/ExpertTeamSlide.jsx": (
            ('''}) : React.createElement(__ds_scope.SlidePlaceholder, {
      label: wide ? "头像" : "专家头像",
      round: true
    })), React.createElement("div", {''', '''}) : React.createElement("span", {
      "aria-hidden": "true",
      style: { width: "100%", aspectRatio: "1 / 1", boxSizing: "border-box", padding: 7, borderRadius: "50%", border: "1.5px solid var(--bronze-500)", display: "flex" }
    }, React.createElement("span", {
      style: { flex: 1, borderRadius: "50%", border: "1px solid var(--line-rule)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: wide ? 64 : 56, lineHeight: 1, color: "var(--charcoal)" }
    }, String(e.name || "").slice(0, 1)))), React.createElement("div", {''', 1),
        ),
        "slides/CaseStudySlide.jsx": (
            ('function CaseStudySlide(props) {', '''function moduleTrack(mod) {
  const steps = ["新店开业", "概念开创", "经营复盘", "连锁督导"];
  const at = steps.findIndex(function (s) { return String(mod || "").indexOf(s) >= 0; });
  return h("div", {
    style: { height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "14px 22px" }
  }, h("span", {
    style: { fontSize: 17, letterSpacing: "var(--tracking-cjk-body)", color: "var(--text-accent)", marginBottom: 12 }
  }, "服务模块"), steps.map(function (s, i) {
    const on = i === at;
    return h("div", {
      key: i,
      style: { position: "relative", display: "grid", gridTemplateColumns: "20px minmax(0,1fr)", columnGap: 14, alignItems: "center", minHeight: 44 }
    }, h("span", {
      style: { position: "absolute", left: 9, top: i === 0 ? "50%" : 0, bottom: i === steps.length - 1 ? "50%" : 0, width: 1, background: "var(--line-rule)" }
    }), h("span", {
      style: { position: "relative", width: 20, height: 20, boxSizing: "border-box", borderRadius: "50%", border: "1.5px solid var(--bronze-500)", background: on ? "var(--bronze-500)" : "var(--parchment-200)" }
    }), h("span", {
      style: { fontFamily: "var(--font-display)", fontSize: on ? 23 : 20, fontWeight: on ? 500 : 400, letterSpacing: "var(--tracking-cjk-body)", whiteSpace: "nowrap", color: on ? "var(--charcoal)" : "var(--text-muted)" }
    }, s));
  }), at < 0 && mod ? h("span", {
    style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line-hairline)", fontFamily: "var(--font-display)", fontSize: 20, color: "var(--charcoal)" }
  }, mod) : null);
}
function CaseStudySlide(props) {''', 1),
            ('gridTemplateColumns: "auto minmax(0,1fr)",', 'gridTemplateColumns: c.logo ? "auto minmax(0,1fr)" : "minmax(0,1fr)",', 1),
            ('''}) : h(__ds_scope.SlidePlaceholder, {
    label: "案例照片",
    aspect: "auto",
    style: {
      height: "100%",
      border: "none"
    }
  })), c.deliverables''', '''}) : moduleTrack(c.module)), c.deliverables''', 1),
        ),
        # Names set in type need less height than logo cells; keeps the quote clear of the footer.
        "slides/PartnerWallSlide.jsx": (
            ('height: items.length > columns * 2 ? 96 : 120,', 'height: it.src ? items.length > columns * 2 ? 96 : 120 : 84,', 1),
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
