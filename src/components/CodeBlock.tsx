import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";

const KEYWORDS = new Set([
  "def","return","if","else","elif","for","while","in","not","and","or","True","False","None",
  "import","from","as","class","try","except","finally","with","lambda","yield","break","continue","pass","is","print",
]);
const BUILTINS = new Set([
  "list","len","range","print","enumerate","zip","map","filter","sum","min","max","any","all","sorted","reversed","abs","int","str","float","bool","dict","set","tuple","input","type","open","copy","deepcopy",
]);

function highlight(line: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const regex = /(#.*$)|("[^"]*"|'[^']*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([^\w\s]+)|(\s+)/g;
  let m;
  let key = 0;
  while ((m = regex.exec(line)) !== null) {
    const [tok] = m;
    if (m[1]) tokens.push(<span key={key++} style={{ color: "var(--code-comment)" }}>{tok}</span>);
    else if (m[2]) tokens.push(<span key={key++} style={{ color: "var(--code-string)" }}>{tok}</span>);
    else if (m[3]) tokens.push(<span key={key++} style={{ color: "var(--code-number)" }}>{tok}</span>);
    else if (m[4]) {
      if (KEYWORDS.has(tok)) tokens.push(<span key={key++} style={{ color: "var(--code-keyword)" }}>{tok}</span>);
      else if (BUILTINS.has(tok)) tokens.push(<span key={key++} style={{ color: "var(--code-func)" }}>{tok}</span>);
      else tokens.push(<span key={key++}>{tok}</span>);
    } else tokens.push(<span key={key++}>{tok}</span>);
  }
  return tokens;
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border" style={{ background: "var(--code-bg)" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs" style={{ color: "var(--code-comment)" }}>
            {title ?? "python"}
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10 transition"
          style={{ color: "var(--code-fg)" }}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ color: "var(--code-fg)" }}>
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-6 shrink-0 select-none text-right" style={{ color: "var(--code-comment)" }}>
                {i + 1}
              </span>
              <span className="whitespace-pre">{highlight(line) as ReactNode}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
