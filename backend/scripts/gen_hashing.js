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
    solution: { approach: app || 'Standard algorithmic approach.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(1)' }
  };
}

// ==========================================
// 1. HASHING (10)
// ==========================================
const hashing = [
  // 4 Easy
  p('Contains Duplicate', 'hashing-contains-duplicate', 'Hashing', 'Easy',
    'Given an integer array nums, return "true" if any value appears at least twice in the array, and return "false" if every element is distinct.',
    'First line: n. Second line: n space-separated integers.', 'Print "true" or "false".', ['1 <= n <= 10^5'],
    [{ input: '4\n1 2 3 1', output: 'true', explanation: '1 appears twice.' }, { input: '4\n1 2 3 4', output: 'false', explanation: 'All unique.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Set<Integer> set = new HashSet<>();\n        for (int i = 0; i < n; i++) {\n            if (!set.add(sc.nextInt())) { System.out.println("true"); return; }\n        }\n        System.out.println("false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    print("true" if len(set(a)) < n else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> s;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        if (s.count(x)) { cout << "true" << endl; return 0; }\n        s.insert(x);\n    }\n    cout << "false" << endl;\n    return 0;\n}`,
    [{ input: '4\n1 2 3 1', expectedOutput: 'true' }, { input: '4\n1 2 3 4', expectedOutput: 'false' }],
    'HashSet insertion check.', 'O(N)', 'O(N)'),

  p('Intersection of Two Arrays', 'hashing-intersection-of-two-arrays', 'Hashing', 'Easy',
    'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and returned in sorted order.',
    'First line: n and m. Second line: n integers. Third line: m integers.', 'Print sorted unique intersection elements.', ['1 <= n, m <= 1000'],
    [{ input: '4 5\n1 2 2 1\n2 2 3 2 4', output: '2', explanation: 'Intersection is 2.' }, { input: '3 5\n4 9 5\n9 4 9 8 4', output: '4 9', explanation: 'Sorted intersection.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        Set<Integer> s1 = new HashSet<>(), res = new TreeSet<>();\n        for (int i = 0; i < n; i++) s1.add(sc.nextInt());\n        for (int i = 0; i < m; i++) {\n            int x = sc.nextInt();\n            if (s1.contains(x)) res.add(x);\n        }\n        boolean first = true;\n        for (int x : res) {\n            System.out.print((first ? "" : " ") + x);\n            first = false;\n        }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1]); a = set(int(x) for x in d[2:2+n]); b = set(int(x) for x in d[2+n:2+n+m])\n    print(" ".join(str(x) for x in sorted(a & b)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <set>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    set<int> s1, res;\n    for (int i = 0; i < n; i++) { int x; cin >> x; s1.insert(x); }\n    for (int i = 0; i < m; i++) { int x; cin >> x; if (s1.count(x)) res.insert(x); }\n    bool first = true;\n    for (int x : res) { cout << (first ? "" : " ") << x; first = false; }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '4 5\n1 2 2 1\n2 2 3 2 4', expectedOutput: '2' }, { input: '3 5\n4 9 5\n9 4 9 8 4', expectedOutput: '4 9' }],
    'Set intersection.', 'O(N + M)', 'O(N)'),

  p('Find All Numbers Disappeared in an Array', 'hashing-find-all-disappeared-numbers', 'Hashing', 'Easy',
    'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums in ascending order.',
    'First line: n. Second line: n integers.', 'Print missing numbers separated by space.', ['1 <= n <= 10^5'],
    [{ input: '8\n4 3 2 7 8 2 3 1', output: '5 6', explanation: '5 and 6 do not appear.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        boolean[] seen = new boolean[n + 1];\n        for (int i = 0; i < n; i++) seen[sc.nextInt()] = true;\n        boolean first = true;\n        for (int i = 1; i <= n; i++) {\n            if (!seen[i]) {\n                System.out.print((first ? "" : " ") + i);\n                first = false;\n            }\n        }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = set(int(x) for x in d[1:n+1])\n    res = [str(i) for i in range(1, n + 1) if i not in a]\n    print(" ".join(res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<bool> seen(n + 1, false);\n    for (int i = 0; i < n; i++) { int x; cin >> x; seen[x] = true; }\n    bool first = true;\n    for (int i = 1; i <= n; i++) if (!seen[i]) { cout << (first ? "" : " ") << i; first = false; }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '8\n4 3 2 7 8 2 3 1', expectedOutput: '5 6' }, { input: '2\n1 1', expectedOutput: '2' }],
    'Boolean existence map.', 'O(N)', 'O(N)'),

  p('Unique Number of Occurrences', 'hashing-unique-number-of-occurrences', 'Hashing', 'Easy',
    'Given an array of integers arr, return "true" if the number of occurrences of each value in the array is unique, or "false" otherwise.',
    'First line: n. Second line: n integers.', 'Print "true" or "false".', ['1 <= arr.length <= 1000'],
    [{ input: '6\n1 2 2 1 1 3', output: 'true', explanation: '1 has 3, 2 has 2, 3 has 1 occurrence.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) map.put(sc.nextInt(), map.getOrDefault(sc.nextInt(), 0) + 1);\n        Set<Integer> set = new HashSet<>(map.values());\n        System.out.println(map.size() == set.size() ? "true" : "false");\n    }\n}`,
    `import sys\nfrom collections import Counter\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    c = Counter(a)\n    print("true" if len(c.values()) == len(set(c.values())) else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_map<int, int> count;\n    for (int i = 0; i < n; i++) { int x; cin >> x; count[x]++; }\n    unordered_set<int> occ;\n    for (auto& p : count) {\n        if (occ.count(p.second)) { cout << "false" << endl; return 0; }\n        occ.insert(p.second);\n    }\n    cout << "true" << endl;\n    return 0;\n}`,
    [{ input: '6\n1 2 2 1 1 3', expectedOutput: 'true' }, { input: '2\n1 2', expectedOutput: 'false' }],
    'Count frequencies and test set uniqueness of counts.', 'O(N)', 'O(N)'),

  // 3 Medium
  p('Longest Consecutive Sequence', 'hashing-longest-consecutive-sequence', 'Hashing', 'Medium',
    'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
    'First line: n. Second line: n integers.', 'Print length.', ['0 <= nums.length <= 10^5'],
    [{ input: '6\n100 4 200 1 3 2', output: '4', explanation: 'Sequence is [1, 2, 3, 4] with length 4.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Set<Integer> set = new HashSet<>();\n        for (int i = 0; i < n; i++) set.add(sc.nextInt());\n        int maxL = 0;\n        for (int x : set) {\n            if (!set.contains(x - 1)) {\n                int curr = x, len = 1;\n                while (set.contains(curr + 1)) { curr++; len++; }\n                maxL = Math.max(maxL, len);\n            }\n        }\n        System.out.println(maxL);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = set(int(x) for x in d[1:n+1])\n    m = 0\n    for x in a:\n        if x - 1 not in a:\n            c = x; l = 1\n            while c + 1 in a: c += 1; l += 1\n            m = max(m, l)\n    print(m)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<int> s; for (int i = 0; i < n; i++) { int x; cin >> x; s.insert(x); }\n    int maxL = 0;\n    for (int x : s) {\n        if (!s.count(x - 1)) {\n            int curr = x, len = 1;\n            while (s.count(curr + 1)) { curr++; len++; }\n            maxL = max(maxL, len);\n        }\n    }\n    cout << maxL << endl;\n    return 0;\n}`,
    [{ input: '6\n100 4 200 1 3 2', expectedOutput: '4' }, { input: '10\n0 3 7 2 5 8 4 6 0 1', expectedOutput: '9' }],
    'Start expanding consecutive runs only from sequence start values.', 'O(N)', 'O(N)'),

  p('Subarray Sum Equals K', 'hashing-subarray-sum-equals-k', 'Hashing', 'Medium',
    'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    'First line: n and k. Second line: n integers.', 'Print count.', ['1 <= nums.length <= 2 * 10^4'],
    [{ input: '3 2\n1 1 1', output: '2', explanation: 'Two subarrays [1, 1] sum to 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        map.put(0, 1);\n        int sum = 0, count = 0;\n        for (int i = 0; i < n; i++) {\n            sum += sc.nextInt();\n            count += map.getOrDefault(sum - k, 0);\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        System.out.println(count);\n    }\n}`,
    `import sys\nfrom collections import defaultdict\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    c = defaultdict(int); c[0] = 1; s = ans = 0\n    for x in a:\n        s += x; ans += c[s - k]; c[s] += 1\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    unordered_map<int, int> map; map[0] = 1;\n    int sum = 0, count = 0;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x; sum += x;\n        if (map.count(sum - k)) count += map[sum - k];\n        map[sum]++;\n    }\n    cout << count << endl;\n    return 0;\n}`,
    [{ input: '3 2\n1 1 1', expectedOutput: '2' }, { input: '3 3\n1 2 3', expectedOutput: '2' }],
    'Prefix sum hash map counting occurrences of sum - k.', 'O(N)', 'O(N)'),

  p('Top K Frequent Elements', 'hashing-top-k-frequent-elements', 'Hashing', 'Medium',
    'Given an integer array nums and an integer k, return the k most frequent elements in descending order of frequency.',
    'First line: n and k. Second line: n integers.', 'Print k elements separated by space.', ['1 <= k <= number of unique elements'],
    [{ input: '6 2\n1 1 1 2 2 3', output: '1 2', explanation: '1 has freq 3, 2 has freq 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        Map<Integer, Integer> count = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt(); count.put(x, count.getOrDefault(x, 0) + 1);\n        }\n        List<Integer> keys = new ArrayList<>(count.keySet());\n        keys.sort((a, b) -> Integer.compare(count.get(b), count.get(a)));\n        for (int i = 0; i < k; i++) System.out.print(keys.get(i) + (i == k - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\nfrom collections import Counter\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    c = Counter(a).most_common(k)\n    print(" ".join(str(x[0]) for x in c))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    unordered_map<int, int> count;\n    for (int i = 0; i < n; i++) { int x; cin >> x; count[x]++; }\n    vector<pair<int, int>> v;\n    for (auto& p : count) v.push_back({p.second, p.first});\n    sort(v.rbegin(), v.rend());\n    for (int i = 0; i < k; i++) cout << v[i].second << (i == k - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '6 2\n1 1 1 2 2 3', expectedOutput: '1 2' }, { input: '1 1\n1', expectedOutput: '1' }],
    'Hash map frequency count with bucket sort or max heap.', 'O(N log K)', 'O(N)'),

  // 3 Hard
  p('Insert Delete GetRandom O(1)', 'hashing-insert-delete-getrandom-o1', 'Hashing', 'Hard',
    'Implement a structure supporting insert, remove, and size queries in O(1) average time. Given q operations: 1 x (insert x, prints true/false if already present), 2 x (remove x, prints true/false), 3 (print current size).',
    'First line: q. Next q lines: operation.', 'Print results on new lines.', ['1 <= q <= 10^4'],
    [{ input: '4\n1 1\n2 2\n1 2\n3', output: 'true\nfalse\ntrue\n2', explanation: 'Insert 1 (true), remove 2 (false), insert 2 (true), size 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int q = sc.nextInt();\n        Set<Integer> set = new HashSet<>();\n        for (int i = 0; i < q; i++) {\n            int type = sc.nextInt();\n            if (type == 1) System.out.println(set.add(sc.nextInt()) ? "true" : "false");\n            else if (type == 2) System.out.println(set.remove(sc.nextInt()) ? "true" : "false");\n            else System.out.println(set.size());\n        }\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    q = int(d[0]); idx = 1; s = set()\n    for _ in range(q):\n        t = int(d[idx]); idx += 1\n        if t == 1:\n            x = int(d[idx]); idx += 1\n            if x in s: print("false")\n            else: s.add(x); print("true")\n        elif t == 2:\n            x = int(d[idx]); idx += 1\n            if x in s: s.remove(x); print("true")\n            else: print("false")\n        else: print(len(s))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int q; if (!(cin >> q)) return 0;\n    unordered_set<int> s;\n    while (q--) {\n        int t; cin >> t;\n        if (t == 1) { int x; cin >> x; if (s.count(x)) cout << "false" << endl; else { s.insert(x); cout << "true" << endl; } }\n        else if (t == 2) { int x; cin >> x; if (!s.count(x)) cout << "false" << endl; else { s.erase(x); cout << "true" << endl; } }\n        else cout << s.size() << endl;\n    }\n    return 0;\n}`,
    [{ input: '4\n1 1\n2 2\n1 2\n3', expectedOutput: 'true\nfalse\ntrue\n2' }],
    'HashMap + dynamic array with swap-with-last element removal.', 'O(1)', 'O(N)'),

  p('Max Points on a Line', 'hashing-max-points-on-a-line', 'Hashing', 'Hard',
    'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.',
    'First line: n. Next n lines: x and y.', 'Print max points.', ['1 <= points.length <= 300'],
    [{ input: '3\n1 1\n2 2\n3 3', output: '3', explanation: 'All 3 lie on y = x.' }],
    `import java.util.*;\npublic class Main {\n    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] pts = new int[n][2];\n        for (int i = 0; i < n; i++) { pts[i][0] = sc.nextInt(); pts[i][1] = sc.nextInt(); }\n        if (n <= 2) { System.out.println(n); return; }\n        int maxPts = 0;\n        for (int i = 0; i < n; i++) {\n            Map<String, Integer> map = new HashMap<>();\n            int curMax = 0;\n            for (int j = i + 1; j < n; j++) {\n                int dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1];\n                int g = gcd(dx, dy);\n                dx /= g; dy /= g;\n                if (dx < 0 || (dx == 0 && dy < 0)) { dx = -dx; dy = -dy; }\n                String slope = dy + "/" + dx;\n                map.put(slope, map.getOrDefault(slope, 0) + 1);\n                curMax = Math.max(curMax, map.get(slope));\n            }\n            maxPts = Math.max(maxPts, curMax + 1);\n        }\n        System.out.println(maxPts);\n    }\n}`,
    `import sys\nfrom math import gcd\nfrom collections import defaultdict\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); pts = []\n    for i in range(n): pts.append((int(d[1+2*i]), int(d[2+2*i])))\n    if n <= 2: print(n); return\n    ans = 0\n    for i in range(n):\n        c = defaultdict(int)\n        for j in range(i + 1, n):\n            dx = pts[j][0] - pts[i][0]; dy = pts[j][1] - pts[i][1]\n            g = gcd(dx, dy); dx //= g; dy //= g\n            if dx < 0 or (dx == 0 and dy < 0): dx, dy = -dx, -dy\n            c[(dx, dy)] += 1\n        ans = max(ans, max(c.values(), default=0) + 1)\n    print(ans)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\nint gcdVal(int a, int b) { return b == 0 ? a : gcdVal(b, a % b); }\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int, int>> p(n); for (int i = 0; i < n; i++) cin >> p[i].first >> p[i].second;\n    if (n <= 2) { cout << n << endl; return 0; }\n    int ans = 0;\n    for (int i = 0; i < n; i++) {\n        unordered_map<string, int> count; int cur = 0;\n        for (int j = i + 1; j < n; j++) {\n            int dx = p[j].first - p[i].first, dy = p[j].second - p[i].second;\n            int g = gcdVal(abs(dx), abs(dy));\n            if (g != 0) { dx /= g; dy /= g; }\n            if (dx < 0 || (dx == 0 && dy < 0)) { dx = -dx; dy = -dy; }\n            string key = to_string(dy) + "/" + to_string(dx);\n            cur = max(cur, ++count[key]);\n        }\n        ans = max(ans, cur + 1);\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    [{ input: '3\n1 1\n2 2\n3 3', expectedOutput: '3' }],
    'Reduce dx and dy by their GCD as slope map keys.', 'O(N^2)', 'O(N)'),

  p('Longest Substring with At Most Two Distinct Characters', 'hashing-longest-substring-two-distinct', 'Hashing', 'Hard',
    'Given a string s, return the length of the longest substring that contains at most two distinct characters.',
    'A single string s.', 'Print length.', ['1 <= s.length <= 10^5'],
    [{ input: 'eceba', output: '3', explanation: '"ece" has length 3.' }, { input: 'ccaabbb', output: '5', explanation: '"aabbb" has length 5.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        Map<Character, Integer> map = new HashMap<>();\n        int l = 0, maxLen = 0;\n        for (int r = 0; r < s.length(); r++) {\n            map.put(s.charAt(r), r);\n            if (map.size() > 2) {\n                int minIdx = Collections.min(map.values());\n                map.remove(s.charAt(minIdx));\n                l = minIdx + 1;\n            }\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}`,
    `import sys\ndef main():\n    s = sys.stdin.read().strip()\n    d = {}; l = max_len = 0\n    for r, c in enumerate(s):\n        d[c] = r\n        if len(d) > 2:\n            min_i = min(d.values())\n            del d[s[min_i]]\n            l = min_i + 1\n        max_len = max(max_len, r - l + 1)\n    print(max_len)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    unordered_map<char, int> map; int l = 0, maxLen = 0;\n    for (int r = 0; r < s.size(); r++) {\n        map[s[r]] = r;\n        if (map.size() > 2) {\n            int minIdx = s.size();\n            for (auto& p : map) minIdx = min(minIdx, p.second);\n            map.erase(s[minIdx]);\n            l = minIdx + 1;\n        }\n        maxLen = max(maxLen, r - l + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}`,
    [{ input: 'eceba', expectedOutput: '3' }, { input: 'ccaabbb', expectedOutput: '5' }],
    'Sliding window with character index hash map.', 'O(N)', 'O(1)')
];

saveTopic('hashing.js', hashing);
