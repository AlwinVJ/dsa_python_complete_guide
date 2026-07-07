import type { HTLesson } from "./types";

/** Tables tier — the Hash Table data structure itself, once hashing is understood. */
export const HT_TABLES: HTLesson[] = [
  {
    slug: "introduction",
    title: "Introduction",
    eyebrow: "Hash Tables · 1",
    description:
      "Now that hashing is clear, wire it into a full data structure with insert / search / delete / update.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A Hash Table is a fixed-size array of buckets plus a hash function. To store (k, v) you compute i = h(k) mod m and drop the pair into bucket i. To look up k you compute the same index and inspect the bucket.",
      },
      { type: "playground" },
    ],
  },
  {
    slug: "internal-structure",
    title: "Internal Structure",
    eyebrow: "Hash Tables · 2",
    description: "The three moving parts every implementation ships with.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "An array `table[0..m-1]` of buckets.",
          "A hash function `h(key) → int`.",
          "A collision policy (chaining or open addressing).",
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "Load factor lives here too",
        text: "The implementation also tracks `n` (entry count) so it can trigger a resize when n/m grows past its threshold.",
      },
    ],
  },
  {
    slug: "buckets",
    title: "Buckets",
    eyebrow: "Hash Tables · 3",
    description: "The atomic unit — one array slot.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "In separate chaining, a bucket holds a small list of colliding entries. In open addressing, a bucket holds at most one entry plus a flag (empty / occupied / tombstone).",
      },
      {
        type: "buckets",
        capacity: 6,
        buckets: [
          null,
          [
            { key: "hi", value: 1 },
            { key: "ho", value: 2 },
          ],
          null,
          [{ key: "ha", value: 3 }],
          null,
          null,
        ],
        caption: "Bucket 1 is a chain of 2; bucket 3 is a single entry.",
      },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Hash Tables · 4",
    description: "Contiguous slots on the heap, plus per-entry payloads.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "The bucket array is one contiguous allocation. Chained entries live on the heap and are linked via `next` pointers. CPython uses a compact 3-tuple (hash, key, value) per entry and packs indices in a separate small array to save cache.",
      },
    ],
  },
  {
    slug: "creating-a-hash-table",
    title: "Creating a Hash Table",
    eyebrow: "Hash Tables · 5",
    description:
      "In Python you rarely 'create' one — `{}` and `dict()` already give you the industrial-grade version.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        title: "creating dicts and sets",
        code: `empty  = {}                       # empty dict
counts = {"a": 1, "b": 2}         # literal
lookup = dict(alice=1, bob=2)     # kwargs
seen   = set()                    # empty set (NOT {})
uniq   = {1, 2, 3}                # set literal`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Empty set gotcha",
        text: "`{}` is an *empty dict*, not an empty set. Use `set()` for a fresh empty set.",
      },
    ],
  },
  {
    slug: "insert",
    title: "Insert",
    eyebrow: "Hash Tables · 6",
    description: "Put a new (key, value) pair — or overwrite an existing key.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `d = {}
d["alice"] = 1        # insert
d["alice"] = 99       # overwrite in place, same bucket
d.setdefault("bob", []).append(4)   # insert if missing then act`,
      },
      {
        type: "complexity",
        rows: [{ op: "insert", time: "O(1) avg · O(n) worst", space: "O(1)" }],
      },
      {
        type: "dryRun",
        headers: ["Op", "Bucket (mod 8)", "State"],
        rows: [
          ["d['alice'] = 1", "5", "{alice:1}"],
          ["d['bob']   = 2", "3", "{alice:1, bob:2}"],
          ["d['alice'] = 99", "5", "{alice:99, bob:2}  ← overwrite"],
        ],
      },
    ],
  },
  {
    slug: "search",
    title: "Search",
    eyebrow: "Hash Tables · 7",
    description: "Locate a value by key — the operation you optimise everything else for.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `d = {"a": 1, "b": 2}
d["a"]           # 1
d.get("z", 0)    # 0    ← safe lookup with default
"a" in d         # True`,
      },
      { type: "complexity", rows: [{ op: "search", time: "O(1) avg · O(n) worst" }] },
    ],
  },
  {
    slug: "delete",
    title: "Delete",
    eyebrow: "Hash Tables · 8",
    description: "Remove an entry — and, in open addressing, leave a tombstone.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `d = {"a": 1, "b": 2, "c": 3}
del d["b"]              # KeyError if missing
d.pop("z", None)        # safe, returns None
d.pop("c")              # returns 3`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Tombstones",
        text: "In open addressing, a naïve delete would break future probes. Implementations mark the slot as a tombstone — free for insert but transparent for lookup.",
      },
    ],
  },
  {
    slug: "update",
    title: "Update",
    eyebrow: "Hash Tables · 9",
    description: "Merge one dict into another — bulk insert with overwrite.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `a = {"x": 1, "y": 2}
b = {"y": 20, "z": 30}
a.update(b)             # a is now {'x':1, 'y':20, 'z':30}
a | b                   # 3.9+ dict-union operator (non-mutating)`,
      },
    ],
  },
  {
    slug: "traversal",
    title: "Traversal",
    eyebrow: "Hash Tables · 10",
    description: "Iterate keys, values, or pairs — always in insertion order in modern Python.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `d = {"a": 1, "b": 2, "c": 3}
for k in d:            iter over keys
for v in d.values():   iter over values
for k, v in d.items(): iter over pairs`,
      },
      {
        type: "callout",
        kind: "did",
        title: "Insertion order — since 3.7",
        text: "Before 3.7, dict iteration order was implementation-defined. It is now guaranteed to be the order of insertion.",
      },
    ],
  },
  {
    slug: "python-dictionary",
    title: "Python Dictionary",
    eyebrow: "Hash Tables · 11",
    description: "The industrial-grade hash table you already use every day.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "CPython's dict uses open addressing with a perturbed probe, compact storage, and PEP-468-guaranteed insertion order. Threshold α is ~0.66 — beyond that the table resizes.",
      },
      {
        type: "code",
        title: "the workhorse APIs",
        code: `d = {}
d["k"] = v
d.get("k", default)
d.pop("k", default)
d.setdefault("k", init).append(x)
from collections import defaultdict, Counter, OrderedDict
Counter("mississippi")   # Counter({'i':4, 's':4, 'p':2, 'm':1})`,
      },
    ],
  },
  {
    slug: "python-set",
    title: "Python Set",
    eyebrow: "Hash Tables · 12",
    description: "A hash table with only keys — O(1) membership on a value collection.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `a = {1, 2, 3}
b = {3, 4, 5}
a | b       # {1,2,3,4,5}   union
a & b       # {3}           intersection
a - b       # {1, 2}        difference
a ^ b       # {1,2,4,5}     symmetric diff
frozenset({1,2,3})   # immutable → itself hashable`,
      },
    ],
  },
  {
    slug: "custom-hash-table",
    title: "Custom Hash Table Implementation",
    eyebrow: "Hash Tables · 13",
    description: "Build a small chaining hash table end-to-end.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        title: "chaining_map.py",
        code: `class HashMap:
    def __init__(self, cap=8):
        self.cap = cap
        self.n = 0
        self.buckets = [[] for _ in range(cap)]

    def _bucket(self, k):
        return self.buckets[hash(k) % self.cap]

    def put(self, k, v):
        b = self._bucket(k)
        for i, (kk, _) in enumerate(b):
            if kk == k:
                b[i] = (k, v)
                return
        b.append((k, v))
        self.n += 1
        if self.n / self.cap > 0.66:
            self._resize(self.cap * 2)

    def get(self, k, default=None):
        for kk, v in self._bucket(k):
            if kk == k: return v
        return default

    def remove(self, k):
        b = self._bucket(k)
        for i, (kk, _) in enumerate(b):
            if kk == k:
                b.pop(i); self.n -= 1; return
        raise KeyError(k)

    def _resize(self, new_cap):
        old = self.buckets
        self.cap = new_cap
        self.buckets = [[] for _ in range(new_cap)]
        self.n = 0
        for chain in old:
            for k, v in chain:
                self.put(k, v)`,
      },
    ],
  },
  {
    slug: "handling-collisions",
    title: "Handling Collisions",
    eyebrow: "Hash Tables · 14",
    description: "Wiring in a probing scheme instead of chaining.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        title: "linear-probing map (skeleton)",
        code: `class LinearProbeMap:
    TOMB = object()   # sentinel

    def __init__(self, cap=8):
        self.cap = cap; self.n = 0
        self.table = [None] * cap

    def _probe(self, k):
        i = hash(k) % self.cap
        for _ in range(self.cap):
            if self.table[i] is None or (self.table[i] is not self.TOMB and self.table[i][0] == k):
                return i
            i = (i + 1) % self.cap
        raise RuntimeError("table full")

    def put(self, k, v):
        i = self._probe(k)
        if self.table[i] is None or self.table[i] is self.TOMB:
            self.n += 1
        self.table[i] = (k, v)`,
      },
    ],
  },
  {
    slug: "load-factor-in-practice",
    title: "Load Factor in Practice",
    eyebrow: "Hash Tables · 15",
    description: "Watching α climb until the table decides to grow.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "buckets",
        capacity: 8,
        buckets: [
          [{ key: "a" }],
          [{ key: "b" }],
          [{ key: "c" }],
          [{ key: "d" }],
          [{ key: "e" }],
          null,
          null,
          null,
        ],
        showLoadFactor: true,
        caption:
          "Five entries in eight slots → α = 0.625. One more insert triggers a resize under the 0.66 threshold.",
      },
    ],
  },
  {
    slug: "performance-analysis",
    title: "Performance Analysis",
    eyebrow: "Hash Tables · 16",
    description: "Where the constants hide in the O(1) headline.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "get / set / del", time: "O(1) avg · O(n) worst", note: "worst = total collision" },
          { op: "iteration", time: "O(n)" },
          { op: "copy", time: "O(n)" },
          { op: "len", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        title: "Real-world numbers",
        text: "A modern dict resolves ~50–100 million lookups per second per core. The bottleneck is rarely hashing; it's memory latency.",
      },
    ],
  },
  {
    slug: "applications",
    title: "Applications",
    eyebrow: "Hash Tables · 17",
    description: "The everyday problems a hash table solves in one line.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Counting occurrences — `Counter(words)`.",
          "Deduplication — `set(seen)`.",
          "Caching / memoisation — `@lru_cache`.",
          "Two-Sum / complement lookups.",
          "Adjacency lists for graphs — `defaultdict(list)`.",
          "Symbol tables in compilers.",
        ],
      },
    ],
  },
  {
    slug: "vs-arrays",
    title: "Comparison with Arrays",
    eyebrow: "Hash Tables · 18",
    description: "Look-up by index vs look-up by identity.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "array · get by index", time: "O(1)" },
          { op: "array · search by value", time: "O(n)" },
          { op: "hash table · get by key", time: "O(1) avg" },
        ],
      },
    ],
  },
  {
    slug: "vs-linked-lists",
    title: "Comparison with Linked Lists",
    eyebrow: "Hash Tables · 19",
    description: "Two very different answers to 'where does this element live?'",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A linked list must walk pointer by pointer — O(n) per look-up. A hash table computes the slot — O(1). Hash tables win on look-up; linked lists win on ordered insert-at-known-position.",
      },
    ],
  },
  {
    slug: "vs-trees",
    title: "Comparison with Trees",
    eyebrow: "Hash Tables · 20",
    description: "The choice you make when order matters.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "hash · get / set / del", time: "O(1) avg" },
          { op: "BST · get / set / del", time: "O(log n)" },
          { op: "hash · in-order iteration", time: "O(n log n) — needs sort" },
          { op: "BST · in-order iteration", time: "O(n)" },
        ],
      },
    ],
  },
  {
    slug: "vs-sets",
    title: "Comparison with Sets",
    eyebrow: "Hash Tables · 21",
    description: "Hash table without values — smaller, faster, simpler.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A set is exactly a hash table where every bucket carries only the key. The operations are identical; the memory footprint is smaller. Reach for a set the moment you don't need an associated value.",
      },
    ],
  },
  {
    slug: "complexity",
    title: "Complexity Analysis",
    eyebrow: "Hash Tables · 22",
    description: "The definitive complexity table for the exam.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "insert · avg", time: "O(1)", space: "O(n)" },
          { op: "insert · worst", time: "O(n)", note: "total collision or rehash" },
          { op: "search · avg", time: "O(1)" },
          { op: "search · worst", time: "O(n)" },
          { op: "delete · avg", time: "O(1)" },
          { op: "delete · worst", time: "O(n)" },
        ],
      },
    ],
  },
  {
    slug: "common-mistakes",
    title: "Common Mistakes",
    eyebrow: "Hash Tables · 23",
    description: "Bugs that surface in real code, not just interviews.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "mistakes",
        items: [
          "Mutating a key after insertion (e.g. custom class where __hash__ depends on a field you later change).",
          "Iterating over a dict while modifying it — raises RuntimeError.",
          "Using `d[k]` and letting KeyError propagate when you should have used `d.get(k)`.",
          "Defining `__eq__` without `__hash__` — Python then sets `__hash__ = None` and the class becomes unhashable.",
          "Assuming set / dict ordering across processes matches ordering across runs.",
        ],
      },
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Hash Tables · 24",
    description: "Questions specifically about the data structure.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "interview",
        items: [
          "Why is dict lookup O(1)? What's the worst case?",
          "Implement a hash map from scratch (chaining first, then open addressing).",
          "Design an LRU cache using a hash map + doubly linked list (LeetCode 146).",
          "Group anagrams — hash on sorted string or char-count tuple.",
          "Detect a duplicate in an array in O(n) using a set.",
          "Sub-array sum equals K — prefix sums + hash.",
          "Explain how Python's dict preserves insertion order under compact hashing.",
          "When would you prefer a tree map over a hash map?",
        ],
      },
    ],
  },
  {
    slug: "practice",
    title: "Practice Problems",
    eyebrow: "Hash Tables · 25",
    description: "Curated problems that stress the data structure.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "LC 1 · Two Sum",
                url: "https://leetcode.com/problems/two-sum/",
                difficulty: "Easy",
              },
              {
                title: "LC 242 · Valid Anagram",
                url: "https://leetcode.com/problems/valid-anagram/",
                difficulty: "Easy",
              },
              {
                title: "LC 383 · Ransom Note",
                url: "https://leetcode.com/problems/ransom-note/",
                difficulty: "Easy",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 49 · Group Anagrams",
                url: "https://leetcode.com/problems/group-anagrams/",
                difficulty: "Medium",
              },
              {
                title: "LC 3 · Longest Substring Without Repeat",
                url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
                difficulty: "Medium",
              },
              {
                title: "LC 560 · Subarray Sum Equals K",
                url: "https://leetcode.com/problems/subarray-sum-equals-k/",
                difficulty: "Medium",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "LC 146 · LRU Cache",
                url: "https://leetcode.com/problems/lru-cache/",
                difficulty: "Medium",
              },
              {
                title: "LC 460 · LFU Cache",
                url: "https://leetcode.com/problems/lfu-cache/",
                difficulty: "Hard",
              },
              {
                title: "LC 41 · First Missing Positive",
                url: "https://leetcode.com/problems/first-missing-positive/",
                difficulty: "Hard",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "quiz",
    title: "Quiz",
    eyebrow: "Hash Tables · 26",
    description: "Confirm you're ready for Review & Practice.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "quiz",
        items: [
          {
            q: "Why is `list` unhashable in Python?",
            choices: [
              "It's too big",
              "It's mutable, so its hash could change after insertion",
              "It has no __eq__",
              "Lists don't support indexing by hash",
            ],
            answer: 1,
          },
          {
            q: "What happens to CPython's dict on `del d[k]` under open addressing?",
            choices: [
              "Slot becomes empty",
              "Slot becomes a tombstone",
              "Table shrinks",
              "All subsequent probes shift left",
            ],
            answer: 1,
          },
          {
            q: "Amortised cost of insert into a table that doubles on resize?",
            choices: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    slug: "references",
    title: "References",
    eyebrow: "Hash Tables · 27",
    description: "Deep dives for the curious.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "Python docs · Mapping types — dict",
            url: "https://docs.python.org/3/library/stdtypes.html#dict",
          },
          {
            label: "Python docs · set / frozenset",
            url: "https://docs.python.org/3/library/stdtypes.html#set",
          },
          {
            label: "Raymond Hettinger · Modern Dictionaries (PyCon)",
            url: "https://www.youtube.com/watch?v=npw4s1QTmPg",
          },
          {
            label: "CPython dict source",
            url: "https://github.com/python/cpython/blob/main/Objects/dictobject.c",
          },
        ],
      },
    ],
  },
];
