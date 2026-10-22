import React from "react";
import { SlideFrame, SlideTitle, dsAsset } from "./SlideFrame.jsx";

const GOLD = [["T",0],["I",1],["A",0],["N",1],["S",1],["I",1],["G",1],["H",1],["T",1]];

export function TitleSlide({ title = "拍板之前，问侍天", subtitle = "交 6 个月经营数据，7 日内取得经营诊断", client, date, page }) {
  return React.createElement(SlideFrame, { ground: "ink", page: page, seal: false, footer: "Second Brain / Decision System / Restaurant Growth" },
    React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 22 } },
        React.createElement("img", { src: dsAsset("logo-seal.png"), alt: "侍天", width: 76, height: 76, style: { display: "block", filter: "invert(1) sepia(.35) saturate(.6) brightness(1.15)", opacity: .94 } }),
        React.createElement("span", {
          style: { fontFamily: "var(--font-quote)", fontSize: 26, textTransform: "uppercase", letterSpacing: "var(--tracking-caps-wide)", lineHeight: 1.1 }
        }, GOLD.map(function (l, i) {
          return React.createElement("span", { key: i, style: { color: l[1] ? "var(--bronze-300)" : "var(--parchment-100)", fontWeight: l[1] ? 400 : 700 } }, l[0]);
        }))
      ),
      React.createElement(SlideTitle, { size: "xl", ground: "ink" }, title),
      React.createElement("p", { style: { margin: 0, maxWidth: "26em", fontSize: 26, lineHeight: "var(--leading-normal)", color: "rgba(239,230,210,.72)" } }, subtitle),
      client || date ? React.createElement("div", { style: { display: "flex", gap: 44, marginTop: 12 } },
        client ? React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 6 } },
          React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "rgba(239,230,210,.5)" } }, "提案对象"),
          React.createElement("span", { style: { fontSize: 24, fontFamily: "var(--font-display)", color: "var(--text-on-inverse)", letterSpacing: "var(--tracking-cjk-display)" } }, client)
        ) : null,
        date ? React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 6 } },
          React.createElement("span", { style: { fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "rgba(239,230,210,.5)" } }, "日期"),
          React.createElement("span", { style: { fontSize: 24, fontFamily: "var(--font-numeral)", color: "var(--text-on-inverse)" } }, date)
        ) : null
      ) : null
    )
  );
}
