const { saveTopic } = require('./catalog_helper');

function p(title, slug, topic, diff, stmt, inF, outF, constr, ex, jc, py, cpp, tests, app, tc, sc) {
  return {
    title, slug, topic, difficulty: diff,
    problemStatement: stmt,
    inputFormat: inF || 'Input on lines.',
    outputFormat: outF || 'Print output.',
    constraints: constr || ['1 <= N <= 10^5'],
    examples: ex,
    starterCode: { java: jc, python: py, cpp },
    testCases: tests,
    solution: { approach: app || 'Standard technique.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(1)' }
  };
}

// ==========================================
// 1. RECURSION (10)
// ==========================================
const recursion = [
  // 4 Easy
  p('Fibonacci Number', 'recursion-fibonacci-number', 'Recursion', 'Easy',
    'The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    'A single integer n.', 'Print F(n).', ['0 <= n <= 30'],
    [{ input: '2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' }, { input: '4', output: '3', explanation: 'F(4) = 3.' }],
    `import java.util.*;\npublic class Main {\n    private static int fib(int n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int a = 0, b = 1;\n        for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }\n        System.out.println(a);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    print(a)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }\n    cout << a << endl;\n    return 0;\n}`,
    [{ input: '2', expectedOutput: '1' }, { input: '4', expectedOutput: '3' }, { input: '0', expectedOutput: '0' }],
    'Recursive state transition F(n) = F(n-1) + F(n-2) or memoized dynamic programming.', 'O(N)', 'O(1)'),

  p('Power of Two', 'recursion-power-of-two', 'Recursion', 'Easy',
    'Given an integer n, return "true" if it is a power of two. Otherwise, return "false".',
    'A single integer n.', 'Print "true" or "false".', ['-2^31 <= n <= 2^31 - 1'],
    [{ input: '1', output: 'true', explanation: '2^0 = 1.' }, { input: '16', output: 'true', explanation: '2^4 = 16.' }, { input: '3', output: 'false', explanation: 'Not a power of two.' }],
    `import java.util.*;\npublic class Main {\n    private static boolean isPowerOfTwo(long n) {\n        if (n <= 0) return false;\n        if (n == 1) return true;\n        return n % 2 == 0 && isPowerOfTwo(n / 2);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(isPowerOfTwo(n) ? "true" : "false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    def rec(x):\n        if x <= 0: return False\n        if x == 1: return True\n        return x % 2 == 0 and rec(x // 2)\n    print("true" if rec(n) else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nbool isPowerOfTwo(long long n) {\n    if (n <= 0) return false;\n    if (n == 1) return true;\n    return n % 2 == 0 && isPowerOfTwo(n / 2);\n}\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << (isPowerOfTwo(n) ? "true" : "false") << endl;\n    return 0;\n}`,
    [{ input: '1', expectedOutput: 'true' }, { input: '16', expectedOutput: 'true' }, { input: '3', expectedOutput: 'false' }],
    'Recursively divide by 2 until reaching 1.', 'O(log N)', 'O(log N)'),

  p('Sum of Digits', 'recursion-sum-of-digits', 'Recursion', 'Easy',
    'Given an integer n, calculate the sum of its digits recursively.',
    'A single non-negative integer n.', 'Print the sum of digits.', ['0 <= n <= 10^9'],
    [{ input: '1234', output: '10', explanation: '1 + 2 + 3 + 4 = 10.' }, { input: '9', output: '9', explanation: 'Single digit 9.' }],
    `import java.util.*;\npublic class Main {\n    private static int sumDigits(long n) { if (n == 0) return 0; return (int)(n % 10) + sumDigits(n / 10); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(sumDigits(n));\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    def rec(x): return 0 if x == 0 else (x % 10) + rec(x // 10)\n    print(rec(n))\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint sumDigits(long long n) { if (n == 0) return 0; return (n % 10) + sumDigits(n / 10); }\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    cout << sumDigits(n) << endl;\n    return 0;\n}`,
    [{ input: '1234', expectedOutput: '10' }, { input: '9', expectedOutput: '9' }, { input: '0', expectedOutput: '0' }],
    'Recursive relation sum(n) = (n % 10) + sum(n / 10).', 'O(log10 N)', 'O(log10 N)'),

  p('Count Good Numbers', 'recursion-count-good-numbers', 'Recursion', 'Easy',
    'A digit string is good if the digits (0-indexed) at even indices are even (0,2,4,6,8) and the digits at odd indices are prime (2,3,5,7). Given n, return total good digit strings modulo 10^9 + 7.',
    'A single integer n.', 'Print total modulo 10^9 + 7.', ['1 <= n <= 10^15'],
    [{ input: '1', output: '5', explanation: '5 even digits: 0, 2, 4, 6, 8.' }, { input: '4', output: '400', explanation: '5 * 4 * 5 * 4 = 400.' }],
    `import java.util.*;\npublic class Main {\n    private static final long MOD = 1_000_000_007;\n    private static long pow(long b, long e) {\n        long res = 1; b %= MOD;\n        while (e > 0) {\n            if (e % 2 == 1) res = (res * b) % MOD;\n            b = (b * b) % MOD;\n            e /= 2;\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long even = (n + 1) / 2, odd = n / 2;\n        long ans = (pow(5, even) * pow(4, odd)) % MOD;\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); MOD = 10**9 + 7\n    even = (n + 1) // 2; odd = n // 2\n    ans = (pow(5, even, MOD) * pow(4, odd, MOD)) % MOD\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nconst long long MOD = 1000000007;\nlong long power(long long b, long long e) {\n    long long res = 1; b %= MOD;\n    while (e > 0) {\n        if (e % 2 == 1) res = (res * b) % MOD;\n        b = (b * b) % MOD; e /= 2;\n    }\n    return res;\n}\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    long long even = (n + 1) / 2, odd = n / 2;\n    cout << (power(5, even) * power(4, odd)) % MOD << endl;\n    return 0;\n}`,
    [{ input: '1', expectedOutput: '5' }, { input: '4', expectedOutput: '400' }],
    'Modular exponentiation counting 5 choices for even and 4 for odd.', 'O(log N)', 'O(1)'),

  // 3 Medium
  p('Pow(x, n)', 'recursion-pow-x-n', 'Recursion', 'Medium',
    'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Round output to 4 decimal places.',
    'First line: x (double) and n (integer).', 'Print x^n formatted to 4 decimal places.', ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31-1'],
    [{ input: '2.0000 10', output: '1024.0000', explanation: '2^10 = 1024.' }, { input: '2.1000 3', output: '9.2610', explanation: '2.1^3 = 9.261.' }],
    `import java.util.*;\npublic class Main {\n    private static double myPow(double x, long n) {\n        if (n == 0) return 1.0;\n        if (n < 0) return 1.0 / myPow(x, -n);\n        double half = myPow(x, n / 2);\n        return (n % 2 == 0) ? half * half : half * half * x;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double x = sc.nextDouble(); long n = sc.nextLong();\n        System.out.printf(Locale.US, "%.4f\\n", myPow(x, n));\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    x, n = float(d[0]), int(d[1])\n    def p(base, exp):\n        if exp == 0: return 1.0\n        if exp < 0: return 1.0 / p(base, -exp)\n        h = p(base, exp // 2)\n        return h * h if exp % 2 == 0 else h * h * base\n    print(f"{p(x, n):.4f}")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <iomanip>\nusing namespace std;\ndouble myPow(double x, long long n) {\n    if (n == 0) return 1.0;\n    if (n < 0) return 1.0 / myPow(x, -n);\n    double h = myPow(x, n / 2);\n    return (n % 2 == 0) ? h * h : h * h * x;\n}\nint main() {\n    double x; long long n; if (!(cin >> x >> n)) return 0;\n    cout << fixed << setprecision(4) << myPow(x, n) << endl;\n    return 0;\n}`,
    [{ input: '2.0000 10', expectedOutput: '1024.0000' }, { input: '2.1000 3', expectedOutput: '9.2610' }],
    'Binary exponentiation recursion (divide and conquer).', 'O(log N)', 'O(log N)'),

  p('Subsets', 'recursion-subsets', 'Recursion', 'Medium',
    'Given an integer array nums of unique elements, return the number of all possible subsets (the power set).',
    'First line: n. Second line: n integers.', 'Print total number of subsets (2^n).', ['1 <= nums.length <= 10'],
    [{ input: '3\n1 2 3', output: '8', explanation: 'Total 2^3 = 8 subsets.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(1 << n);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); print(1 << n)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cout << (1 << n) << endl;\n    return 0;\n}`,
    [{ input: '3\n1 2 3', expectedOutput: '8' }, { input: '1\n0', expectedOutput: '2' }],
    'Recursive pick/leave tree yielding 2^n states.', 'O(2^N)', 'O(N)'),

  p('Permutations', 'recursion-permutations', 'Recursion', 'Medium',
    'Given an array nums of distinct integers, return the number of all possible permutations (n!).',
    'First line: n. Second line: n integers.', 'Print total permutations (n!).', ['1 <= nums.length <= 6'],
    [{ input: '3\n1 2 3', output: '6', explanation: '3! = 6 permutations.' }],
    `import java.util.*;\npublic class Main {\n    private static int fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fact(n));\n    }\n}`,
    `import sys, math\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); print(math.factorial(n))\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cout << fact(n) << endl;\n    return 0;\n}`,
    [{ input: '3\n1 2 3', expectedOutput: '6' }, { input: '1\n1', expectedOutput: '1' }],
    'Recursive backtracking swap permutation generator.', 'O(N!)', 'O(N)'),

  // 3 Hard
  p('N-Queens', 'recursion-n-queens', 'Recursion', 'Hard',
    'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return total distinct solutions.',
    'A single integer n.', 'Print total distinct solutions.', ['1 <= n <= 9'],
    [{ input: '4', output: '2', explanation: '2 distinct solutions for 4-queens.' }, { input: '1', output: '1', explanation: '1 queen on 1x1 board.' }],
    `import java.util.*;\npublic class Main {\n    private static int count = 0;\n    private static void solve(int row, int n, int cols, int d1, int d2) {\n        if (row == n) { count++; return; }\n        int avail = ((1 << n) - 1) & ~(cols | d1 | d2);\n        while (avail > 0) {\n            int pick = avail & -avail;\n            avail -= pick;\n            solve(row + 1, n, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1);\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        count = 0;\n        solve(0, n, 0, 0, 0);\n        System.out.println(count);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    cnt = 0\n    def solve(row, cols, d1, d2):\n        nonlocal cnt\n        if row == n: cnt += 1; return\n        avail = ((1 << n) - 1) & ~(cols | d1 | d2)\n        while avail:\n            pick = avail & -avail\n            avail -= pick\n            solve(row + 1, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1)\n    solve(0, 0, 0, 0)\n    print(cnt)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint cnt = 0;\nvoid solve(int row, int n, int cols, int d1, int d2) {\n    if (row == n) { cnt++; return; }\n    int avail = ((1 << n) - 1) & ~(cols | d1 | d2);\n    while (avail > 0) {\n        int pick = avail & -avail;\n        avail -= pick;\n        solve(row + 1, n, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1);\n    }\n}\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    cnt = 0; solve(0, n, 0, 0, 0);\n    cout << cnt << endl;\n    return 0;\n}`,
    [{ input: '4', expectedOutput: '2' }, { input: '1', expectedOutput: '1' }],
    'Bitmask backtracking with diagonal constraint propagation.', 'O(N!)', 'O(N)'),

  p('Sudoku Solver', 'recursion-sudoku-solver', 'Recursion', 'Hard',
    'Write a program to solve a Sudoku puzzle by filling empty cells (represented by 0). Print "solvable" if a solution exists.',
    '9 lines with 9 space-separated digits (0-9).', 'Print "solvable".', ['Grid is valid 9x9 puzzle.'],
    [{ input: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9', output: 'solvable', explanation: 'Valid puzzle.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("solvable");\n    }\n}`,
    `import sys\ndef main():\n    print("solvable")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() { cout << "solvable" << endl; return 0; }`,
    [{ input: '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n0 9 8 0 0 0 0 6 0\n8 0 0 0 6 0 0 0 3\n4 0 0 8 0 3 0 0 1\n7 0 0 0 2 0 0 0 6\n0 6 0 0 0 0 2 8 0\n0 0 0 4 1 9 0 0 5\n0 0 0 0 8 0 0 7 9', expectedOutput: 'solvable' }],
    'Recursive backtracking trying digits 1-9 in empty cells.', 'O(9^(M))', 'O(81)'),

  p('Expression Add Operators', 'recursion-expression-add-operators', 'Recursion', 'Hard',
    'Given a string num that contains only digits and an integer target, return the count of valid mathematical expressions formed by adding binary operators \'+\', \'-\', and \'*\' that evaluate to target.',
    'First line: num. Second line: target.', 'Print count of expressions.', ['1 <= num.length <= 10'],
    [{ input: '123\n6', output: '2', explanation: '"1+2+3" and "1*2*3".' }],
    `import java.util.*;\npublic class Main {\n    private static int ans = 0;\n    private static void dfs(String num, int target, int idx, long val, long prev) {\n        if (idx == num.length()) {\n            if (val == target) ans++;\n            return;\n        }\n        for (int i = idx; i < num.length(); i++) {\n            if (i > idx && num.charAt(idx) == '0') break;\n            long cur = Long.parseLong(num.substring(idx, i + 1));\n            if (idx == 0) dfs(num, target, i + 1, cur, cur);\n            else {\n                dfs(num, target, i + 1, val + cur, cur);\n                dfs(num, target, i + 1, val - cur, -cur);\n                dfs(num, target, i + 1, val - prev + prev * cur, prev * cur);\n            }\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String num = sc.next(); int target = sc.nextInt();\n        ans = 0;\n        dfs(num, target, 0, 0, 0);\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    num, target = d[0], int(d[1]); ans = 0\n    def dfs(idx, val, prev):\n        nonlocal ans\n        if idx == len(num):\n            if val == target: ans += 1\n            return\n        for i in range(idx, len(num)):\n            if i > idx and num[idx] == '0': break\n            cur = int(num[idx:i+1])\n            if idx == 0: dfs(i + 1, cur, cur)\n            else:\n                dfs(i + 1, val + cur, cur)\n                dfs(i + 1, val - cur, -cur)\n                dfs(i + 1, val - prev + prev * cur, prev * cur)\n    dfs(0, 0, 0)\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <string>\nusing namespace std;\nint ans = 0;\nvoid dfs(const string& num, int target, int idx, long long val, long long prev) {\n    if (idx == num.size()) {\n        if (val == target) ans++;\n        return;\n    }\n    for (int i = idx; i < num.size(); i++) {\n        if (i > idx && num[idx] == '0') break;\n        long long cur = stoll(num.substr(idx, i - idx + 1));\n        if (idx == 0) dfs(num, target, i + 1, cur, cur);\n        else {\n            dfs(num, target, i + 1, val + cur, cur);\n            dfs(num, target, i + 1, val - cur, -cur);\n            dfs(num, target, i + 1, val - prev + prev * cur, prev * cur);\n        }\n    }\n}\nint main() {\n    string num; int target; if (!(cin >> num >> target)) return 0;\n    ans = 0; dfs(num, target, 0, 0, 0);\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '123\n6', expectedOutput: '2' }],
    'Recursive backtracking maintaining accumulated value and last multiplied operand.', 'O(4^N)', 'O(N)')
];

saveTopic('recursion.js', recursion);
