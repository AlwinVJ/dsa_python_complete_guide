import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

/**
 * CodeViewer — the standardized code panel used across every interactive
 * playground (Sorting, Searching, Recursion, Divide & Conquer, and any
 * future playground).
 *
 * Features:
 *  - Python syntax highlighting
 *  - Active-line highlighting with auto-scroll
 *  - Line numbers
 *  - Copy button
 *  - Expand / Collapse (compact vs full height)
 *  - Optional fullscreen mode
 *  - Responsive: uses full available width, no forced narrow column
 *
 * Reuse this component from every playground — do not build module-specific
 * code panels.
 */

const KEYWORDS = new Set([
  "def", "return", "if", "else", "elif", "for", "while", "in", "not", "and",
  "or", "True", "False", "None", "import", "from", "as", "class", "try",
  "except", "finally", "with", "lambda", "yield", "break", "continue",
  "pass", "is", "global", "nonlocal", "raise", "assert",
]);
const BUILTINS = new Set([
  "list", "len", "range", "print", "enumerate", "zip", "map", "filter",
  "sum", "min", "max", "any", "all", "sorted", "reversed", "abs", "int",
  "str", "float", "bool", "dict", "set", "tuple", "input", "type", "open",
  "copy", "deepcopy",
]);

function highlight(line: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const regex =
    /(#.*$)|("[^"]*"|'[^']*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([^\w\s]+)|(\s+)/g;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(line)) !== null) {
    const [tok] = m;
    if (m[1]) {
      tokens.push(
        <span key={key++} style={{ color: "var(--code-comment)" }}>
          {tok}
        </span>,
      );
    } else if (m[2]) {
      tokens.push(
        <span key={key++} style={{ color: "var(--code-string)" }}>
          {tok}
        </span>,
      );
    } else if (m[3]) {
      tokens.push(
        <span key={key++} style={{ color: "var(--code-number)" }}>
          {tok}
        </span>,
      );
    } else if (m[4]) {
      if (KEYWORDS.has(tok)) {
        tokens.push(
          <span key={key++} style={{ color: "var(--code-keyword)" }}>
            {tok}
          </span>,
        );
      } else if (BUILTINS.has(tok)) {
        tokens.push(
          <span key={key++} style={{ color: "var(--code-func)" }}>
            {tok}
          </span>,
        );
      } else {
        tokens.push(<span key={key++}>{tok}</span>);
      }
    } else {
      tokens.push(<span key={key++}>{tok}</span>);
    }
  }
  return tokens;
}

export interface CodeViewerProps {
  code: string;
  /** File / algorithm label shown in the header (e.g. "merge_sort.py"). */
  title?: string;
  /**
   * 1-indexed line to highlight as "currently executing".
   * Pass undefined / 0 for static code with no active line.
   */
  activeLine?: number;
  /**
   * Compact height (in px) before the user expands. Default 320.
   * The panel can always be expanded to show the full source.
   */
  compactHeight?: number;
  /** Start expanded (show full source, no scroll cap). Default false. */
  defaultExpanded?: boolean;
  /** Enable the fullscreen overlay button. Default true. */
  allowFullscreen?: boolean;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

export function CodeViewer({
  code,
  title,
  activeLine,
  compactHeight = 320,
  defaultExpanded = false,
  allowFullscreen = true,
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [fullscreen, setFullscreen] = useState(false);
  const scrollRef = useRef<HTMLPreElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const gutterWidth = String(lines.length).length;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }, [code]);

  // Auto-scroll active line into view (both compact + fullscreen).
  useEffect(() => {
    if (!activeLine) return;
    const el = activeRef.current;
    const container = scrollRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;
    if (elTop < viewTop || elBottom > viewBottom) {
      container.scrollTo({
        top: Math.max(0, elTop - container.clientHeight / 2 + el.offsetHeight / 2),
        behavior: "smooth",
      });
    }
  }, [activeLine, expanded, fullscreen]);

  // Close fullscreen with Escape.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const body = (isFs: boolean) => {
    const maxH = isFs
      ? "calc(100vh - 120px)"
      : expanded
        ? "none"
        : `${compactHeight}px`;

    return (
      <pre
        ref={scrollRef}
        className="overflow-auto p-3 text-[13px] leading-6 font-mono"
        style={{
          color: "var(--code-fg)",
          maxHeight: maxH,
        }}
      >
        <code className="block min-w-full">
          {lines.map((line, i) => {
            const lineNo = i + 1;
            const isActive = activeLine === lineNo;
            return (
              <div
                key={i}
                ref={isActive ? activeRef : undefined}
                className={
                  "flex items-start px-1 -mx-1 rounded transition-colors " +
                  (isActive
                    ? "bg-amber-500/15 border-l-2 border-amber-400"
                    : "border-l-2 border-transparent")
                }
              >
                <span
                  className="mr-3 shrink-0 select-none text-right tabular-nums pl-1"
                  style={{
                    color: isActive
                      ? "var(--code-fg)"
                      : "var(--code-comment)",
                    width: `${gutterWidth + 1}ch`,
                    opacity: isActive ? 0.9 : 0.55,
                  }}
                >
                  {lineNo}
                </span>
                <span
                  className={
                    "whitespace-pre flex-1 min-w-0 " +
                    (isActive ? "text-amber-100 font-medium" : "")
                  }
                >
                  {highlight(line)}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    );
  };

  const header = (isFs: boolean) => (
    <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shrink-0" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shrink-0" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shrink-0" />
        <span
          className="ml-2 text-xs truncate"
          style={{ color: "var(--code-comment)" }}
        >
          {title ?? "python"}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10 transition"
          style={{ color: "var(--code-fg)" }}
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="hidden sm:inline">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        {!isFs && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10 transition"
            style={{ color: "var(--code-fg)" }}
            aria-label={expanded ? "Collapse code" : "Expand code"}
          >
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">
              {expanded ? "Collapse" : "Expand"}
            </span>
          </button>
        )}
        {allowFullscreen && !isFs && (
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10 transition"
            style={{ color: "var(--code-fg)" }}
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        )}
        {isFs && (
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10 transition"
            style={{ color: "var(--code-fg)" }}
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="h-3 w-3" />
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={
          "overflow-hidden rounded-lg border border-border w-full " +
          (className ?? "")
        }
        style={{ background: "var(--code-bg)" }}
      >
        {header(false)}
        {body(false)}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFullscreen(false);
          }}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-lg border border-border shadow-2xl"
            style={{ background: "var(--code-bg)" }}
          >
            {header(true)}
            {body(true)}
          </div>
        </div>
      )}
    </>
  );
}

export default CodeViewer;
