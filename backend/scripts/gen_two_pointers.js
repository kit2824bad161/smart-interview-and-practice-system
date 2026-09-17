const { saveTopic } = require('./catalog_helper');

// Helper to make problems cleanly
function prob(title, slug, topic, diff, stmt, inF, outF, constr, ex, jc, py, cpp, tests, app, tc, sc) {
  return {
    title, slug, topic, difficulty: diff,
    problemStatement: stmt,
    inputFormat: inF || 'First line contains integer n, followed by input elements.',
    outputFormat: outF || 'Print the result.',
    constraints: constr || ['1 <= n <= 10^5'],
    examples: ex,
    starterCode: { java: jc, python: py, cpp },
    testCases: tests,
    solution: { approach: app || 'Optimal technique.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(1)' }
  };
}

// 1. TWO POINTERS (10)
const twoPointers = [
  // 4 Easy
  prob('Two Sum II - Input Array Is Sorted', 'two-pointers-two-sum-ii', 'Two Pointers', 'Easy',
    'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return 1-based indices.',
    'First line: n. Second line: n sorted integers. Third line: target.', 'Print two 1-based indices separated by space.', ['2 <= n <= 3 * 10^4'],
    [{ input: '4\n2 7 11 15\n9', output: '1 2', explanation: '2 + 7 = 9 at index 1 and 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l < r) {\n            int s = a[l] + a[r];\n            if (s == t) { System.out.println((l + 1) + " " + (r + 1)); return; }\n            if (s < t) l++; else r--;\n        }\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]; t = int(d[n+1])\n    l, r = 0, n - 1\n    while l < r:\n        s = a[l] + a[r]\n        if s == t: print(f"{l+1} {r+1}"); return\n        elif s < t: l += 1\n        else: r -= 1\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    int l = 0, r = n - 1;\n    while (l < r) {\n        int s = a[l] + a[r];\n        if (s == t) { cout << l + 1 << " " << r + 1 << endl; return 0; }\n        if (s < t) l++; else r--;\n    }\n    return 0;\n}`,
    [{ input: '4\n2 7 11 15\n9', expectedOutput: '1 2' }, { input: '3\n2 3 4\n6', expectedOutput: '1 3' }],
    'Two pointers converging from ends.', 'O(N)', 'O(1)'),

  prob('Squares of a Sorted Array', 'two-pointers-squares-of-sorted-array', 'Two Pointers', 'Easy',
    'Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.',
    'First line: n. Second line: n sorted integers.', 'Print sorted squared values.', ['1 <= n <= 10^4'],
    [{ input: '5\n-4 -1 0 3 10', output: '0 1 9 16 100', explanation: 'Squared and sorted.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int[] res = new int[n];\n        int l = 0, r = n - 1, k = n - 1;\n        while (l <= r) {\n            if (Math.abs(a[l]) > Math.abs(a[r])) { res[k--] = a[l] * a[l]; l++; }\n            else { res[k--] = a[r] * a[r]; r--; }\n        }\n        for (int i = 0; i < n; i++) System.out.print(res[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    print(" ".join(str(x) for x in sorted(x * x for x in a)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n), res(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, r = n - 1, k = n - 1;\n    while (l <= r) {\n        if (abs(a[l]) > abs(a[r])) { res[k--] = a[l] * a[l]; l++; }\n        else { res[k--] = a[r] * a[r]; r--; }\n    }\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5\n-4 -1 0 3 10', expectedOutput: '0 1 9 16 100' }],
    'Two pointers comparing absolute values from outer ends.', 'O(N)', 'O(N)'),

  prob('Is Subsequence', 'two-pointers-is-subsequence', 'Two Pointers', 'Easy',
    'Given two strings s and t, return "true" if s is a subsequence of t, or "false" otherwise.',
    'First line: string s. Second line: string t.', 'Print "true" or "false".', ['0 <= s.length <= 100'],
    [{ input: 'abc\nahbgdc', output: 'true', explanation: 'All characters of s exist in t in order.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        String t = sc.hasNext() ? sc.next() : "";\n        int i = 0, j = 0;\n        while (i < s.length() && j < t.length()) {\n            if (s.charAt(i) == t.charAt(j)) i++;\n            j++;\n        }\n        System.out.println(i == s.length() ? "true" : "false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    s = d[0] if len(d) > 0 else ""; t = d[1] if len(d) > 1 else ""\n    i = j = 0\n    while i < len(s) and j < len(t):\n        if s[i] == t[j]: i += 1\n        j += 1\n    print("true" if i == len(s) else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, t; if (!(cin >> s >> t)) { cout << "true" << endl; return 0; }\n    int i = 0, j = 0;\n    while (i < s.size() && j < t.size()) { if (s[i] == t[j]) i++; j++; }\n    cout << (i == s.size() ? "true" : "false") << endl;\n    return 0;\n}`,
    [{ input: 'abc\nahbgdc', expectedOutput: 'true' }, { input: 'axc\nahbgdc', expectedOutput: 'false' }],
    'Two pointers greedy match.', 'O(N)', 'O(1)'),

  prob('Reverse Vowels of a String', 'two-pointers-reverse-vowels', 'Two Pointers', 'Easy',
    'Given a string s, reverse only all the vowels in the string and return it.',
    'A single string s.', 'Print string with reversed vowels.', ['1 <= s.length <= 10^5'],
    [{ input: 'hello', output: 'holle', explanation: 'e and o are reversed.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        char[] ch = s.toCharArray();\n        String v = "aeiouAEIOU";\n        int l = 0, r = ch.length - 1;\n        while (l < r) {\n            while (l < r && v.indexOf(ch[l]) == -1) l++;\n            while (l < r && v.indexOf(ch[r]) == -1) r--;\n            char tmp = ch[l]; ch[l++] = ch[r]; ch[r--] = tmp;\n        }\n        System.out.println(new String(ch));\n    }\n}`,
    `import sys\ndef main():\n    s = list(sys.stdin.read().strip())\n    v = set("aeiouAEIOU")\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and s[l] not in v: l += 1\n        while l < r and s[r] not in v: r -= 1\n        s[l], s[r] = s[r], s[l]; l += 1; r -= 1\n    print("".join(s))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    string v = "aeiouAEIOU";\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && v.find(s[l]) == string::npos) l++;\n        while (l < r && v.find(s[r]) == string::npos) r--;\n        swap(s[l++], s[r--]);\n    }\n    cout << s << endl;\n    return 0;\n}`,
    [{ input: 'hello', expectedOutput: 'holle' }, { input: 'leetcode', expectedOutput: 'leotcede' }],
    'Two pointers scanning inwards for vowels.', 'O(N)', 'O(1)'),

  // 3 Medium
  prob('Container With Most Water', 'two-pointers-container-with-most-water', 'Two Pointers', 'Medium',
    'Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water.',
    'First line: n. Second line: n space-separated heights.', 'Print maximum area.', ['2 <= n <= 10^5'],
    [{ input: '9\n1 8 6 2 5 4 8 3 7', output: '49', explanation: 'Max area is between height 8 and 7, width 7 -> 49.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        int l = 0, r = n - 1, maxArea = 0;\n        while (l < r) {\n            maxArea = Math.max(maxArea, Math.min(h[l], h[r]) * (r - l));\n            if (h[l] < h[r]) l++; else r--;\n        }\n        System.out.println(maxArea);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); h = [int(x) for x in d[1:n+1]]\n    l, r, max_a = 0, n - 1, 0\n    while l < r:\n        max_a = max(max_a, min(h[l], h[r]) * (r - l))\n        if h[l] < h[r]: l += 1\n        else: r -= 1\n    print(max_a)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n); for (int i = 0; i < n; i++) cin >> h[i];\n    int l = 0, r = n - 1, maxA = 0;\n    while (l < r) {\n        maxA = max(maxA, min(h[l], h[r]) * (r - l));\n        if (h[l] < h[r]) l++; else r--;\n    }\n    cout << maxA << endl;\n    return 0;\n}`,
    [{ input: '9\n1 8 6 2 5 4 8 3 7', expectedOutput: '49' }, { input: '2\n1 1', expectedOutput: '1' }],
    'Two pointers advancing shorter wall.', 'O(N)', 'O(1)'),

  prob('3Sum', 'two-pointers-3sum', 'Two Pointers', 'Medium',
    'Given an integer array nums, return the number of unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    'First line: n. Second line: n space-separated integers.', 'Print count of unique triplets.', ['3 <= n <= 3000'],
    [{ input: '6\n-1 0 1 2 -1 -4', output: '2', explanation: 'Triplets: [-1,-1,2] and [-1,0,1].' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int count = 0;\n        for (int i = 0; i < n - 2; i++) {\n            if (i > 0 && a[i] == a[i - 1]) continue;\n            int l = i + 1, r = n - 1;\n            while (l < r) {\n                int s = a[i] + a[l] + a[r];\n                if (s == 0) {\n                    count++;\n                    while (l < r && a[l] == a[l + 1]) l++;\n                    while (l < r && a[r] == a[r - 1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++; else r--;\n            }\n        }\n        System.out.println(count);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = sorted([int(x) for x in d[1:n+1]])\n    c = 0\n    for i in range(n - 2):\n        if i > 0 and a[i] == a[i - 1]: continue\n        l, r = i + 1, n - 1\n        while l < r:\n            s = a[i] + a[l] + a[r]\n            if s == 0:\n                c += 1\n                while l < r and a[l] == a[l + 1]: l += 1\n                while l < r and a[r] == a[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    print(c)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int count = 0;\n    for (int i = 0; i < n - 2; i++) {\n        if (i > 0 && a[i] == a[i - 1]) continue;\n        int l = i + 1, r = n - 1;\n        while (l < r) {\n            int s = a[i] + a[l] + a[r];\n            if (s == 0) {\n                count++;\n                while (l < r && a[l] == a[l + 1]) l++;\n                while (l < r && a[r] == a[r - 1]) r--;\n                l++; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    }\n    cout << count << endl;\n    return 0;\n}`,
    [{ input: '6\n-1 0 1 2 -1 -4', expectedOutput: '2' }, { input: '3\n0 1 1', expectedOutput: '0' }],
    'Sort array and run two-pointer search for each element.', 'O(N^2)', 'O(1)'),

  prob('Sort Array By Parity II', 'two-pointers-sort-by-parity-ii', 'Two Pointers', 'Medium',
    'Given an array nums of half even and half odd integers, sort the array so that whenever nums[i] is odd, i is odd, and whenever nums[i] is even, i is even.',
    'First line: n. Second line: n space-separated integers.', 'Print arranged elements separated by spaces.', ['2 <= n <= 20000'],
    [{ input: '4\n4 2 5 7', output: '4 5 2 7', explanation: 'Even indices have even numbers, odd have odd.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int j = 1;\n        for (int i = 0; i < n; i += 2) {\n            if (a[i] % 2 == 1) {\n                while (a[j] % 2 == 1) j += 2;\n                int t = a[i]; a[i] = a[j]; a[j] = t;\n            }\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    evens = [x for x in a if x % 2 == 0]\n    odds = [x for x in a if x % 2 == 1]\n    res = []\n    for e, o in zip(evens, odds): res.extend([e, o])\n    print(" ".join(str(x) for x in res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int j = 1;\n    for (int i = 0; i < n; i += 2) {\n        if (a[i] % 2 != 0) {\n            while (a[j] % 2 != 0) j += 2;\n            swap(a[i], a[j]);\n        }\n    }\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '4\n4 2 5 7', expectedOutput: '4 5 2 7' }],
    'Two pointers iterating through even and odd indices.', 'O(N)', 'O(1)'),

  // 3 Hard
  prob('Trapping Rain Water', 'two-pointers-trapping-rain-water', 'Two Pointers', 'Hard',
    'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    'First line: n. Second line: n space-separated integers.', 'Print total trapped rain water.', ['1 <= n <= 2 * 10^4'],
    [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: '6 units of water are trapped.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] h = new int[n];\n        for (int i = 0; i < n; i++) h[i] = sc.nextInt();\n        int l = 0, r = n - 1, lMax = 0, rMax = 0, total = 0;\n        while (l < r) {\n            if (h[l] <= h[r]) {\n                if (h[l] >= lMax) lMax = h[l]; else total += lMax - h[l];\n                l++;\n            } else {\n                if (h[r] >= rMax) rMax = h[r]; else total += rMax - h[r];\n                r--;\n            }\n        }\n        System.out.println(total);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); h = [int(x) for x in d[1:n+1]]\n    l, r = 0, n - 1; l_max = r_max = tot = 0\n    while l < r:\n        if h[l] <= h[r]:\n            if h[l] >= l_max: l_max = h[l]\n            else: tot += l_max - h[l]\n            l += 1\n        else:\n            if h[r] >= r_max: r_max = h[r]\n            else: tot += r_max - h[r]\n            r -= 1\n    print(tot)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> h(n); for (int i = 0; i < n; i++) cin >> h[i];\n    int l = 0, r = n - 1, lMax = 0, rMax = 0, total = 0;\n    while (l < r) {\n        if (h[l] <= h[r]) {\n            if (h[l] >= lMax) lMax = h[l]; else total += lMax - h[l];\n            l++;\n        } else {\n            if (h[r] >= rMax) rMax = h[r]; else total += rMax - h[r];\n            r--;\n        }\n    }\n    cout << total << endl;\n    return 0;\n}`,
    [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6' }, { input: '6\n4 2 0 3 2 5', expectedOutput: '9' }],
    'Two pointers tracking leftMax and rightMax boundaries.', 'O(N)', 'O(1)'),

  prob('4Sum', 'two-pointers-4sum', 'Two Pointers', 'Hard',
    'Given an array nums of n integers and target, return count of unique quadruplets summing to target.',
    'First line: n and target. Second line: n space-separated integers.', 'Print count of unique quadruplets.', ['4 <= n <= 200'],
    [{ input: '6 0\n1 0 -1 0 -2 2', output: '3', explanation: 'Three unique quadruplets.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), target = sc.nextInt();\n        long[] a = new long[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextLong();\n        Arrays.sort(a);\n        int count = 0;\n        for (int i = 0; i < n - 3; i++) {\n            if (i > 0 && a[i] == a[i - 1]) continue;\n            for (int j = i + 1; j < n - 2; j++) {\n                if (j > i + 1 && a[j] == a[j - 1]) continue;\n                int l = j + 1, r = n - 1;\n                while (l < r) {\n                    long s = a[i] + a[j] + a[l] + a[r];\n                    if (s == target) {\n                        count++;\n                        while (l < r && a[l] == a[l + 1]) l++;\n                        while (l < r && a[r] == a[r - 1]) r--;\n                        l++; r--;\n                    } else if (s < target) l++; else r--;\n                }\n            }\n        }\n        System.out.println(count);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, target = int(d[0]), int(d[1]); a = sorted([int(x) for x in d[2:2+n]])\n    c = 0\n    for i in range(n - 3):\n        if i > 0 and a[i] == a[i-1]: continue\n        for j in range(i + 1, n - 2):\n            if j > i + 1 and a[j] == a[j-1]: continue\n            l, r = j + 1, n - 1\n            while l < r:\n                s = a[i] + a[j] + a[l] + a[r]\n                if s == target:\n                    c += 1\n                    while l < r and a[l] == a[l+1]: l += 1\n                    while l < r and a[r] == a[r-1]: r -= 1\n                    l += 1; r -= 1\n                elif s < target: l += 1\n                else: r -= 1\n    print(c)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; long long target; if (!(cin >> n >> target)) return 0;\n    vector<long long> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int count = 0;\n    for (int i = 0; i < n - 3; i++) {\n        if (i > 0 && a[i] == a[i - 1]) continue;\n        for (int j = i + 1; j < n - 2; j++) {\n            if (j > i + 1 && a[j] == a[j - 1]) continue;\n            int l = j + 1, r = n - 1;\n            while (l < r) {\n                long long s = a[i] + a[j] + a[l] + a[r];\n                if (s == target) {\n                    count++;\n                    while (l < r && a[l] == a[l + 1]) l++;\n                    while (l < r && a[r] == a[r - 1]) r--;\n                    l++; r--;\n                } else if (s < target) l++; else r--;\n            }\n        }\n    }\n    cout << count << endl;\n    return 0;\n}`,
    [{ input: '6 0\n1 0 -1 0 -2 2', expectedOutput: '3' }],
    'Two nested loops with inner two-pointer search.', 'O(N^3)', 'O(1)'),

  prob('Subarrays with K Different Integers', 'two-pointers-subarrays-with-k-different-integers', 'Two Pointers', 'Hard',
    'Given an integer array nums and an integer k, return the number of good subarrays. A good array is an array where the number of different integers in that array is exactly k.',
    'First line: n and k. Second line: n space-separated integers.', 'Print number of good subarrays.', ['1 <= nums.length <= 2 * 10^4'],
    [{ input: '5 2\n1 2 1 2 3', output: '7', explanation: '7 subarrays have exactly 2 distinct integers.' }],
    `import java.util.*;\npublic class Main {\n    private static int atMostK(int[] a, int k) {\n        Map<Integer, Integer> count = new HashMap<>();\n        int l = 0, res = 0;\n        for (int r = 0; r < a.length; r++) {\n            if (count.getOrDefault(a[r], 0) == 0) k--;\n            count.put(a[r], count.getOrDefault(a[r], 0) + 1);\n            while (k < 0) {\n                count.put(a[l], count.get(a[l]) - 1);\n                if (count.get(a[l]) == 0) k++;\n                l++;\n            }\n            res += r - l + 1;\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        System.out.println(atMostK(a, k) - atMostK(a, k - 1));\n    }\n}`,
    `import sys\nfrom collections import defaultdict\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    def atMost(k_):\n        count = defaultdict(int); l = res = 0\n        for r in range(n):\n            if count[a[r]] == 0: k_ -= 1\n            count[a[r]] += 1\n            while k_ < 0:\n                count[a[l]] -= 1\n                if count[a[l]] == 0: k_ += 1\n                l += 1\n            res += r - l + 1\n        return res\n    print(atMost(k) - atMost(k - 1))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint atMost(const vector<int>& a, int k) {\n    unordered_map<int, int> count;\n    int l = 0, res = 0;\n    for (int r = 0; r < a.size(); r++) {\n        if (count[a[r]]++ == 0) k--;\n        while (k < 0) {\n            if (--count[a[l]] == 0) k++;\n            l++;\n        }\n        res += r - l + 1;\n    }\n    return res;\n}\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    cout << atMost(a, k) - atMost(a, k - 1) << endl;\n    return 0;\n}`,
    [{ input: '5 2\n1 2 1 2 3', expectedOutput: '7' }],
    'Exact(K) = atMost(K) - atMost(K-1) using sliding two-pointers.', 'O(N)', 'O(K)')
];

saveTopic('twoPointers.js', twoPointers);
