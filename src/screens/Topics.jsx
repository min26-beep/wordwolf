import React, { useRef, useState } from "react";
import Screen, { TopBar } from "../components/Screen.jsx";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { MAX_WORD_LENGTH, newTopicId, restoreDefaults, validateTopic } from "../lib/topics.js";
import { DEFAULT_TOPICS } from "../data/defaultTopics.js";

function TopicForm({ topics, editing, onSubmit, onCancel }) {
  const [a, setA] = useState(editing?.a ?? "");
  const [b, setB] = useState(editing?.b ?? "");
  const [error, setError] = useState(null);
  const aRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    const err = validateTopic(topics, a, b, editing?.id ?? null);
    if (err) return setError(err);
    onSubmit({ a: a.trim(), b: b.trim() });
    if (!editing) {
      setA(""); setB(""); setError(null);
      aRef.current?.focus();
    }
  };

  return (
    <form className={`topic-form ${editing ? "is-editing" : ""}`} onSubmit={submit} noValidate>
      <div className="topic-inputs">
        <label className="field">
          <span className="field-label">ワードA</span>
          <input ref={aRef} value={a} maxLength={MAX_WORD_LENGTH} placeholder="例：海"
            onChange={(e) => { setA(e.target.value); setError(null); }} enterKeyHint="next" />
        </label>
        <span className="topic-vs" aria-hidden="true">／</span>
        <label className="field">
          <span className="field-label">ワードB</span>
          <input value={b} maxLength={MAX_WORD_LENGTH} placeholder="例：プール"
            onChange={(e) => { setB(e.target.value); setError(null); }} enterKeyHint="done" />
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="topic-form-actions">
        {editing && <Button variant="secondary" onClick={onCancel}>キャンセル</Button>}
        <button type="submit" className="btn btn-primary btn-md">{editing ? "保存" : "追加"}</button>
      </div>
    </form>
  );
}

export default function Topics({ topics, setTopics, onBack }) {
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const editing = topics.find((t) => t.id === editingId) ?? null;
  const missingDefaults = restoreDefaults(topics, DEFAULT_TOPICS).length - topics.length;

  const add = ({ a, b }) => setTopics((ts) => [{ id: newTopicId(), a, b }, ...ts]);
  const update = ({ a, b }) => {
    setTopics((ts) => ts.map((t) => (t.id === editingId ? { ...t, a, b } : t)));
    setEditingId(null);
  };
  const startEdit = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Screen top={<TopBar onBack={onBack} backLabel="ホーム" title="お題" right={`${topics.length}組`} />}>
      <TopicForm key={editingId ?? "new"} topics={topics} editing={editing}
        onSubmit={editing ? update : add} onCancel={() => setEditingId(null)} />

      {topics.length === 0 ? (
        <p className="empty">お題がありません。上のフォームから追加してください。</p>
      ) : (
        <ul className="topic-list">
          {topics.map((t) => (
            <li key={t.id} className={`topic-row ${t.id === editingId ? "is-editing" : ""}`}>
              <span className="topic-words">
                <span>{t.a}</span><span className="topic-slash">／</span><span>{t.b}</span>
              </span>
              <span className="topic-actions">
                <Button variant="ghost" size="sm" onClick={() => startEdit(t.id)}>編集</Button>
                <Button variant="ghost-danger" size="sm" onClick={() => setDeleting(t)}>削除</Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {missingDefaults > 0 && (
        <div className="restore">
          <Button variant="ghost" size="sm" onClick={() => setConfirmRestore(true)}>
            削除した初期お題を戻す（{missingDefaults}組）
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        message="このお題を削除しますか？"
        detail={deleting ? `${deleting.a} ／ ${deleting.b}` : ""}
        confirmLabel="削除" danger
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setTopics((ts) => ts.filter((t) => t.id !== deleting.id));
          if (editingId === deleting.id) setEditingId(null);
          setDeleting(null);
        }}
      />
      <ConfirmDialog
        open={confirmRestore}
        message="削除した初期お題を戻しますか？"
        detail="自分で追加したお題はそのまま残ります。"
        confirmLabel="戻す"
        onCancel={() => setConfirmRestore(false)}
        onConfirm={() => { setTopics((ts) => restoreDefaults(ts, DEFAULT_TOPICS)); setConfirmRestore(false); }}
      />
    </Screen>
  );
}
