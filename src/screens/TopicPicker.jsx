import React from "react";
import Screen, { TopBar } from "../components/Screen.jsx";
import Button from "../components/Button.jsx";

export default function TopicPicker({ topics, lastTopicId, onPick, onRandom, onBack }) {
  return (
    <Screen
      top={<TopBar onBack={onBack} title="お題を選ぶ" />}
      bottom={<Button variant="secondary" onClick={onRandom}>おまかせで決める</Button>}
    >
      <p className="note">選ぶ人にはお題が見えます。進行役が選ぶのがおすすめです。</p>
      <ul className="pick-list">
        {topics.map((t) => (
          <li key={t.id}>
            <button type="button" className="pick-row" onClick={() => onPick(t)}>
              <span>{t.a}</span><span className="topic-slash">／</span><span>{t.b}</span>
              {t.id === lastTopicId && <span className="pick-badge">前回</span>}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
