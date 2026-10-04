import React from "react";
import Screen, { TopBar } from "../components/Screen.jsx";
import Button from "../components/Button.jsx";
import Stepper from "../components/Stepper.jsx";
import Segmented from "../components/Segmented.jsx";
import NameInputs from "../components/NameInputs.jsx";
import { MAX_PLAYERS, MIN_PLAYERS, TALK_OPTIONS, clampSettings, maxWolves } from "../lib/game.js";

function Row({ label, hint, children }) {
  return (
    <section className="setting">
      <div className="setting-head">
        <h2 className="setting-label">{label}</h2>
        {hint && <span className="setting-hint">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

export default function Setup({ settings, setSettings, topicCount, onStart, onBack, onManage }) {
  const set = (patch) => setSettings((s) => clampSettings({ ...s, ...patch }));
  const canTwo = maxWolves(settings.players) >= 2;
  const noTopics = topicCount === 0;

  return (
    <Screen
      top={<TopBar onBack={onBack} backLabel="ホーム" title="ゲーム設定" />}
      bottom={
        noTopics ? (
          <Button size="xl" onClick={onManage}>お題を追加する</Button>
        ) : (
          <Button size="xl" onClick={onStart}>
            {settings.topicMode === "select" ? "お題を選ぶ" : "スタート"}
          </Button>
        )
      }
    >
      <Row label="参加人数">
        <Stepper value={settings.players} min={MIN_PLAYERS} max={MAX_PLAYERS}
          label="参加人数" onChange={(players) => set({ players })} />
      </Row>

      <Row label="名前" hint="入れなくてもOK・この順番でスマホを回します">
        <NameInputs count={settings.players} names={settings.names}
          onChange={(names) => set({ names })} />
        {settings.names.some((n) => n.trim()) && (
          <button type="button" className="names-clear" onClick={() => set({ names: [] })}>名前をすべて消す</button>
        )}
      </Row>

      <Row label="ウルフ" hint={canTwo ? null : "2人は5人以上から"}>
        <Segmented label="ウルフ人数" value={settings.wolves} onChange={(wolves) => set({ wolves })}
          options={[{ value: 1, label: "1人" }, { value: 2, label: "2人", disabled: !canTwo }]} />
      </Row>

      <Row label="お題">
        <Segmented label="お題の決め方" value={settings.topicMode}
          onChange={(topicMode) => set({ topicMode })}
          options={[{ value: "random", label: "ランダム" }, { value: "select", label: "自分で選ぶ" }]} />
      </Row>

      <Row label="トーク時間">
        <Segmented label="トーク時間" wrap value={settings.talkSeconds}
          onChange={(talkSeconds) => set({ talkSeconds })}
          options={TALK_OPTIONS.map((o) => ({ value: o.seconds, label: o.label }))} />
      </Row>

      {noTopics && <p className="form-error">お題が登録されていません。</p>}
    </Screen>
  );
}
