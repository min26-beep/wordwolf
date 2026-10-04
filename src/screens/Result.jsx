import React from "react";
import Screen from "../components/Screen.jsx";
import Button from "../components/Button.jsx";

export default function Result({ round, onReplay, onHome }) {
  const wolves = round.wolfIndexes.map((i) => round.labels[i]).join("と");
  return (
    <Screen
      bottom={
        <>
          <Button size="xl" onClick={onReplay}>もう一度遊ぶ</Button>
          <Button variant="secondary" onClick={onHome}>ホームへ戻る</Button>
        </>
      }>
      <div className="result">
        <section className="result-wolf">
          <p className="result-label">ウルフは</p>
          <p className="result-who">{wolves}</p>
        </section>
        <div className="result-words">
          <section className="result-card is-minor">
            <p className="result-label">少数派（ウルフ）のお題</p>
            <p className="result-word">{round.minorityWord}</p>
          </section>
          <section className="result-card">
            <p className="result-label">多数派のお題</p>
            <p className="result-word">{round.majorityWord}</p>
          </section>
        </div>
      </div>
    </Screen>
  );
}
