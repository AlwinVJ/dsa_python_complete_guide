import type { Course } from "./types";

export const introductionToDsaCourse: Course = {
  slug: "introduction-to-dsa",
  title: "Introduction to DSA",
  tagline: "Your gateway to the complete Data Structures & Algorithms curriculum.",
  category: "foundation",
  order: 1,
  icon: "BookOpen",
  hidden: false,
  comingSoon: false,
  infoCard: {
    estimatedTime: "≈ 10–12 Weeks",
    difficulty: 4, // 4 out of 5 stars
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "College Students seeking a strong CS foundation",
    "Software Engineers preparing for technical interviews",
    "AI / ML Engineers wanting to write optimized code",
    "Competitive Programming Beginners",
    "Self-taught Developers mastering system design basics",
  ],
  showRoadmap: true,
  ctaText: "Start Learning Arrays →",
  ctaRoute: "/introduction",
  lessons: [
    {
      slug: "what-is-dsa",
      title: "What is DSA?",
      theory: "A Data Structure is a specialized format for organizing, processing, retrieving, and storing data in computer memory. An Algorithm is a step-by-step procedure or formula for solving a problem, doing a calculation, or processing data. Together, they form the bedrock of efficient computation.",
      bullets: [
        "Data structures hold data in a structured way (e.g. sequentially in an Array, linked via pointers in a Linked List).",
        "Algorithms perform operations on that data (e.g. sorting elements, searching for a target).",
        "A program = Data Structures + Algorithms.",
      ],
      tip: "In interviews, writing correct code is only half the battle. You must explain why you chose a specific data structure and algorithm for the problem.",
    },
    {
      slug: "why-studied-together",
      title: "Why Study Them Together?",
      theory: "You cannot write an algorithm without operating on a data structure, and a data structure is useless without algorithms to query and modify it. For example, search algorithms differ drastically depending on whether they operate on a sorted array, a linked list, or a binary search tree. Studying them together helps you see the direct relationship between data layout in memory and algorithmic efficiency.",
    },
    {
      slug: "why-python",
      title: "Why Python for DSA?",
      theory: "Python's clean, high-level syntax reads like pseudo-code, allowing you to focus entirely on algorithm logic rather than managing syntax boilerplate (like semicolons, types, or memory pointers). Python's standard library comes equipped with highly optimized collections (lists, dicts, sets) and algorithms (bisect, heapq) built-in, making it the preferred prototyping language for top-tier technical interviews.",
    },
    {
      slug: "real-world-dsa",
      title: "Real-world Applications",
      theory: "Every piece of software you use is powered by DSA. Database systems use B-Trees and Hash indexes to query billions of rows in milliseconds. Network routing protocols and Google Maps use Graph algorithms (like Dijkstra's) to find the shortest path. Browser history tracks pages using Stacks, and autocompletion boxes use Tries.",
      bullets: [
        "Google Search: PageRank algorithms traversing web graphs.",
        "File Systems: Tree structures organizing directories and files.",
        "JSON Parsers: Stack-based parsers checking brackets and nesting.",
      ],
    },
    {
      slug: "estimated-timeline",
      title: "Learning Timeline & Roadmap",
      theory: "Mastering DSA is a marathon, not a sprint. We recommend dedicating 10–12 weeks of structured study, focusing on one module at a time. Do not rush into coding; spend time dry-running index pointers on paper first.",
      bullets: [
        "Prerequisites: 2–3 Days (variables, loops, functions, basic collections)",
        "Introduction to DSA: 30–60 Minutes (this overview)",
        "Complexity Analysis: 2–4 Hours (Big-O notation)",
        "Linear Data Structures: 1–2 Weeks (Arrays, Linked Lists, Stacks, Queues, Hash Tables)",
        "Non-Linear & Specialized Data Structures: 2 Weeks (Trees, Graphs, Heaps, Tries)",
        "Algorithms: 2–3 Weeks (Sorting, Searching, Greedy, Divide & Conquer, DP, Backtracking)",
        "Interview Preparation: 1–2 Weeks (mock interviews, LeetCode practice)",
      ],
    },
  ],
};
