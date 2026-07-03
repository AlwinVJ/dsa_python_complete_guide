import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Section } from "@/components/ListVisualizer";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/cheatsheet")({
  head: () => ({
    meta: [
      { title: "Python List Quick Revision Sheet" },
      { name: "description", content: "The one-page revision sheet you can print or save." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHeader eyebrow="Reference" title="Quick Revision" description="One-page cheat sheet — perfect for exams and interviews." />

      <Section title="Creation">
        <CodeBlock code={`a = []                  # empty\nb = [1, 2, 3]           # literal\nc = list("abc")         # ['a','b','c']\nd = [0] * 5             # [0,0,0,0,0]\nm = [[0]*3 for _ in range(3)]   # 3x3 matrix`} />
      </Section>

      <Section title="Access & Update">
        <CodeBlock code={`x = a[0]        # first\ny = a[-1]       # last\na[2] = 42       # update\nlen(a)          # length`} />
      </Section>

      <Section title="Slicing">
        <CodeBlock code={`a[1:4]     # positions 1,2,3\na[:3]      # first 3\na[-3:]     # last 3\na[::2]     # every 2nd\na[::-1]    # reversed`} />
      </Section>

      <Section title="Add / Remove">
        <CodeBlock code={`a.append(9)       # end\na.insert(0, 1)    # index 0\na.extend([1,2])   # multiple\na.pop()           # last\na.pop(0)          # by index\na.remove(9)       # by value\ndel a[2]\na.clear()`} />
      </Section>

      <Section title="Search">
        <CodeBlock code={`9 in a\na.index(9)\na.count(9)`} />
      </Section>

      <Section title="Sort / Reverse / Copy">
        <CodeBlock code={`a.sort()             # in place\nsorted(a)            # new list\na.sort(reverse=True)\na.sort(key=len)\na.reverse()\nb = a.copy()`} />
      </Section>

      <Section title="Handy built-ins">
        <CodeBlock code={`len(a); min(a); max(a); sum(a)\nany(a); all(a)\nlist(zip(a, b))\nlist(enumerate(a))\nlist(map(str, a))\nlist(filter(None, a))`} />
      </Section>

      <PrevNext current="/cheatsheet" />
    </PageShell>
  );
}
