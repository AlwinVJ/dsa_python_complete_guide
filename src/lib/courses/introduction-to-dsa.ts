import type { Course } from "./types";

export const introductionToDsaCourse: Course = {
  slug: "introduction-to-dsa",
  title: "Introduction to DSA",
  tagline:
    "A gentle on-ramp to the world of Data Structures & Algorithms in Python. Understand what DSA is, why it matters, and how to study it — before you write a single line of code in the modules that follow.",
  category: "foundation",
  order: 1,
  icon: "BookOpen",
  hidden: false,
  comingSoon: false,
  ctaText: "Start Learning Arrays →",
  ctaRoute: "/introduction",
  lessons: [
    {
      slug: "welcome",
      title: "Welcome to the Course",
      tagline: "A guided tour of what you'll build, master, and be able to explain by the end.",
      sections: [
        {
          type: "theory",
          text: "Welcome to the interactive Data Structures & Algorithms curriculum. This course takes you from the raw building blocks of memory all the way to the algorithmic patterns used by senior engineers at top-tier companies. Every module blends short, focused theory with Python code you can read in a few minutes and interactive playgrounds where you can see each operation animate step by step. The goal is not to memorize solutions — it is to develop the judgement to pick the right data structure for a problem and to prove, in Big-O terms, why it is the right one.\n\nThis first module is intentionally short and code-light. Its job is to give you the vocabulary, the mental map, and the study habits you will use for the rest of the curriculum. By the end of these seven lessons you should be able to explain, in plain English, what a data structure is, what an algorithm is, why we always study them together, why Python is a great language for learning DSA, where these ideas show up in real products, and — most importantly — how to actually study the modules that come next.",
          bullets: [
            "What you will study — foundations, linear structures, non-linear structures, and core algorithm patterns.",
            "Learning objectives — read code, reason about Big-O, implement every structure from scratch, and defend design choices.",
            "How to use the platform — theory, code, visual playgrounds, quizzes, and spaced revision sheets.",
            "Recommended study strategy — read → visualize → retype → dry-run on paper → attempt a practice problem.",
            "Expected outcome — you will be interview-ready for the DSA rounds at product and FAANG-tier companies.",
          ],
        },
        {
          type: "tip",
          text: "Treat every lesson like a mini-interview. After reading it, close the tab and explain the idea out loud in 60 seconds. If you stumble, re-read only the part you stumbled on — that is where the real learning happens.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "Which best describes the goal of this course?",
              choices: [
                "Memorize solutions to common LeetCode problems.",
                "Learn the syntax of Python.",
                "Build the judgement to pick the right data structure and justify it with Big-O.",
                "Only prepare for FAANG interviews.",
              ],
              answer: 2,
              explain:
                "Understanding trade-offs and justifying choices matters more than memorization — that judgement is what interviewers actually test.",
            },
          ],
        },
        {
          type: "references",
          items: [
            {
              label: "MIT 6.006 — Introduction to Algorithms",
              url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
            },
            {
              label: "Python Data Structures Docs",
              url: "https://docs.python.org/3/tutorial/datastructures.html",
            },
          ],
        },
      ],
    },
    {
      slug: "what-is-a-data-structure",
      title: "What is a Data Structure?",
      tagline:
        "The layout of data in memory decides which operations are cheap and which are expensive.",
      sections: [
        {
          type: "theory",
          text: "A data structure is a specialized format for organizing, storing, and managing data so that it can be accessed and modified efficiently. Every structure has its own physical layout in memory, and that layout is what makes some operations extremely fast and others painfully slow. When you pick an array over a linked list, or a hash table over a binary search tree, you are really picking a set of trade-offs: which operations will be O(1), which will be O(log n), and which you are willing to let be O(n).\n\nData structures exist because raw memory is just a very long row of bytes — the CPU doesn't know that byte 4096 is 'Alice's shopping cart'. Data structures are the conventions we impose on top of memory so that a program can insert, search, delete, and iterate without walking the entire address space. Every structure is a compromise: contiguous layouts (arrays) are the fastest to read sequentially but expensive to grow in the middle; linked layouts (lists, trees) are cheap to grow but slow to random-access; hashed layouts (dictionaries, sets) are fast to look up by key but unordered.",
          bullets: [
            "Contiguous storage — Arrays store elements next to each other in memory: O(1) index, O(n) insert at front.",
            "Node-based storage — Linked Lists and Trees link nodes via pointers: O(1) insert, O(n) random access.",
            "Key-value mapping — Hash Tables map keys directly to bucket indexes: O(1) average lookup.",
            "Hierarchical storage — Trees model parent/child relationships: file systems, the DOM, decision paths.",
            "Network storage — Graphs model many-to-many relationships: friends, road networks, dependencies.",
            "Primitive vs abstract — int/float/bool are primitive; list/dict/set/tree/graph are abstract data types built on top of primitives.",
          ],
        },
        {
          type: "code",
          code: `# The same 5 numbers, three completely different structures.
arr   = [10, 20, 30, 40, 50]          # array  — O(1) index, O(n) insert-front
stack = []                            # stack  — LIFO
stack.append(10); stack.pop()

table = {"a": 1, "b": 2}              # hash table — O(1) average lookup
print(table["a"])                     # → 1

# Same data as a linked list of tuples (value, next_index)
nodes = [(10, 1), (20, 2), (30, 3), (40, 4), (50, None)]
i = 0
while i is not None:                  # traversal is O(n)
    v, i = nodes[i]
    print(v)`,
          title: "python",
        },
        {
          type: "mistakes",
          items: [
            "Treating 'list' as one-size-fits-all — a Python list is a dynamic array, not a linked list, so insert-at-front is O(n).",
            "Ignoring memory: a hash table with millions of keys uses far more memory than a sorted array of the same keys.",
            "Confusing the abstract type (Stack) with the concrete implementation (list vs deque vs linked list).",
          ],
        },
        {
          type: "tip",
          text: "In interviews, writing correct code is only half the battle. You must explain WHY you chose a specific data structure — and what you gave up to gain that speed. 'I picked a hash set for O(1) membership at the cost of unordered iteration' is exactly the sentence they are listening for.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "Which structure gives O(1) average-case lookup by key?",
              choices: ["Linked List", "Array (by value)", "Hash Table", "Binary Search Tree"],
              answer: 2,
              explain:
                "Hash tables map keys directly to bucket indexes, so lookup is O(1) on average. A BST is O(log n); array-by-value and linked-list search are both O(n).",
            },
          ],
        },
        {
          type: "references",
          items: [
            {
              label: "Wikipedia — Data structure",
              url: "https://en.wikipedia.org/wiki/Data_structure",
            },
            {
              label: "Python Data Model",
              url: "https://docs.python.org/3/reference/datamodel.html",
            },
          ],
        },
      ],
    },
    {
      slug: "what-is-an-algorithm",
      title: "What is an Algorithm?",
      tagline: "A finite, unambiguous recipe for turning inputs into outputs.",
      sections: [
        {
          type: "theory",
          text: "An algorithm is a finite, step-by-step procedure that takes an input, performs a well-defined sequence of operations, and produces an output. A great algorithm is correct on every valid input (including nasty edge cases), easy for another human to read, and efficient in its use of time and memory. The same problem can be solved by many different algorithms with wildly different performance characteristics — that gap between 'a solution' and 'the right solution' is what this entire course is about.\n\nAlgorithms are typically classified by strategy: brute force tries every possibility; divide-and-conquer breaks a problem into smaller pieces and recombines the answers; greedy commits to the locally best move at each step; dynamic programming caches overlapping sub-answers; backtracking explores a search tree with pruning; and randomized algorithms trade determinism for expected speed. Different problems reward different strategies, and picking the right family is often more important than the details of the implementation.",
          bullets: [
            "Finiteness — the algorithm must terminate after a finite number of steps.",
            "Definiteness — every step is precisely defined and unambiguous.",
            "Effectiveness — every step is basic enough to be executed in practice.",
            "Input & Output — zero or more inputs, at least one output.",
            "Correctness — must produce the right answer for every valid input, including edge cases.",
            "Common families — brute force, divide & conquer, greedy, dynamic programming, backtracking, randomized.",
          ],
        },
        {
          type: "code",
          code: `# Two algorithms for the same problem: is x in the list?

def linear_search(arr, x):            # O(n) — works on any list
    for i, v in enumerate(arr):
        if v == x:
            return i
    return -1

def binary_search(sorted_arr, x):     # O(log n) — requires sorted input
    lo, hi = 0, len(sorted_arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_arr[mid] == x: return mid
        if sorted_arr[mid] < x:  lo = mid + 1
        else:                    hi = mid - 1
    return -1

# Same problem, drastically different runtimes:
# n = 1,000,000 → linear ~1,000,000 steps, binary ~20 steps.`,
          title: "python",
        },
        {
          type: "mistakes",
          items: [
            "Assuming an algorithm is 'fast' without measuring — always reason about Big-O first.",
            "Ignoring edge cases: empty input, single element, duplicates, negatives, integer overflow.",
            "Confusing correctness with efficiency: bubble sort and quicksort are both correct — only one scales.",
          ],
        },
        {
          type: "tip",
          text: "Real-world algorithms you already rely on: Google Search ranking, GPS route planning, Netflix recommendations, spam filters, compression (ZIP), and cryptography. Every one of them is a specific algorithm tuned for a specific data structure.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "Which property is NOT required of an algorithm?",
              choices: ["Finiteness", "Ambiguity", "Definiteness", "Correctness"],
              answer: 1,
              explain:
                "Algorithms must be unambiguous — every step must be precisely defined. Ambiguity is the opposite of what we want.",
            },
          ],
        },
        {
          type: "references",
          items: [
            { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
            {
              label: "Wikipedia — Algorithm",
              url: "https://en.wikipedia.org/wiki/Algorithm",
            },
          ],
        },
      ],
    },
    {
      slug: "why-studied-together",
      title: "Why Study Them Together?",
      tagline:
        "Algorithms are meaningless without the structures they operate on — and vice versa.",
      sections: [
        {
          type: "theory",
          text: "Data structures and algorithms are two sides of the same coin. An algorithm cannot exist without a structure to operate on, and a data structure is nearly useless without the algorithms that query and mutate it. The same 'search for x' problem has a completely different complexity depending on whether x lives in an unsorted array (O(n)), a sorted array (O(log n)), a hash table (O(1) average), or a balanced BST (O(log n)). The structure changes what algorithm is even possible — and what is efficient.\n\nStudying them together also teaches you to think in trade-offs. Every performance win is paid for somewhere else: a hash table trades memory and ordering for O(1) lookup; a heap trades sorted iteration for O(log n) min/max; a trie trades memory for O(k) prefix search. Interviewers listen specifically for candidates who can name what they are giving up, because that is the mindset real production engineering rewards.",
          bullets: [
            "Same problem + different structure = completely different complexity.",
            "Choosing a structure is really choosing which algorithms will be cheap to run on it.",
            "Trade-offs live at the boundary — memory vs speed, ordered vs unordered, static vs dynamic.",
            "Industry relevance — databases (B-trees + query planners), OS schedulers (heaps), routers (tries), search (inverted index + ranking).",
            "Interview signal — strong candidates justify the structure first, then write the algorithm.",
          ],
        },
        {
          type: "code",
          code: `# 'Find the two numbers that sum to target' — three approaches.

def two_sum_brute(nums, target):          # O(n^2) time, O(1) space
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return (i, j)

def two_sum_sorted(nums, target):         # O(n log n) time, O(1) extra
    idx = sorted(range(len(nums)), key=lambda i: nums[i])
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[idx[lo]] + nums[idx[hi]]
        if s == target: return (idx[lo], idx[hi])
        if s < target:  lo += 1
        else:           hi -= 1

def two_sum_hash(nums, target):           # O(n) time, O(n) space
    seen = {}                             # value → index
    for i, v in enumerate(nums):
        if target - v in seen:
            return (seen[target - v], i)
        seen[v] = i`,
          title: "python",
        },
        {
          type: "tip",
          text: "When you get a new problem, spend the first two minutes on 'what shape is my data?' before writing a single line of code. The shape dictates the structure; the structure dictates the algorithm.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "You need repeated O(1) membership checks on a stream of items. Best structure?",
              choices: ["Sorted list", "Hash set", "Linked list", "Binary search tree"],
              answer: 1,
              explain:
                "A hash set gives O(1) average membership. Sorted list and BST are O(log n); linked list is O(n).",
            },
          ],
        },
      ],
    },
    {
      slug: "why-python",
      title: "Why Python for DSA?",
      tagline: "Python's syntax stays out of the way so you can focus on the algorithm.",
      sections: [
        {
          type: "theory",
          text: "Python's clean, high-level syntax reads like pseudo-code, which lets you spend your mental energy on the algorithm instead of on semicolons, types, or manual memory management. The standard library ships with highly optimized collections — list, dict, set, deque, heapq, bisect — so nearly every primitive you need in an interview is already there and battle-tested. That is why Python is one of the most common choices at Google, Meta, and most competitive-programming teams: you can write, run, and dry-run a solution in the time it takes to set up boilerplate in a lower-level language.\n\nPython does have real limitations. It is significantly slower than C++ or Java on tight numeric loops, its recursion depth is limited by default (~1,000), and it has no compile-time type checking to catch mistakes before runtime. For most interview problems and for learning DSA, these limitations don't matter — but you should know they exist, and you should know when to reach for a compiled language or a C-backed library like NumPy for hot paths.",
          bullets: [
            "list — dynamic array with O(1) amortized append.",
            "dict / set — hash tables with O(1) average lookup, insert, and delete.",
            "collections.deque — double-ended queue with O(1) push/pop on both ends.",
            "heapq — binary min-heap for priority queues.",
            "bisect — binary search over sorted lists.",
            "itertools & functools — combinatorial generators, memoization decorator.",
            "Readable syntax — easier to explain your thinking out loud during an interview.",
          ],
        },
        {
          type: "code",
          code: `from collections import deque
import heapq, bisect
from functools import lru_cache

q = deque([1, 2, 3])          # O(1) popleft — perfect for BFS
q.appendleft(0); q.pop()

heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappop(heap)           # → 1

arr = [1, 3, 5, 7]
i = bisect.bisect_left(arr, 4) # → 2 (insert position, O(log n))

@lru_cache(maxsize=None)      # one-line memoization
def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)`,
          title: "python",
        },
        {
          type: "mistakes",
          items: [
            "Reaching for list.insert(0, x) in a hot loop — that's O(n). Use collections.deque.appendleft.",
            "Deep recursion without sys.setrecursionlimit — Python caps at ~1000 by default.",
            "Assuming dict/set iteration order is random — since Python 3.7 dicts preserve insertion order.",
          ],
        },
        {
          type: "tip",
          text: "Know these four modules cold: collections, heapq, bisect, itertools. They cover ~80% of what you'll reach for in interviews.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "Which is the correct O(1) 'pop from the left' collection in Python?",
              choices: [
                "list.pop(0)",
                "collections.deque.popleft()",
                "queue.Queue.get()",
                "heapq.heappop()",
              ],
              answer: 1,
              explain:
                "deque.popleft is O(1). list.pop(0) is O(n) because every remaining element shifts.",
            },
          ],
        },
        {
          type: "references",
          items: [
            {
              label: "collections — Python Docs",
              url: "https://docs.python.org/3/library/collections.html",
            },
            {
              label: "heapq — Python Docs",
              url: "https://docs.python.org/3/library/heapq.html",
            },
            {
              label: "TimeComplexity — Python Wiki",
              url: "https://wiki.python.org/moin/TimeComplexity",
            },
          ],
        },
      ],
    },
    {
      slug: "real-world-dsa",
      title: "Real-world Applications",
      tagline: "The structures in this course power almost every product you use every day.",
      sections: [
        {
          type: "theory",
          text: "DSA is not a topic that only matters for interviews — it powers the entire digital world. Every product you touch is a stack of well-chosen data structures and carefully tuned algorithms. When Google returns a result in 200 ms, when Uber routes your car around traffic, when Instagram ranks a feed, when Postgres runs a JOIN, when Git merges a branch — every one of those is a specific data structure paired with a specific algorithm. The gap between an app that scales and one that falls over at 10× traffic is almost always a DSA choice made (or not made) years earlier.",
          bullets: [
            "Search engines — Google uses graph algorithms (PageRank) over the web graph and Tries for query autocomplete.",
            "Social networks — Facebook/LinkedIn model connections as graphs; feeds use heaps for top-k ranking and hash tables for deduping.",
            "GPS navigation — Google Maps, Uber, and Waze use Dijkstra's and A* over road-network graphs for shortest paths.",
            "Operating systems — schedulers use priority queues (heaps); virtual memory uses page tables (hash tables); file systems use trees.",
            "Databases — PostgreSQL/MySQL use B-Trees and hash indexes to query billions of rows in milliseconds; query planners run graph search over join plans.",
            "AI & Machine Learning — neural networks are matrices (multi-dimensional arrays); decision trees classify inputs; k-NN uses KD-trees.",
            "Game development — quadtrees / octrees for spatial partitioning and collision; A* for NPC pathfinding; grid graphs for tile maps.",
            "Compilers — stacks evaluate expressions; abstract syntax trees represent parsed code; symbol tables are hash maps.",
            "Version control — Git stores commits as a directed acyclic graph (DAG); Merkle trees verify integrity.",
            "Networking — routers use tries (radix tries) for O(k) IP prefix lookup; TCP uses queues for reordering.",
          ],
        },
        {
          type: "code",
          code: `# A miniature autocomplete built on a Trie — the same idea Google uses.

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:      # O(len(word))
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def suggest(self, prefix: str) -> list[str]:  # O(len(prefix) + matches)
        node = self.root
        for ch in prefix:
            if ch not in node.children: return []
            node = node.children[ch]
        out: list[str] = []
        def dfs(n: TrieNode, path: str):
            if n.is_end: out.append(path)
            for c, child in n.children.items(): dfs(child, path + c)
        dfs(node, prefix)
        return out

t = Trie()
for w in ["apple", "app", "apricot", "banana"]: t.insert(w)
print(t.suggest("ap"))    # → ['apple', 'app', 'apricot']`,
          title: "python",
        },
        {
          type: "tip",
          text: "When a topic feels abstract, look up which real product depends on it. 'B-Trees power every SQL query I run at work' is far more memorable than the textbook definition alone.",
        },
        {
          type: "references",
          items: [
            {
              label: "How Google Search Works",
              url: "https://www.google.com/search/howsearchworks/",
            },
            {
              label: "Git Internals — Objects",
              url: "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects",
            },
          ],
        },
      ],
    },
    {
      slug: "how-to-study",
      title: "How to Study This Course",
      tagline: "A disciplined, hands-on loop that turns reading into real skill.",
      sections: [
        {
          type: "theory",
          text: "To get the most out of this platform, follow a disciplined, hands-on loop: read → visualize → implement → dry-run → review. Passive reading gives short-term recognition, not long-term recall — and the gap between the two is exactly what an interviewer probes when they change a single constraint on a familiar problem. Every lesson in this course is designed to be paired with the interactive playgrounds and the practice section; treat those as the actual work, and treat the text as the setup.",
          bullets: [
            "Recommended order — Foundations → Linear structures → Non-linear structures → Algorithms → Interview prep.",
            "Type the code yourself — never just read. Retype every implementation and run it against your own test cases.",
            "Dry-run on paper — trace indexes, pointers, and recursion stacks by hand before trusting your intuition.",
            "Use the playgrounds — watch each operation animate; that is the mental model you'll recall under interview pressure.",
            "Spaced revision — return after 24 hours and re-derive the code from scratch. Use the cheatsheets sparingly.",
            "Practice deliberately — attempt the linked problem, get stuck for 20 minutes, read only the hint, then retry.",
          ],
        },
        {
          type: "tip",
          text: "Do not skip the interactive playgrounds. The people who ace DSA interviews are the ones who can 'see' the structure moving in their head — the playgrounds build exactly that muscle.",
        },
        {
          type: "quiz",
          items: [
            {
              q: "What is the single most effective study habit for DSA?",
              choices: [
                "Reading solutions to as many problems as possible",
                "Watching video lectures at 2× speed",
                "Retyping code, dry-running by hand, and spaced revision",
                "Memorizing the Big-O of every operation",
              ],
              answer: 2,
              explain:
                "Active recall beats passive consumption every time. Type it, trace it, revisit it.",
            },
          ],
        },
        {
          type: "references",
          items: [
            {
              label: "Learn How to Learn — Coursera",
              url: "https://www.coursera.org/learn/learning-how-to-learn",
            },
            {
              label: "Make It Stick — book summary",
              url: "https://www.retrievalpractice.org/make-it-stick",
            },
          ],
        },
      ],
    },
  ],
};
