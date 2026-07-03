import { useCallback, useEffect, useState } from "react";

const KEY = "dsa-lesson-progress:v1";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function persist(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

/** Global lesson-completion store, synced across components via a window event. */
export function useLessonProgress() {
  const [done, setDone] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setDone(read());
    const onUpdate = () => setDone(read());
    window.addEventListener("dsa-lesson-progress", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("dsa-lesson-progress", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const key = (course: string, lesson: string) => `${course}/${lesson}`;

  const isDone = useCallback(
    (course: string, lesson: string) => done.has(key(course, lesson)),
    [done],
  );

  const toggle = useCallback((course: string, lesson: string) => {
    const cur = read();
    const k = key(course, lesson);
    if (cur.has(k)) cur.delete(k);
    else cur.add(k);
    persist(cur);
    setDone(new Set(cur));
    window.dispatchEvent(new Event("dsa-lesson-progress"));
  }, []);

  const courseProgress = useCallback(
    (course: string, lessonSlugs: string[]) => {
      const total = lessonSlugs.length;
      const doneCount = lessonSlugs.filter((s) => done.has(key(course, s))).length;
      const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
      return { done: doneCount, total, pct };
    },
    [done],
  );

  return { isDone, toggle, courseProgress };
}
