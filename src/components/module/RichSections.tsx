import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  X,
  ArrowRight,
  Boxes,
  Layers,
  ListChecks,
  Trophy,
} from "lucide-react";
import type {
  RichModule,
  VariantSpec,
  OperationSpec,
  AlgorithmSpec,
  QuizItem,
} from "@/lib/module-schema";
import { CodeBlock } from "@/components/CodeBlock";

/* ---------- Introduction ---------- */
export function IntroductionSection({ m }: { m: RichModule }) {
  const i = m.introduction;
  return (
    <div className="space-y-6">
      <div className="card-surface p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
          Definition
        </div>
        <p className="text-foreground">{i.definition}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-surface p-5">
          <div className="mb-2 font-semibold">Why it exists</div>
          <p className="text-sm text-muted-foreground">{i.whyExists}</p>
        </div>
        {i.history && (
          <div className="card-surface p-5">
            <div className="mb-2 font-semibold">A brief history</div>
            <p className="text-sm text-muted-foreground">{i.history}</p>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PillList title="Advantages" items={i.advantages} tone="good" />
        <PillList title="Disadvantages" items={i.disadvantages} tone="bad" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PillList title="Use when…" items={i.whenToUse} tone="good" />
        <PillList title="Avoid when…" items={i.whenNotToUse} tone="bad" />
      </div>
      {i.comparedWith && i.comparedWith.length > 0 && (
        <div className="card-surface p-5">
          <div className="mb-3 font-semibold">Compared with</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {i.comparedWith.map((c) => (
              <div key={c.name} className="rounded-md border border-border bg-background/40 p-3">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PillList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  const Icon = tone === "good" ? Check : X;
  const color = tone === "good" ? "text-emerald-500" : "text-rose-500";
  return (
    <div className="card-surface p-5">
      <div className="mb-3 font-semibold">{title}</div>
      <ul className="space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
            <span className="text-muted-foreground">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Internals + Memory Diagram ---------- */
export function InternalsSection({ m }: { m: RichModule }) {
  const { internals } = m;
  return (
    <div className="space-y-6">
      <div className="card-surface p-5">
        <p className="text-foreground">{internals.summary}</p>
        <ul className="mt-4 space-y-2">
          {internals.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <MemoryDiagram m={m} />
    </div>
  );
}

export function MemoryDiagram({ m }: { m: RichModule }) {
  const { memory } = m.internals;
  return (
    <div className="card-surface p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Boxes className="h-4 w-4 text-[color:var(--brand)]" /> Memory Layout
      </div>
      <div className="rounded-md border border-border bg-background/40 p-4">
        {memory.kind === "linked" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-muted px-2 py-1 text-xs font-mono">head</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            {["A", "B", "C"].map((v, i) => (
              <div key={v} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-md border border-[color:var(--brand)]/50 bg-[color:var(--brand)]/10 px-3 py-2 text-sm font-mono"
                >
                  {v}
                  <span className="ml-2 text-xs text-muted-foreground">·next</span>
                </motion.div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                {i === 2 && (
                  <span className="rounded bg-muted px-2 py-1 text-xs font-mono">None</span>
                )}
              </div>
            ))}
          </div>
        )}
        {memory.kind === "contiguous" && (
          <div className="flex gap-0">
            {[10, 20, 30, 40, 50].map((v) => (
              <div
                key={v}
                className="w-14 border border-border bg-[color:var(--brand)]/10 py-2 text-center text-sm font-mono"
              >
                {v}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 text-xs text-muted-foreground">{memory.caption}</div>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {memory.notes.map((n, i) => (
          <li key={i}>• {n}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Variants ---------- */
export function VariantsSection({ variants }: { variants: VariantSpec[] }) {
  const [active, setActive] = useState(variants[0]?.slug);
  const cur = variants.find((v) => v.slug === active) ?? variants[0];
  if (!cur) return null;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.slug}
            onClick={() => setActive(v.slug)}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              active === v.slug
                ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
      <motion.div
        key={cur.slug}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-5"
      >
        <h3 className="text-lg font-semibold">{cur.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{cur.description}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Use cases
            </div>
            <ul className="space-y-1 text-sm">
              {cur.useCases.map((u) => (
                <li key={u}>• {u}</li>
              ))}
            </ul>
          </div>
          {(cur.pros || cur.cons) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {cur.pros && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-emerald-500">Pros</div>
                  <ul className="space-y-1 text-sm">
                    {cur.pros.map((p) => (
                      <li key={p}>+ {p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cur.cons && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-rose-500">Cons</div>
                  <ul className="space-y-1 text-sm">
                    {cur.cons.map((p) => (
                      <li key={p}>− {p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {cur.complexity && (
          <div className="mt-4 overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left">Operation</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Space</th>
                </tr>
              </thead>
              <tbody>
                {cur.complexity.map((r) => (
                  <tr key={r.op} className="border-t border-border">
                    <td className="px-3 py-2">{r.op}</td>
                    <td className="px-3 py-2 font-mono text-[color:var(--brand)]">{r.time}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{r.space ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {cur.python && (
          <div className="mt-4">
            <CodeBlock code={cur.python.code} />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Operations ---------- */
export function OperationsSection({ ops }: { ops: OperationSpec[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {ops.map((op, i) => (
        <div key={op.name} className="card-surface overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <div className="font-semibold">{op.name}</div>
              <div className="text-xs text-muted-foreground">{op.summary}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded bg-[color:var(--brand)]/10 px-2 py-0.5 font-mono text-xs text-[color:var(--brand)]">
                {op.time}
              </span>
              <ChevronRight className={`h-4 w-4 transition ${open === i ? "rotate-90" : ""}`} />
            </div>
          </button>
          {open === i && (
            <div className="border-t border-border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Step-by-step
                  </div>
                  <ol className="space-y-1.5 text-sm">
                    {op.steps.map((s, k) => (
                      <li key={k} className="flex gap-2">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--brand)]/15 text-[10px] font-bold text-[color:var(--brand)]">
                          {k + 1}
                        </span>
                        <span className="text-muted-foreground">{s}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex gap-3 text-xs">
                    <span>
                      Time: <code className="text-[color:var(--brand)]">{op.time}</code>
                    </span>
                    <span>
                      Space: <code className="text-[color:var(--brand)]">{op.space}</code>
                    </span>
                  </div>
                  {op.edgeCases && (
                    <div className="mt-3">
                      <div className="text-xs font-semibold uppercase text-amber-500">
                        Edge cases
                      </div>
                      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {op.edgeCases.map((e, k) => (
                          <li key={k}>• {e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <CodeBlock code={op.python.code} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Algorithms ---------- */
export function AlgorithmsSection({ algos }: { algos: AlgorithmSpec[] }) {
  return (
    <div className="grid gap-4">
      {algos.map((a) => (
        <div key={a.slug} className="card-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <div className="flex gap-2 text-xs">
              {a.pattern && <span className="rounded bg-muted px-2 py-0.5">{a.pattern}</span>}
              <span className="rounded bg-[color:var(--brand)]/10 px-2 py-0.5 font-mono text-[color:var(--brand)]">
                {a.time}
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono">{a.space}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            <b className="text-foreground">Problem: </b>
            {a.problem}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <b className="text-foreground">Approach: </b>
            {a.approach}
          </p>
          <div className="mt-3">
            <CodeBlock code={a.python.code} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Complexity ---------- */
export function ComplexitySection({ m }: { m: RichModule }) {
  const rows = m.complexity.operations;
  const color = (v: string) => {
    if (v.includes("1")) return "text-emerald-500";
    if (v.includes("log")) return "text-sky-500";
    if (v.includes("n^2") || v.includes("n²")) return "text-rose-500";
    return "text-amber-500";
  };
  return (
    <div className="space-y-4">
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Operation</th>
              <th className="px-4 py-3 text-left">Best</th>
              <th className="px-4 py-3 text-left">Average</th>
              <th className="px-4 py-3 text-left">Worst</th>
              <th className="px-4 py-3 text-left">Space</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.op} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{r.op}</td>
                <td className={`px-4 py-3 font-mono ${color(r.best)}`}>{r.best}</td>
                <td className={`px-4 py-3 font-mono ${color(r.avg)}`}>{r.avg}</td>
                <td className={`px-4 py-3 font-mono ${color(r.worst)}`}>{r.worst}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.space ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {m.complexity.notes && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {m.complexity.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Applications ---------- */
export function ApplicationsSection({ m }: { m: RichModule }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {m.applications.map((a) => (
        <motion.div
          key={a.area}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-surface p-4"
        >
          <div className="text-sm font-semibold text-[color:var(--brand)]">{a.area}</div>
          <div className="mt-1 text-sm text-muted-foreground">{a.example}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Interview ---------- */
export function InterviewSection({ m }: { m: RichModule }) {
  const cats: { key: keyof RichModule["interview"]; label: string }[] = [
    { key: "theory", label: "Theory" },
    { key: "coding", label: "Coding" },
    { key: "optimization", label: "Optimization" },
    { key: "edgeCase", label: "Edge Cases" },
    { key: "company", label: "Company style" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cats.map((c) => (
        <div key={c.key} className="card-surface p-5">
          <div className="mb-2 text-sm font-semibold text-[color:var(--brand)]">{c.label}</div>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {m.interview[c.key].map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ---------- FAQ ---------- */
export function FAQSection({ m }: { m: RichModule }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">{m.faqs.length} curated questions</div>
      {m.faqs.map((f, i) => (
        <div key={i} className="card-surface overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <span className="text-sm font-medium">{f.q}</span>
            <ChevronRight className={`h-4 w-4 transition ${open === i ? "rotate-90" : ""}`} />
          </button>
          {open === i && (
            <div className="border-t border-border p-4 text-sm text-muted-foreground">
              {f.a}
              {f.code && (
                <div className="mt-3">
                  <CodeBlock code={f.code} />
                </div>
              )}
              {f.related && (
                <div className="mt-2 text-xs">
                  Related: <span className="text-[color:var(--brand)]">{f.related}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Mistakes ---------- */
export function MistakesSection({ m }: { m: RichModule }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {m.mistakes.map((e, i) => (
        <div key={i} className="card-surface p-4">
          <div className="text-sm font-semibold text-rose-500">✗ {e.mistake}</div>
          <div className="mt-2 text-sm text-emerald-500">✓ {e.fix}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Quiz ---------- */
export function QuizSection({ m }: { m: RichModule }) {
  const key = `dsa-quiz:${m.slug}`;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnswers(parsed.answers ?? {});
        setSubmitted(parsed.submitted ?? {});
      }
    } catch {
      /* ignore */
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ answers, submitted }));
    } catch {
      /* ignore */
    }
  }, [key, answers, submitted]);

  const score = m.quiz.reduce(
    (acc, q, i) => acc + (submitted[i] && answers[i] === q.answer ? 1 : 0),
    0,
  );
  const attempted = Object.values(submitted).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="card-surface flex items-center justify-between p-4">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[color:var(--brand)]" /> Your score
          </div>
          <div className="text-xs text-muted-foreground">
            {attempted} of {m.quiz.length} attempted
          </div>
        </div>
        <div className="text-2xl font-bold text-[color:var(--brand)]">
          {score}/{m.quiz.length}
        </div>
      </div>
      {m.quiz.map((q, i) => (
        <QuizCard
          key={i}
          idx={i}
          q={q}
          chosen={answers[i]}
          isSubmitted={!!submitted[i]}
          onChoose={(k) => setAnswers({ ...answers, [i]: k })}
          onSubmit={() => setSubmitted({ ...submitted, [i]: true })}
        />
      ))}
    </div>
  );
}

function QuizCard({
  idx,
  q,
  chosen,
  isSubmitted,
  onChoose,
  onSubmit,
}: {
  idx: number;
  q: QuizItem;
  chosen?: number;
  isSubmitted: boolean;
  onChoose: (k: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">
        Q{idx + 1}. {q.q}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.choices.map((c, k) => {
          const isChosen = chosen === k;
          const isCorrect = k === q.answer;
          const cls = isSubmitted
            ? isCorrect
              ? "border-emerald-500 bg-emerald-500/10"
              : isChosen
                ? "border-rose-500 bg-rose-500/10"
                : "border-border"
            : isChosen
              ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10"
              : "border-border hover:border-[color:var(--brand)]/60";
          return (
            <button
              key={k}
              disabled={isSubmitted}
              onClick={() => onChoose(k)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${cls}`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {!isSubmitted ? (
          <button
            onClick={onSubmit}
            disabled={chosen === undefined}
            className="rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
          >
            Submit
          </button>
        ) : (
          <div className="text-xs text-muted-foreground">
            {chosen === q.answer ? "✓ Correct — " : "✗ Not quite — "}
            {q.explain}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Practice ---------- */
export function PracticeSection({ m }: { m: RichModule }) {
  const groups = [
    { key: "beginner", label: "Beginner" },
    { key: "intermediate", label: "Intermediate" },
    { key: "advanced", label: "Advanced" },
    { key: "interview", label: "Interview" },
    { key: "competitive", label: "Competitive" },
  ] as const;
  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const items = m.practice[g.key];
        if (!items || items.length === 0) return null;
        return (
          <div key={g.key}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--brand)]">
              <ListChecks className="h-4 w-4" /> {g.label}{" "}
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            <div className="grid gap-2">
              {items.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/60 transition"
                >
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {p.pattern && <span>{p.pattern} · </span>}
                      {p.estMin && <span>~{p.estMin} min</span>}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs ${
                      p.difficulty === "Easy"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : p.difficulty === "Medium"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-rose-500/15 text-rose-500"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- References ---------- */
export function ReferencesSection({ m }: { m: RichModule }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {m.references.map((r) => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/60 transition"
        >
          <div className="text-sm font-medium">{r.label}</div>
          <span className="rounded bg-muted px-2 py-0.5 text-xs uppercase text-muted-foreground">
            {r.kind}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ---------- Revision ---------- */
export function RevisionSection({ m }: { m: RichModule }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card-surface p-5">
        <div className="mb-3 font-semibold">Quick Notes</div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {m.revision.quickNotes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </div>
      <div className="card-surface p-5">
        <div className="mb-3 font-semibold">Complexity Cheat Sheet</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {m.revision.cheatSheet.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2"
            >
              <span className="text-muted-foreground">{c.label}</span>
              <code className="text-[color:var(--brand)]">{c.value}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="card-surface p-5">
        <div className="mb-3 font-semibold flex items-center gap-2">
          <Layers className="h-4 w-4 text-[color:var(--brand)]" /> Interview Tips
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {m.revision.interviewTips.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </div>
      <div className="card-surface p-5">
        <div className="mb-3 font-semibold">Memory Tricks</div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {m.revision.memoryTricks.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
