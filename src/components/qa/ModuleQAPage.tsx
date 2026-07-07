import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HelpCircle, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { PageShell, PageHeader } from "@/components/Callout";
import { FaqAccordion } from "@/components/qa/FaqAccordion";
import { InterviewQuestions } from "@/components/qa/InterviewQuestions";
import type { ModuleQA } from "@/lib/qa/types";

type Mode = "faq" | "interview";

export function ModuleQAPage({ qa, mode }: { qa: ModuleQA; mode: Mode }) {
  const isFaq = mode === "faq";
  const other = isFaq ? qa.interviewPath : qa.faqPath;
  const otherLabel = isFaq ? "Interview Questions" : "FAQ";
  const OtherIcon = isFaq ? GraduationCap : HelpCircle;

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {qa.moduleTitle} · {isFaq ? "Frequently Asked Questions" : "Interview Question Bank"}
        </div>
        <PageHeader
          eyebrow={isFaq ? "FAQ" : "Interview"}
          title={isFaq ? `${qa.moduleTitle} — FAQ` : `${qa.moduleTitle} — Interview Questions`}
          description={
            isFaq
              ? `Detailed answers to the questions learners ask most often about ${qa.moduleTitle.toLowerCase()}. Every answer is a mini lesson with code, complexity, and cross-links.`
              : `Interview-ready questions organised by difficulty — from theory warm-ups to FAANG-style problems. Each entry ships with a Python solution, complexity analysis, and lesson pointers.`
          }
        />

        <div className="-mt-4 mb-8 flex flex-wrap items-center gap-2">
          <Link
            to={other as any}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:border-[color:var(--brand)]/60"
          >
            <OtherIcon className="h-3.5 w-3.5 text-[color:var(--brand)]" />
            Switch to {otherLabel} <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to="/modules/$slug"
            params={{ slug: qa.moduleSlug }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:border-[color:var(--brand)]/60"
          >
            ← Back to {qa.moduleTitle} overview
          </Link>
        </div>
      </motion.div>

      {isFaq ? <FaqAccordion faqs={qa.faqs} /> : <InterviewQuestions questions={qa.interview} />}
    </PageShell>
  );
}
