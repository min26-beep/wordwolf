import { useEffect, useState } from "react";
import { load, save } from "../lib/storage.js";

/** useState + localStorage 自動保存 */
export function usePersistentState(key, initial, sanitize = (v) => v) {
  const [value, setValue] = useState(() => sanitize(load(key, initial)));
  useEffect(() => save(key, value), [key, value]);
  return [value, setValue];
}
