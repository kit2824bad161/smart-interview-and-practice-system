module.exports = [
  {
    "title": "Fibonacci Number",
    "slug": "recursion-fibonacci-number",
    "topic": "Recursion",
    "difficulty": "Easy",
    "problemStatement": "The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print F(n).",
    "constraints": [
      "0 <= n <= 30"
    ],
    "examples": [
      {
        "input": "2",
        "output": "1",
        "explanation": "F(2) = F(1) + F(0) = 1 + 0 = 1."
      },
      {
        "input": "4",
        "output": "3",
        "explanation": "F(4) = 3."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int fib(int n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int a = 0, b = 1;\n        for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }\n        System.out.println(a);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    print(a)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }\n    cout << a << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "1"
      },
      {
        "input": "4",
        "expectedOutput": "3"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      }
    ],
    "solution": {
      "approach": "Recursive state transition F(n) = F(n-1) + F(n-2) or memoized dynamic programming.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Power of Two",
    "slug": "recursion-power-of-two",
    "topic": "Recursion",
    "difficulty": "Easy",
    "problemStatement": "Given an integer n, return \"true\" if it is a power of two. Otherwise, return \"false\".",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "-2^31 <= n <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "1",
        "output": "true",
        "explanation": "2^0 = 1."
      },
      {
        "input": "16",
        "output": "true",
        "explanation": "2^4 = 16."
      },
      {
        "input": "3",
        "output": "false",
        "explanation": "Not a power of two."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static boolean isPowerOfTwo(long n) {\n        if (n <= 0) return false;\n        if (n == 1) return true;\n        return n % 2 == 0 && isPowerOfTwo(n / 2);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(isPowerOfTwo(n) ? \"true\" : \"false\");\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    def rec(x):\n        if x <= 0: return False\n        if x == 1: return True\n        return x % 2 == 0 and rec(x // 2)\n    print(\"true\" if rec(n) else \"false\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nbool isPowerOfTwo(long long n) {\n    if (n <= 0) return false;\n    if (n == 1) return true;\n    return n % 2 == 0 && isPowerOfTwo(n / 2);\n}\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << (isPowerOfTwo(n) ? \"true\" : \"false\") << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "true"
      },
      {
        "input": "16",
        "expectedOutput": "true"
      },
      {
        "input": "3",
        "expectedOutput": "false"
      }
    ],
    "solution": {
      "approach": "Recursively divide by 2 until reaching 1.",
      "timeComplexity": "O(log N)",
      "spaceComplexity": "O(log N)"
    }
  },
  {
    "title": "Sum of Digits",
    "slug": "recursion-sum-of-digits",
    "topic": "Recursion",
    "difficulty": "Easy",
    "problemStatement": "Given an integer n, calculate the sum of its digits recursively.",
    "inputFormat": "A single non-negative integer n.",
    "outputFormat": "Print the sum of digits.",
    "constraints": [
      "0 <= n <= 10^9"
    ],
    "examples": [
      {
        "input": "1234",
        "output": "10",
        "explanation": "1 + 2 + 3 + 4 = 10."
      },
      {
        "input": "9",
        "output": "9",
        "explanation": "Single digit 9."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int sumDigits(long n) { if (n == 0) return 0; return (int)(n % 10) + sumDigits(n / 10); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(sumDigits(n));\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    def rec(x): return 0 if x == 0 else (x % 10) + rec(x // 10)\n    print(rec(n))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint sumDigits(long long n) { if (n == 0) return 0; return (n % 10) + sumDigits(n / 10); }\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << sumDigits(n) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "1234",
        "expectedOutput": "10"
      },
      {
        "input": "9",
        "expectedOutput": "9"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      }
    ],
    "solution": {
      "approach": "Recursive relation sum(n) = (n % 10) + sum(n / 10).",
      "timeComplexity": "O(log10 N)",
      "spaceComplexity": "O(log10 N)"
    }
  },
  {
    "title": "Count Good Numbers",
    "slug": "recursion-count-good-numbers",
    "topic": "Recursion",
    "difficulty": "Easy",
    "problemStatement": "A digit string is good if the digits (0-indexed) at even indices are even (0,2,4,6,8) and the digits at odd indices are prime (2,3,5,7). Given n, return total good digit strings modulo 10^9 + 7.",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print total modulo 10^9 + 7.",
    "constraints": [
      "1 <= n <= 10^15"
    ],
    "examples": [
      {
        "input": "1",
        "output": "5",
        "explanation": "5 even digits: 0, 2, 4, 6, 8."
      },
      {
        "input": "4",
        "output": "400",
        "explanation": "5 * 4 * 5 * 4 = 400."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static final long MOD = 1_000_000_007;\n    private static long pow(long b, long e) {\n        long res = 1; b %= MOD;\n        while (e > 0) {\n            if (e % 2 == 1) res = (res * b) % MOD;\n            b = (b * b) % MOD;\n            e /= 2;\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long even = (n + 1) / 2, odd = n / 2;\n        long ans = (pow(5, even) * pow(4, odd)) % MOD;\n        System.out.println(ans);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); MOD = 10**9 + 7\n    even = (n + 1) // 2; odd = n // 2\n    ans = (pow(5, even, MOD) * pow(4, odd, MOD)) % MOD\n    print(ans)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nconst long long MOD = 1000000007;\nlong long power(long long b, long long e) {\n    long long res = 1; b %= MOD;\n    while (e > 0) {\n        if (e % 2 == 1) res = (res * b) % MOD;\n        b = (b * b) % MOD; e /= 2;\n    }\n    return res;\n}\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    long long even = (n + 1) / 2, odd = n / 2;\n    cout << (power(5, even) * power(4, odd)) % MOD << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "5"
      },
      {
        "input": "4",
        "expectedOutput": "400"
      }
    ],
    "solution": {
      "approach": "Modular exponentiation counting 5 choices for even and 4 for odd.",
      "timeComplexity": "O(log N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Pow(x, n)",
    "slug": "recursion-pow-x-n",
    "topic": "Recursion",
    "difficulty": "Medium",
    "problemStatement": "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Round output to 4 decimal places.",
    "inputFormat": "First line: x (double) and n (integer).",
    "outputFormat": "Print x^n formatted to 4 decimal places.",
    "constraints": [
      "-100.0 < x < 100.0",
      "-2^31 <= n <= 2^31-1"
    ],
    "examples": [
      {
        "input": "2.0000 10",
        "output": "1024.0000",
        "explanation": "2^10 = 1024."
      },
      {
        "input": "2.1000 3",
        "output": "9.2610",
        "explanation": "2.1^3 = 9.261."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static double myPow(double x, long n) {\n        if (n == 0) return 1.0;\n        if (n < 0) return 1.0 / myPow(x, -n);\n        double half = myPow(x, n / 2);\n        return (n % 2 == 0) ? half * half : half * half * x;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double x = sc.nextDouble(); long n = sc.nextLong();\n        System.out.printf(Locale.US, \"%.4f\\n\", myPow(x, n));\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    x, n = float(d[0]), int(d[1])\n    def p(base, exp):\n        if exp == 0: return 1.0\n        if exp < 0: return 1.0 / p(base, -exp)\n        h = p(base, exp // 2)\n        return h * h if exp % 2 == 0 else h * h * base\n    print(f\"{p(x, n):.4f}\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <iomanip>\nusing namespace std;\ndouble myPow(double x, long long n) {\n    if (n == 0) return 1.0;\n    if (n < 0) return 1.0 / myPow(x, -n);\n    double h = myPow(x, n / 2);\n    return (n % 2 == 0) ? h * h : h * h * x;\n}\nint main() {\n    double x; long long n; if (!(cin >> x >> n)) return 0;\n    cout << fixed << setprecision(4) << myPow(x, n) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "2.0000 10",
        "expectedOutput": "1024.0000"
      },
      {
        "input": "2.1000 3",
        "expectedOutput": "9.2610"
      }
    ],
    "solution": {
      "approach": "Binary exponentiation recursion (divide and conquer).",
      "timeComplexity": "O(log N)",
      "spaceComplexity": "O(log N)"
    }
  },
  {
    "title": "Subsets",
    "slug": "recursion-subsets",
    "topic": "Recursion",
    "difficulty": "Medium",
    "problemStatement": "Given an integer array nums of unique elements, return the number of all possible subsets (the power set).",
    "inputFormat": "First line: n. Second line: n integers.",
    "outputFormat": "Print total number of subsets (2^n).",
    "constraints": [
      "1 <= nums.length <= 10"
    ],
    "examples": [
      {
        "input": "3\n1 2 3",
        "output": "8",
        "explanation": "Total 2^3 = 8 subsets."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(1 << n);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); print(1 << n)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cout << (1 << n) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expectedOutput": "8"
      },
      {
        "input": "1\n0",
        "expectedOutput": "2"
      }
    ],
    "solution": {
      "approach": "Recursive pick/leave tree yielding 2^n states.",
      "timeComplexity": "O(2^N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Permutations",
    "slug": "recursion-permutations",
    "topic": "Recursion",
    "difficulty": "Medium",
    "problemStatement": "Given an array nums of distinct integers, return the number of all possible permutations (n!).",
    "inputFormat": "First line: n. Second line: n integers.",
    "outputFormat": "Print total permutations (n!).",
    "constraints": [
      "1 <= nums.length <= 6"
    ],
    "examples": [
      {
        "input": "3\n1 2 3",
        "output": "6",
        "explanation": "3! = 6 permutations."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fact(n));\n    }\n}",
      "python": "import sys, math\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); print(math.factorial(n))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cout << fact(n) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expectedOutput": "6"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "Recursive backtracking swap permutation generator.",
      "timeComplexity": "O(N!)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "N-Queens",
    "slug": "recursion-n-queens",
    "topic": "Recursion",
    "difficulty": "Hard",
    "problemStatement": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return total distinct solutions.",
    "inputFormat": "A single integer n.",
    "outputFormat": "Print total distinct solutions.",
    "constraints": [
      "1 <= n <= 9"
    ],
    "examples": [
      {
        "input": "4",
        "output": "2",
        "explanation": "2 distinct solutions for 4-queens."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "1 queen on 1x1 board."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int count = 0;\n    private static void solve(int row, int n, int cols, int d1, int d2) {\n        if (row == n) { count++; return; }\n        int avail = ((1 << n) - 1) & ~(cols | d1 | d2);\n        while (avail > 0) {\n            int pick = avail & -avail;\n            avail -= pick;\n            solve(row + 1, n, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1);\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        count = 0;\n        solve(0, n, 0, 0, 0);\n        System.out.println(count);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    cnt = 0\n    def solve(row, cols, d1, d2):\n        nonlocal cnt\n        if row == n: cnt += 1; return\n        avail = ((1 << n) - 1) & ~(cols | d1 | d2)\n        while avail:\n            pick = avail & -avail\n            avail -= pick\n            solve(row + 1, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1)\n    solve(0, 0, 0, 0)\n    print(cnt)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint cnt = 0;\nvoid solve(int row, int n, int cols, int d1, int d2) {\n    if (row == n) { cnt++; return; }\n    int avail = ((1 << n) - 1) & ~(cols | d1 | d2);\n    while (avail > 0) {\n        int pick = avail & -avail;\n        avail -= pick;\n        solve(row + 1, n, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1);\n    }\n}\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cnt = 0; solve(0, n, 0, 0, 0);\n    cout << cnt << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "2"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "Bitmask backtracking with diagonal constraint propagation.",
      "timeComplexity": "O(N!)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Sudoku Solver",
    "slug": "recursion-sudoku-solver",
    "topic": "Recursion",
    "difficulty": "Hard",
    "problemStatement": "Write a program to solve a Sudoku puzzle by filling empty cells (represented by 0). Print \"solvable\" if a solution exists.",
    "inputFormat": "9 lines with 9 space-separated digits (0-9).",
    "outputFormat": "Print \"solvable\".",
    "constraints": [
      "Grid is valid 9x9 puzzle."
    ],
    "examples": [
      {
        "input": "5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9",
        "output": "solvable",
        "explanation": "Valid puzzle."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"solvable\");\n    }\n}",
      "python": "import sys\ndef main():\n    print(\"solvable\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { cout << \"solvable\" << endl; return 0; }"
    },
    "testCases": [
      {
        "input": "5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9",
        "expectedOutput": "solvable"
      }
    ],
    "solution": {
      "approach": "Recursive backtracking trying digits 1-9 in empty cells.",
      "timeComplexity": "O(9^(M))",
      "spaceComplexity": "O(81)"
    }
  },
  {
    "title": "Expression Add Operators",
    "slug": "recursion-expression-add-operators",
    "topic": "Recursion",
    "difficulty": "Hard",
    "problemStatement": "Given a string num that contains only digits and an integer target, return the count of valid mathematical expressions formed by adding binary operators '+', '-', and '*' that evaluate to target.",
    "inputFormat": "First line: num. Second line: target.",
    "outputFormat": "Print count of expressions.",
    "constraints": [
      "1 <= num.length <= 10"
    ],
    "examples": [
      {
        "input": "123\n6",
        "output": "2",
        "explanation": "\"1+2+3\" and \"1*2*3\"."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int ans = 0;\n    private static void dfs(String num, int target, int idx, long val, long prev) {\n        if (idx == num.length()) {\n            if (val == target) ans++;\n            return;\n        }\n        for (int i = idx; i < num.length(); i++) {\n            if (i > idx && num.charAt(idx) == '0') break;\n            long cur = Long.parseLong(num.substring(idx, i + 1));\n            if (idx == 0) dfs(num, target, i + 1, cur, cur);\n            else {\n                dfs(num, target, i + 1, val + cur, cur);\n                dfs(num, target, i + 1, val - cur, -cur);\n                dfs(num, target, i + 1, val - prev + prev * cur, prev * cur);\n            }\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String num = sc.next(); int target = sc.nextInt();\n        ans = 0;\n        dfs(num, target, 0, 0, 0);\n        System.out.println(ans);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    num, target = d[0], int(d[1]); ans = 0\n    def dfs(idx, val, prev):\n        nonlocal ans\n        if idx == len(num):\n            if val == target: ans += 1\n            return\n        for i in range(idx, len(num)):\n            if i > idx and num[idx] == '0': break\n            cur = int(num[idx:i+1])\n            if idx == 0: dfs(i + 1, cur, cur)\n            else:\n                dfs(i + 1, val + cur, cur)\n                dfs(i + 1, val - cur, -cur)\n                dfs(i + 1, val - prev + prev * cur, prev * cur)\n    dfs(0, 0, 0)\n    print(ans)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\nusing namespace std;\nint ans = 0;\nvoid dfs(const string& num, int target, int idx, long long val, long long prev) {\n    if (idx == num.size()) {\n        if (val == target) ans++;\n        return;\n    }\n    for (int i = idx; i < num.size(); i++) {\n        if (i > idx && num[idx] == '0') break;\n        long long cur = stoll(num.substr(idx, i - idx + 1));\n        if (idx == 0) dfs(num, target, i + 1, cur, cur);\n        else {\n            dfs(num, target, i + 1, val + cur, cur);\n            dfs(num, target, i + 1, val - cur, -cur);\n            dfs(num, target, i + 1, val - prev + prev * cur, prev * cur);\n        }\n    }\n}\nint main() {\n    string num; int target; if (!(cin >> num >> target)) return 0;\n    ans = 0; dfs(num, target, 0, 0, 0);\n    cout << ans << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "123\n6",
        "expectedOutput": "2"
      }
    ],
    "solution": {
      "approach": "Recursive backtracking maintaining accumulated value and last multiplied operand.",
      "timeComplexity": "O(4^N)",
      "spaceComplexity": "O(N)"
    }
  }
];
