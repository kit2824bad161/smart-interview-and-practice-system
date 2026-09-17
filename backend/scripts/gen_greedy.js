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
    solution: { approach: app || 'Standard greedy/DP approach.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(N)' }
  };
}

// ==========================================
// 1. GREEDY (10)
// ==========================================
const greedy = [
  // 4 Easy
  p('Assign Cookies', 'greedy-assign-cookies', 'Greedy', 'Easy',
    'Assume you are an awesome parent and want to give your children some cookies. Each child i has a greed factor g[i], and each cookie j has size s[j]. Maximize the number of your content children.',
    'First line: n and m. Second line: n children greeds. Third line: m cookie sizes.', 'Print number of content children.', ['1 <= n, m <= 3 * 10^4'],
    [{ input: '3 2\n1 2 3\n1 1', output: '1', explanation: 'Only 1 child can be content.' }, { input: '2 3\n1 2\n1 2 3', output: '2', explanation: 'Both children content.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] g = new int[n], s = new int[m];\n        for (int i = 0; i < n; i++) g[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) s[i] = sc.nextInt();\n        Arrays.sort(g); Arrays.sort(s);\n        int i = 0, j = 0;\n        while (i < n && j < m) {\n            if (s[j] >= g[i]) i++;\n            j++;\n        }\n        System.out.println(i);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1])\n    g = sorted([int(x) for x in d[2:2+n]])\n    s = sorted([int(x) for x in d[2+n:2+n+m]])\n    i = j = 0\n    while i < n and j < m:\n        if s[j] >= g[i]: i += 1\n        j += 1\n    print(i)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> g(n), s(m); for (int i = 0; i < n; i++) cin >> g[i]; for (int i = 0; i < m; i++) cin >> s[i];\n    sort(g.begin(), g.end()); sort(s.begin(), s.end());\n    int i = 0, j = 0;\n    while (i < n && j < m) { if (s[j] >= g[i]) i++; j++; }\n    cout << i << endl;\n    return 0;\n}`,
    [{ input: '3 2\n1 2 3\n1 1', expectedOutput: '1' }, { input: '2 3\n1 2\n1 2 3', expectedOutput: '2' }],
    'Sort both arrays and greedily satisfy smallest greed factors first.', 'O(N log N + M log M)', 'O(1)'),

  p('Lemonade Change', 'greedy-lemonade-change', 'Greedy', 'Easy',
    'At a lemonade stand, each lemonade costs $5. Customers pay with a $5, $10, or $20 bill. Return "true" if you can provide every customer with correct change, else "false".',
    'First line: n. Second line: n customer payments.', 'Print "true" or "false".', ['1 <= n <= 10^5'],
    [{ input: '5\n5 5 5 10 20', output: 'true', explanation: 'All customers served.' }, { input: '5\n5 5 10 10 20', output: 'false', explanation: 'Cannot provide change for $20.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int five = 0, ten = 0;\n        for (int i = 0; i < n; i++) {\n            int b = sc.nextInt();\n            if (b == 5) five++;\n            else if (b == 10) { if (five == 0) { System.out.println("false"); return; } five--; ten++; }\n            else {\n                if (ten > 0 && five > 0) { ten--; five--; }\n                else if (five >= 3) five -= 3;\n                else { System.out.println("false"); return; }\n            }\n        }\n        System.out.println("true");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); bills = [int(x) for x in d[1:n+1]]\n    five = ten = 0\n    for b in bills:\n        if b == 5: five += 1\n        elif b == 10:\n            if five == 0: print("false"); return\n            five -= 1; ten += 1\n        else:\n            if ten and five: ten -= 1; five -= 1\n            elif five >= 3: five -= 3\n            else: print("false"); return\n    print("true")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    int five = 0, ten = 0;\n    for (int i = 0; i < n; i++) {\n        int b; cin >> b;\n        if (b == 5) five++;\n        else if (b == 10) { if (!five) { cout << "false" << endl; return 0; } five--; ten++; }\n        else {\n            if (ten && five) { ten--; five--; }\n            else if (five >= 3) five -= 3;\n            else { cout << "false" << endl; return 0; }\n        }\n    }\n    cout << "true" << endl;\n    return 0;\n}`,
    [{ input: '5\n5 5 5 10 20', expectedOutput: 'true' }, { input: '5\n5 5 10 10 20', expectedOutput: 'false' }],
    'Greedily prefer giving $10+$5 change over three $5 bills for $20 payment.', 'O(N)', 'O(1)'),

  p('Maximum Units on a Truck', 'greedy-max-units-on-truck', 'Greedy', 'Easy',
    'You are assigned to put some amount of boxes onto one truck. You are given a 2D array boxTypes where boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i] and an integer truckSize. Return the maximum total units.',
    'First line: n and truckSize. Next n lines: boxes and units.', 'Print max units.', ['1 <= n <= 1000'],
    [{ input: '3 4\n1 3\n2 2\n3 1', output: '8', explanation: '1 box of 3 units + 2 boxes of 2 units + 1 box of 1 unit = 8.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), truckSize = sc.nextInt();\n        int[][] b = new int[n][2];\n        for (int i = 0; i < n; i++) { b[i][0] = sc.nextInt(); b[i][1] = sc.nextInt(); }\n        Arrays.sort(b, (x, y) -> Integer.compare(y[1], x[1]));\n        int total = 0;\n        for (int[] box : b) {\n            int take = Math.min(truckSize, box[0]);\n            total += take * box[1];\n            truckSize -= take;\n            if (truckSize == 0) break;\n        }\n        System.out.println(total);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, t_sz = int(d[0]), int(d[1])\n    boxes = []\n    for i in range(n): boxes.append((int(d[2+2*i]), int(d[3+2*i])))\n    boxes.sort(key=lambda x: x[1], reverse=True)\n    tot = 0\n    for cnt, u in boxes:\n        take = min(t_sz, cnt)\n        tot += take * u; t_sz -= take\n        if t_sz == 0: break\n    print(tot)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, tSize; if (!(cin >> n >> tSize)) return 0;\n    vector<pair<int, int>> b(n);\n    for (int i = 0; i < n; i++) cin >> b[i].second >> b[i].first;\n    sort(b.rbegin(), b.rend());\n    int tot = 0;\n    for (auto& p : b) {\n        int take = min(tSize, p.second);\n        tot += take * p.first; tSize -= take;\n        if (!tSize) break;\n    }\n    cout << tot << endl;\n    return 0;\n}`,
    [{ input: '3 4\n1 3\n2 2\n3 1', expectedOutput: '8' }],
    'Fractional knapsack greedy by highest units per box.', 'O(N log N)', 'O(1)'),

  p('Buy Maximum Stocks', 'greedy-buy-max-stocks', 'Greedy', 'Easy',
    'In a stock market, on day i (1-indexed), you can buy at most i stocks at price arr[i]. Given total budget k, calculate the maximum number of stocks you can buy.',
    'First line: n and k. Second line: n stock prices.', 'Print max stocks bought.', ['1 <= n <= 10^4'],
    [{ input: '3 45\n10 7 19', output: '4', explanation: 'Buy 1 on day 1 (10) and 2 on day 2 (14), total 24 <= 45. Stocks: 1+2+1=4.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(); long k = sc.nextLong();\n        int[][] a = new int[n][2];\n        for (int i = 0; i < n; i++) { a[i][0] = sc.nextInt(); a[i][1] = i + 1; }\n        Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));\n        long count = 0;\n        for (int[] s : a) {\n            long buy = Math.min(s[1], k / s[0]);\n            count += buy;\n            k -= buy * s[0];\n        }\n        System.out.println(count);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); p = [int(x) for x in d[2:2+n]]\n    items = sorted([(p[i], i + 1) for i in range(n)])\n    cnt = 0\n    for price, limit in items:\n        buy = min(limit, k // price)\n        cnt += buy; k -= buy * price\n    print(cnt)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; long long k; if (!(cin >> n >> k)) return 0;\n    vector<pair<int, int>> a(n);\n    for (int i = 0; i < n; i++) { cin >> a[i].first; a[i].second = i + 1; }\n    sort(a.begin(), a.end());\n    long long cnt = 0;\n    for (auto& s : a) {\n        long long buy = min((long long)s.second, k / s.first);\n        cnt += buy; k -= buy * s.first;\n    }\n    cout << cnt << endl;\n    return 0;\n}`,
    [{ input: '3 45\n10 7 19', expectedOutput: '4' }],
    'Greedily sort by lowest price first.', 'O(N log N)', 'O(1)'),

  // 3 Medium
  p('Jump Game', 'greedy-jump-game', 'Greedy', 'Medium',
    'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return "true" if you can reach the last index, or "false" otherwise.',
    'First line: n. Second line: n integers.', 'Print "true" or "false".', ['1 <= nums.length <= 10^4'],
    [{ input: '5\n2 3 1 1 4', output: 'true', explanation: 'Jump 1 to index 1, then 3 to the last index.' }, { input: '5\n3 2 1 0 4', output: 'false', explanation: 'Will always arrive at index 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int maxReach = 0;\n        for (int i = 0; i < n; i++) {\n            if (i > maxReach) { System.out.println("false"); return; }\n            maxReach = Math.max(maxReach, i + a[i]);\n        }\n        System.out.println("true");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    max_reach = 0\n    for i, x in enumerate(a):\n        if i > max_reach: print("false"); return\n        max_reach = max(max_reach, i + x)\n    print("true")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int maxReach = 0;\n    for (int i = 0; i < n; i++) {\n        if (i > maxReach) { cout << "false" << endl; return 0; }\n        maxReach = max(maxReach, i + a[i]);\n    }\n    cout << "true" << endl;\n    return 0;\n}`,
    [{ input: '5\n2 3 1 1 4', expectedOutput: 'true' }, { input: '5\n3 2 1 0 4', expectedOutput: 'false' }],
    'Greedy forward scan tracking farthest reachable index.', 'O(N)', 'O(1)'),

  p('Gas Station', 'greedy-gas-station', 'Greedy', 'Medium',
    'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel to station i + 1. Return the starting gas station\'s index if you can travel around once, or -1.',
    'First line: n. Second line: n gas amounts. Third line: n costs.', 'Print starting index or -1.', ['1 <= n <= 10^5'],
    [{ input: '5\n1 2 3 4 5\n3 4 5 1 2', output: '3', explanation: 'Start at index 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] gas = new int[n], cost = new int[n];\n        for (int i = 0; i < n; i++) gas[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) cost[i] = sc.nextInt();\n        int total = 0, tank = 0, start = 0;\n        for (int i = 0; i < n; i++) {\n            int diff = gas[i] - cost[i];\n            total += diff; tank += diff;\n            if (tank < 0) { start = i + 1; tank = 0; }\n        }\n        System.out.println(total >= 0 ? start : -1);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); g = [int(x) for x in d[1:n+1]]; c = [int(x) for x in d[n+1:2*n+1]]\n    if sum(g) < sum(c): print(-1); return\n    start = tank = 0\n    for i in range(n):\n        tank += g[i] - c[i]\n        if tank < 0: start = i + 1; tank = 0\n    print(start)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> g(n), c(n); for (int i = 0; i < n; i++) cin >> g[i]; for (int i = 0; i < n; i++) cin >> c[i];\n    int total = 0, tank = 0, start = 0;\n    for (int i = 0; i < n; i++) {\n        int d = g[i] - c[i];\n        total += d; tank += d;\n        if (tank < 0) { start = i + 1; tank = 0; }\n    }\n    cout << (total >= 0 ? start : -1) << endl;\n    return 0;\n}`,
    [{ input: '5\n1 2 3 4 5\n3 4 5 1 2', expectedOutput: '3' }],
    'Reset start index whenever prefix tank runs negative.', 'O(N)', 'O(1)'),

  p('Non-overlapping Intervals', 'greedy-non-overlapping-intervals', 'Greedy', 'Medium',
    'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    'First line: n. Next n lines: start and end.', 'Print count of intervals to remove.', ['1 <= n <= 10^5'],
    [{ input: '4\n1 2\n2 3\n3 4\n1 3', output: '1', explanation: '[1,3] removed.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] iv = new int[n][2];\n        for (int i = 0; i < n; i++) { iv[i][0] = sc.nextInt(); iv[i][1] = sc.nextInt(); }\n        Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 0, end = Integer.MIN_VALUE;\n        for (int[] x : iv) {\n            if (x[0] >= end) end = x[1];\n            else count++;\n        }\n        System.out.println(count);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); iv = []\n    for i in range(n): iv.append((int(d[1+2*i]), int(d[2+2*i])))\n    iv.sort(key=lambda x: x[1])\n    cnt = 0; end = -float('inf')\n    for s, e in iv:\n        if s >= end: end = e\n        else: cnt += 1\n    print(cnt)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int, int>> iv(n);\n    for (int i = 0; i < n; i++) cin >> iv[i].second >> iv[i].first;\n    sort(iv.begin(), iv.end());\n    int cnt = 0, end = INT_MIN;\n    for (auto& p : iv) {\n        if (p.second >= end) end = p.first;\n        else cnt++;\n    }\n    cout << cnt << endl;\n    return 0;\n}`,
    [{ input: '4\n1 2\n2 3\n3 4\n1 3', expectedOutput: '1' }],
    'Sort by end time (interval scheduling greedy strategy).', 'O(N log N)', 'O(1)'),

  // 3 Hard
  p('Candy', 'greedy-candy', 'Greedy', 'Hard',
    'There are n children standing in a line. Each child is assigned a rating value. Each child must have at least one candy, and children with higher rating get more candies than neighbors. Return minimum total candies.',
    'First line: n. Second line: n ratings.', 'Print minimum candies.', ['1 <= n <= 2 * 10^4'],
    [{ input: '3\n1 0 2', output: '5', explanation: 'Allocations: [2, 1, 2] sum = 5.' }, { input: '3\n1 2 2', output: '4', explanation: 'Allocations: [1, 2, 1] sum = 4.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] r = new int[n], c = new int[n];\n        for (int i = 0; i < n; i++) { r[i] = sc.nextInt(); c[i] = 1; }\n        for (int i = 1; i < n; i++) if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;\n        for (int i = n - 2; i >= 0; i--) if (r[i] > r[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);\n        int total = 0;\n        for (int x : c) total += x;\n        System.out.println(total);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); r = [int(x) for x in d[1:n+1]]\n    c = [1] * n\n    for i in range(1, n):\n        if r[i] > r[i-1]: c[i] = c[i-1] + 1\n    for i in range(n - 2, -1, -1):\n        if r[i] > r[i+1]: c[i] = max(c[i], c[i+1] + 1)\n    print(sum(c))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> r(n), c(n, 1); for (int i = 0; i < n; i++) cin >> r[i];\n    for (int i = 1; i < n; i++) if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;\n    for (int i = n - 2; i >= 0; i--) if (r[i] > r[i + 1]) c[i] = max(c[i], c[i + 1] + 1);\n    cout << accumulate(c.begin(), c.end(), 0) << endl;\n    return 0;\n}`,
    [{ input: '3\n1 0 2', expectedOutput: '5' }, { input: '3\n1 2 2', expectedOutput: '4' }],
    'Two passes (left-to-right then right-to-left) taking max satisfying both neighbors.', 'O(N)', 'O(N)'),

  p('Minimum Number of Refueling Stops', 'greedy-min-refueling-stops', 'Greedy', 'Hard',
    'A car starts with startFuel liters of fuel. Distance to target miles. Given stations where station[i] = [position, fuel]. Return minimum number of refueling stops to reach target, or -1.',
    'First line: target, startFuel, n. Next n lines: pos and fuel.', 'Print min stops or -1.', ['1 <= target, startFuel <= 10^9', '0 <= n <= 500'],
    [{ input: '1 1 0', output: '0', explanation: 'No stops needed.' }, { input: '100 10 4\n10 60\n20 30\n30 30\n60 40', output: '2', explanation: 'Stop at 10 and 60.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int target = sc.nextInt(), fuel = sc.nextInt(), n = sc.nextInt();\n        int[][] st = new int[n][2];\n        for (int i = 0; i < n; i++) { st[i][0] = sc.nextInt(); st[i][1] = sc.nextInt(); }\n        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());\n        int stops = 0, i = 0;\n        while (fuel < target) {\n            while (i < n && st[i][0] <= fuel) pq.offer(st[i++][1]);\n            if (pq.isEmpty()) { System.out.println(-1); return; }\n            fuel += pq.poll(); stops++;\n        }\n        System.out.println(stops);\n    }\n}`,
    `import sys, heapq\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    target, fuel, n = int(d[0]), int(d[1]), int(d[2])\n    st = []\n    for i in range(n): st.append((int(d[3+2*i]), int(d[4+2*i])))\n    pq = []; stops = i = 0\n    while fuel < target:\n        while i < n and st[i][0] <= fuel:\n            heapq.heappush(pq, -st[i][1]); i += 1\n        if not pq: print(-1); return\n        fuel += -heapq.heappop(pq); stops += 1\n    print(stops)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    int target, fuel, n; if (!(cin >> target >> fuel >> n)) return 0;\n    vector<pair<int, int>> st(n); for (int i = 0; i < n; i++) cin >> st[i].first >> st[i].second;\n    priority_queue<int> pq; int stops = 0, i = 0;\n    while (fuel < target) {\n        while (i < n && st[i].first <= fuel) pq.push(st[i++].second);\n        if (pq.empty()) { cout << -1 << endl; return 0; }\n        fuel += pq.top(); pq.pop(); stops++;\n    }\n    cout << stops << endl;\n    return 0;\n}`,
    [{ input: '1 1 0', expectedOutput: '0' }, { input: '100 10 4\n10 60\n20 30\n30 30\n60 40', expectedOutput: '2' }],
    'Max-heap of accessible stations, refueling greedily from station with most fuel.', 'O(N log N)', 'O(N)'),

  p('Course Schedule III', 'greedy-course-schedule-iii', 'Greedy', 'Hard',
    'There are n different online courses numbered from 1 to n. Each course i has duration and lastDay. Return the maximum number of courses that you can take.',
    'First line: n. Next n lines: duration and lastDay.', 'Print max courses.', ['1 <= n <= 10^4'],
    [{ input: '4\n100 200\n200 1300\n1000 1250\n2000 3200', output: '3', explanation: 'Take 3 courses.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] c = new int[n][2];\n        for (int i = 0; i < n; i++) { c[i][0] = sc.nextInt(); c[i][1] = sc.nextInt(); }\n        Arrays.sort(c, (a, b) -> Integer.compare(a[1], b[1]));\n        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());\n        int time = 0;\n        for (int[] x : c) {\n            time += x[0]; pq.offer(x[0]);\n            if (time > x[1]) time -= pq.poll();\n        }\n        System.out.println(pq.size());\n    }\n}`,
    `import sys, heapq\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); c = []\n    for i in range(n): c.append((int(d[1+2*i]), int(d[2+2*i])))\n    c.sort(key=lambda x: x[1])\n    pq = []; time = 0\n    for dur, last in c:\n        time += dur; heapq.heappush(pq, -dur)\n        if time > last: time += heapq.heappop(pq)\n    print(len(pq))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int, int>> c(n); for (int i = 0; i < n; i++) cin >> c[i].second >> c[i].first;\n    sort(c.begin(), c.end());\n    priority_queue<int> pq; int time = 0;\n    for (auto& p : c) {\n        time += p.second; pq.push(p.second);\n        if (time > p.first) { time -= pq.top(); pq.pop(); }\n    }\n    cout << pq.size() << endl;\n    return 0;\n}`,
    [{ input: '4\n100 200\n200 1300\n1000 1250\n2000 3200', expectedOutput: '3' }],
    'Sort by deadline and greedily drop longest course from max-heap if deadline exceeded.', 'O(N log N)', 'O(N)')
];

saveTopic('greedy.js', greedy);
