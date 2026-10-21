const { Seal, Button, Icon } = window.TIANSIGHTDesignSystem_bb63dc;

function NavLink({ id, children, onNav, active }) {
  const [h, setH] = React.useState(false);
  return <a href={"#" + id} onClick={e => { e.preventDefault(); onNav(id); }}
    onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ fontSize: "var(--text-sm)", color: h || active ? "var(--bronze-600)" : "var(--ink-700)",
      borderBottom: "1px solid " + (active ? "var(--line-strong)" : "transparent"), paddingBottom: 2,
      letterSpacing: "var(--tracking-cjk-body)", transition: "all var(--dur-fast) var(--ease-standard)" }}>{children}</a>;
}

function SiteHeader({ onNav, active }) {
  return <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(239,230,210,.88)",
    backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid var(--line-hairline)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-7)" }}>
      <a href="#top" onClick={e => { e.preventDefault(); onNav("top"); }} style={{ borderBottom: "none" }}>
        <Seal size={34} wordmark subtitle="智慧餐饮" src="../../assets/logo-seal.png" />
      </a>
      <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-7)" }}>
        <NavLink id="proof" onNav={onNav} active={active === "proof"}>报告样张</NavLink>
        <NavLink id="five" onNav={onNav} active={active === "five"}>经营五问</NavLink>
        <NavLink id="ladder" onNav={onNav} active={active === "ladder"}>服务与价格</NavLink>
        <a href="partners.html" style={{ fontSize: "var(--text-sm)", color: active === "partners" ? "var(--bronze-600)" : "var(--ink-700)", borderBottom: "1px solid " + (active === "partners" ? "var(--line-strong)" : "transparent"), paddingBottom: 2, letterSpacing: "var(--tracking-cjk-body)" }}>伙伴与专家</a>
        <Button variant="primary" size="sm" icon={<Icon name="arrow-right" size={14} />} onClick={() => onNav("contact")}>进入平台</Button>
      </nav>
    </div>
  </header>;
}

Object.assign(window, { SiteHeader, NavLink });
