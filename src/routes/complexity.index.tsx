import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { ComplexityBadgeCell } from "@/components/ComplexityTable";
import { PrevNext } from "@/components/PrevNext";
import { Clock, HardDrive, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/complexity/")({
  head: () => ({
    meta: [
      { title: "Complexity Cheat Sheets — Python Lists" },
      { name: "description", content: "Time and space complexity reference for Python list operations, sorting, searching, and interview patterns." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Reference"
        title="Complexity Cheat Sheets"
        description="Two dedicated, searchable references — one for time, one for space — covering every list operation, sorting and searching algorithm, and common interview pattern."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/complexity/time"
          className="card-surface group flex flex-col gap-3 p-5 hover:border-[color:var(--brand)] transition"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md gradient-brand text-primary-foreground">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <div className="text-base font-semibold">Time Complexity</div>
              <div className="text-xs text-muted-foreground">Best / Average / Worst</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            43 operations across list methods, 11 sorting algorithms, 5 searching algorithms, and interview patterns.
          </p>
          <div className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand)]">
            Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          to="/complexity/space"
          className="card-surface group flex flex-col gap-3 p-5 hover:border-[color:var(--brand)] transition"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md gradient-brand text-primary-foreground">
              <HardDrive className="h-5 w-5" />
            </span>
            <div>
              <div className="text-base font-semibold">Space Complexity</div>
              <div className="text-xs text-muted-foreground">Auxiliary memory usage</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Extra memory each operation, algorithm, and popular interview solution actually uses.
          </p>
          <div className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand)]">
            Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      <Callout kind="did" title="Big-O color key">
        <div className="flex flex-wrap gap-2">
          <ComplexityBadgeCell value="O(1)" /> constant
          <ComplexityBadgeCell value="O(log n)" /> logarithmic
          <ComplexityBadgeCell value="O(n)" /> linear
          <ComplexityBadgeCell value="O(n log n)" /> linearithmic
          <ComplexityBadgeCell value="O(n²)" /> quadratic
          <ComplexityBadgeCell value="O(2^n)" /> exponential
        </div>
      </Callout>

      <PrevNext current="/complexity" />
    </PageShell>
  );
}
