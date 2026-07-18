import type { Course } from "./types";

export const stringAlgorithmsCourse: Course = {
  slug: "string-algorithms",
  title: "String Algorithms",
  tagline: "Efficient text processing, from naive slides to linear-time state machines.",
  category: "algorithm",
  order: 8,
  icon: "TextSearch",
  comingSoon: false,
  courseLayout: "overview",
  ctaText: "Open String Playground →",
  ctaRoute: "/playgrounds/string-algorithms",
  overview: {
    introduction:
      "String algorithms find, match, transform, and analyze patterns inside text. From search engines indexing the web to biologists aligning DNA sequences, text processing is a core pillar of computer science. While naive string matching runs in quadratic time, advanced algorithms achieve optimal linear runtime by analyzing pattern symmetries, using rolling hashes, and building state-transition trees.",
    whyLearn:
      "Text is the most common unstructured data format. Standard searches take O(N * M) time, which fails instantly on large documents or genome data. Learning string algorithms teaches you key techniques like preprocessing search patterns, computing linear rolling hashes, and building tree state-machines. These concepts are frequently tested in engineering interviews and are essential for building compilers, data parsers, and search engines.",
    learningObjectives: [
      "Analyze naive pattern matching and understand why it exhibits O(N * M) worst-case performance.",
      "Master Knuth-Morris-Pratt (KMP) and prefix function (LPS table) construction.",
      "Learn the Rabin-Karp rolling hash algorithm and how to handle collisions gracefully.",
      "Master the Z-algorithm for linear-time pattern matching using Z-arrays.",
      "Understand Boyer-Moore heuristics (bad character and good suffix rule).",
      "Learn Suffix Arrays, Tries, and Aho-Corasick concepts for multi-pattern searching.",
      "Implement space-efficient string manipulations in Python.",
    ],
    realWorldApplications: [
      "Text Editors & IDEs — instant find/replace, syntax highlighting, autocomplete.",
      "Bioinformatics — finding specific gene/DNA strands in huge genome sequences.",
      "Search Engines — parsing HTML, reverse indexing documents, search queries.",
      "Network Security — scanning packet payloads for malware signatures (Aho-Corasick).",
      "Compilers — lexical analyzers tokenizing source code strings.",
    ],
    advantages: [
      "Sublinear/Linear Search — algorithms like KMP and Boyer-Moore achieve O(N + M) or even sublinear performance.",
      "Memory Efficient — KMP and Z-algorithm require only O(M) auxiliary memory.",
      "Streaming Friendly — Rabin-Karp and KMP can process text character-by-character on a stream.",
    ],
    limitations: [
      "High constant factor overhead for small text arrays.",
      "Complexity of implementation — Rabin-Karp is prone to arithmetic overflow or collisions, KMP is conceptually difficult.",
      "Exact match focus — standard string algorithms require modifications to handle fuzzy/approximate matching.",
    ],
    prerequisites: [
      "Comfort with arrays, lists, loops, and index slicing in Python.",
      "Basic understanding of hash functions and modulus arithmetic.",
      "Familiarity with Big-O time and space complexity analysis.",
    ],
    estimatedTime: "4–6 Hours",
    difficulty: 3,
  },
  infoCard: {
    estimatedTime: "4–6 Hours",
    difficulty: 3,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners looking to master KMP, Rabin-Karp, and linear string search.",
    "Interview prep candidates — string manipulation is a high-frequency interview topic.",
    "Engineers working on lexers, parsers, bioinformatics, or search indices.",
  ],
  lessons: [
    {
      slug: "introduction",
      title: "1. Introduction to String Algorithms",
      tagline: "Why text search requires specialized linear-time algorithms.",
      theory:
        "In computing, strings are sequences of characters representing text. A fundamental problem is string matching: finding occurrences of a pattern P of length M inside a text T of length N. \n\nNaive search scans each position sequentially, leading to slow O(N * M) performance. String algorithms overcome this by pre-processing the pattern to skip redudant comparisons. By exploiting string symmetries, we can shift the pattern multiple positions forward instead of just one character.",
      bullets: [
        "Text T of length N, Pattern P of length M.",
        "Goal: Find the starting index of P in T.",
        "Naive search is O(N * M), which is too slow for large databases.",
        "Modern algorithms achieve O(N + M) time using pattern pre-processing.",
      ],
      quiz: {
        q: "What makes string matching algorithms efficient?",
        choices: [
          "They compress the text first.",
          "They pre-process the pattern to avoid redundant comparisons.",
          "They always use binary search on characters.",
          "They require sorting the text array.",
        ],
        answer: 1,
        explain: "By analyzing the pattern first (pre-processing), string algorithms can determine how far to shift the pattern window on a mismatch, avoiding checking characters twice.",
      },
    },
    {
      slug: "string-fundamentals",
      title: "2. String Fundamentals",
      tagline: "ASCII, Unicode, and character array representations in memory.",
      theory:
        "Before implementing algorithms, we must understand how strings are stored. In memory, characters are mapped to integers using encodings like ASCII (7-bit) or Unicode/UTF-8. \n\nIn Python, strings are immutable arrays of Unicode characters. This immutability means that operations like concatenation (`+`) or slicing (`s[i:j]`) actually create a *new* string copy in O(L) time, where L is the slice length. Understanding these memory costs is crucial for string algorithm efficiency.",
      bullets: [
        "ASCII uses 7-bits (128 characters); Unicode maps thousands of symbols.",
        "Python strings are immutable. Slicing creates copies in O(slice_length) time.",
        "To modify strings in place, convert to list (`list(s)`) and join (`''.join(list)`).",
      ],
      code: `# Example: Reversing a string efficiently
def reverse_string(s):
    # s[::-1] is optimized in CPython, but array swap shows in-place concept
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)`,
      quiz: {
        q: "What is the time complexity of slicing a string of length N in Python as s[0:N]?",
        choices: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        answer: 2,
        explain: "Since Python strings are immutable, slicing `s[0:N]` creates a new copy of the slice, which takes linear time O(N).",
      },
    },
    {
      slug: "naive-pattern-matching",
      title: "3. Naive Pattern Matching",
      tagline: "Slide, check, increment, repeat.",
      theory:
        "The Naive (or Brute-Force) pattern matching slides the pattern P over text T one alignment at a time. At each starting index `i`, it compares characters of P with T starting from `i`. If a mismatch occurs, it resets the pattern index, shifts the pattern by exactly *one* position to the right, and starts comparison again. \n\nIn the worst case (e.g. T = 'AAAAAAAB', P = 'AAAB'), it performs M comparisons at almost all N positions, running in O(N * M) time.",
      bullets: [
        "Slide pattern P over text T, checking all index alignments from 0 to N - M.",
        "On mismatch, shift alignment forward by exactly 1.",
        "Worst-case Time Complexity: O(N * M).",
        "Space Complexity: O(1).",
      ],
      code: `def naive_search(text, pattern):
    N, M = len(text), len(pattern)
    occurrences = []
    # Loop over all possible starting alignments
    for i in range(N - M + 1):
        match = True
        for j in range(M):
            if text[i + j] != pattern[j]:
                match = False
                break
        if match:
            occurrences.append(i)
    return occurrences`,
      quiz: {
        q: "In naive search, what is the worst-case time complexity to find pattern 'AAB' in text 'AAAAA...A'?",
        choices: ["O(N)", "O(N + M)", "O(N * M)", "O(N log M)"],
        answer: 2,
        explain: "At each of the N positions, the naive algorithm compares the first two 'A' characters before failing on 'B', resulting in O(N * M) overall steps.",
      },
    },
    {
      slug: "prefix-function",
      title: "4. Prefix Function",
      tagline: "Computing borders and the Longest Prefix Suffix (LPS) table.",
      theory:
        "To avoid repeating comparisons, we analyze the pattern's self-similarity. The prefix function (commonly called the LPS table, for Longest Prefix Suffix) computes for each prefix of the pattern the length of its longest proper prefix that is also a proper suffix. \n\nProper prefix means a prefix that is not the entire string. Proper suffix means a suffix that is not the entire string. If the pattern is 'ABACABA', the LPS table helps us skip alignment checking because we know how the pattern overlaps with itself.",
      bullets: [
        "LPS[i] stores the length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i].",
        "Example: For 'ABAA', prefixes are 'A'(0), 'AB'(0), 'ABA'(1, 'A'), 'ABAA'(1, 'A').",
        "Precomputed in linear time O(M) using two pointers.",
      ],
      code: `def compute_lps(pattern):
    M = len(pattern)
    lps = [0] * M
    length = 0  # length of the previous longest prefix suffix
    i = 1
    
    while i < M:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps`,
      quiz: {
        q: "What is the LPS array values for the pattern 'ABAB'?",
        choices: ["[0, 0, 1, 2]", "[0, 1, 1, 2]", "[0, 0, 1, 1]", "[0, 1, 2, 3]"],
        answer: 0,
        explain: "Prefixes of 'ABAB' are: 'A' -> 0, 'AB' -> 0, 'ABA' -> 1 (prefix 'A' = suffix 'A'), 'ABAB' -> 2 (prefix 'AB' = suffix 'AB'). Thus: [0, 0, 1, 2].",
      },
    },
    {
      slug: "suffix-concepts",
      title: "5. Suffix Concepts",
      tagline: "Prefixes, suffixes, and borders in string structures.",
      theory:
        "A proper prefix of a string S is a substring that starts at index 0 and has length less than len(S). A proper suffix is a substring that ends at index len(S)-1 and has length less than len(S). \n\nA border of a string is a substring that is both a proper prefix and a proper suffix. Analyzing borders is the math foundation of efficient string search: KMP uses the longest borders (LPS), and Suffix Arrays sort all suffixes lexicographically.",
      bullets: [
        "Prefix: S[0..i]. Suffix: S[j..len(S)-1].",
        "Border: A substring that is both a prefix and suffix.",
        "Symmetry analysis allows string algorithms to achieve linear runtimes.",
      ],
      quiz: {
        q: "Which of the following is a proper suffix of the string 'APPLE'?",
        choices: ["'APPLE'", "'APP'", "'PLE'", "'AP'"],
        answer: 2,
        explain: "'PLE' is a proper suffix because it appears at the end of the string and is shorter than the entire string.",
      },
    },
    {
      slug: "kmp",
      title: "6. Knuth-Morris-Pratt (KMP)",
      tagline: "Linear-time pattern matching with backtracking skips.",
      theory:
        "The Knuth-Morris-Pratt (KMP) algorithm uses the precomputed LPS table to match patterns in O(N + M) time. \n\nWhen a mismatch occurs at text index `i` and pattern index `j`, instead of resetting the search to `i - j + 1` (like naive search), we shift the pattern so that the longest proper prefix of P[0..j-1] matches the suffix of T[i-j..i-1]. We lookup `lps[j-1]` to get the new pattern pointer index `j`, completely skipping characters we already know must match.",
      bullets: [
        "Uses precomputed LPS table to determine pattern shift distance on mismatch.",
        "Text pointer `i` never backtracks (moves only forward).",
        "Time Complexity: O(N + M).",
        "Space Complexity: O(M) for the LPS table.",
      ],
      code: `def kmp_search(text, pattern):
    N, M = len(text), len(pattern)
    lps = compute_lps(pattern)
    occurrences = []
    i = 0  # index for text
    j = 0  # index for pattern
    
    while i < N:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        if j == M:
            occurrences.append(i - j)
            j = lps[j - 1]
        elif i < N and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return occurrences`,
      quiz: {
        q: "What is KMP's worst-case time complexity?",
        choices: ["O(N * M)", "O(N + M)", "O(N log M)", "O(M)"],
        answer: 1,
        explain: "KMP scans the text linearly, and the pattern pointer only backtracks using the precomputed LPS array. This results in an optimal O(N + M) time complexity.",
      },
    },
    {
      slug: "rabin-karp",
      title: "7. Rabin-Karp Algorithm",
      tagline: "Harnessing rolling hashes to perform quick string checks.",
      theory:
        "The Rabin-Karp algorithm uses hashing to find any one of a set of pattern strings in a text. It computes a hash value for the pattern, and then slides a window of size M across the text, computing the hash of the current substring. \n\nIf the hash values match, it performs a character comparison to verify a match (resolving hash collisions). Using a rolling hash function, the hash of the next window is computed from the previous hash in O(1) time.",
      bullets: [
        "Computes a polynomial rolling hash of sliding windows of size M.",
        "Calculates the next hash value in O(1) using arithmetic shifts.",
        "Requires verification on hash matches due to possible collisions.",
        "Average time complexity: O(N + M); Worst-case: O(N * M).",
      ],
      code: `def rabin_karp(text, pattern):
    N, M = len(text), len(pattern)
    d = 256  # size of alphabet
    q = 101  # prime modulus
    h = pow(d, M - 1, q)
    p_hash = 0
    t_hash = 0
    occurrences = []

    # Calculate initial hash values
    for i in range(M):
        p_hash = (d * p_hash + ord(pattern[i])) % q
        t_hash = (d * t_hash + ord(text[i])) % q

    for i in range(N - M + 1):
        if p_hash == t_hash:
            # Check characters to verify
            if text[i : i + M] == pattern:
                occurrences.append(i)
        
        # Calculate rolling hash for next window
        if i < N - M:
            t_hash = (d * (t_hash - ord(text[i]) * h) + ord(text[i + M])) % q
            t_hash = (t_hash + q) % q  # ensure positive
            
    return occurrences`,
      quiz: {
        q: "What is a rolling hash?",
        choices: [
          "A hash function that runs in O(N) at each window.",
          "A hash that changes on every system restart.",
          "A polynomial hash calculated in O(1) using the previous window's hash.",
          "A hash that only works for numeric inputs.",
        ],
        answer: 2,
        explain: "A rolling hash allows computing the hash of a shifted window in O(1) time by removing the leading character's hash contribution and adding the trailing character's contribution.",
      },
    },
    {
      slug: "z-algorithm",
      title: "8. Z Algorithm",
      tagline: "Linear-time exact pattern matching with Z-box indices.",
      theory:
        "The Z Algorithm constructs a Z-array of size L for a string S, where Z[i] is the length of the longest substring starting at S[i] that matches a prefix of S. \n\nBy running the Z-algorithm on the concatenated string P + '$' + T (where '$' is a sentinel character not in either string), we can identify matches. Wherever Z[i] equals the length of P, we have found a match in T! The Z-algorithm runs in O(N + M) time using a sliding 'Z-box' boundary [L, R] to skip redundant character checks.",
      bullets: [
        "Z[i] is length of longest prefix match starting at S[i].",
        "Uses bounds [L, R] of the rightmost matched prefix segment (Z-box) to reuse computations.",
        "Allows pattern matching in O(N + M) time with O(N + M) space.",
      ],
      code: `def get_z_array(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l = i
            r = i + z[i] - 1
    return z

def z_search(text, pattern):
    concat = pattern + "$" + text
    z = get_z_array(concat)
    occurrences = []
    M = len(pattern)
    for i in range(len(z)):
        if z[i] == M:
            occurrences.append(i - M - 1)
    return occurrences`,
      quiz: {
        q: "What is the Z-array for the string 'aab'?",
        choices: ["[0, 1, 0]", "[0, 0, 0]", "[3, 1, 0]", "[0, 2, 0]"],
        answer: 0,
        explain: "For 'aab': S[0] is skipped or undefined by convention (often 0). S[1]='a' matches prefix 'a' (length 1). S[2]='b' does not match 'a' (length 0). Thus [0, 1, 0].",
      },
    },
    {
      slug: "boyer-moore",
      title: "9. Boyer-Moore Algorithm",
      tagline: "Sublinear search by matching from right to left.",
      theory:
        "The Boyer-Moore algorithm is the benchmark for practical string searches. Unlike KMP or Rabin-Karp, it scans the pattern from *right to left* (index M-1 down to 0). \n\nWhen a mismatch occurs, it applies two powerful shift rules:\n1. **Bad Character Heuristic**: Shifts pattern so the mismatched text character aligns with its last occurrence in the pattern.\n2. **Good Suffix Heuristic**: Shifts pattern so the matched suffix aligns with its next occurrence in the pattern.\nThese heuristics allow it to achieve sublinear O(N/M) average performance on natural text by skipping massive chunks.",
      bullets: [
        "Matches pattern characters from right to left.",
        "Bad Character rule: aligns mismatched text character with pattern occurrence.",
        "Good Suffix rule: aligns matched suffix segments.",
        "Achieves O(N/M) average time complexity (sublinear).",
      ],
      quiz: {
        q: "In what direction does Boyer-Moore compare characters of the pattern with the text?",
        choices: ["Left to right", "Right to left", "From the middle outwards", "Random order"],
        answer: 1,
        explain: "Boyer-Moore matches characters of the pattern against the text from right to left, which lets it skip large portions of text on mismatches.",
      },
    },
    {
      slug: "trie-search",
      title: "10. Trie-based String Searching",
      tagline: "Prefix trees for dictionary lookups.",
      theory:
        "A Trie (or Prefix Tree) is a search tree used to store a associative key-value array of strings. Each node represents a character. Searching a word of length L in a Trie takes O(L) time, regardless of how many words are stored. \n\nFor string matching, we can insert all suffixes of a text T into a Trie (creating a Suffix Trie). Then, we can check if a pattern P is in T by searching P in the Trie in O(M) time.",
      bullets: [
        "A node has child pointers for each possible character.",
        "Dictionary lookup is fast: O(L) time.",
        "Suffix Tries allow matching in O(M) but take O(N^2) space.",
      ],
      quiz: {
        q: "What is the time complexity to lookup a word of length L in a Trie containing W words?",
        choices: ["O(log W)", "O(L)", "O(W * L)", "O(L log W)"],
        answer: 1,
        explain: "Trie lookup depends only on the length of the string L, as we traverse exactly one character edge per lookup step, running in O(L) time.",
      },
    },
    {
      slug: "rolling-hash",
      title: "11. Rolling Hash",
      tagline: "Polynomial hash values and collision mitigation.",
      theory:
        "A rolling hash polynomial representation treats a string as a list of coefficient coefficients: \n`H = (s[0]*p^(k-1) + s[1]*p^(k-2) + ... + s[k-1]*p^0) % m`\nwhere `p` is a prime base (often 31 or 53 for alphabetic text) and `m` is a large prime modulo (like 10^9+7).\n\nTo slide the hash window by one character from index `i` to `i+1`, we do:\n`H_{new} = ((H_{old} - s[i]*p^(k-1)) * p + s[i+k]) % m`\nCare must be taken to prevent integer overflow and to double-check characters on matching hashes because prime modulo collisions are possible (birthday paradox).",
      bullets: [
        "Polynomial expression representing string characters with prime base `p`.",
        "Modulo `m` keeps the hash value within integer boundaries.",
        "Double-hashing (using two different primes/mods) practically eliminates collisions.",
      ],
      quiz: {
        q: "Why is a prime number selected as the base and modulo in rolling hashes?",
        choices: [
          "It makes the calculation faster.",
          "It minimizes the probability of hash collisions.",
          "Prime arithmetic does not require divisions.",
          "Computers process primes natively.",
        ],
        answer: 1,
        explain: "Primes generate a uniform distribution of hash keys, reducing mathematical patterns and lowering collision probabilities.",
      },
    },
    {
      slug: "suffix-arrays",
      title: "12. Suffix Arrays",
      tagline: "Lexicographically sorting suffixes of a text.",
      theory:
        "A Suffix Array is a sorted array of all suffixes of a string. The array stores the starting indices of the suffixes in lexicographical order. \n\nFor example, suffixes of 'banana' are 'banana'(0), 'anana'(1), 'nana'(2), 'ana'(3), 'na'(4), 'a'(5). Sorted, the suffix array is [5, 3, 1, 0, 4, 2], corresponding to: 'a', 'ana', 'anana', 'banana', 'na', 'nana'. \nWe can find any pattern P in T by performing binary search on the Suffix Array in O(M log N) time.",
      bullets: [
        "Stores starting indices of sorted suffixes.",
        "Built in O(N log N) using prefix doubling, or O(N) using SA-IS.",
        "Enables O(M log N) pattern matching using binary search.",
      ],
      quiz: {
        q: "What is the sorted order of suffixes (Suffix Array indices) for 'cab'?",
        choices: ["[2, 1, 0]", "[1, 2, 0]", "[1, 0, 2]", "[0, 1, 2] font-bold"],
        answer: 1,
        explain: "Suffixes of 'cab' are 'cab'(0), 'ab'(1), 'b'(2). Lexicographically sorted: 'ab'(1), 'b'(2), 'cab'(0). Suffix array indices: [1, 2, 0].",
      },
    },
    {
      slug: "suffix-trees",
      title: "13. Suffix Trees (Conceptual)",
      tagline: "Representing all suffixes of a string in a compressed Trie.",
      theory:
        "A Suffix Tree is a compressed Trie containing all suffixes of a string S. Unlike standard Tries, it compresses linear chains of single-child nodes into single edges labeled with substrings, keeping the number of nodes at O(N).\n\nSuffix Trees are extremely powerful: once built, they solve substring matching, longest repeated substring, and longest common substring queries in linear time. They can be built in O(N) time using Ukkonen's Algorithm, which is theoretically optimal but complex to implement.",
      bullets: [
        "Compressed prefix tree of all suffixes.",
        "Ukkonen's Algorithm builds it in O(N) time and space.",
        "Enables advanced queries (e.g. longest common substring) in linear time.",
      ],
      quiz: {
        q: "What is a major advantage of Suffix Trees over standard Tries of suffixes?",
        choices: [
          "They take O(N) space instead of O(N^2).",
          "They only store numbers.",
          "They do not require character comparisons.",
          "They represent multiple graphs.",
        ],
        answer: 0,
        explain: "A Suffix Tree compresses single-child nodes into single edge labels, which drops the space complexity of representing all suffixes from quadratic O(N^2) to linear O(N).",
      },
    },
    {
      slug: "aho-corasick",
      title: "14. Aho-Corasick Algorithm",
      tagline: "Matching dictionary of patterns in parallel using finite automata.",
      theory:
        "The Aho-Corasick algorithm is a multi-pattern search algorithm. It matches a dictionary of patterns against a text in parallel. \n\nIt constructs a finite state automaton resembling a Trie with additional 'failure links' (similar to the prefix skips in KMP) and 'output dictionary links'. During search, it processes the text in a single pass. It runs in O(N + M + K) time, where K is the number of pattern matches. This makes it ideal for antivirus scanners searching packet payloads for thousands of virus signatures.",
      bullets: [
        "Builds a Trie of patterns and adds KMP-like failure links.",
        "Evaluates all patterns simultaneously in a single linear pass of the text.",
        "Time Complexity: O(N + M + K) where K is occurrences.",
      ],
      quiz: {
        q: "For what applications is Aho-Corasick preferred over KMP?",
        choices: [
          "Fuzzy matching.",
          "Matching a single long pattern.",
          "Matching multiple patterns in parallel.",
          "Reversing strings.",
        ],
        answer: 2,
        explain: "Aho-Corasick matches an entire dictionary of multiple patterns in parallel in a single text pass, whereas KMP only matches one pattern at a time.",
      },
    },
    {
      slug: "common-mistakes",
      title: "15. Common Mistakes",
      tagline: "Off-by-one errors, python string copies, and collision bugs.",
      theory:
        "When implementing string algorithms, developer mistakes usually center around three areas:\n1. **Python Copy Overhead**: Slicing strings `t[i:i+m] == p` inside loops generates string copies in memory. In naive searches, this turns O(N) comparisons into O(N * M) performance. Compare indices instead.\n2. **Rabin-Karp Collision Checking**: Failing to check actual character values when rolling hashes match. Hashes can collide, and skipping verification leads to false matches.\n3. **Integer Overflows in Hashing**: Python handles arbitrarily large integers, but in other languages, rolling hash addition must handle mathematical overflows safely using correct modular arithmetic.",
      bullets: [
        "Avoid string slicing copies `s[i:j]` inside loop checks.",
        "Always verify characters in Rabin-Karp when hash values match.",
        "Handle negative modulus values correctly in rolling hash transitions.",
      ],
      quiz: {
        q: "Why is verifying characters in Rabin-Karp mandatory even when hashes are equal?",
        choices: [
          "To speed up execution.",
          "To prevent compiler overflow warnings.",
          "Because different string segments can have identical hash values (collisions).",
          "To reset the sliding window.",
        ],
        answer: 2,
        explain: "A hash function maps infinite strings to a finite set of integer values. Equal hashes do not guarantee equal strings, so character validation is required to ensure correctness.",
      },
    },
    {
      slug: "interview-questions",
      title: "16. Interview Questions",
      tagline: "High-frequency string questions and algorithm selections.",
      theory:
        "In interviews, string questions frequently test KMP logic, sliding windows, and hashing. Key problems include:\n- **strStr() / Index of occurrence**: Solved with KMP or Rabin-Karp in O(N + M).\n- **Longest Prefix Suffix / Borders**: Solved by computing the KMP LPS array in O(N).\n- **Repeated Substring Pattern**: A string S has a repeated pattern if the KMP failure value `len(S) - lps[-1]` divides `len(S)` and is not equal to `len(S)`.\n- **Longest Palindromic Substring**: Solved in O(N) using Manacher's Algorithm or O(N^2) using center expansion.",
      bullets: [
        "Use KMP / Rabin-Karp for exact pattern searches.",
        "Use Tries for multiple prefix lookup queries.",
        "Use Sliding Window for substring constraint checks (e.g. minimum window).",
      ],
      practice: [
        {
          title: "Implement strStr() (LC 28)",
          url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
          difficulty: "Easy",
        },
        {
          title: "Longest Palindromic Substring (LC 5)",
          url: "https://leetcode.com/problems/longest-palindromic-substring/",
          difficulty: "Medium",
        },
        {
          title: "Repeated Substring Pattern (LC 459)",
          url: "https://leetcode.com/problems/repeated-substring-pattern/",
          difficulty: "Easy",
        },
      ],
      quiz: {
        q: "What is the KMP shortcut to determine if S is composed entirely of a repeated substring S'?",
        choices: [
          "If the sorted string contains no duplicate characters.",
          "If the LPS value of the last character divides S length and is non-zero.",
          "If the Rabin-Karp hash equals zero.",
          "If the Z-array has no zeros.",
        ],
        answer: 1,
        explain: "In KMP, if `len(S) % (len(S) - lps[-1]) == 0` and `lps[-1] > 0`, it proves S is made of repeating blocks of length `len(S) - lps[-1]`.",
      },
    },
    {
      slug: "summary-revision",
      title: "17. Summary & Revision",
      tagline: "Algorithm comparison grid and curriculum wrap-up.",
      theory:
        "Let's review the time and space complexity of the core string algorithms:\n\n| Algorithm | Preprocessing Time | Search Time (Avg) | Search Time (Worst) | Auxiliary Space |\n|---|---|---|---|---|\n| Naive | None | O(N) | O(N * M) | O(1) |\n| KMP | O(M) | O(N + M) | O(N + M) | O(M) |\n| Rabin-Karp | O(M) | O(N + M) | O(N * M) | O(1) |\n| Z-Algorithm | O(N + M) | O(N + M) | O(N + M) | O(N + M) |\n| Boyer-Moore | O(M + Alphabet) | O(N / M) | O(N * M) | O(Alphabet) |\n| Suffix Array | O(N log N) | O(M log N) | O(M log N) | O(N) |\n\nCongratulations on completing the Algorithms curriculum! In the next module, we explore Bit Manipulation and system-level performance heuristics.",
      bullets: [
        "Naive is simple but has O(N * M) worst-case time.",
        "KMP is optimal and linear-time, storing shifts in LPS arrays.",
        "Rabin-Karp uses rolling hashes and works well for multiple pattern matches.",
        "Z-algorithm is straightforward and uses Z-box boundaries.",
      ],
      quiz: {
        q: "Which string matching algorithm can achieve sublinear search time on average?",
        choices: ["Naive Search", "KMP", "Boyer-Moore", "Z-Algorithm"],
        answer: 2,
        explain: "Boyer-Moore scans the pattern from right to left, allowing it to bypass up to M characters on a mismatch, achieving O(N/M) sublinear average time.",
      },
    },
  ],
};
