import React from "react";
import { MAX_NAME_LENGTH } from "../lib/game.js";

/** 参加人数ぶんの名前入力。空欄でもOK（「1人目」などで表示） */
export default function NameInputs({ count, names, onChange }) {
  const set = (i, v) => {
    const next = [...names];
    while (next.length < count) next.push("");
    next[i] = v;
    onChange(next);
  };
  return (
    <ol className="names">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="name-item">
          <span className="name-no" aria-hidden="true">{i + 1}</span>
          <input
            value={names[i] ?? ""}
            maxLength={MAX_NAME_LENGTH}
            placeholder={`${i + 1}人目`}
            aria-label={`${i + 1}人目の名前`}
            enterKeyHint={i + 1 < count ? "next" : "done"}
            autoComplete="off"
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                const inputs = e.currentTarget.closest(".names").querySelectorAll("input");
                if (inputs[i + 1]) inputs[i + 1].focus(); else e.currentTarget.blur();
              }
            }}
          />
        </li>
      ))}
    </ol>
  );
}
