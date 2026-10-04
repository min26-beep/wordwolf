// トーク終了の合図（音＋バイブ）。AudioContext はタップ時に作る必要がある
let ctx = null;

export function primeSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume();
  } catch { /* noop */ }
}

export function playEndSignal() {
  try { navigator.vibrate && navigator.vibrate([250, 120, 250]); } catch { /* noop */ }
  if (!ctx) return;
  try {
    [0, 0.28, 0.56].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 2 ? 1046 : 784;
      const t = ctx.currentTime + offset;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  } catch { /* noop */ }
}
