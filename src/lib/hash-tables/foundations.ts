import type { HTLesson } from "./types";

/** Foundations tier — everything a learner needs BEFORE studying hashing. */
export const HT_FOUNDATIONS: HTLesson[] = [
  {
    slug: "introduction",
    title: "Introduction",
    eyebrow: "Foundations · 1",
    description: "A tour of what a hash table is, why every language ships one, and where this course is heading.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A hash table stores key/value pairs and answers 'is this key here?' in constant time on average. Python's `dict` and `set` are hash tables, and so is nearly every cache, symbol table, and lookup index you have ever used." },
      { type: "theory", bullets: [
        "Insert, search, and delete are O(1) on average.",
        "Keys are looked up by content, not by position.",
        "The magic ingredient is a hash function that turns a key into a bucket index.",
        "Understanding that ingredient is why this course teaches Hashing before Hash Tables.",
      ]},
      { type: "callout", kind: "info", title: "Where we're headed",
        text: "Foundations → Hashing Fundamentals → Hash Tables → Review. Master each tier before moving on." },
    ],
  },
  {
    slug: "why-hash-tables",
    title: "Why Hash Tables?",
    eyebrow: "Foundations · 2",
    description: "The gap that arrays and linked lists leave open — and what hash tables fill.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Given a username, how do you find its user record? An array can only look up by index (O(1)) or by scanning every element (O(n)). Sorted arrays add binary search (O(log n)) — still not free. Hash tables give you look-up by identity in O(1) on average." },
      { type: "code", title: "phone-book lookup", code:
`# array of tuples — O(n) per lookup
book = [("alice", "555-1"), ("bob", "555-2"), ("carol", "555-3")]
def find(name):
    for n, p in book:
        if n == name: return p

# dict — O(1) per lookup
book = {"alice": "555-1", "bob": "555-2", "carol": "555-3"}
book["alice"]                    # instant` },
    ],
  },
  {
    slug: "problems-arrays-linked-lists",
    title: "Problems with Arrays and Linked Lists",
    eyebrow: "Foundations · 3",
    description: "Every structure you know so far breaks down on the 'find by value' problem.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Unsorted array — search O(n).",
        "Sorted array — search O(log n), but insert O(n).",
        "Singly linked list — search and insert-at-tail O(n).",
        "Balanced BST — O(log n) but heavy pointer bookkeeping.",
        "Hash table — O(1) average across all three.",
      ]},
      { type: "callout", kind: "did", title: "The unifying idea",
        text: "Instead of searching *for* a key, a hash table computes *where the key lives*. That single flip turns O(n) into O(1)." },
    ],
  },
  {
    slug: "key-value-storage",
    title: "What is Key-Value Storage?",
    eyebrow: "Foundations · 4",
    description: "The abstract model behind dicts, maps, caches, and databases.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "A key/value store maps unique keys to associated values. The key is the search handle; the value is the payload. The store must support put(k, v), get(k), and delete(k) — nothing else is fundamental." },
      { type: "code", title: "the KV contract", code:
`put(k, v)   # store v under key k, overwriting any existing entry
get(k)      # return the value under k, or raise / default
delete(k)   # remove k, no-op if missing
contains(k) # bool` },
    ],
  },
  {
    slug: "real-world-applications",
    title: "Real-World Applications",
    eyebrow: "Foundations · 5",
    description: "Every product you use ships a hash table somewhere on the hot path.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Database indexes (hash indexes in Postgres, Redis).",
        "Compiler and interpreter symbol tables.",
        "In-memory caches (Memcached, LRU caches).",
        "Dedup: unique visitors, unique tweets, unique URLs.",
        "Routing tables in networking stacks.",
        "Language runtime: Python attribute lookup, JS object shapes.",
      ]},
    ],
  },
  {
    slug: "dictionary-vs-hash-table",
    title: "Dictionary vs Hash Table",
    eyebrow: "Foundations · 6",
    description: "Same idea, different vocabulary — plus the concrete Python answer.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "'Dictionary' is the ADT name — an unordered collection of key/value pairs. 'Hash table' is one particular implementation of that ADT. Python calls its implementation `dict`; internally it is a hash table." },
      { type: "callout", kind: "info", title: "Other implementations exist",
        text: "A dictionary can also be implemented with a balanced BST (Java's TreeMap, C++'s std::map). Same interface, different trade-offs — O(log n) instead of O(1) but ordered keys." },
    ],
  },
  {
    slug: "map-vs-hash-table",
    title: "Map vs Hash Table",
    eyebrow: "Foundations · 7",
    description: "How other languages name the same idea.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Java: `Map` interface, `HashMap` implementation.",
        "C++: `std::map` (BST) and `std::unordered_map` (hash).",
        "JavaScript: `Map` object, plus plain `{}` objects.",
        "Go: built-in `map[K]V` — hash under the hood.",
        "Python: `dict` — the only common name that hides the mechanism.",
      ]},
    ],
  },
  {
    slug: "set-vs-hash-table",
    title: "Set vs Hash Table",
    eyebrow: "Foundations · 8",
    description: "A set is a hash table with only keys — and it is faster because of it.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "A set stores unique keys with no associated values. The underlying implementation is still a hash table, but each bucket carries only the key, not a payload — so a set costs less memory and answers `in` in O(1)." },
      { type: "code", title: "when to reach for set", code:
`# deduplicating
uniq = set(seen_ids)

# membership testing
if user_id in banned:   # set → O(1) · list → O(n)
    ...` },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 9",
    description: "How a hash table lives in RAM — an array of buckets, one per slot.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "At the metal, a hash table is a plain contiguous array. Each cell — a bucket — either holds an entry, a chain of entries, or a tombstone. The array is over-allocated so most slots are empty, which keeps collisions rare." },
      { type: "buckets", capacity: 8, buckets: [
        [{ key: "alice", value: 1 }],
        null,
        [{ key: "bob", value: 2 }],
        null,
        [{ key: "carol", value: 3 }],
        null,
        null,
        [{ key: "dave", value: 4 }],
      ], showLoadFactor: true, caption: "Four entries in an 8-slot table → load factor 0.50." },
    ],
  },
  {
    slug: "advantages",
    title: "Advantages",
    eyebrow: "Foundations · 10",
    description: "Why hash tables dominate look-up-heavy workloads.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "O(1) average time for insert, search, and delete.",
        "Simple, cache-friendly array-backed layout.",
        "No ordering overhead — no rebalancing, no rotations.",
        "Natural fit for identity semantics — hash keys never collide semantically.",
      ]},
    ],
  },
  {
    slug: "disadvantages",
    title: "Disadvantages",
    eyebrow: "Foundations · 11",
    description: "The costs you pay in exchange for that O(1) look-up.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Worst-case operations are O(n) when many keys collide.",
        "Keys must be hashable — no mutable containers.",
        "No natural ordering (Python's insertion order is a runtime bonus, not a spec).",
        "Extra memory: load factor stays low so the table is deliberately half-empty.",
        "Iteration order is not sorted — costs O(n log n) if you want it sorted.",
      ]},
    ],
  },
  {
    slug: "average-vs-worst-case",
    title: "Average vs Worst Case Performance",
    eyebrow: "Foundations · 12",
    description: "The gap between the O(1) marketing pitch and the O(n) small print.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A hash table is O(1) on average — assuming keys spread uniformly across buckets. When every key lands in the same bucket, the table degenerates into a linked list and every op costs O(n)." },
      { type: "callout", kind: "warn", title: "Why interviewers care",
        text: "'Average O(1)' is the answer for the happy path. The follow-up is always 'what's the worst case, and when does it happen?' — memorise both." },
    ],
  },
  {
    slug: "time-complexity",
    title: "Time Complexity Overview",
    eyebrow: "Foundations · 13",
    description: "A single table you can keep in your head.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "get / set / delete", time: "O(1) avg · O(n) worst", note: "worst on total collision" },
        { op: "iteration", time: "O(n)", note: "one pass through all buckets" },
        { op: "resize (rehash)", time: "O(n)", note: "amortised O(1) per op" },
      ]},
    ],
  },
  {
    slug: "space-complexity",
    title: "Space Complexity Overview",
    eyebrow: "Foundations · 14",
    description: "You always pay for empty slots — that's the deal.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "Space is O(n) in the number of entries, but the constant factor is bigger than an array because the table is intentionally over-sized. Typical CPython dicts stay at load factor ≤ 0.66 — so a dict of 100 keys occupies ~150 slots." },
    ],
  },
  {
    slug: "summary",
    title: "Foundations Summary",
    eyebrow: "Foundations · 15",
    description: "The mental model you are about to build hashing on top of.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Hash tables answer key-based look-up in O(1) on average.",
        "They are the concrete implementation behind the Dictionary ADT.",
        "Space is O(n) with a small constant multiplier from load factor.",
        "Every operation depends on one thing — a good hash function.",
      ]},
      { type: "callout", kind: "tip", title: "Next up",
        text: "Now that you know *what* a hash table promises, learn *how* it can keep the promise. Continue to Hashing Fundamentals." },
    ],
  },
];
