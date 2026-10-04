// お題データの操作（純粋関数）
export const MAX_WORD_LENGTH = 20;

const norm = (s) => s.trim().normalize("NFKC").toLowerCase();

export function newTopicId() {
  return `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** 入力チェック。問題があればメッセージ、なければ null */
export function validateTopic(topics, a, b, editingId = null) {
  const A = a.trim();
  const B = b.trim();
  if (!A || !B) return "ワードAとワードBを入力してください";
  if (A.length > MAX_WORD_LENGTH || B.length > MAX_WORD_LENGTH)
    return `${MAX_WORD_LENGTH}文字以内で入力してください`;
  if (norm(A) === norm(B)) return "AとBには違うワードを入力してください";
  const dup = topics.some(
    (t) =>
      t.id !== editingId &&
      ((norm(t.a) === norm(A) && norm(t.b) === norm(B)) ||
        (norm(t.a) === norm(B) && norm(t.b) === norm(A)))
  );
  if (dup) return "同じお題がすでに登録されています";
  return null;
}

/** 削除した初期お題だけを戻す（自分で追加したお題は残す） */
export function restoreDefaults(topics, defaults) {
  const result = [...topics];
  for (const d of defaults) {
    if (!result.some((t) => t.id === d.id) && validateTopic(result, d.a, d.b) === null) {
      result.push(d);
    }
  }
  return result;
}

/** 保存データが壊れていても使える形に整える */
export function sanitizeTopics(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  return value.filter(
    (t) => t && typeof t.id === "string" && typeof t.a === "string" && typeof t.b === "string"
  );
}
