import type { HTLesson } from "./types";

/** Hashing Fundamentals tier — how hashing works, before hash tables use it. */
export const HT_HASHING: HTLesson[] = [
  {
    slug: "introduction",
    title: "Introduction to Hashing",
    eyebrow: "Hashing · 1",
    description:
      "Hashing is the technique that turns arbitrary data into a fixed-size fingerprint. Everything a hash table does is built on it.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Hashing is the process of mapping a key of any size into an integer within a fixed range. That integer is the key's fingerprint. Two identical keys must produce the same fingerprint; two different keys usually — but not always — produce different ones.",
      },
      {
        type: "hashFlow",
        key: "cat",
        hashValue: 3141592,
        bucket: 0,
        capacity: 8,
        caption: "The key 'cat' becomes hash 3141592, which lands in bucket 3141592 % 8 = 0.",
      },
    ],
  },
  {
    slug: "why-hashing",
    title: "Why Hashing?",
    eyebrow: "Hashing · 2",
    description:
      "The trick that lets you look up a needle in a haystack without touching most of the hay.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Sequential search must compare the query with each element. Hashing computes the location *from the key itself* — you jump directly there without comparing anything else.",
      },
      {
        type: "callout",
        kind: "did",
        title: "One-shot look-up",
        text: "It doesn't matter if your table holds 10 keys or 10 million — a hash lookup performs the same handful of instructions.",
      },
    ],
  },
  {
    slug: "what-is-a-hash-function",
    title: "What is a Hash Function?",
    eyebrow: "Hashing · 3",
    description: "A pure function that takes a key and returns an integer.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "A hash function h(k) accepts any key from the key universe U and returns an integer, usually reduced modulo the table capacity m to produce a bucket index.",
      },
      {
        type: "code",
        title: "the shape of a hash function",
        code: `def h(key: str, m: int) -> int:
    return sum(ord(c) for c in key) % m

h("dog", 8)   # 3
h("god", 8)   # 3   ← collision by construction`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Bad functions are worse than no function",
        text: "The sum-of-char-codes hash above collides on every anagram. Real hash functions must mix the input aggressively.",
      },
    ],
  },
  {
    slug: "good-hash-function",
    title: "Characteristics of a Good Hash Function",
    eyebrow: "Hashing · 4",
    description: "The five properties an interviewer expects you to name.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        bullets: [
          "Deterministic — same key always maps to the same value.",
          "Uniform — outputs are spread evenly across the range.",
          "Fast — computable in O(1) with respect to the table size.",
          "Avalanche — flipping one input bit flips roughly half the output bits.",
          "Deterministic within a run — CPython adds process-level randomisation for security, but it stays fixed for the life of the process.",
        ],
      },
    ],
  },
  {
    slug: "division-method",
    title: "Division Method",
    eyebrow: "Hashing · 5",
    description: "The textbook classic — `h(k) = k mod m`.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `def h(k, m): return k % m

h(1234, 11)   # 2
h(5678, 11)   # 3`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Choose m carefully",
        text: "If m is a power of 2, only the low-order bits of k matter — pick a prime not too close to a power of 2.",
      },
    ],
  },
  {
    slug: "multiplication-method",
    title: "Multiplication Method",
    eyebrow: "Hashing · 6",
    description: "Multiply, take the fractional part, scale.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "h(k) = ⌊m · (k·A mod 1)⌋. Choose A ≈ (√5 − 1)/2 (Knuth's suggestion) for a well-distributed output. Table size m does not need to be prime.",
      },
      {
        type: "code",
        code: `import math
A = (math.sqrt(5) - 1) / 2   # ≈ 0.6180339
def h(k, m): return int(m * ((k * A) % 1))`,
      },
    ],
  },
  {
    slug: "mid-square-method",
    title: "Mid-Square Method",
    eyebrow: "Hashing · 7",
    description: "Square the key and grab the middle digits.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Square k, extract r middle digits/bits from the result, use them as the hash. Every input bit affects the middle, so the output mixes well — but multiplication of large keys is expensive.",
      },
    ],
  },
  {
    slug: "folding-method",
    title: "Folding Method",
    eyebrow: "Hashing · 8",
    description: "Split the key into chunks, add them together, then mod.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `def fold(k, m, chunk=3):
    s = str(k); total = 0
    for i in range(0, len(s), chunk):
        total += int(s[i:i+chunk])
    return total % m

fold(123_456_789, 100)   # 68  →  123 + 456 + 789 = 1368 → 68`,
      },
    ],
  },
  {
    slug: "digit-extraction",
    title: "Digit Extraction Method",
    eyebrow: "Hashing · 9",
    description: "Keep only the digits that vary the most.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "If the keys share a common prefix (student IDs like 2024xxxx), drop the shared digits and hash on the varying ones. Cheap and effective when the key structure is known.",
      },
    ],
  },
  {
    slug: "universal-hashing",
    title: "Universal Hashing",
    eyebrow: "Hashing · 10",
    description: "Pick the hash function randomly at run time to defeat adversaries.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "A universal family H of hash functions has the property that, for any two distinct keys x ≠ y, Pr[h(x) = h(y)] ≤ 1/m when h is chosen uniformly from H. Picking h at run time makes it impossible for an attacker to craft colliding inputs ahead of time.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Where Python uses it",
        text: "PEP 456 introduced randomised SipHash in CPython so that hash(str) varies per process — a lightweight universal-hashing style defense against DoS by hash collisions.",
      },
    ],
  },
  {
    slug: "polynomial-hashing",
    title: "Polynomial Hashing",
    eyebrow: "Hashing · 11",
    description: "The workhorse hash for strings — treat the string as a base-p number.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def poly_hash(s, p=31, m=10**9 + 7):
    h = 0
    for ch in s:
        h = (h * p + ord(ch)) % m
    return h`,
      },
      {
        type: "callout",
        kind: "did",
        title: "Why prime base",
        text: "Using a prime like 31 or 53 spreads similar strings across the modulus. This is the exact recipe Java's `String.hashCode` uses.",
      },
    ],
  },
  {
    slug: "rolling-hash",
    title: "Rolling Hash",
    eyebrow: "Hashing · 12",
    description: "Update a polynomial hash in O(1) when the window slides by one character.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "For a substring, when you add a new right character and drop the left one, you don't recompute the whole polynomial — you subtract the leftmost term and multiply by the base. Foundational to Rabin-Karp string matching.",
      },
      {
        type: "code",
        code: `# slide window by 1 in O(1)
new_hash = ((old_hash - ord(left) * p_pow) * p + ord(right)) % m`,
      },
    ],
  },
  {
    slug: "perfect-hashing",
    title: "Perfect Hashing",
    eyebrow: "Hashing · 13",
    description: "A hash function that guarantees zero collisions on a known key set.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "When the set of keys is known in advance and never changes, we can construct a two-level hash scheme (FKS) that guarantees O(1) worst-case look-up. Widely used in compilers for keyword lookup.",
      },
    ],
  },
  {
    slug: "cryptographic-hashing",
    title: "Cryptographic Hashing",
    eyebrow: "Hashing · 14",
    description: "Hash functions strong enough that inverting them is infeasible.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "SHA-256, SHA-3, BLAKE3 — all produce 256-bit fingerprints.",
          "Design goals include preimage resistance and collision resistance.",
          "Much slower than data-structure hashes — never use for `dict` keys.",
          "Do use for: password hashing (with a KDF like bcrypt), file integrity, git commit IDs.",
        ],
      },
    ],
  },
  {
    slug: "string-hashing",
    title: "String Hashing",
    eyebrow: "Hashing · 15",
    description: "The techniques a language runtime uses to hash strings quickly.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        title: "CPython (SipHash-2-4, simplified)",
        code: `# real code lives in Python/pyhash.c
# uses a per-process key + SipHash to defeat hash-flooding attacks
hash("hello")   # some 64-bit int, changes every process`,
      },
    ],
  },
  {
    slug: "integer-hashing",
    title: "Integer Hashing",
    eyebrow: "Hashing · 16",
    description: "In Python, `hash(int) == int` — with one twist.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `hash(42)       # 42
hash(-1)       # -2   ← -1 is reserved to mean "error"
hash(2**61)    # 1    ← Mersenne prime wrap-around`,
      },
      {
        type: "callout",
        kind: "did",
        title: "Modular identity",
        text: "CPython hashes integers modulo the Mersenne prime 2^61 − 1 so that large ints stay hashable in O(1).",
      },
    ],
  },
  {
    slug: "load-factor",
    title: "Load Factor",
    eyebrow: "Hashing · 17",
    description: "The single number that predicts a hash table's speed.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Load factor α = n / m, where n is the number of stored entries and m is the number of buckets. Low α → few collisions → fast operations. High α → many collisions → slow.",
      },
      {
        type: "buckets",
        capacity: 8,
        buckets: [
          [{ key: "a" }],
          [{ key: "b" }],
          [{ key: "c" }],
          null,
          [{ key: "d" }],
          null,
          [{ key: "e" }],
          [{ key: "f" }],
        ],
        showLoadFactor: true,
        caption: "6 keys in 8 buckets → α = 0.75. Time to resize.",
      },
    ],
  },
  {
    slug: "hash-collisions",
    title: "Hash Collisions",
    eyebrow: "Hashing · 18",
    description: "Two different keys, one bucket. Inevitable by counting.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "The key universe is much larger than the table (usernames = infinite, buckets = a few thousand), so by the pigeonhole principle collisions must happen. The question is not *whether* they happen but *how* the table handles them.",
      },
      {
        type: "buckets",
        capacity: 6,
        buckets: [null, [{ key: "cat" }, { key: "dog" }], null, null, null, null],
        collisionIndex: 1,
        caption: "Both 'cat' and 'dog' land in bucket 1 — a collision.",
      },
    ],
  },
  {
    slug: "collision-resolution",
    title: "Collision Resolution",
    eyebrow: "Hashing · 19",
    description: "The two families every implementation picks from.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Separate chaining — each bucket owns a list (or tree) of colliding entries.",
          "Open addressing — everything lives in the table; on collision, probe elsewhere.",
          "Modern CPython dict uses open addressing with a perturbed probe.",
          "Java HashMap uses separate chaining, upgraded to a tree past 8 entries.",
        ],
      },
    ],
  },
  {
    slug: "separate-chaining",
    title: "Separate Chaining",
    eyebrow: "Hashing · 20",
    description: "Bucket holds a linked list — simple, robust, slightly cache-unfriendly.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "buckets",
        capacity: 6,
        buckets: [
          null,
          [
            { key: "cat", value: 1 },
            { key: "dog", value: 2 },
            { key: "bat", value: 3 },
          ],
          null,
          [{ key: "ant", value: 4 }],
          null,
          null,
        ],
        caption: "Bucket 1 chains three colliding keys; bucket 3 has one.",
      },
      {
        type: "code",
        title: "insert",
        code: `b = buckets[hash(k) % m]
for i, (kk, _) in enumerate(b):
    if kk == k: b[i] = (k, v); return
b.append((k, v))`,
      },
    ],
  },
  {
    slug: "open-addressing",
    title: "Open Addressing",
    eyebrow: "Hashing · 21",
    description: "No side lists — probe the table until you find an empty slot.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "In open addressing, every entry lives inside the array. A collision on slot i means try i+1, then i+2 (linear), or i+1², i+2² (quadratic), or some second-hash step (double hashing).",
      },
      {
        type: "callout",
        kind: "perf",
        title: "Why CPython uses it",
        text: "Open addressing keeps the whole entry in cache — one indirection instead of two. Linked chains blow the cache.",
      },
    ],
  },
  {
    slug: "linear-probing",
    title: "Linear Probing",
    eyebrow: "Hashing · 22",
    description: "On collision, walk right by one until an empty slot appears.",
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
          null,
          null,
          null,
          null,
        ],
        probeIndices: [2, 3, 4],
        caption: "'d' hashed to 2, found it full → probed 3 → still full → landed at 4.",
      },
      {
        type: "code",
        code: `def insert(k, v):
    i = hash(k) % m
    while table[i] is not None and table[i][0] != k:
        i = (i + 1) % m
    table[i] = (k, v)`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Primary clustering",
        text: "Long runs of filled slots snowball — every collision extends the run. Load factor > 0.7 turns this ugly fast.",
      },
    ],
  },
  {
    slug: "quadratic-probing",
    title: "Quadratic Probing",
    eyebrow: "Hashing · 23",
    description: "Take longer jumps to break up primary clusters.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def probe(i, k):
    for j in range(m):
        yield (i + j*j) % m   # 1, 4, 9, 16, ...`,
      },
      {
        type: "callout",
        kind: "info",
        title: "Table size matters",
        text: "Quadratic probing may not reach every slot unless m is prime and load factor < 0.5. Choose sizes carefully.",
      },
    ],
  },
  {
    slug: "double-hashing",
    title: "Double Hashing",
    eyebrow: "Hashing · 24",
    description: "The step size comes from a second hash function — the gold standard.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def probe(k):
    i = h1(k) % m
    step = 1 + (h2(k) % (m - 1))
    for _ in range(m):
        yield i
        i = (i + step) % m`,
      },
      {
        type: "callout",
        kind: "did",
        title: "Near-uniform distribution",
        text: "Double hashing behaves closest to the theoretical 'random probe' analysis — the one behind the O(1) average bounds you cite in interviews.",
      },
    ],
  },
  {
    slug: "robin-hood-hashing",
    title: "Robin Hood Hashing",
    eyebrow: "Hashing · 25",
    description: "Steal from the rich, give to the poor — flatten the probe distances.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "During insertion, if the current entry has probed less than the incoming key, swap them and continue with the displaced entry. Keeps the variance of probe distances tiny.",
      },
    ],
  },
  {
    slug: "cuckoo-hashing",
    title: "Cuckoo Hashing",
    eyebrow: "Hashing · 26",
    description: "Two tables, two hash functions, worst-case O(1) look-up.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Every key is stored in one of two positions, given by h1 and h2. On collision, the incumbent is kicked out into its alternate slot — cuckoo-style. Look-up checks only two slots, guaranteeing O(1) worst case.",
      },
    ],
  },
  {
    slug: "rehashing",
    title: "Rehashing",
    eyebrow: "Hashing · 27",
    description: "When the load factor grows, allocate a bigger table and re-insert everyone.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def rehash(table, new_cap):
    new_table = [None] * new_cap
    for slot in table:
        if slot is not None:
            k, v = slot
            insert_into(new_table, k, v)
    return new_table`,
      },
      {
        type: "callout",
        kind: "perf",
        title: "Amortised analysis",
        text: "Rehashing is O(n), but it happens only when the table doubles — so the per-op cost averaged over many inserts remains O(1).",
      },
    ],
  },
  {
    slug: "dynamic-resizing",
    title: "Dynamic Resizing",
    eyebrow: "Hashing · 28",
    description: "Grow when full, shrink when empty — the growth policy of a real dict.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Common policy: double when α > 0.66; some implementations halve when α < 0.16. CPython grows by factor 4× for small dicts, 2× thereafter, to reduce the number of rehashes.",
      },
    ],
  },
  {
    slug: "hashing-complexity",
    title: "Hashing Complexity",
    eyebrow: "Hashing · 29",
    description: "Time and space costs of the strategies you've just learnt.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "chaining · get", time: "O(1 + α)", note: "α = load factor" },
          { op: "linear probing · get", time: "O(1) at α<0.7 · O(n) at α→1" },
          { op: "double hashing · get", time: "O(1) at α<0.9" },
          { op: "rehash", time: "O(n)", note: "amortised O(1) per insert" },
        ],
      },
    ],
  },
  {
    slug: "common-mistakes",
    title: "Common Mistakes",
    eyebrow: "Hashing · 30",
    description: "Bugs and misconceptions that come up on every hashing question.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "mistakes",
        items: [
          "Using a mutable object as a key — dicts, lists, and sets are unhashable.",
          "Assuming `hash(x)` is stable across Python processes — it isn't (PEP 456).",
          "Choosing a power-of-two modulus with a poor hash — only the low bits contribute.",
          "Rehashing on every insert once the table is 'nearly full' — you're supposed to double capacity.",
          "Deleting from an open-addressed table without tombstones — future probes stop early and lose keys.",
        ],
      },
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Hashing · 31",
    description: "Questions specifically about the hashing mechanism itself.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "interview",
        items: [
          "What makes a hash function 'good'? Name five properties.",
          "Why does CPython randomise hash(str) between processes?",
          "Compare separate chaining vs open addressing.",
          "Explain amortised O(1) insertion despite O(n) rehashing.",
          "Design a rolling hash and use it for Rabin-Karp.",
          "How would you build a hash table that never resizes (perfect hashing)?",
          "How do tombstones work in open addressing?",
          "When does quadratic probing fail to visit every slot?",
        ],
      },
    ],
  },
  {
    slug: "practice",
    title: "Practice Problems",
    eyebrow: "Hashing · 32",
    description: "Curated problems that exercise the hashing machinery.",
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
                pattern: "hash-map complement",
              },
              {
                title: "LC 217 · Contains Duplicate",
                url: "https://leetcode.com/problems/contains-duplicate/",
                difficulty: "Easy",
                pattern: "set membership",
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
                pattern: "hash-map bucket",
              },
              {
                title: "LC 560 · Subarray Sum Equals K",
                url: "https://leetcode.com/problems/subarray-sum-equals-k/",
                difficulty: "Medium",
                pattern: "prefix sum + hash",
              },
              {
                title: "LC 128 · Longest Consecutive Sequence",
                url: "https://leetcode.com/problems/longest-consecutive-sequence/",
                difficulty: "Medium",
                pattern: "hash set",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "LC 187 · Repeated DNA Sequences",
                url: "https://leetcode.com/problems/repeated-dna-sequences/",
                difficulty: "Medium",
                pattern: "rolling hash",
              },
              {
                title: "LC 76 · Minimum Window Substring",
                url: "https://leetcode.com/problems/minimum-window-substring/",
                difficulty: "Hard",
                pattern: "sliding window + hash",
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
    eyebrow: "Hashing · 33",
    description: "Check your understanding before moving to Hash Tables.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "quiz",
        items: [
          {
            q: "Which is NOT a property of a good hash function?",
            choices: ["Deterministic", "Uniform", "Reversible", "Fast"],
            answer: 2,
            explain:
              "Reversibility is a property of *cryptographic* hashes' failure mode, not a design goal — good hashes are one-way in practice.",
          },
          {
            q: "Given m = 8 buckets and hash(k) = 27, which bucket does k land in?",
            choices: ["27", "3", "0", "8"],
            answer: 1,
            explain: "27 mod 8 = 3.",
          },
          {
            q: "Which resolution technique keeps every entry inside the main array?",
            choices: ["Separate chaining", "Open addressing", "Tombstoning", "Universal hashing"],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    slug: "references",
    title: "References",
    eyebrow: "Hashing · 34",
    description: "Original papers and the CPython source.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "PEP 456 — Secure and interchangeable hash algorithm",
            url: "https://peps.python.org/pep-0456/",
          },
          {
            label: "CPython Objects/dictobject.c",
            url: "https://github.com/python/cpython/blob/main/Objects/dictobject.c",
          },
          {
            label: "CLRS · Chapter 11 · Hash Tables",
            url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
          },
          {
            label: "Sedgewick — Universal Hashing lecture",
            url: "https://algs4.cs.princeton.edu/34hash/",
          },
        ],
      },
    ],
  },
];
