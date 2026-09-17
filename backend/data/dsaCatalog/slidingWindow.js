module.exports = [
  {
    "title": "Maximum Average Subarray I",
    "slug": "sliding-window-max-avg-subarray-i",
    "topic": "Sliding Window",
    "difficulty": "Easy",
    "problemStatement": "Given an array nums consisting of n integers and an integer k, find a contiguous subarray whose length is equal to k that has the maximum average value and return this value rounded to 2 decimal places.",
    "inputFormat": "First line: n and k. Second line: n integers.",
    "outputFormat": "Print max average formatted to 2 decimal places.",
    "constraints": [
      "1 <= k <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "6 4\n1 12 -5 -6 50 3",
        "output": "12.75",
        "explanation": "Subarray [12, -5, -6, 50] has average 51/4 = 12.75."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        double sum = 0;\n        double[] a = new double[n];\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextDouble();\n            if (i < k) sum += a[i];\n        }\n        double maxSum = sum;\n        for (int i = k; i < n; i++) {\n            sum += a[i] - a[i - k];\n            maxSum = Math.max(maxSum, sum);\n        }\n        System.out.printf(Locale.US, \"%.2f\\n\", maxSum / k);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [float(x) for x in d[2:2+n]]\n    s = sum(a[:k]); m = s\n    for i in range(k, n): s += a[i] - a[i-k]; m = max(m, s)\n    print(f\"{m/k:.2f}\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <iomanip>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<double> a(n); double s = 0;\n    for (int i = 0; i < n; i++) { cin >> a[i]; if (i < k) s += a[i]; }\n    double m = s;\n    for (int i = k; i < n; i++) { s += a[i] - a[i-k]; m = max(m, s); }\n    cout << fixed << setprecision(2) << m / k << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "6 4\n1 12 -5 -6 50 3",
        "expectedOutput": "12.75"
      },
      {
        "input": "1 1\n5",
        "expectedOutput": "5.00"
      }
    ],
    "solution": {
      "approach": "Fixed size sliding window of length k.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Substrings of Size Three with Distinct Characters",
    "slug": "sliding-window-substrings-three-distinct",
    "topic": "Sliding Window",
    "difficulty": "Easy",
    "problemStatement": "A string is good if there are no repeated characters. Given a string s, return the number of good substrings of length three in s.",
    "inputFormat": "A single string s.",
    "outputFormat": "Print number of good substrings of length 3.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "xyzzaz",
        "output": "1",
        "explanation": "\"xyz\" is good."
      },
      {
        "input": "aababcabc",
        "output": "4",
        "explanation": "Good substrings: \"abc\", \"bca\", \"cab\", \"abc\"."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : \"\";\n        int count = 0;\n        for (int i = 0; i < s.length() - 2; i++) {\n            char a = s.charAt(i), b = s.charAt(i+1), c = s.charAt(i+2);\n            if (a != b && b != c && a != c) count++;\n        }\n        System.out.println(count);\n    }\n}",
      "python": "import sys\ndef main():\n    s = sys.stdin.read().strip()\n    c = sum(1 for i in range(len(s) - 2) if len(set(s[i:i+3])) == 3)\n    print(c)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    int c = 0;\n    for (int i = 0; i + 2 < s.size(); i++) if (s[i] != s[i+1] && s[i+1] != s[i+2] && s[i] != s[i+2]) c++;\n    cout << c << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "xyzzaz",
        "expectedOutput": "1"
      },
      {
        "input": "aababcabc",
        "expectedOutput": "4"
      }
    ],
    "solution": {
      "approach": "Sliding window of length 3 checking uniqueness.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Defuse the Bomb",
    "slug": "sliding-window-defuse-bomb",
    "topic": "Sliding Window",
    "difficulty": "Easy",
    "problemStatement": "Given a circular array code and an integer k, decrypt the code according to rules: if k > 0 replace each with sum of next k numbers; if k == 0 replace with 0; if k < 0 replace with sum of previous |k| numbers.",
    "inputFormat": "First line: n and k. Second line: n integers.",
    "outputFormat": "Print decrypted array.",
    "constraints": [
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "4 3\n5 7 1 4",
        "output": "12 10 16 13",
        "explanation": "Decrypted sum of next 3."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n], res = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        if (k != 0) {\n            int start = k > 0 ? 1 : n + k, end = k > 0 ? k : n - 1;\n            int sum = 0;\n            for (int i = start; i <= end; i++) sum += a[i % n];\n            for (int i = 0; i < n; i++) {\n                res[i] = sum;\n                sum -= a[start++ % n];\n                sum += a[++end % n];\n            }\n        }\n        for (int i = 0; i < n; i++) System.out.print(res[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    res = [0] * n\n    if k != 0:\n        start, end = (1, k) if k > 0 else (n + k, n - 1)\n        s = sum(a[i % n] for i in range(start, end + 1))\n        for i in range(n):\n            res[i] = s\n            s -= a[start % n]; start += 1\n            end += 1; s += a[end % n]\n    print(\" \".join(str(x) for x in res))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n), res(n, 0); for (int i = 0; i < n; i++) cin >> a[i];\n    if (k != 0) {\n        int start = k > 0 ? 1 : n + k, end = k > 0 ? k : n - 1, sum = 0;\n        for (int i = start; i <= end; i++) sum += a[i % n];\n        for (int i = 0; i < n; i++) {\n            res[i] = sum;\n            sum -= a[start++ % n];\n            sum += a[++end % n];\n        }\n    }\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4 3\n5 7 1 4",
        "expectedOutput": "12 10 16 13"
      }
    ],
    "solution": {
      "approach": "Sliding window on circular array with modulo arithmetic.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Minimum Recolors to Get K Consecutive Black Blocks",
    "slug": "sliding-window-min-recolors",
    "topic": "Sliding Window",
    "difficulty": "Easy",
    "problemStatement": "Given a 0-indexed string blocks of length n (containing \"W\" and \"B\") and an integer k, return minimum operations to get at least k consecutive black blocks.",
    "inputFormat": "First line: n and k. Second line: string blocks.",
    "outputFormat": "Print minimum recolors.",
    "constraints": [
      "1 <= k <= n <= 100"
    ],
    "examples": [
      {
        "input": "7 7\nWBBWWBB",
        "output": "3",
        "explanation": "3 white blocks recolored."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        String s = sc.next();\n        int w = 0;\n        for (int i = 0; i < k; i++) if (s.charAt(i) == 'W') w++;\n        int minW = w;\n        for (int i = k; i < n; i++) {\n            if (s.charAt(i) == 'W') w++;\n            if (s.charAt(i - k) == 'W') w--;\n            minW = Math.min(minW, w);\n        }\n        System.out.println(minW);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); s = d[2]\n    w = s[:k].count('W'); min_w = w\n    for i in range(k, n):\n        if s[i] == 'W': w += 1\n        if s[i-k] == 'W': w -= 1\n        min_w = min(min_w, w)\n    print(min_w)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    string s; cin >> s;\n    int w = 0; for (int i = 0; i < k; i++) if (s[i] == 'W') w++;\n    int minW = w;\n    for (int i = k; i < n; i++) {\n        if (s[i] == 'W') w++;\n        if (s[i - k] == 'W') w--;\n        minW = min(minW, w);\n    }\n    cout << minW << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "7 7\nWBBWWBB",
        "expectedOutput": "3"
      }
    ],
    "solution": {
      "approach": "Count minimum W characters in any window of size k.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Longest Repeating Character Replacement",
    "slug": "sliding-window-longest-repeating-char-replacement",
    "topic": "Sliding Window",
    "difficulty": "Medium",
    "problemStatement": "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return length of longest substring containing same letter.",
    "inputFormat": "First line: string s. Second line: integer k.",
    "outputFormat": "Print length.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "examples": [
      {
        "input": "ABAB\n2",
        "output": "4",
        "explanation": "Replace two \"A\"s with \"B\"s to get \"BBBB\"."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next(); int k = sc.nextInt();\n        int[] count = new int[26];\n        int maxCount = 0, l = 0, maxLen = 0;\n        for (int r = 0; r < s.length(); r++) {\n            maxCount = Math.max(maxCount, ++count[s.charAt(r) - 'A']);\n            while (r - l + 1 - maxCount > k) count[s.charAt(l++) - 'A']--;\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    s, k = d[0], int(d[1])\n    count = {}; max_c = l = max_len = 0\n    for r, c in enumerate(s):\n        count[c] = count.get(c, 0) + 1\n        max_c = max(max_c, count[c])\n        while (r - l + 1) - max_c > k:\n            count[s[l]] -= 1; l += 1\n        max_len = max(max_len, r - l + 1)\n    print(max_len)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s; int k; if (!(cin >> s >> k)) return 0;\n    vector<int> count(26, 0); int maxC = 0, l = 0, maxLen = 0;\n    for (int r = 0; r < s.size(); r++) {\n        maxC = max(maxC, ++count[s[r] - 'A']);\n        while (r - l + 1 - maxC > k) count[s[l++] - 'A']--;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "ABAB\n2",
        "expectedOutput": "4"
      },
      {
        "input": "AABABBA\n1",
        "expectedOutput": "4"
      }
    ],
    "solution": {
      "approach": "Maintain frequency of most frequent char in window; shrink when non-matching > k.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Permutation in String",
    "slug": "sliding-window-permutation-in-string",
    "topic": "Sliding Window",
    "difficulty": "Medium",
    "problemStatement": "Given two strings s1 and s2, return \"true\" if s2 contains a permutation of s1, or \"false\" otherwise.",
    "inputFormat": "First line: s1. Second line: s2.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= s1.length, s2.length <= 10^4"
    ],
    "examples": [
      {
        "input": "ab\neidbaooo",
        "output": "true",
        "explanation": "s2 contains \"ba\" which is a permutation of \"ab\"."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.next(), s2 = sc.next();\n        if (s1.length() > s2.length()) { System.out.println(\"false\"); return; }\n        int[] c1 = new int[26], c2 = new int[26];\n        for (int i = 0; i < s1.length(); i++) {\n            c1[s1.charAt(i) - 'a']++;\n            c2[s2.charAt(i) - 'a']++;\n        }\n        for (int i = 0; i <= s2.length() - s1.length(); i++) {\n            if (Arrays.equals(c1, c2)) { System.out.println(\"true\"); return; }\n            if (i + s1.length() < s2.length()) {\n                c2[s2.charAt(i) - 'a']--;\n                c2[s2.charAt(i + s1.length()) - 'a']++;\n            }\n        }\n        System.out.println(\"false\");\n    }\n}",
      "python": "import sys\nfrom collections import Counter\ndef main():\n    d = sys.stdin.read().split()\n    if len(d) < 2: return\n    s1, s2 = d[0], d[1]\n    k = len(s1); c1 = Counter(s1); c2 = Counter(s2[:k])\n    for i in range(len(s2) - k + 1):\n        if c1 == c2: print(\"true\"); return\n        if i + k < len(s2):\n            c2[s2[i]] -= 1\n            if c2[s2[i]] == 0: del c2[s2[i]]\n            c2[s2[i+k]] = c2.get(s2[i+k], 0) + 1\n    print(\"false\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s1, s2; if (!(cin >> s1 >> s2)) return 0;\n    if (s1.size() > s2.size()) { cout << \"false\" << endl; return 0; }\n    vector<int> c1(26, 0), c2(26, 0);\n    for (int i = 0; i < s1.size(); i++) { c1[s1[i]-'a']++; c2[s2[i]-'a']++; }\n    for (int i = 0; i <= s2.size() - s1.size(); i++) {\n        if (c1 == c2) { cout << \"true\" << endl; return 0; }\n        if (i + s1.size() < s2.size()) { c2[s2[i]-'a']--; c2[s2[i+s1.size()]-'a']++; }\n    }\n    cout << \"false\" << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "ab\neidbaooo",
        "expectedOutput": "true"
      },
      {
        "input": "ab\neidboaoo",
        "expectedOutput": "false"
      }
    ],
    "solution": {
      "approach": "Fixed size sliding window tracking frequency vector match.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Max Consecutive Ones III",
    "slug": "sliding-window-max-consecutive-ones-iii",
    "topic": "Sliding Window",
    "difficulty": "Medium",
    "problemStatement": "Given a binary array nums and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s.",
    "inputFormat": "First line: n and k. Second line: n binary values.",
    "outputFormat": "Print maximum length.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "11 2\n1 1 1 0 0 0 1 1 1 1 0",
        "output": "6",
        "explanation": "Flip two zeros to get 6 consecutive 1s."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, zeroes = 0, maxLen = 0;\n        for (int r = 0; r < n; r++) {\n            if (a[r] == 0) zeroes++;\n            while (zeroes > k) if (a[l++] == 0) zeroes--;\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    l = z = max_len = 0\n    for r in range(n):\n        if a[r] == 0: z += 1\n        while z > k:\n            if a[l] == 0: z -= 1\n            l += 1\n        max_len = max(max_len, r - l + 1)\n    print(max_len)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, z = 0, maxLen = 0;\n    for (int r = 0; r < n; r++) {\n        if (a[r] == 0) z++;\n        while (z > k) if (a[l++] == 0) z--;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "11 2\n1 1 1 0 0 0 1 1 1 1 0",
        "expectedOutput": "6"
      }
    ],
    "solution": {
      "approach": "Variable sliding window maintaining at most k zeroes.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-sliding-window-maximum",
    "topic": "Sliding Window",
    "difficulty": "Hard",
    "problemStatement": "You are given an array of integers nums, and a sliding window of size k moving from left to right. Return the max in each window.",
    "inputFormat": "First line: n and k. Second line: n space-separated integers.",
    "outputFormat": "Print max for each window separated by space.",
    "constraints": [
      "1 <= k <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "8 3\n1 3 -1 -3 5 3 6 7",
        "output": "3 3 5 5 6 7",
        "explanation": "Window maximums."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Deque<Integer> dq = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();\n            while (!dq.isEmpty() && a[dq.peekLast()] < a[i]) dq.pollLast();\n            dq.offerLast(i);\n            if (i >= k - 1) System.out.print(a[dq.peekFirst()] + (i == n - 1 ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    dq = deque(); res = []\n    for i in range(n):\n        while dq and dq[0] < i - k + 1: dq.popleft()\n        while dq and a[dq[-1]] < a[i]: dq.pop()\n        dq.append(i)\n        if i >= k - 1: res.append(str(a[dq[0]]))\n    print(\" \".join(res))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    deque<int> dq;\n    for (int i = 0; i < n; i++) {\n        while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();\n        while (!dq.empty() && a[dq.back()] < a[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) cout << a[dq.front()] << (i == n - 1 ? \"\" : \" \");\n    }\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "8 3\n1 3 -1 -3 5 3 6 7",
        "expectedOutput": "3 3 5 5 6 7"
      }
    ],
    "solution": {
      "approach": "Monotonic decreasing deque of indices.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(K)"
    }
  },
  {
    "title": "Minimum Window Subsequence",
    "slug": "sliding-window-minimum-window-subsequence",
    "topic": "Sliding Window",
    "difficulty": "Hard",
    "problemStatement": "Given strings s1 and s2, return the minimum contiguous substring part of s1 so that s2 is a subsequence of part. If no such substring, print empty line.",
    "inputFormat": "First line: s1. Second line: s2.",
    "outputFormat": "Print minimal substring.",
    "constraints": [
      "1 <= s1.length <= 20000"
    ],
    "examples": [
      {
        "input": "abcdebdde\nbde",
        "output": "bcde",
        "explanation": "\"bcde\" contains \"bde\" in order."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.next(), s2 = sc.next();\n        int i = 0, j = 0, minLen = Integer.MAX_VALUE, start = -1;\n        while (i < s1.length()) {\n            if (s1.charAt(i) == s2.charAt(j)) {\n                if (++j == s2.length()) {\n                    int end = i + 1;\n                    while (--j >= 0) while (s1.charAt(i--) != s2.charAt(j));\n                    i++; j++;\n                    if (end - i < minLen) { minLen = end - i; start = i; }\n                }\n            }\n            i++;\n        }\n        System.out.println(start == -1 ? \"\" : s1.substring(start, start + minLen));\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if len(d) < 2: return\n    s1, s2 = d[0], d[1]\n    i = j = 0; min_l = float('inf'); start = -1\n    while i < len(s1):\n        if s1[i] == s2[j]:\n            j += 1\n            if j == len(s2):\n                end = i + 1; j -= 1\n                while j >= 0:\n                    while s1[i] != s2[j]: i -= 1\n                    i -= 1; j -= 1\n                i += 1; j = 0\n                if end - i < min_l: min_l = end - i; start = i\n        i += 1\n    print(\"\" if start == -1 else s1[start:start+min_l])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <climits>\nusing namespace std;\nint main() {\n    string s1, s2; if (!(cin >> s1 >> s2)) return 0;\n    int i = 0, j = 0, minLen = INT_MAX, start = -1;\n    while (i < s1.size()) {\n        if (s1[i] == s2[j]) {\n            if (++j == s2.size()) {\n                int end = i + 1;\n                while (--j >= 0) while (s1[i--] != s2[j]);\n                i++; j++;\n                if (end - i < minLen) { minLen = end - i; start = i; }\n            }\n        }\n        i++;\n    }\n    cout << (start == -1 ? \"\" : s1.substr(start, minLen)) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "abcdebdde\nbde",
        "expectedOutput": "bcde"
      }
    ],
    "solution": {
      "approach": "Two pointer forward scan followed by backwards contraction to find minimal window.",
      "timeComplexity": "O(N * M)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Substring with Concatenation of All Words",
    "slug": "sliding-window-substring-with-concatenation",
    "topic": "Sliding Window",
    "difficulty": "Hard",
    "problemStatement": "Given a string s and an array of strings words of the same length, return the number of starting indices of substring(s) in s that is a concatenation of each word in words exactly once.",
    "inputFormat": "First line: string s. Second line: n (count of words). Third line: n words.",
    "outputFormat": "Print count of starting indices.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "examples": [
      {
        "input": "barfoothefoobarman\n2\nfoo bar",
        "output": "2",
        "explanation": "Indices 0 and 9 match."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next(); int n = sc.nextInt();\n        String[] words = new String[n];\n        Map<String, Integer> counts = new HashMap<>();\n        for (int i = 0; i < n; i++) { words[i] = sc.next(); counts.put(words[i], counts.getOrDefault(words[i], 0) + 1); }\n        int wordLen = words[0].length(), totalLen = n * wordLen, ans = 0;\n        for (int i = 0; i <= s.length() - totalLen; i++) {\n            Map<String, Integer> seen = new HashMap<>();\n            int j = 0;\n            while (j < n) {\n                String w = s.substring(i + j * wordLen, i + (j + 1) * wordLen);\n                if (!counts.containsKey(w)) break;\n                seen.put(w, seen.getOrDefault(w, 0) + 1);\n                if (seen.get(w) > counts.get(w)) break;\n                j++;\n            }\n            if (j == n) ans++;\n        }\n        System.out.println(ans);\n    }\n}",
      "python": "import sys\nfrom collections import Counter\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    s, n = d[0], int(d[1]); words = d[2:2+n]\n    counts = Counter(words); w_len = len(words[0]); tot = n * w_len; ans = 0\n    for i in range(len(s) - tot + 1):\n        seen = Counter()\n        j = 0\n        while j < n:\n            w = s[i + j*w_len : i + (j+1)*w_len]\n            if w not in counts: break\n            seen[w] += 1\n            if seen[w] > counts[w]: break\n            j += 1\n        if j == n: ans += 1\n    print(ans)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    string s; int n; if (!(cin >> s >> n)) return 0;\n    vector<string> words(n); unordered_map<string, int> counts;\n    for (int i = 0; i < n; i++) { cin >> words[i]; counts[words[i]]++; }\n    int wLen = words[0].size(), tot = n * wLen, ans = 0;\n    for (int i = 0; i + tot <= s.size(); i++) {\n        unordered_map<string, int> seen; int j = 0;\n        while (j < n) {\n            string w = s.substr(i + j * wLen, wLen);\n            if (!counts.count(w)) break;\n            if (++seen[w] > counts[w]) break;\n            j++;\n        }\n        if (j == n) ans++;\n    }\n    cout << ans << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "barfoothefoobarman\n2\nfoo bar",
        "expectedOutput": "2"
      }
    ],
    "solution": {
      "approach": "Chunk-based sliding window over offsets [0, wordLen).",
      "timeComplexity": "O(N * K)",
      "spaceComplexity": "O(M)"
    }
  }
];
