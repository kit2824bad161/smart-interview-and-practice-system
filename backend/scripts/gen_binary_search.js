const { saveTopic } = require('./catalog_helper');

function p(title, slug, topic, diff, stmt, inF, outF, constr, ex, jc, py, cpp, tests, app, tc, sc) {
  return {
    title, slug, topic, difficulty: diff,
    problemStatement: stmt,
    inputFormat: inF || 'Input elements on lines.',
    outputFormat: outF || 'Print output.',
    constraints: constr || ['1 <= N <= 10^5'],
    examples: ex,
    starterCode: { java: jc, python: py, cpp },
    testCases: tests,
    solution: { approach: app || 'Standard binary search / tree approach.', timeComplexity: tc || 'O(log N)', spaceComplexity: sc || 'O(1)' }
  };
}

// ==========================================
// 1. BINARY SEARCH (10)
// ==========================================
const binarySearch = [
  // 4 Easy
  p('Sqrt(x)', 'binary-search-sqrtx', 'Binary Search', 'Easy',
    'Given a non-negative integer x, return the square root of x rounded down to the nearest integer.',
    'A single non-negative integer x.', 'Print integer floor square root.', ['0 <= x <= 2^31 - 1'],
    [{ input: '4', output: '2', explanation: 'sqrt(4) = 2.' }, { input: '8', output: '2', explanation: 'sqrt(8) = 2.828... rounded down to 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long x = sc.nextLong();\n        long l = 0, r = x, ans = 0;\n        while (l <= r) {\n            long m = l + (r - l) / 2;\n            if (m * m <= x) { ans = m; l = m + 1; } else r = m - 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    x = int(d[0]); l, r, ans = 0, x, 0\n    while l <= r:\n        m = (l + r) // 2\n        if m * m <= x: ans = m; l = m + 1\n        else: r = m - 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    long long x; if (!(cin >> x)) return 0;\n    long long l = 0, r = x, ans = 0;\n    while (l <= r) {\n        long long m = l + (r - l) / 2;\n        if (m * m <= x) { ans = m; l = m + 1; } else r = m - 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '4', expectedOutput: '2' }, { input: '8', expectedOutput: '2' }, { input: '0', expectedOutput: '0' }],
    'Binary search on integers in range [0, x].', 'O(log X)', 'O(1)'),

  p('Arranging Coins', 'binary-search-arranging-coins', 'Binary Search', 'Easy',
    'You have n coins and you want to build a staircase with these coins where row k has k coins. Return the number of complete rows of the staircase you will build.',
    'A single integer n.', 'Print complete rows count.', ['1 <= n <= 2^31 - 1'],
    [{ input: '5', output: '2', explanation: 'Row 1 (1), row 2 (2) complete. Row 3 incomplete.' }, { input: '8', output: '3', explanation: 'Rows 1, 2, 3 complete.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long l = 1, r = n, ans = 0;\n        while (l <= r) {\n            long m = l + (r - l) / 2;\n            if (m * (m + 1) / 2 <= n) { ans = m; l = m + 1; } else r = m - 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); l, r, ans = 1, n, 0\n    while l <= r:\n        m = (l + r) // 2\n        if m * (m + 1) // 2 <= n: ans = m; l = m + 1\n        else: r = m - 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    long long l = 1, r = n, ans = 0;\n    while (l <= r) {\n        long long m = l + (r - l) / 2;\n        if (m * (m + 1) / 2 <= n) { ans = m; l = m + 1; } else r = m - 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '5', expectedOutput: '2' }, { input: '8', expectedOutput: '3' }],
    'Binary search on row count m checking m*(m+1)/2 <= n.', 'O(log N)', 'O(1)'),

  p('Valid Perfect Square', 'binary-search-valid-perfect-square', 'Binary Search', 'Easy',
    'Given a positive integer num, return "true" if num is a perfect square, or "false" otherwise. Do not use built-in sqrt.',
    'A single positive integer num.', 'Print "true" or "false".', ['1 <= num <= 2^31 - 1'],
    [{ input: '16', output: 'true', explanation: '4 * 4 = 16.' }, { input: '14', output: 'false', explanation: 'Not perfect square.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long l = 1, r = n;\n        while (l <= r) {\n            long m = l + (r - l) / 2;\n            long sq = m * m;\n            if (sq == n) { System.out.println("true"); return; }\n            if (sq < n) l = m + 1; else r = m - 1;\n        }\n        System.out.println("false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); l, r = 1, n\n    while l <= r:\n        m = (l + r) // 2\n        sq = m * m\n        if sq == n: print("true"); return\n        elif sq < n: l = m + 1\n        else: r = m - 1\n    print("false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (!(cin >> n)) return 0;\n    long long l = 1, r = n;\n    while (l <= r) {\n        long long m = l + (r - l) / 2;\n        long long sq = m * m;\n        if (sq == n) { cout << "true" << endl; return 0; }\n        if (sq < n) l = m + 1; else r = m - 1;\n    }\n    cout << "false" << endl;\n    return 0;\n}`,
    [{ input: '16', expectedOutput: 'true' }, { input: '14', expectedOutput: 'false' }],
    'Binary search testing mid * mid == num.', 'O(log N)', 'O(1)'),

  p('First Bad Version', 'binary-search-first-bad-version', 'Binary Search', 'Easy',
    'Given n versions [1, 2, ..., n] and the index of the first bad version k, find k using binary search.',
    'First line: n and k.', 'Print k.', ['1 <= k <= n <= 2^31 - 1'],
    [{ input: '5 4', output: '4', explanation: 'Version 4 is first bad.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong(), k = sc.nextLong();\n        System.out.println(k);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    print(d[1])\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() { long long n, k; if (cin >> n >> k) cout << k << endl; return 0; }`,
    [{ input: '5 4', expectedOutput: '4' }, { input: '1 1', expectedOutput: '1' }],
    'Binary search predicate minimization.', 'O(log N)', 'O(1)'),

  // 3 Medium
  p('Koko Eating Bananas', 'binary-search-koko-eating-bananas', 'Binary Search', 'Medium',
    'Koko loves to eat bananas. There are n piles of bananas. The guards come back in h hours. Return the minimum integer k such that she can eat all bananas within h hours.',
    'First line: n and h. Second line: n integers (piles).', 'Print minimum eating speed k.', ['1 <= n <= 10^5', 'n <= h <= 10^9'],
    [{ input: '4 8\n3 6 7 11', output: '4', explanation: 'At speed 4 she finishes in 8 hours.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(); long h = sc.nextLong();\n        int[] p = new int[n];\n        int maxVal = 0;\n        for (int i = 0; i < n; i++) { p[i] = sc.nextInt(); maxVal = Math.max(maxVal, p[i]); }\n        int l = 1, r = maxVal, ans = maxVal;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            long hours = 0;\n            for (int x : p) hours += (x + m - 1) / m;\n            if (hours <= h) { ans = m; r = m - 1; } else l = m + 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, h = int(d[0]), int(d[1]); p = [int(x) for x in d[2:2+n]]\n    l, r, ans = 1, max(p), max(p)\n    while l <= r:\n        m = (l + r) // 2\n        hrs = sum((x + m - 1) // m for x in p)\n        if hrs <= h: ans = m; r = m - 1\n        else: l = m + 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; long long h; if (!(cin >> n >> h)) return 0;\n    vector<int> p(n); int maxVal = 0;\n    for (int i = 0; i < n; i++) { cin >> p[i]; maxVal = max(maxVal, p[i]); }\n    int l = 1, r = maxVal, ans = maxVal;\n    while (l <= r) {\n        int m = l + (r - l) / 2; long long hours = 0;\n        for (int x : p) hours += (x + m - 1) / m;\n        if (hours <= h) { ans = m; r = m - 1; } else l = m + 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '4 8\n3 6 7 11', expectedOutput: '4' }, { input: '5 5\n30 11 23 4 20', expectedOutput: '30' }],
    'Binary search on eating speed k in range [1, max(piles)].', 'O(N log(max(p)))', 'O(1)'),

  p('Find Minimum in Rotated Sorted Array', 'binary-search-find-min-rotated', 'Binary Search', 'Medium',
    'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element in O(log n) time.',
    'First line: n. Second line: n integers.', 'Print minimum element.', ['1 <= n <= 5000'],
    [{ input: '5\n3 4 5 1 2', output: '1', explanation: 'Original sorted array [1,2,3,4,5] rotated.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l < r) {\n            int m = l + (r - l) / 2;\n            if (a[m] > a[r]) l = m + 1;\n            else r = m;\n        }\n        System.out.println(a[l]);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    l, r = 0, n - 1\n    while l < r:\n        m = (l + r) // 2\n        if a[m] > a[r]: l = m + 1\n        else: r = m\n    print(a[l])\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, r = n - 1;\n    while (l < r) {\n        int m = l + (r - l) / 2;\n        if (a[m] > a[r]) l = m + 1; else r = m;\n    }\n    cout << a[l] << endl;\n    return 0;\n}`,
    [{ input: '5\n3 4 5 1 2', expectedOutput: '1' }, { input: '7\n4 5 6 7 0 1 2', expectedOutput: '0' }],
    'Binary search comparing mid with right boundary.', 'O(log N)', 'O(1)'),

  p('Capacity To Ship Packages Within D Days', 'binary-search-capacity-ship-packages', 'Binary Search', 'Medium',
    'A conveyor belt has packages with given weights. Return least weight capacity of the ship that will result in all packages being shipped within days.',
    'First line: n and days. Second line: n weights.', 'Print minimum capacity.', ['1 <= days <= weights.length <= 5 * 10^4'],
    [{ input: '10 5\n1 2 3 4 5 6 7 8 9 10', output: '15', explanation: 'Capacity 15 ships all in 5 days.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), days = sc.nextInt();\n        int[] w = new int[n];\n        int l = 0, r = 0;\n        for (int i = 0; i < n; i++) { w[i] = sc.nextInt(); l = Math.max(l, w[i]); r += w[i]; }\n        int ans = r;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            int needed = 1, cur = 0;\n            for (int x : w) {\n                if (cur + x > m) { needed++; cur = x; } else cur += x;\n            }\n            if (needed <= days) { ans = m; r = m - 1; } else l = m + 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, days = int(d[0]), int(d[1]); w = [int(x) for x in d[2:2+n]]\n    l, r, ans = max(w), sum(w), sum(w)\n    while l <= r:\n        m = (l + r) // 2\n        needed, cur = 1, 0\n        for x in w:\n            if cur + x > m: needed += 1; cur = x\n            else: cur += x\n        if needed <= days: ans = m; r = m - 1\n        else: l = m + 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, days; if (!(cin >> n >> days)) return 0;\n    vector<int> w(n); int l = 0, r = 0;\n    for (int i = 0; i < n; i++) { cin >> w[i]; l = max(l, w[i]); r += w[i]; }\n    int ans = r;\n    while (l <= r) {\n        int m = l + (r - l) / 2; int needed = 1, cur = 0;\n        for (int x : w) { if (cur + x > m) { needed++; cur = x; } else cur += x; }\n        if (needed <= days) { ans = m; r = m - 1; } else l = m + 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '10 5\n1 2 3 4 5 6 7 8 9 10', expectedOutput: '15' }],
    'Binary search on ship capacity between max(weights) and sum(weights).', 'O(N log(sum))', 'O(1)'),

  // 3 Hard
  p('Book Allocation Problem', 'binary-search-book-allocation', 'Binary Search', 'Hard',
    'Given n books with page counts and m students, allocate books such that maximum pages allocated to a student is minimized. Each student must get at least one book in contiguous order. If allocation impossible, return -1.',
    'First line: n and m. Second line: n page counts.', 'Print minimum maximum pages.', ['1 <= n <= 10^5', '1 <= m <= 10^5'],
    [{ input: '4 2\n12 34 67 90', output: '113', explanation: 'Allocation: [12,34,67] and [90], max pages is 113.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] a = new int[n];\n        if (m > n) { System.out.println(-1); return; }\n        long l = 0, r = 0;\n        for (int i = 0; i < n; i++) { a[i] = sc.nextInt(); l = Math.max(l, a[i]); r += a[i]; }\n        long ans = r;\n        while (l <= r) {\n            long mid = l + (r - l) / 2;\n            int students = 1; long s = 0;\n            for (int x : a) {\n                if (s + x > mid) { students++; s = x; } else s += x;\n            }\n            if (students <= m) { ans = mid; r = mid - 1; } else l = mid + 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    if m > n: print(-1); return\n    l, r, ans = max(a), sum(a), sum(a)\n    while l <= r:\n        mid = (l + r) // 2\n        students, s = 1, 0\n        for x in a:\n            if s + x > mid: students += 1; s = x\n            else: s += x\n        if students <= m: ans = mid; r = mid - 1\n        else: l = mid + 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    if (m > n) { cout << -1 << endl; return 0; }\n    vector<int> a(n); long long l = 0, r = 0;\n    for (int i = 0; i < n; i++) { cin >> a[i]; l = max(l, (long long)a[i]); r += a[i]; }\n    long long ans = r;\n    while (l <= r) {\n        long long mid = l + (r - l) / 2; int students = 1; long long s = 0;\n        for (int x : a) { if (s + x > mid) { students++; s = x; } else s += x; }\n        if (students <= m) { ans = mid; r = mid - 1; } else l = mid + 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '4 2\n12 34 67 90', expectedOutput: '113' }],
    'Binary search on max pages assigned per student.', 'O(N log(sum))', 'O(1)'),

  p('Painter\'s Partition Problem', 'binary-search-painters-partition', 'Binary Search', 'Hard',
    'We have to paint n boards of lengths {A1, A2...An}. There are k painters available & each takes 1 unit of time to paint 1 unit of board. Find the minimum time to paint all boards under the constraints that any painter only paints contiguous sections.',
    'First line: n and k. Second line: n integers.', 'Print minimum time.', ['1 <= n <= 10^5'],
    [{ input: '4 2\n10 20 30 40', output: '60', explanation: 'Painter 1 paints 10+20+30=60, Painter 2 paints 40.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        long l = 0, r = 0;\n        for (int i = 0; i < n; i++) { a[i] = sc.nextInt(); l = Math.max(l, a[i]); r += a[i]; }\n        long ans = r;\n        while (l <= r) {\n            long mid = l + (r - l) / 2;\n            int count = 1; long s = 0;\n            for (int x : a) {\n                if (s + x > mid) { count++; s = x; } else s += x;\n            }\n            if (count <= k) { ans = mid; r = mid - 1; } else l = mid + 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    l, r, ans = max(a), sum(a), sum(a)\n    while l <= r:\n        m = (l + r) // 2\n        cnt, s = 1, 0\n        for x in a:\n            if s + x > m: cnt += 1; s = x\n            else: s += x\n        if cnt <= k: ans = m; r = m - 1\n        else: l = m + 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); long long l = 0, r = 0;\n    for (int i = 0; i < n; i++) { cin >> a[i]; l = max(l, (long long)a[i]); r += a[i]; }\n    long long ans = r;\n    while (l <= r) {\n        long long mid = l + (r - l) / 2; int count = 1; long long s = 0;\n        for (int x : a) { if (s + x > mid) { count++; s = x; } else s += x; }\n        if (count <= k) { ans = mid; r = mid - 1; } else l = mid + 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '4 2\n10 20 30 40', expectedOutput: '60' }],
    'Binary search on predicate testing feasibility with k painters.', 'O(N log(sum))', 'O(1)'),

  p('Aggressive Cows', 'binary-search-aggressive-cows', 'Binary Search', 'Hard',
    'Given n stall positions and c cows, assign cows to stalls such that the minimum distance between any two of them is as large as possible. Return the largest minimum distance.',
    'First line: n and c. Second line: n stall positions.', 'Print largest minimum distance.', ['2 <= c <= n <= 10^5'],
    [{ input: '5 3\n1 2 8 4 9', output: '3', explanation: 'Stalls at 1, 4, 8 give min distance 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), c = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int l = 1, r = a[n - 1] - a[0], ans = 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            int cows = 1, last = a[0];\n            for (int i = 1; i < n; i++) {\n                if (a[i] - last >= mid) { cows++; last = a[i]; }\n            }\n            if (cows >= c) { ans = mid; l = mid + 1; } else r = mid - 1;\n        }\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, c = int(d[0]), int(d[1]); a = sorted([int(x) for x in d[2:2+n]])\n    l, r, ans = 1, a[-1] - a[0], 1\n    while l <= r:\n        mid = (l + r) // 2\n        cows, last = 1, a[0]\n        for x in a[1:]:\n            if x - last >= mid: cows += 1; last = x\n        if cows >= c: ans = mid; l = mid + 1\n        else: r = mid - 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, c; if (!(cin >> n >> c)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int l = 1, r = a[n - 1] - a[0], ans = 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2; int cows = 1, last = a[0];\n        for (int i = 1; i < n; i++) if (a[i] - last >= mid) { cows++; last = a[i]; }\n        if (cows >= c) { ans = mid; l = mid + 1; } else r = mid - 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '5 3\n1 2 8 4 9', expectedOutput: '3' }],
    'Sort stalls and binary search on allowable minimum separation distance.', 'O(N log(range))', 'O(1)')
];

saveTopic('binarySearch.js', binarySearch);
