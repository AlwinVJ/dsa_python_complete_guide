import type { Course } from "./types";

export const stringsCourse: Course = {
  slug: "strings",
  title: "Strings",
  tagline: "Immutable sequences of Unicode characters in Python.",
  category: "linear",
  order: 2,
  icon: "Type",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      tagline: "What strings are and why they are special.",
      theory:
        "A string is an ordered, immutable sequence of Unicode code points. Because strings are immutable, every 'mutation' actually creates a new object — an idea that shapes both correctness and performance in Python code.",
      bullets: [
        "Strings support indexing, slicing, iteration, and membership tests.",
        "They are hashable, so they can be dict keys and set elements.",
        "Repeated concatenation in a loop is O(n²) — build with a list and join.",
      ],
      code: `s = "hello"\nprint(s[0], s[-1], len(s))\nprint("ell" in s)   # True`,
      tip: "In interviews, prefer '.join(list_of_parts)' over '+=' inside a loop.",
      quiz: {
        q: "What is the time complexity of `s + t` where both have length n?",
        choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        explain: "A new string of size 2n is allocated and both are copied.",
      },
    },
    {
      slug: "string-vs-char-array",
      title: "String vs Character Array",
      theory:
        "Unlike C, Python has no separate char type — a character is just a length-1 string. When you need mutability, convert to a list of characters, mutate, then join back.",
      code: `chars = list("cat")\nchars[0] = "b"\nprint("".join(chars))  # bat`,
      tip: "list(s) is O(n); use it once, mutate freely, then join at the end.",
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      theory:
        "CPython stores strings using a compact PEP-393 layout: 1, 2, or 4 bytes per character depending on the highest code point. Short strings and identifiers may also be *interned* so equal strings share memory.",
      bullets: [
        "ASCII-only strings use 1 byte/char plus a small header.",
        "sys.getsizeof('hi') ≈ 51 bytes on 64-bit CPython.",
        "Interning makes `'py' is 'py'` return True — but never rely on it.",
      ],
    },
    {
      slug: "creation",
      title: "Creation",
      theory:
        "Strings can be built with literals, constructors, format specifiers, or joined from iterables.",
      code: `a = "hi"\nb = 'hi'\nc = str(42)               # "42"\nd = f"{a} {c}"            # "hi 42"\ne = "-".join(["a","b"])   # "a-b"`,
    },
    {
      slug: "indexing",
      title: "Indexing",
      theory:
        "Access individual characters with 0-based positive indices or negative indices from the end.",
      code: `s = "python"\nprint(s[0], s[-1])   # p n\n# s[10] -> IndexError`,
      complexity: [{ op: "index access", time: "O(1)" }],
    },
    {
      slug: "traversal",
      title: "Traversal",
      theory: "Iterate directly over a string or over its indices when you need positions.",
      code: `for ch in "abc":\n    print(ch)\n\nfor i, ch in enumerate("abc"):\n    print(i, ch)`,
      complexity: [{ op: "full scan", time: "O(n)" }],
    },
    {
      slug: "operations",
      title: "String Operations",
      theory:
        "Common operations include concatenation, repetition, slicing, and membership testing.",
      code: `"ab" + "cd"     # "abcd"\n"ab" * 3        # "ababab"\n"hello"[1:4]    # "ell"\n"py" in "python"  # True`,
      complexity: [
        { op: "concat s + t", time: "O(n + m)" },
        { op: "slice s[a:b]", time: "O(b - a)" },
        { op: "membership", time: "O(n·m) worst case" },
      ],
    },
    {
      slug: "searching",
      title: "Searching",
      theory:
        "Use `in` for existence, `find`/`index` for the first position, and `count` for occurrences.",
      code: `s = "banana"\ns.find("na")   # 2\ns.rfind("na")  # 4\ns.count("a")   # 3\ns.index("z")   # ValueError`,
      tip: "`find` returns -1 on miss; `index` raises. Pick the one that matches your error-handling style.",
    },
    {
      slug: "pattern-matching",
      title: "Pattern Matching",
      theory:
        "For fixed patterns Python's built-ins are enough; for structured patterns reach for `re`. Classic algorithms — KMP, Rabin-Karp, Z-algorithm — power the ecosystem underneath.",
      code: `import re\nre.findall(r"\\d+", "a12 b34")   # ['12', '34']\nbool(re.match(r"^py", "python")) # True`,
      references: [
        {
          label: "re — Regular expressions (Python docs)",
          url: "https://docs.python.org/3/library/re.html",
        },
      ],
    },
    {
      slug: "built-in-methods",
      title: "Built-in Methods",
      theory: "String methods are pure functions — they return new strings, never mutate.",
      code: `"  Hi  ".strip()        # "Hi"\n"abc".upper()           # "ABC"\n"a,b,c".split(",")      # ['a','b','c']\n"-".join(["a","b"])   # "a-b"\n"abc".replace("b","B")  # "aBc"`,
    },
    {
      slug: "mutable-vs-immutable",
      title: "Mutable vs Immutable",
      theory:
        "Immutability makes strings safe to hash and share, but it means every edit copies memory. This is why building a string with `+=` inside a loop is quadratic.",
      code: `# BAD  O(n²)\nout = ""\nfor w in words:\n    out += w\n\n# GOOD O(n)\nout = "".join(words)`,
      mistakes: ["Assuming `s[0] = 'x'` will work — strings do not support item assignment."],
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Tokenising and parsing input.",
        "Hash keys, canonical identifiers, JSON/CSV I/O.",
        "Log processing, template rendering, natural-language pipelines.",
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      bullets: [
        "Reverse a string in place (convert to list first).",
        "Check if two strings are anagrams.",
        "Find the longest substring without repeating characters.",
        "Implement strStr / substring search.",
        "Group anagrams from a list of strings.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        {
          title: "LC 344 · Reverse String",
          url: "https://leetcode.com/problems/reverse-string/",
          difficulty: "Easy",
        },
        {
          title: "LC 242 · Valid Anagram",
          url: "https://leetcode.com/problems/valid-anagram/",
          difficulty: "Easy",
        },
        {
          title: "LC 3 · Longest Substring Without Repeat",
          url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          difficulty: "Medium",
        },
        {
          title: "LC 5 · Longest Palindromic Substring",
          url: "https://leetcode.com/problems/longest-palindromic-substring/",
          difficulty: "Medium",
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Which operation is NOT valid on a Python string?",
        choices: ["s[0]", "s + t", "s * 3", "s[0] = 'x'"],
        answer: 3,
        explain: "Strings are immutable; item assignment raises TypeError.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        {
          label: "Text sequence type — str",
          url: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str",
        },
        {
          label: "PEP 393 — Flexible String Representation",
          url: "https://peps.python.org/pep-0393/",
        },
      ],
    },
  ],
};
