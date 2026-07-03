import { useEffect, useState } from "react";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalSet(key: string) {
  const [set, setSet] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSet(new Set(read<string[]>(key, [])));
    setReady(true);
  }, [key]);
  const toggle = (id: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };
  const has = (id: string) => set.has(id);
  return { set, has, toggle, ready, size: set.size };
}
