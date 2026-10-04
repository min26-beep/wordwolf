import React from "react";
import Screen from "../components/Screen.jsx";
import Button from "../components/Button.jsx";

export default function Home({ topicCount, onStart, onManage }) {
  return (
    <Screen
      center
      bottom={
        <>
          <Button size="xl" onClick={onStart}>ゲームをはじめる</Button>
          <Button variant="secondary" onClick={onManage}>お題を管理する</Button>
        </>
      }
    >
      <div className="hero">
        <div className="hero-moon" aria-hidden="true" />
        <h1 className="hero-title">ワード<br />ウルフ</h1>
        <p className="hero-sub">1台のスマホを回して遊ぶ会話ゲーム</p>
        <p className="hero-meta">お題 {topicCount}組</p>
      </div>
    </Screen>
  );
}
