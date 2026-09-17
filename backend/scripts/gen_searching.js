const { saveTopic } = require('./catalog_helper');

// ==========================================
// 1. SEARCHING
// ==========================================
const searching = [
  // Easy 1
  {
    title: 'Linear Search',
    slug: 'searching-linear-search',
    topic: 'Searching',
    difficulty: 'Easy',
    problemStatement: 'Given an array of integers nums and an integer target, find the 0-based index of the first occurrence of target. If target is not present, return -1.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated integers.\nThird line contains integer target.',
    outputFormat: 'Print the index or -1.',
    constraints: ['1 <= n <= 10^5', '-10^9 <= nums[i], target <= 10^9'],
    examples: [{ input: '5\n10 20 30 40 50\n30', output: '2', explanation: '30 is at index 2.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            if (a[i] == t) { System.out.println(i); return; }\n        }\n        System.out.println(-1);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    nums = [int(x) for x in d[1:n+1]]\n    t = int(d[n+1])\n    for i, x in enumerate(nums):\n        if x == t: print(i); return\n    print(-1)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    for (int i = 0; i < n; i++) if (a[i] == t) { cout << i << endl; return 0; }\n    cout << -1 << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '5\n10 20 30 40 50\n30', expectedOutput: '2' },
      { input: '3\n1 2 3\n5', expectedOutput: '-1' },
      { input: '1\n7\n7', expectedOutput: '0' }
    ],
    solution: { approach: 'Single pass scanning every element.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Easy 2
  {
    title: 'Binary Search',
    slug: 'searching-binary-search',
    topic: 'Searching',
    difficulty: 'Easy',
    problemStatement: 'Given an array of integers nums sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its 0-based index. Otherwise, return -1.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated sorted integers.\nThird line contains integer target.',
    outputFormat: 'Print the index or -1.',
    constraints: ['1 <= nums.length <= 10^5', 'nums is sorted in ascending order.'],
    examples: [{ input: '6\n-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists at index 4.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (a[mid] == t) { System.out.println(mid); return; }\n            if (a[mid] < t) l = mid + 1;\n            else r = mid - 1;\n        }\n        System.out.println(-1);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    t = int(d[n+1])\n    l, r = 0, n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if a[mid] == t: print(mid); return\n        elif a[mid] < t: l = mid + 1\n        else: r = mid - 1\n    print(-1)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (a[mid] == t) { cout << mid << endl; return 0; }\n        if (a[mid] < t) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << -1 << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4' },
      { input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1' }
    ],
    solution: { approach: 'Divide and conquer binary search.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' }
  },
  // Easy 3
  {
    title: 'Search Insert Position',
    slug: 'searching-search-insert-position',
    topic: 'Searching',
    difficulty: 'Easy',
    problemStatement: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated sorted integers.\nThird line contains integer target.',
    outputFormat: 'Print the index.',
    constraints: ['1 <= nums.length <= 10^4', 'nums contains distinct values sorted in ascending order.'],
    examples: [
      { input: '4\n1 3 5 6\n5', output: '2', explanation: '5 is at index 2.' },
      { input: '4\n1 3 5 6\n2', output: '1', explanation: '2 would be inserted at index 1.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (a[mid] == t) { System.out.println(mid); return; }\n            if (a[mid] < t) l = mid + 1;\n            else r = mid - 1;\n        }\n        System.out.println(l);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    t = int(d[n+1])\n    l, r = 0, n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if a[mid] == t: print(mid); return\n        elif a[mid] < t: l = mid + 1\n        else: r = mid - 1\n    print(l)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (a[mid] == t) { cout << mid << endl; return 0; }\n        if (a[mid] < t) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << l << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '4\n1 3 5 6\n5', expectedOutput: '2' },
      { input: '4\n1 3 5 6\n2', expectedOutput: '1' },
      { input: '4\n1 3 5 6\n7', expectedOutput: '4' }
    ],
    solution: { approach: 'Lower bound binary search returning left insertion index.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' }
  },
  // Easy 4
  {
    title: 'Find Target in 2D Matrix',
    slug: 'searching-target-in-2d-matrix',
    topic: 'Searching',
    difficulty: 'Easy',
    problemStatement: 'You are given an m x n integer matrix where each row is sorted and the first integer of each row is greater than the last of the previous row. Return "true" if target exists, else "false".',
    inputFormat: 'First line contains m and n.\nNext m lines contain n space-separated integers.\nLast line contains target.',
    outputFormat: 'Print "true" or "false".',
    constraints: ['1 <= m, n <= 100'],
    examples: [{ input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', output: 'true', explanation: '3 is present.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[] a = new int[m * n];\n        for (int i = 0; i < m * n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        int l = 0, r = m * n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (a[mid] == t) { System.out.println("true"); return; }\n            if (a[mid] < t) l = mid + 1;\n            else r = mid - 1;\n        }\n        System.out.println("false");\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n = int(d[0]), int(d[1])\n    vals = [int(x) for x in d[2:2+m*n]]\n    t = int(d[2+m*n])\n    l, r = 0, m * n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if vals[mid] == t: print("true"); return\n        elif vals[mid] < t: l = mid + 1\n        else: r = mid - 1\n    print("false")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<int> a(m * n);\n    for (int i = 0; i < m * n; i++) cin >> a[i];\n    int t; cin >> t;\n    int l = 0, r = m * n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (a[mid] == t) { cout << "true" << endl; return 0; }\n        if (a[mid] < t) l = mid + 1;\n        else r = mid - 1;\n    }\n    cout << "false" << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', expectedOutput: 'true' },
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', expectedOutput: 'false' }
    ],
    solution: { approach: 'Flatten 2D matrix conceptually into 1D sorted array and binary search.', timeComplexity: 'O(log(M * N))', spaceComplexity: 'O(1)' }
  },
  // Medium 1
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'searching-search-in-rotated-sorted-array',
    topic: 'Searching',
    difficulty: 'Medium',
    problemStatement: 'Given the array nums after possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated integers.\nThird line contains integer target.',
    outputFormat: 'Print index or -1.',
    constraints: ['1 <= nums.length <= 5000', 'all values in nums are unique.'],
    examples: [{ input: '7\n4 5 6 7 0 1 2\n0', output: '4', explanation: '0 is at index 4.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (a[mid] == t) { System.out.println(mid); return; }\n            if (a[l] <= a[mid]) {\n                if (a[l] <= t && t < a[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (a[mid] < t && t <= a[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        System.out.println(-1);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    t = int(d[n+1])\n    l, r = 0, n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if a[mid] == t: print(mid); return\n        if a[l] <= a[mid]:\n            if a[l] <= t < a[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if a[mid] < t <= a[r]: l = mid + 1\n            else: r = mid - 1\n    print(-1)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (a[mid] == t) { cout << mid << endl; return 0; }\n        if (a[l] <= a[mid]) {\n            if (a[l] <= t && t < a[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (a[mid] < t && t <= a[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    cout << -1 << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '7\n4 5 6 7 0 1 2\n0', expectedOutput: '4' },
      { input: '7\n4 5 6 7 0 1 2\n3', expectedOutput: '-1' }
    ],
    solution: { approach: 'Modified binary search determining which half is sorted.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' }
  },
  // Medium 2
  {
    title: 'Find First and Last Position of Element',
    slug: 'searching-first-last-position',
    topic: 'Searching',
    difficulty: 'Medium',
    problemStatement: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return "-1 -1".',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated integers.\nThird line contains integer target.',
    outputFormat: 'Print two space-separated integers.',
    constraints: ['0 <= nums.length <= 10^5'],
    examples: [{ input: '6\n5 7 7 8 8 10\n8', output: '3 4', explanation: '8 starts at 3 and ends at 4.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    private static int findBound(int[] a, int t, boolean first) {\n        int l = 0, r = a.length - 1, ans = -1;\n        while (l <= r) {\n            int m = l + (r - l) / 2;\n            if (a[m] == t) {\n                ans = m;\n                if (first) r = m - 1;\n                else l = m + 1;\n            } else if (a[m] < t) l = m + 1;\n            else r = m - 1;\n        }\n        return ans;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int t = sc.nextInt();\n        System.out.println(findBound(a, t, true) + " " + findBound(a, t, false));\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    t = int(d[n+1])\n    def search(first):\n        l, r, ans = 0, n - 1, -1\n        while l <= r:\n            m = (l + r) // 2\n            if a[m] == t:\n                ans = m\n                if first: r = m - 1\n                else: l = m + 1\n            elif a[m] < t: l = m + 1\n            else: r = m - 1\n        return ans\n    print(f"{search(True)} {search(False)}")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint searchBound(const vector<int>& a, int t, bool first) {\n    int l = 0, r = (int)a.size() - 1, ans = -1;\n    while (l <= r) {\n        int m = l + (r - l) / 2;\n        if (a[m] == t) {\n            ans = m;\n            if (first) r = m - 1;\n            else l = m + 1;\n        } else if (a[m] < t) l = m + 1;\n        else r = m - 1;\n    }\n    return ans;\n}\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t; cin >> t;\n    cout << searchBound(a, t, true) << " " << searchBound(a, t, false) << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '6\n5 7 7 8 8 10\n8', expectedOutput: '3 4' },
      { input: '6\n5 7 7 8 8 10\n6', expectedOutput: '-1 -1' }
    ],
    solution: { approach: 'Two separate binary searches for first and last occurrences.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' }
  },
  // Medium 3
  {
    title: 'Peak Index in a Mountain Array',
    slug: 'searching-peak-index-mountain-array',
    topic: 'Searching',
    difficulty: 'Medium',
    problemStatement: 'An array arr is a mountain if arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]. Return the index i of the peak element.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated integers.',
    outputFormat: 'Print the peak index.',
    constraints: ['3 <= arr.length <= 10^5'],
    examples: [{ input: '3\n0 1 0', output: '1', explanation: 'Index 1 is the peak.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l < r) {\n            int m = l + (r - l) / 2;\n            if (a[m] < a[m + 1]) l = m + 1;\n            else r = m;\n        }\n        System.out.println(l);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    l, r = 0, n - 1\n    while l < r:\n        m = (l + r) // 2\n        if a[m] < a[m + 1]: l = m + 1\n        else: r = m\n    print(l)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, r = n - 1;\n    while (l < r) {\n        int m = l + (r - l) / 2;\n        if (a[m] < a[m + 1]) l = m + 1;\n        else r = m;\n    }\n    cout << l << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '3\n0 1 0', expectedOutput: '1' },
      { input: '4\n0 2 1 0', expectedOutput: '1' },
      { input: '4\n0 10 5 2', expectedOutput: '1' }
    ],
    solution: { approach: 'Binary search comparing mid and mid + 1.', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)' }
  },
  // Hard 1
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'searching-median-of-two-sorted-arrays',
    topic: 'Searching',
    difficulty: 'Hard',
    problemStatement: 'Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays rounded to one decimal place (e.g. 2.0 or 2.5).',
    inputFormat: 'First line contains m and n.\nSecond line contains m space-separated integers.\nThird line contains n space-separated integers.',
    outputFormat: 'Print the median formatted to 1 decimal place.',
    constraints: ['0 <= m, n <= 1000', 'm + n >= 1'],
    examples: [{ input: '2 1\n1 3\n2', output: '2.0', explanation: 'Merged array [1,2,3], median is 2.0.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[] a = new int[m], b = new int[n];\n        for (int i = 0; i < m; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) b[i] = sc.nextInt();\n        \n        int[] merged = new int[m + n];\n        int i = 0, j = 0, k = 0;\n        while (i < m && j < n) merged[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];\n        while (i < m) merged[k++] = a[i++];\n        while (j < n) merged[k++] = b[j++];\n        int total = m + n;\n        double med = (total % 2 == 1) ? merged[total / 2] : (merged[total / 2 - 1] + merged[total / 2]) / 2.0;\n        System.out.printf(Locale.US, "%.1f\\n", med);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n = int(d[0]), int(d[1])\n    a = [int(x) for x in d[2:2+m]]\n    b = [int(x) for x in d[2+m:2+m+n]]\n    merged = sorted(a + b)\n    tot = len(merged)\n    med = merged[tot//2] if tot % 2 == 1 else (merged[tot//2 - 1] + merged[tot//2]) / 2.0\n    print(f"{med:.1f}")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<int> a(m), b(n);\n    for (int i = 0; i < m; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) cin >> b[i];\n    vector<int> c;\n    c.insert(c.end(), a.begin(), a.end());\n    c.insert(c.end(), b.begin(), b.end());\n    sort(c.begin(), c.end());\n    int tot = c.size();\n    double med = (tot % 2 == 1) ? c[tot / 2] : (c[tot / 2 - 1] + c[tot / 2]) / 2.0;\n    cout << fixed << setprecision(1) << med << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '2 1\n1 3\n2', expectedOutput: '2.0' },
      { input: '2 2\n1 2\n3 4', expectedOutput: '2.5' }
    ],
    solution: { approach: 'Binary search on partition points of smaller array.', timeComplexity: 'O(log(min(M, N)))', spaceComplexity: 'O(1)' }
  },
  // Hard 2
  {
    title: 'Split Array Largest Sum',
    slug: 'searching-split-array-largest-sum',
    topic: 'Searching',
    difficulty: 'Hard',
    problemStatement: 'Given an array nums which consists of non-negative integers and an integer k, split the array into k non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum.',
    inputFormat: 'First line contains n and k.\nSecond line contains n space-separated integers.',
    outputFormat: 'Print the minimized largest sum.',
    constraints: ['1 <= nums.length <= 1000', '1 <= k <= min(50, nums.length)'],
    examples: [{ input: '5 2\n7 2 5 10 8', output: '18', explanation: 'Split into [7,2,5] and [10,8], largest is 18.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    private static boolean canSplit(int[] a, int k, long maxAllowed) {\n        int pieces = 1;\n        long sum = 0;\n        for (int x : a) {\n            if (sum + x > maxAllowed) {\n                pieces++;\n                sum = x;\n            } else sum += x;\n        }\n        return pieces <= k;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        long l = 0, r = 0;\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n            l = Math.max(l, a[i]);\n            r += a[i];\n        }\n        long ans = r;\n        while (l <= r) {\n            long mid = l + (r - l) / 2;\n            if (canSplit(a, k, mid)) {\n                ans = mid;\n                r = mid - 1;\n            } else l = mid + 1;\n        }\n        System.out.println(ans);\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1])\n    a = [int(x) for x in d[2:2+n]]\n    l, r = max(a), sum(a)\n    def can(m):\n        pieces, s = 1, 0\n        for x in a:\n            if s + x > m: pieces += 1; s = x\n            else: s += x\n        return pieces <= k\n    ans = r\n    while l <= r:\n        m = (l + r) // 2\n        if can(m): ans = m; r = m - 1\n        else: l = m + 1\n    print(ans)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nbool canSplit(const vector<int>& a, int k, long long m) {\n    int pieces = 1; long long s = 0;\n    for (int x : a) {\n        if (s + x > m) { pieces++; s = x; } else s += x;\n    }\n    return pieces <= k;\n}\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); long long l = 0, r = 0;\n    for (int i = 0; i < n; i++) { cin >> a[i]; l = max(l, (long long)a[i]); r += a[i]; }\n    long long ans = r;\n    while (l <= r) {\n        long long m = l + (r - l) / 2;\n        if (canSplit(a, k, m)) { ans = m; r = m - 1; } else l = m + 1;\n    }\n    cout << ans << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '5 2\n7 2 5 10 8', expectedOutput: '18' },
      { input: '5 2\n1 2 3 4 5', expectedOutput: '9' }
    ],
    solution: { approach: 'Binary search on answer domain [max(nums), sum(nums)].', timeComplexity: 'O(N log(sum))', spaceComplexity: 'O(1)' }
  },
  // Hard 3
  {
    title: 'Find Peak Element II',
    slug: 'searching-find-peak-element-ii',
    topic: 'Searching',
    difficulty: 'Hard',
    problemStatement: 'A peak element in a 2D grid is an element that is strictly greater than all of its adjacent neighbors to the left, right, top, and bottom. Find any peak element in the m x n matrix and output its row and col.',
    inputFormat: 'First line contains m and n.\nNext m lines contain n space-separated integers.',
    outputFormat: 'Print two space-separated integers representing row and column.',
    constraints: ['1 <= m, n <= 500'],
    examples: [{ input: '2 2\n1 4\n3 2', output: '0 1', explanation: '4 at (0,1) is greater than 1 and 2.' }],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] mat = new int[m][n];\n        for (int i = 0; i < m; i++)\n            for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l <= r) {\n            int midCol = l + (r - l) / 2;\n            int maxRow = 0;\n            for (int i = 0; i < m; i++) if (mat[i][midCol] > mat[maxRow][midCol]) maxRow = i;\n            boolean leftIsBigger = midCol > 0 && mat[maxRow][midCol - 1] > mat[maxRow][midCol];\n            boolean rightIsBigger = midCol < n - 1 && mat[maxRow][midCol + 1] > mat[maxRow][midCol];\n            if (!leftIsBigger && !rightIsBigger) { System.out.println(maxRow + " " + midCol); return; }\n            if (leftIsBigger) r = midCol - 1;\n            else l = midCol + 1;\n        }\n    }\n}`,
      python: `import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n = int(d[0]), int(d[1])\n    mat = []\n    idx = 2\n    for _ in range(m):\n        mat.append([int(x) for x in d[idx:idx+n]])\n        idx += n\n    l, r = 0, n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        max_row = max(range(m), key=lambda i: mat[i][mid])\n        left_bigger = mid > 0 and mat[max_row][mid - 1] > mat[max_row][mid]\n        right_bigger = mid < n - 1 and mat[max_row][mid + 1] > mat[max_row][mid]\n        if not left_bigger and not right_bigger:\n            print(f"{max_row} {mid}")\n            return\n        if left_bigger: r = mid - 1\n        else: l = mid + 1\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> mat(m, vector<int>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> mat[i][j];\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        int maxRow = 0;\n        for (int i = 0; i < m; i++) if (mat[i][mid] > mat[maxRow][mid]) maxRow = i;\n        bool leftBigger = mid > 0 && mat[maxRow][mid - 1] > mat[maxRow][mid];\n        bool rightBigger = mid < n - 1 && mat[maxRow][mid + 1] > mat[maxRow][mid];\n        if (!leftBigger && !rightBigger) { cout << maxRow << " " << mid << endl; return 0; }\n        if (leftBigger) r = mid - 1;\n        else l = mid + 1;\n    }\n    return 0;\n}`
    },
    testCases: [
      { input: '2 2\n1 4\n3 2', expectedOutput: '0 1' }
    ],
    solution: { approach: 'Binary search on columns, finding max element of column in O(M).', timeComplexity: 'O(M log N)', spaceComplexity: 'O(1)' }
  }
];

saveTopic('searching.js', searching);
