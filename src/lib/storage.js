// localStorage の読み書き（失敗しても画面が壊れないよう必ず try/catch）
export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 保存できない環境でもゲームは続けられる */
  }
}
