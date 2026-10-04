import React, { useEffect, useState } from "react";
import Screen, { TopBar } from "../components/Screen.jsx";
import Button from "../components/Button.jsx";
import { useElapsed, useWakeLock } from "../hooks/useTimer.js";
import { playEndSignal, primeSound } from "../lib/sound.js";

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export default function Talk({ talkSeconds, onResult, onQuit }) {
  const [phase, setPhase] = useState("ready"); // ready | running | ended
  const [startedAt, setStartedAt] = useState(null);
  const elapsed = useElapsed(startedAt, phase === "running");
  const limited = talkSeconds > 0;
  const remainingSec = limited ? Math.max(0, Math.ceil((talkSeconds * 1000 - elapsed) / 1000)) : 0;
  useWakeLock(phase === "running");

  useEffect(() => {
    if (phase === "running" && limited && elapsed >= talkSeconds * 1000) {
      setPhase("ended");
      playEndSignal();
    }
  }, [phase, limited, elapsed, talkSeconds]);

  const start = () => { primeSound(); setStartedAt(Date.now()); setPhase("running"); };
  const top = <TopBar onBack={onQuit} backLabel="やめる" />;

  if (phase === "ready") {
    return (
      <Screen top={top} center bottom={<Button size="xl" onClick={start}>トークスタート</Button>}>
        <div className="talk-ready">
          <p className="talk-big">全員確認しました！</p>
          <p className="talk-sub">
            {limited ? `トーク時間は${fmt(talkSeconds)}。` : "時間制限なし。"}
            お題について話して、ウルフを探そう
          </p>
        </div>
      </Screen>
    );
  }

  if (phase === "ended") {
    return (
      <Screen top={top} center bottom={<Button size="xl" onClick={onResult}>結果を見る</Button>}>
        <div className="talk-ready">
          <p className="talk-big talk-end">トーク終了！</p>
          <p className="talk-sub">ウルフだと思う人を一斉に指さそう</p>
        </div>
      </Screen>
    );
  }

  const hurry = limited && remainingSec <= 10;
  const shown = limited ? remainingSec : Math.floor(elapsed / 1000);
  return (
    <Screen top={top} center
      bottom={
        limited
          ? <Button variant="secondary" onClick={() => setPhase("ended")}>ここで終了する</Button>
          : <Button size="xl" onClick={() => setPhase("ended")}>トーク終了</Button>
      }>
      <div className="timer" role="timer" aria-live="off">
        <p className="timer-label">{limited ? "残り" : "経過"}</p>
        <p className={`timer-num ${hurry ? "is-hurry" : ""}`}>{fmt(shown)}</p>
        {limited && (
          <div className="timer-bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(0, 1 - elapsed / (talkSeconds * 1000))})` }} />
          </div>
        )}
      </div>
    </Screen>
  );
}
