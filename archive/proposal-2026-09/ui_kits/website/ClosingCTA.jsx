const { Seal, Wordmark, Button, Input, Select, Checkbox, Icon, Eyebrow } = window.TIANSIGHTDesignSystem_bb63dc;

function ClosingCTA() {
  const [sent, setSent] = React.useState(false);
  return <section id="contact" style={{ background: "var(--surface-inverse)", color: "var(--text-on-inverse)" }}>
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--section-y) 32px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,420px)", gap: "var(--space-10)", alignItems: "start" }}>
      <div>
        <Eyebrow tone="inverse">TIANSIGHT · TABLE AI ALLIANCE</Eyebrow>
        <h2 style={{ margin: "22px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-5xl)", fontWeight: "var(--weight-regular)", lineHeight: 1.18, letterSpacing: "var(--tracking-cjk-display)", color: "var(--text-on-inverse)" }}>
          携手侍天，<br />持续领先。
        </h2>
        <p style={{ margin: "24px 0 0", maxWidth: "28em", fontSize: "var(--text-md)", lineHeight: "var(--leading-normal)", color: "rgba(239,230,210,.72)" }}>
          以最近 6 个月经营数据为始，7 日内交付经营诊断：增长机会、利润流失、行动次序、验收标准。
        </p>
        <div style={{ marginTop: "var(--space-9)", display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          <Seal size={92} inverse src="../../assets/logo-seal.png" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Wordmark fontSize="var(--text-md)" inverse />
            <span style={{ fontSize: "var(--text-xs)", color: "rgba(239,230,210,.6)" }}>微信扫码联系侍天</span>
          </div>
        </div>
      </div>
      <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-md)", padding: "var(--space-7)", boxShadow: "var(--shadow-lg)" }}>
        {sent
          ? <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
              <span style={{ color: "var(--growth-500)", display: "flex" }}><Icon name="check" size={26} /></span>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-medium)", color: "var(--text-display)" }}>已收到，7 日内回复</h3>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>侍天顾问将与你确认数据口径与交付节奏。</p>
              <Button variant="ghost" size="sm" onClick={() => setSent(false)}>再填一份</Button>
            </div>
          : <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div style={{ fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-accent)" }}>经营诊断申请</div>
              <Input label="品牌名称" placeholder="例：韵 1980 新派淮扬菜" required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <Input label="门店数" suffix="家" defaultValue="7" />
                <Select label="业态" options={["新派淮扬菜", "潮汕牛肉", "河鲜小馆", "老字号茶庄"]} />
              </div>
              <Input label="联系方式" placeholder="手机号或微信号" required />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
                <Checkbox label="收银数据" description="近 6 个月流水与折扣明细" defaultChecked />
                <Checkbox label="平台数据" description="外卖与团购结算单" defaultChecked />
                <Checkbox label="会员数据" description="会员消费与复购明细" />
              </div>
              <Button variant="primary" fullWidth type="submit" icon={<Icon name="arrow-right" size={16} />}>提交，取得经营诊断</Button>
            </form>}
      </div>
    </div>
    <div style={{ borderTop: "1px solid var(--line-inverse)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "26px 32px", display: "flex", justifyContent: "space-between", gap: "var(--space-6)", flexWrap: "wrap", fontSize: "var(--text-2xs)", color: "rgba(239,230,210,.55)" }}>
        <span>侍天 / Table AI Alliance</span>
        <span style={{ fontFamily: "var(--font-quote)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>Second Brain / Decision System / Restaurant Growth</span>
        <span style={{ fontFamily: "var(--font-quote)", fontStyle: "italic" }}>Time is money. With TIANSIGHT, lose neither.</span>
      </div>
    </div>
  </section>;
}

Object.assign(window, { ClosingCTA });
