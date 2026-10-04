import React, { useState } from "react";
import Screen, { TopBar } from "../components/Screen.jsx";
import Button from "../components/Button.jsx";
import { useArmed } from "../hooks/useTimer.js";

/** 文字数に合わせてお題の文字サイズを調整（長いワードもはみ出さない） */
function wordSize(word) {
  const len = [...word].length;
  return `min(${Math.min(24, 86 / Math.max(len, 1)).toFixed(1)}vw, ${len <= 3 ? 8 : 6}rem)`;
}

/**
 * 1人ずつお題を確認する画面。
 * pass（渡す） → show（お題を見る） → 次の人の pass …
 * お題の文字は show のときだけ描画するので、次の人に残像が見えることはない。
 */
export default function Reveal({ round, onDone, onQuit }) {
  const total = round.words.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("pass");
  // 直前のボタン連打で次の人のお題が開かないよう、切り替え直後は少しだけ押せない
  const armed = useArmed(phase === "pass" ? 700 : 500, `${index}-${phase}`);
  const n = index + 1;
  const label = round.labels[index];
  const hasName = label !== `${n}人目`;

  const confirm = () => {
    if (index + 1 >= total) onDone();
    else { setIndex(index + 1); setPhase("pass"); }
  };

  const top = <TopBar onBack={onQuit} backLabel="やめる" right={`${n} / ${total}`} />;

  if (phase === "pass") {
    return (
      <Screen tone="night" top={top} center
        bottom={<Button size="xl" variant="accent" disabled={!armed} onClick={() => setPhase("show")}>お題を見る</Button>}>
        <div className="pass" key={index}>
          {hasName ? (
            <div className="pass-name" style={{ fontSize: wordSize(label) }}>{label}</div>
          ) : (
            <div className="pass-num"><span className="pass-n">{n}</span><span className="pass-unit">人目</span></div>
          )}
          <p className="pass-text">{round.calls[index]}にスマホを渡してください</p>
          <p className="pass-sub">ほかの人に画面が見えないように</p>
        </div>
      </Screen>
    );
  }

  const word = round.words[index];
  return (
    <Screen tone="night" top={top} center
      bottom={<Button size="xl" variant="accent" disabled={!armed} onClick={confirm}>確認した</Button>}>
      <div className="secret">
        <p className="secret-label">{hasName ? `${label}さん` : `${n}人目`}のお題</p>
        <div className="secret-card">
          <span className="secret-word" style={{ fontSize: wordSize(word) }}>{word}</span>
        </div>
        <p className="secret-sub">覚えたら「確認した」を押して画面を隠す</p>
      </div>
    </Screen>
  );
}
