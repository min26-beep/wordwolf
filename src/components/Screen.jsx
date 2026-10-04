import React from "react";

/** 画面の骨組み：上部バー / 中身 / 親指で押しやすい下部ボタン */
export default function Screen({ tone = "light", top, children, bottom, center = false }) {
  return (
    <div className={`screen screen-${tone}`}>
      {top && <div className="screen-top">{top}</div>}
      <main className={`screen-body ${center ? "is-center" : ""}`}>{children}</main>
      {bottom && <div className="screen-bottom">{bottom}</div>}
    </div>
  );
}

export function TopBar({ onBack, backLabel = "戻る", title, right }) {
  return (
    <div className="topbar">
      {onBack ? (
        <button type="button" className="topbar-back" onClick={onBack}>
          <span aria-hidden="true">‹</span> {backLabel}
        </button>
      ) : <span />}
      {title && <h1 className="topbar-title">{title}</h1>}
      <span className="topbar-right">{right}</span>
    </div>
  );
}
