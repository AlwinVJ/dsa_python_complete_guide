import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { introductionToDsaCourse } from "./src/lib/courses/introduction-to-dsa";
import type { Course, Lesson, LessonSection } from "./src/lib/courses/types";

// Lucide icon mocks
const Sparkles = () => React.createElement("span", null, "✨");
const BookOpen = () => React.createElement("span", null, "📖");
const ChevronRight = () => React.createElement("span", null, "👉");
const Lightbulb = () => React.createElement("span", null, "💡");
const AlertTriangle = () => React.createElement("span", null, "⚠️");
const Trophy = () => React.createElement("span", null, "🏆");
const ExternalLink = () => React.createElement("span", null, "🔗");

// Component mocks
const motion = {
  div: ({ children, ...props }: any) => React.createElement("div", props, children),
};
const Link = ({ children, to, params, ...props }: any) => React.createElement("a", { href: typeof to === "string" ? to : "/mock-link", ...props }, children);
const CodeBlock = ({ code, title }: any) => React.createElement("pre", null, `${title}: ${code}`);
const Callout = ({ children, kind, title }: any) => React.createElement("div", { className: `callout-${kind}` }, React.createElement("strong", null, title), children);
const ComingSoon = () => React.createElement("div", null, "Coming Soon...");
const SortingRedirect = () => React.createElement("div", null, "Sorting Redirect");
const TrieRedirect = () => React.createElement("div", null, "Trie Redirect");

// Copy from LessonView.tsx logic
function isLessonEmpty(l: Lesson): boolean {
  if (l.sections && l.sections.length > 0) return false;
  return !(
    l.theory ||
    (l.bullets && l.bullets.length) ||
    l.code ||
    (l.complexity && l.complexity.length) ||
    (l.mistakes && l.mistakes.length) ||
    l.tip ||
    l.quiz ||
    (l.practice && l.practice.length) ||
    (l.references && l.references.length)
  );
}

function normalizeLesson(lesson: Lesson): LessonSection[] {
  if (lesson.sections && lesson.sections.length > 0) {
    return lesson.sections;
  }
  const sections: LessonSection[] = [];
  if (lesson.theory || (lesson.bullets && lesson.bullets.length)) {
    sections.push({
      type: "theory",
      text: lesson.theory,
      bullets: lesson.bullets,
    });
  }
  if (lesson.code) {
    sections.push({
      type: "code",
      code: lesson.code,
      title: lesson.codeTitle,
      explanation: lesson.explanation,
    });
  }
  if (lesson.complexity && lesson.complexity.length) {
    sections.push({
      type: "complexity",
      rows: lesson.complexity.map((c) => ({
        op: c.op,
        time: c.time,
        space: c.space,
      })),
    });
  }
  if (lesson.mistakes && lesson.mistakes.length) {
    sections.push({
      type: "mistakes",
      items: lesson.mistakes,
    });
  }
  if (lesson.tip) {
    sections.push({
      type: "tip",
      text: lesson.tip,
    });
  }
  if (lesson.quiz) {
    sections.push({
      type: "quiz",
      items: [
        {
          q: lesson.quiz.q,
          choices: lesson.quiz.choices,
          answer: lesson.quiz.answer,
          explain: lesson.quiz.explain,
        },
      ],
    });
  }
  if (lesson.practice && lesson.practice.length) {
    sections.push({
      type: "practice",
      groups: [
        {
          level: "Intermediate",
          items: lesson.practice,
        },
      ],
    });
  }
  if (lesson.references && lesson.references.length) {
    sections.push({
      type: "references",
      items: lesson.references,
    });
  }
  return sections;
}

function SectionRenderer({ s }: { s: LessonSection }) {
  switch (s.type) {
    case "heading":
      return React.createElement("h2", null, s.text);
    case "theory":
      return React.createElement(
        "div",
        null,
        s.text && s.text.split("\n\n").map((para, i) => React.createElement("p", { key: i }, para)),
        s.bullets &&
          React.createElement(
            "ul",
            null,
            s.bullets.map((b, i) => React.createElement("li", { key: i }, b))
          )
      );
    case "code":
      return React.createElement(
        "div",
        null,
        React.createElement(CodeBlock, { code: s.code, title: s.title }),
        s.explanation && React.createElement("p", null, s.explanation)
      );
    case "complexity":
      return React.createElement(
        "div",
        null,
        React.createElement("h3", null, "Complexity"),
        React.createElement(
          "table",
          null,
          React.createElement(
            "tbody",
            null,
            s.rows.map((r, i) =>
              React.createElement(
                "tr",
                { key: i },
                React.createElement("td", null, r.op),
                React.createElement("td", null, r.time),
                React.createElement("td", null, r.space ?? "—")
              )
            )
          )
        )
      );
    case "mistakes":
      return React.createElement(
        Callout,
        { kind: "warn", title: "Common Mistakes" },
        React.createElement(
          "ul",
          null,
          s.items.map((m, i) => React.createElement("li", { key: i }, m))
        )
      );
    case "tip":
      return React.createElement(
        "div",
        null,
        React.createElement(Lightbulb),
        React.createElement("div", null, s.title ?? "Interview Tip"),
        React.createElement("div", null, s.text)
      );
    case "callout":
      return React.createElement(Callout, { kind: s.kind, title: s.title }, s.text);
    case "quiz":
      return React.createElement(
        "section",
        null,
        React.createElement("h3", null, React.createElement(Trophy), " Quiz"),
        s.items.map((q, i) => React.createElement(QuizCard, { key: i, q }))
      );
    case "practice":
      return React.createElement(
        "section",
        null,
        React.createElement("h3", null, "Practice Problems"),
        s.groups.map((g, i) =>
          React.createElement(
            "div",
            { key: i },
            React.createElement("div", null, g.level),
            React.createElement(
              "ul",
              null,
              g.items.map((p, j) =>
                React.createElement("li", { key: j }, React.createElement("a", { href: p.url }, p.title))
              )
            )
          )
        )
      );
    case "references":
      return React.createElement(
        "section",
        null,
        React.createElement("h3", null, "References"),
        React.createElement(
          "ul",
          null,
          s.items.map((r, i) =>
            React.createElement("li", { key: i }, React.createElement("a", { href: r.url }, r.label))
          )
        )
      );
    default:
      return null;
  }
}

function QuizCard({ q }: { q: any }) {
  return React.createElement(
    "div",
    null,
    React.createElement("p", null, q.q),
    q.choices.map((c: string, i: number) => React.createElement("button", { key: i }, c))
  );
}

function LessonView({ course, lesson, index }: any) {
  if (course.comingSoon || isLessonEmpty(lesson)) {
    return React.createElement(ComingSoon);
  }

  const sections = normalizeLesson(lesson);

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, lesson.title),
    React.createElement("p", null, lesson.tagline),
    React.createElement(
      "div",
      { className: "sections-container" },
      sections.map((s, i) => React.createElement(SectionRenderer, { key: i, s }))
    )
  );
}

// Render Lesson 1
const lesson = introductionToDsaCourse.lessons[0];
const html = ReactDOMServer.renderToStaticMarkup(
  React.createElement(LessonView, {
    course: introductionToDsaCourse,
    lesson: lesson,
    index: 0,
  })
);

console.log("Welcome Lesson HTML:\n", html);

// Render Lesson 2
const lesson2 = introductionToDsaCourse.lessons[1];
const html2 = ReactDOMServer.renderToStaticMarkup(
  React.createElement(LessonView, {
    course: introductionToDsaCourse,
    lesson: lesson2,
    index: 1,
  })
);

console.log("\nWhat is a Data Structure Lesson HTML:\n", html2);
