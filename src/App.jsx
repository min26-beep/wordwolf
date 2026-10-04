import React, { useEffect, useState } from "react";
import Home from "./screens/Home.jsx";
import Topics from "./screens/Topics.jsx";
import Setup from "./screens/Setup.jsx";
import TopicPicker from "./screens/TopicPicker.jsx";
import Reveal from "./screens/Reveal.jsx";
import Talk from "./screens/Talk.jsx";
import Result from "./screens/Result.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { DEFAULT_TOPICS } from "./data/defaultTopics.js";
import { sanitizeTopics } from "./lib/topics.js";
import { DEFAULT_SETTINGS, clampSettings, createRound, pickRandomTopic } from "./lib/game.js";

const TOPICS_KEY = "wordwolf:topics:v1";
const SETTINGS_KEY = "wordwolf:settings:v1";

export default function App() {
  const [topics, setTopics] = usePersistentState(TOPICS_KEY, DEFAULT_TOPICS,
    (v) => sanitizeTopics(v, DEFAULT_TOPICS));
  const [settings, setSettings] = usePersistentState(SETTINGS_KEY, DEFAULT_SETTINGS, clampSettings);
  const [screen, setScreen] = useState("home");
  const [round, setRound] = useState(null);
  const [lastTopicId, setLastTopicId] = useState(null);
  const [quitOpen, setQuitOpen] = useState(false);

  // お題確認中は画面のふち（ノッチ周りなど）も夜色にする
  useEffect(() => {
    document.documentElement.dataset.tone = screen === "reveal" ? "night" : "light";
  }, [screen]);

  const go = (s) => { setScreen(s); window.scrollTo(0, 0); };

  const beginWith = (topic) => {
    if (!topic) return go("setup");
    setRound(createRound({ players: settings.players, wolves: settings.wolves, topic, names: settings.names }));
    setLastTopicId(topic.id);
    go("reveal");
  };

  // ランダムなら直前と違うお題で即開始、自分で選ぶなら選択画面へ
  const newGame = () => {
    if (settings.topicMode === "select") go("pick");
    else beginWith(pickRandomTopic(topics, lastTopicId));
  };

  const quit = () => { setQuitOpen(false); setRound(null); go("home"); };

  let view;
  switch (screen) {
    case "topics":
      view = <Topics topics={topics} setTopics={setTopics} onBack={() => go("home")} />;
      break;
    case "setup":
      view = <Setup settings={settings} setSettings={setSettings} topicCount={topics.length}
        onStart={newGame} onBack={() => go("home")} onManage={() => go("topics")} />;
      break;
    case "pick":
      view = <TopicPicker topics={topics} lastTopicId={lastTopicId} onPick={beginWith}
        onRandom={() => beginWith(pickRandomTopic(topics, lastTopicId))} onBack={() => go("setup")} />;
      break;
    case "reveal":
      view = <Reveal round={round}
        onDone={() => go("talk")} onQuit={() => setQuitOpen(true)} />;
      break;
    case "talk":
      view = <Talk talkSeconds={settings.talkSeconds} onResult={() => go("result")}
        onQuit={() => setQuitOpen(true)} />;
      break;
    case "result":
      view = <Result round={round} onReplay={newGame} onHome={() => go("home")} />;
      break;
    default:
      view = <Home topicCount={topics.length} onStart={() => go("setup")} onManage={() => go("topics")} />;
  }

  return (
    <>
      {view}
      <ConfirmDialog open={quitOpen} message="ゲームをやめますか？" detail="ホームに戻ります。"
        confirmLabel="やめる" cancelLabel="続ける" danger
        onCancel={() => setQuitOpen(false)} onConfirm={quit} />
    </>
  );
}
