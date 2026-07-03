import { useEffect, useState, useCallback } from "react";
import { ROADMAP } from "./curriculum";

const PROGRESS_KEY = "dsa-progress-completed";
const STREAK_KEY = "dsa-streak";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setCompleted(new Set(read<string[]>(PROGRESS_KEY, [])));
    setReady(true);
  }, []);
  const toggle = useCallback((slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);
  const has = useCallback((slug: string) => completed.has(slug), [completed]);
  const pct = ROADMAP.length ? Math.round((completed.size / ROADMAP.length) * 100) : 0;
  return { completed, has, toggle, ready, size: completed.size, total: ROADMAP.length, pct };
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const parsed = raw ? (JSON.parse(raw) as { last: string; count: number }) : null;
      let nextCount = 1;
      if (parsed) {
        if (parsed.last === today) {
          nextCount = parsed.count;
        } else {
          const y = new Date(now);
          y.setDate(y.getDate() - 1);
          const yesterday = y.toISOString().slice(0, 10);
          nextCount = parsed.last === yesterday ? parsed.count + 1 : 1;
        }
      }
      localStorage.setItem(STREAK_KEY, JSON.stringify({ last: today, count: nextCount }));
      setStreak(nextCount);
    } catch {}
  }, []);
  return streak;
}

export function nextUnlocked(completed: Set<string>) {
  for (const item of ROADMAP) {
    if (!completed.has(item.slug)) return item;
  }
  return null;
}
