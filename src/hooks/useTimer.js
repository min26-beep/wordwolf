import { useEffect, useState } from "react";

/**
 * 経過時間（ms）を返す。startedAt は Date.now() の値。
 * 画面がバックグラウンドに回っても時刻ベースなのでズレない。
 */
export function useElapsed(startedAt, running) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [running, startedAt]);
  return startedAt ? Math.max(0, now - startedAt) : 0;
}

/** 誤タップ防止：表示されてから ms 経つまで false */
export function useArmed(ms, resetKey) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    setArmed(false);
    const id = setTimeout(() => setArmed(true), ms);
    return () => clearTimeout(id);
  }, [ms, resetKey]);
  return armed;
}

/** トーク中に画面が消灯しないようにする（対応ブラウザのみ） */
export function useWakeLock(active) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock = null;
    let cancelled = false;
    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (cancelled) lock.release();
      } catch {
        /* 未対応・拒否は無視 */
      }
    };
    const onVisible = () => document.visibilityState === "visible" && request();
    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      try { lock && lock.release(); } catch { /* noop */ }
    };
  }, [active]);
}
