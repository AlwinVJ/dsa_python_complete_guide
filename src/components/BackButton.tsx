import { ArrowLeft } from "lucide-react";
import { useRouter, useRouterState } from "@tanstack/react-router";

export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/") return null;

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: fallback });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back to previous page"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:border-[color:var(--brand)] transition"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
}
