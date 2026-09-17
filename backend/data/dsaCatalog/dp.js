module.exports = [
  {
    "title": "Climbing Stairs",
    "slug": "dp-climbing-stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "problemStatement": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print distinct ways count.",
    "constraints": [
      "1 <= n <= 45"
    ],
    "examples": [
      {
        "input": "2",
        "output": "2",
        "explanation": "1+1 or 2."
      },
      {
        "input": "3",
        "output": "3",
        "explanation": "1+1+1, 1+2, 2+1."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int a = 1, b = 1;\n        for (int i = 2; i <= n; i++) { int t = a + b; a = b; b = t; }\n        System.out.println(b);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a, b = 1, 1\n    for _ in range(n - 1): a, b = b, a + b\n    print(b)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int a = 1, b = 1;\n    for (int i = 2; i <= n; i++) { int t = a + b; a = b; b = t; }\n    cout << b << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "2"
      },
      {
        "input": "3",
        "expectedOutput": "3"
      }
    ],
    "solution": {
      "approach": "dp[i] = dp[i-1] + dp[i-2] with O(1) space.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Min Cost Climbing Stairs",
    "slug": "dp-min-cost-climbing-stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "problemStatement": "Given an integer array cost where cost[i] is the cost of ith step, return the minimum cost to reach the top of the floor.",
    "inputFormat": "First line: n. Second line: n costs.",
    "outputFormat": "Print minimum cost.",
    "constraints": [
      "2 <= cost.length <= 1000"
    ],
    "examples": [
      {
        "input": "3\n10 15 20",
        "output": "15",
        "explanation": "Pay 15 and climb two steps to top."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] c = new int[n];\n        for (int i = 0; i < n; i++) c[i] = sc.nextInt();\n        int a = 0, b = 0;\n        for (int i = 2; i <= n; i++) {\n            int cur = Math.min(b + c[i - 1], a + c[i - 2]);\n            a = b; b = cur;\n        }\n        System.out.println(b);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); c = [int(x) for x in d[1:n+1]]\n    a = b = 0\n    for i in range(2, n + 1):\n        cur = min(b + c[i - 1], a + c[i - 2])\n        a, b = b, cur\n    print(b)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> c(n); for (int i = 0; i < n; i++) cin >> c[i];\n    int a = 0, b = 0;\n    for (int i = 2; i <= n; i++) {\n        int cur = min(b + c[i - 1], a + c[i - 2]);\n        a = b; b = cur;\n    }\n    cout << b << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3\n10 15 20",
        "expectedOutput": "15"
      }
    ],
    "solution": {
      "approach": "dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "House Robber",
    "slug": "dp-house-robber",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "problemStatement": "You are a professional robber planning to rob houses along a street. Adjacent houses have security systems connected. Return maximum money you can rob without alerting police.",
    "inputFormat": "First line: n. Second line: n house values.",
    "outputFormat": "Print max amount.",
    "constraints": [
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "4\n1 2 3 1",
        "output": "4",
        "explanation": "Rob house 1 (1) + house 3 (3) = 4."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int rob = 0, noRob = 0;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            int newRob = noRob + x;\n            noRob = Math.max(noRob, rob);\n            rob = newRob;\n        }\n        System.out.println(Math.max(rob, noRob));\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    rob = no_rob = 0\n    for x in a:\n        new_rob = no_rob + x\n        no_rob = max(no_rob, rob)\n        rob = new_rob\n    print(max(rob, no_rob))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int rob = 0, noRob = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        int newRob = noRob + x;\n        noRob = max(noRob, rob);\n        rob = newRob;\n    }\n    cout << max(rob, noRob) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n1 2 3 1",
        "expectedOutput": "4"
      },
      {
        "input": "5\n2 7 9 3 1",
        "expectedOutput": "12"
      }
    ],
    "solution": {
      "approach": "Two states dp: rob vs noRob.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Divisor Game",
    "slug": "dp-divisor-game",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "problemStatement": "Alice and Bob take turns playing a game, with Alice starting first. Initially there is a number n. In each turn a player chooses x with 0 < x < n and n % x == 0 and replaces n with n - x. If Alice wins, return \"true\", else \"false\".",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= n <= 1000"
    ],
    "examples": [
      {
        "input": "2",
        "output": "true",
        "explanation": "Alice chooses 1, Bob has no moves."
      },
      {
        "input": "3",
        "output": "false",
        "explanation": "Bob will win."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(n % 2 == 0 ? \"true\" : \"false\");\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    print(\"true\" if int(d[0]) % 2 == 0 else \"false\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { int n; if (cin >> n) cout << (n % 2 == 0 ? \"true\" : \"false\") << endl; return 0; }"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "true"
      },
      {
        "input": "3",
        "expectedOutput": "false"
      }
    ],
    "solution": {
      "approach": "Game theory induction: even states are winning, odd states are losing.",
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Coin Change",
    "slug": "dp-coin-change",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "problemStatement": "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount, or -1.",
    "inputFormat": "First line: n and amount. Second line: n coin values.",
    "outputFormat": "Print fewest coins count or -1.",
    "constraints": [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10^4"
    ],
    "examples": [
      {
        "input": "3 11\n1 2 5",
        "output": "3",
        "explanation": "5 + 5 + 1 = 11."
      },
      {
        "input": "1 3\n2",
        "output": "-1",
        "explanation": "Cannot make 3 with 2."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), amount = sc.nextInt();\n        int[] coins = new int[n];\n        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n        System.out.println(dp[amount] > amount ? -1 : dp[amount]);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, amount = int(d[0]), int(d[1]); coins = [int(x) for x in d[2:2+n]]\n    dp = [amount + 1] * (amount + 1); dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i >= c: dp[i] = min(dp[i], dp[i - c] + 1)\n    print(-1 if dp[amount] > amount else dp[amount])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, amount; if (!(cin >> n >> amount)) return 0;\n    vector<int> coins(n); for (int i = 0; i < n; i++) cin >> coins[i];\n    vector<int> dp(amount + 1, amount + 1); dp[0] = 0;\n    for (int i = 1; i <= amount; i++) for (int c : coins) if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1);\n    cout << (dp[amount] > amount ? -1 : dp[amount]) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 11\n1 2 5",
        "expectedOutput": "3"
      },
      {
        "input": "1 3\n2",
        "expectedOutput": "-1"
      }
    ],
    "solution": {
      "approach": "Unbounded knapsack DP: dp[i] = min(dp[i - c] + 1).",
      "timeComplexity": "O(amount * N)",
      "spaceComplexity": "O(amount)"
    }
  },
  {
    "title": "Longest Increasing Subsequence",
    "slug": "dp-longest-increasing-subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "problemStatement": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    "inputFormat": "First line: n. Second line: n integers.",
    "outputFormat": "Print length.",
    "constraints": [
      "1 <= nums.length <= 2500"
    ],
    "examples": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "output": "4",
        "explanation": "LIS is [2, 3, 7, 101] of length 4."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        List<Integer> tails = new ArrayList<>();\n        for (int x : a) {\n            int idx = Collections.binarySearch(tails, x);\n            if (idx < 0) idx = -(idx + 1);\n            if (idx == tails.size()) tails.add(x);\n            else tails.set(idx, x);\n        }\n        System.out.println(tails.size());\n    }\n}",
      "python": "import sys, bisect\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    tails = []\n    for x in a:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    print(len(tails))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    vector<int> tails;\n    for (int x : a) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "expectedOutput": "4"
      }
    ],
    "solution": {
      "approach": "Patience sorting with binary search on active tail candidates.",
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "0/1 Knapsack Problem",
    "slug": "dp-0-1-knapsack",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "problemStatement": "Given n items with weights and values, and a maximum capacity W, find the maximum value that can be put in a knapsack.",
    "inputFormat": "First line: n and W. Second line: n values. Third line: n weights.",
    "outputFormat": "Print maximum value.",
    "constraints": [
      "1 <= n <= 1000",
      "1 <= W <= 1000"
    ],
    "examples": [
      {
        "input": "3 4\n1 2 3\n4 5 1",
        "output": "3",
        "explanation": "Take item 3 (weight 1, value 3)."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), w = sc.nextInt();\n        int[] val = new int[n], wt = new int[n];\n        for (int i = 0; i < n; i++) val[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) wt[i] = sc.nextInt();\n        int[] dp = new int[w + 1];\n        for (int i = 0; i < n; i++) {\n            for (int j = w; j >= wt[i]; j--) dp[j] = Math.max(dp[j], dp[j - wt[i]] + val[i]);\n        }\n        System.out.println(dp[w]);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, w = int(d[0]), int(d[1]); val = [int(x) for x in d[2:2+n]]; wt = [int(x) for x in d[2+n:2+2*n]]\n    dp = [0] * (w + 1)\n    for v, weight in zip(val, wt):\n        for j in range(w, weight - 1, -1):\n            dp[j] = max(dp[j], dp[j - weight] + v)\n    print(dp[w])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, w; if (!(cin >> n >> w)) return 0;\n    vector<int> val(n), wt(n); for (int i = 0; i < n; i++) cin >> val[i]; for (int i = 0; i < n; i++) cin >> wt[i];\n    vector<int> dp(w + 1, 0);\n    for (int i = 0; i < n; i++) for (int j = w; j >= wt[i]; j--) dp[j] = max(dp[j], dp[j - wt[i]] + val[i]);\n    cout << dp[w] << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 4\n1 2 3\n4 5 1",
        "expectedOutput": "3"
      }
    ],
    "solution": {
      "approach": "Classic 0/1 knapsack 1D space optimization.",
      "timeComplexity": "O(N * W)",
      "spaceComplexity": "O(W)"
    }
  },
  {
    "title": "Edit Distance",
    "slug": "dp-edit-distance",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "problemStatement": "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, or replace a character).",
    "inputFormat": "First line: word1. Second line: word2.",
    "outputFormat": "Print min edit distance.",
    "constraints": [
      "0 <= word1.length, word2.length <= 500"
    ],
    "examples": [
      {
        "input": "horse\nros",
        "output": "3",
        "explanation": "horse -> rorse -> rose -> ros."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.hasNext() ? sc.next() : \"\", s2 = sc.hasNext() ? sc.next() : \"\";\n        int m = s1.length(), n = s2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));\n            }\n        }\n        System.out.println(dp[m][n]);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    s1 = d[0] if len(d) > 0 else \"\"; s2 = d[1] if len(d) > 1 else \"\"\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1]\n            else: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])\n    print(dp[m][n])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s1, s2; if (!(cin >> s1 >> s2)) { cout << 0 << endl; return 0; }\n    int m = s1.size(), n = s2.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});\n        }\n    }\n    cout << dp[m][n] << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "horse\nros",
        "expectedOutput": "3"
      },
      {
        "input": "intention\nexecution",
        "expectedOutput": "5"
      }
    ],
    "solution": {
      "approach": "Levenshtein distance matrix matching prefixes.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)"
    }
  },
  {
    "title": "Burst Balloons",
    "slug": "dp-burst-balloons",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "problemStatement": "You are given n balloons, each with a number of coins painted on it represented by array nums. Burst all the balloons to maximize total coins collected.",
    "inputFormat": "First line: n. Second line: n integers.",
    "outputFormat": "Print max coins.",
    "constraints": [
      "1 <= n <= 500"
    ],
    "examples": [
      {
        "input": "4\n3 1 5 8",
        "output": "167",
        "explanation": "Max coins is 167."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n + 2]; a[0] = a[n + 1] = 1;\n        for (int i = 1; i <= n; i++) a[i] = sc.nextInt();\n        int[][] dp = new int[n + 2][n + 2];\n        for (int len = 1; len <= n; len++) {\n            for (int l = 1; l <= n - len + 1; l++) {\n                int r = l + len - 1;\n                for (int k = l; k <= r; k++) {\n                    dp[l][r] = Math.max(dp[l][r], dp[l][k - 1] + a[l - 1] * a[k] * a[r + 1] + dp[k + 1][r]);\n                }\n            }\n        }\n        System.out.println(dp[1][n]);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [1] + [int(x) for x in d[1:n+1]] + [1]\n    dp = [[0]*(n+2) for _ in range(n+2)]\n    for length in range(1, n + 1):\n        for l in range(1, n - length + 2):\n            r = l + length - 1\n            for k in range(l, r + 1):\n                dp[l][r] = max(dp[l][r], dp[l][k-1] + a[l-1]*a[k]*a[r+1] + dp[k+1][r])\n    print(dp[1][n])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n + 2, 1); for (int i = 1; i <= n; i++) cin >> a[i];\n    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));\n    for (int len = 1; len <= n; len++) {\n        for (int l = 1; l <= n - len + 1; l++) {\n            int r = l + len - 1;\n            for (int k = l; k <= r; k++) {\n                dp[l][r] = max(dp[l][r], dp[l][k - 1] + a[l - 1] * a[k] * a[r + 1] + dp[k + 1][r]);\n            }\n        }\n    }\n    cout << dp[1][n] << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n3 1 5 8",
        "expectedOutput": "167"
      }
    ],
    "solution": {
      "approach": "Interval DP picking the LAST balloon to burst in range [l, r].",
      "timeComplexity": "O(N^3)",
      "spaceComplexity": "O(N^2)"
    }
  },
  {
    "title": "Regular Expression Matching",
    "slug": "dp-regular-expression-matching",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "problemStatement": "Given an input string s and a pattern p, implement regular expression matching with support for '.' (matches any single character) and '*' (matches zero or more of the preceding element). Return \"true\" or \"false\".",
    "inputFormat": "First line: s. Second line: p.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= s.length, p.length <= 20"
    ],
    "examples": [
      {
        "input": "aa\na",
        "output": "false",
        "explanation": "Pattern does not match entire string."
      },
      {
        "input": "aa\na*",
        "output": "true",
        "explanation": "'*' matches two 'a's."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next(), p = sc.next();\n        int m = s.length(), n = p.length();\n        boolean[][] dp = new boolean[m + 1][n + 1];\n        dp[0][0] = true;\n        for (int j = 2; j <= n; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (p.charAt(j - 1) == '*') {\n                    dp[i][j] = dp[i][j - 2];\n                    if (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1)) dp[i][j] |= dp[i - 1][j];\n                } else if (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) dp[i][j] = dp[i - 1][j - 1];\n            }\n        }\n        System.out.println(dp[m][n] ? \"true\" : \"false\");\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if len(d) < 2: return\n    s, p = d[0], d[1]\n    m, n = len(s), len(p)\n    dp = [[False]*(n+1) for _ in range(m+1)]; dp[0][0] = True\n    for j in range(2, n + 1):\n        if p[j-1] == '*': dp[0][j] = dp[0][j-2]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if p[j-1] == '*':\n                dp[i][j] = dp[i][j-2] or ((p[j-2] in ('.', s[i-1])) and dp[i-1][j])\n            elif p[j-1] in ('.', s[i-1]): dp[i][j] = dp[i-1][j-1]\n    print(\"true\" if dp[m][n] else \"false\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s, p; if (!(cin >> s >> p)) return 0;\n    int m = s.size(), n = p.size();\n    vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false)); dp[0][0] = true;\n    for (int j = 2; j <= n; j++) if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (p[j - 1] == '*') dp[i][j] = dp[i][j - 2] || ((p[j - 2] == '.' || p[j - 2] == s[i - 1]) && dp[i - 1][j]);\n            else if (p[j - 1] == '.' || p[j - 1] == s[i - 1]) dp[i][j] = dp[i - 1][j - 1];\n        }\n    }\n    cout << (dp[m][n] ? \"true\" : \"false\") << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "aa\na",
        "expectedOutput": "false"
      },
      {
        "input": "aa\na*",
        "expectedOutput": "true"
      }
    ],
    "solution": {
      "approach": "2D dynamic programming tracking matching state across character and Kleene star operators.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)"
    }
  }
];
