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
    estimatedTime: "≈ 30–60 Mins",
    difficulty: 1, // Beginner friendly
    practiceRequired: false,
    language: "Python",
  },
  whoIsThisFor: [
    "College Students seeking a strong CS foundation",
    "Software Engineers preparing for technical interviews",
    "AI / ML Engineers wanting to write optimized code",
    "Competitive Programmers starting their journey",
    "Self Learners mastering programming fundamentals",
  ],
  showRoadmap: true,
  ctaText: "Start Learning Arrays →",
  ctaRoute: "/introduction",
  lessons: [
    {
      slug: "welcome",
      title: "Welcome to the Course",
      theory: "Welcome to the interactive Data Structures & Algorithms curriculum. This course is designed to guide you from the basic building blocks of memory to the advanced algorithmic patterns used by top-tier engineering organizations. By the end of this course, you will not only be able to write clean, optimized Python code, but also explain the deep structural trade-offs of every decision you make.",
      bullets: [
        "Develop intuitive mental models for how data is structured in memory.",
        "Master Big-O analysis to measure and optimize time and space complexity.",
        "Build and implement arrays, linked lists, trees, graphs, and heap structures from scratch.",
        "Learn to apply searching, sorting, greedy algorithms, divide & conquer, and dynamic programming.",
      ],
    },
    {
      slug: "what-is-a-data-structure",
      title: "What is a Data Structure?",
      theory: "A data structure is a specialized format for organizing, storing, and managing data in computer memory. Every structure has its own unique layout that makes certain operations extremely fast and others slow. Choosing the right data structure is the most critical decision in software design.",
      bullets: [
        "Contiguous storage: Arrays store elements next to each other, allowing instant index lookups but slow insertions.",
        "Node-based storage: Linked Lists and Trees link memory blocks via pointers, making insertions easy but search slow.",
        "Key-Value mapping: Hash Tables map keys directly to indexes for O(1) average lookups.",
      ],
      tip: "In interviews, writing correct code is only half the battle. You must explain why you chose a specific data structure for the problem.",
    },
    {
      slug: "what-is-an-algorithm",
      title: "What is an Algorithm?",
      theory: "An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a computation. It takes an input, processes it through a series of logical steps, and produces an output. A great algorithm is correct, easy to read, and efficient in its resource usage.",
      bullets: [
        "Finiteness: The algorithm must eventually terminate after a finite number of steps.",
        "Definiteness: Each step must be precisely defined and unambiguous.",
        "Effectiveness: Every step must be basic enough to be carried out in practice.",
      ],
    },
    {
      slug: "why-studied-together",
      title: "Why Study Them Together?",
      theory: "Data structures and algorithms are two sides of the same coin. An algorithm cannot exist without a structure to operate on, and a data structure is useless without algorithms to query and modify it. For example, search algorithms differ drastically depending on whether they operate on a sorted array, a linked list, or a binary search tree. Studying them together helps you see the direct relationship between data layout in memory and algorithmic efficiency.",
    },
    {
      slug: "why-python",
      title: "Why Python for DSA?",
      theory: "Python's clean, high-level syntax reads like pseudo-code, allowing you to focus entirely on algorithm logic rather than managing syntax boilerplate (like semicolons, types, or manual memory management). Python's standard library comes equipped with highly optimized collections (lists, dicts, sets) and algorithms (bisect, heapq) built-in, making it the preferred prototyping language for top-tier technical interviews.",
    },
    {
      slug: "real-world-dsa",
      title: "Real-world Applications",
      theory: "DSA is not just for interviews; it powers the entire digital world. Here are real-world examples of where these concepts are used in production systems:",
      bullets: [
        "Search Engines: Google Search uses page-ranking algorithms traversing massive web graphs, and autocompletion boxes use Tries.",
        "Databases: MySQL and PostgreSQL use B-Trees and Hash indexes to query billions of rows in milliseconds.",
        "GPS Navigation: Google Maps and routing protocols use Dijkstra's and A* graph algorithms to calculate the shortest path.",
        "AI / Machine Learning: Neural networks represent weight parameters as matrices (multidimensional arrays) and decision structures as trees.",
        "Operating Systems: OS schedulers use Priority Queues (heaps) to schedule CPU processes, and virtual memory maps addresses via page tables.",
        "Social Networks: Facebook and LinkedIn model friends and connections as Graphs, analyzing degrees of separation.",
        "Game Development: Game engines use spatial trees (Quadtrees/Octrees) for collision detection and graph pathfinding for NPC movement.",
        "Compilers: Parsers use Stacks to evaluate mathematical expressions and syntax trees to parse code blocks.",
      ],
    },
    {
      slug: "how-to-study",
      title: "How to Study This Course",
      theory: "To get the most out of this interactive platform, we recommend a disciplined, hands-on approach:",
      bullets: [
        "Recommended Order: Follow the roadmap from Foundations to Linear structures, then Non-Linear structures, and finally advanced Algorithms.",
        "Importance of Coding: Never just read the code. Write out the implementations yourself, run the test suites, and debug failures.",
        "Dry Runs: Trace index pointers, recursion stacks, and memory updates on paper first. This builds the mental execution model.",
        "Revision: Periodically revisit completed concepts. Review the quick revision cheatsheets and redo quizzes to retain memory.",
        "Solving Problems: Apply your learning to practice problems. If you get stuck, study the hint or approach before looking at the code.",
      ],
    },
  ],
};
