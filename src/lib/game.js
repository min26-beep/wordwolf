// ゲーム進行のロジック（純粋関数・UIから独立）
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const TALK_OPTIONS = [
  { label: "1分", seconds: 60 },
  { label: "2分", seconds: 120 },
  { label: "3分", seconds: 180 },
  { label: "5分", seconds: 300 },
  { label: "制限なし", seconds: 0 }, // 0 = 時間制限なし
];

export const DEFAULT_SETTINGS = {
  players: 4,
  wolves: 1,
  topicMode: "random", // "random" | "select"
  talkSeconds: 180,
  names: [], // 参加者の名前（空欄なら「1人目」のように表示）
};

export const MAX_NAME_LENGTH = 10;

/** 表示用の名前。未入力なら「N人目」 */
export function playerLabel(names, i) {
  const name = (names?.[i] ?? "").trim();
  return name || `${i + 1}人目`;
}

/** 「〇〇さんに」「N人目に」の呼びかけ用 */
export function playerCall(names, i) {
  const name = (names?.[i] ?? "").trim();
  return name ? `${name}さん` : `${i + 1}人目`;
}

/** ウルフ2人は5人以上から（多数派が必ず過半数になるように） */
export const maxWolves = (players) => (players >= 5 ? 2 : 1);

export function clampSettings(s = {}) {
  const players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, Number(s.players) || 4));
  const wolves = Math.min(maxWolves(players), Math.max(1, Number(s.wolves) || 1));
  const topicMode = s.topicMode === "select" ? "select" : "random";
  const talkSeconds = TALK_OPTIONS.some((o) => o.seconds === s.talkSeconds) ? s.talkSeconds : 180;
  const names = Array.isArray(s.names)
    ? s.names.slice(0, MAX_PLAYERS).map((n) => (typeof n === "string" ? n.slice(0, MAX_NAME_LENGTH) : ""))
    : [];
  return { players, wolves, topicMode, talkSeconds, names };
}

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 直前のお題をできるだけ避けてランダムに選ぶ */
export function pickRandomTopic(topics, excludeId = null, rand = Math.random) {
  if (!topics.length) return null;
  const pool = topics.length > 1 ? topics.filter((t) => t.id !== excludeId) : topics;
  return pool[Math.floor(rand() * pool.length)];
}

/** 1ラウンド分の配役を作る */
export function createRound({ players, wolves, topic, names = [] }, rand = Math.random) {
  const flip = rand() < 0.5;
  const majorityWord = flip ? topic.b : topic.a;
  const minorityWord = flip ? topic.a : topic.b;
  const order = shuffle([...Array(players).keys()], rand);
  const wolfIndexes = order.slice(0, wolves).sort((x, y) => x - y);
  const words = [...Array(players).keys()].map((i) =>
    wolfIndexes.includes(i) ? minorityWord : majorityWord
  );
  // 開始時点の名前を固定しておく（途中で設定が変わっても表示がずれない）
  const labels = [...Array(players).keys()].map((i) => playerLabel(names, i));
  const calls = [...Array(players).keys()].map((i) => playerCall(names, i));
  return { topicId: topic.id, majorityWord, minorityWord, wolfIndexes, words, labels, calls };
}
