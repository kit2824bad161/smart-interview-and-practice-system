module.exports = [
  {
    "title": "Bubble Sort",
    "slug": "sorting-bubble-sort",
    "topic": "Sorting",
    "difficulty": "Easy",
    "problemStatement": "Given an array of integers nums, sort the array in ascending order using the Bubble Sort algorithm and print the sorted array.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print n space-separated sorted integers.",
    "constraints": [
      "1 <= n <= 1000",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "5\n5 1 4 2 8",
        "output": "1 2 4 5 8",
        "explanation": "Sorted in ascending order."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - i - 1; j++) {\n                if (a[j] > a[j + 1]) {\n                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n                }\n            }\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    for i in range(n - 1):\n        for j in range(n - i - 1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n    print(\" \".join(str(x) for x in a))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n - 1; i++) for (int j = 0; j < n - i - 1; j++) if (a[j] > a[j+1]) swap(a[j], a[j+1]);\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "5\n5 1 4 2 8",
        "expectedOutput": "1 2 4 5 8"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "1 2 3"
      }
    ],
    "solution": {
      "approach": "Repeatedly swap adjacent inverted elements.",
      "timeComplexity": "O(N^2)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Selection Sort",
    "slug": "sorting-selection-sort",
    "topic": "Sorting",
    "difficulty": "Easy",
    "problemStatement": "Given an array of integers nums, sort it in ascending order using Selection Sort.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print the sorted array.",
    "constraints": [
      "1 <= n <= 1000"
    ],
    "examples": [
      {
        "input": "4\n64 25 12 22",
        "output": "12 22 25 64",
        "explanation": "Sorted order."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n - 1; i++) {\n            int minIdx = i;\n            for (int j = i + 1; j < n; j++) if (a[j] < a[minIdx]) minIdx = j;\n            int t = a[minIdx]; a[minIdx] = a[i]; a[i] = t;\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    for i in range(n - 1):\n        min_i = i\n        for j in range(i + 1, n):\n            if a[j] < a[min_i]: min_i = j\n        a[i], a[min_i] = a[min_i], a[i]\n    print(\" \".join(str(x) for x in a))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) if (a[j] < a[minIdx]) minIdx = j;\n        swap(a[i], a[minIdx]);\n    }\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n64 25 12 22",
        "expectedOutput": "12 22 25 64"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      }
    ],
    "solution": {
      "approach": "Repeatedly find minimum element from unsorted part and place at beginning.",
      "timeComplexity": "O(N^2)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Insertion Sort",
    "slug": "sorting-insertion-sort",
    "topic": "Sorting",
    "difficulty": "Easy",
    "problemStatement": "Sort the array using Insertion Sort algorithm.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print the sorted array.",
    "constraints": [
      "1 <= n <= 1000"
    ],
    "examples": [
      {
        "input": "5\n12 11 13 5 6",
        "output": "5 6 11 12 13",
        "explanation": "Sorted elements."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 1; i < n; i++) {\n            int key = a[i], j = i - 1;\n            while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }\n            a[j + 1] = key;\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    for i in range(1, n):\n        key = a[i]; j = i - 1\n        while j >= 0 and a[j] > key:\n            a[j + 1] = a[j]; j -= 1\n        a[j + 1] = key\n    print(\" \".join(str(x) for x in a))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 1; i < n; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }\n        a[j + 1] = key;\n    }\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "5\n12 11 13 5 6",
        "expectedOutput": "5 6 11 12 13"
      }
    ],
    "solution": {
      "approach": "Build sorted array in-place one element at a time.",
      "timeComplexity": "O(N^2)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Check if Array is Sorted",
    "slug": "sorting-check-sorted",
    "topic": "Sorting",
    "difficulty": "Easy",
    "problemStatement": "Given an array nums of size n, return \"true\" if the array is sorted in non-decreasing order, otherwise return \"false\".",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "true",
        "explanation": "Array is sorted."
      },
      {
        "input": "4\n2 1 3 4",
        "output": "false",
        "explanation": "2 > 1."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 1; i < n; i++) {\n            if (a[i] < a[i - 1]) { System.out.println(\"false\"); return; }\n        }\n        System.out.println(\"true\");\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    for i in range(1, n):\n        if a[i] < a[i - 1]: print(\"false\"); return\n    print(\"true\")\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 1; i < n; i++) if (a[i] < a[i-1]) { cout << \"false\" << endl; return 0; }\n    cout << \"true\" << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "true"
      },
      {
        "input": "4\n2 1 3 4",
        "expectedOutput": "false"
      },
      {
        "input": "1\n100",
        "expectedOutput": "true"
      }
    ],
    "solution": {
      "approach": "Check if every adjacent pair satisfies a[i] <= a[i+1].",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Merge Intervals",
    "slug": "sorting-merge-intervals",
    "topic": "Sorting",
    "difficulty": "Medium",
    "problemStatement": "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return the non-overlapping intervals in sorted order.",
    "inputFormat": "First line contains integer n (number of intervals).\nNext n lines contain start and end.",
    "outputFormat": "Print each merged interval on a new line with start and end separated by a space.",
    "constraints": [
      "1 <= intervals.length <= 10^4"
    ],
    "examples": [
      {
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "output": "1 6\n8 10\n15 18",
        "explanation": "[1,3] and [2,6] overlap into [1,6]."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] intervals = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            intervals[i][0] = sc.nextInt();\n            intervals[i][1] = sc.nextInt();\n        }\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        int[] curr = intervals[0];\n        for (int i = 1; i < n; i++) {\n            if (intervals[i][0] <= curr[1]) {\n                curr[1] = Math.max(curr[1], intervals[i][1]);\n            } else {\n                merged.add(curr);\n                curr = intervals[i];\n            }\n        }\n        merged.add(curr);\n        for (int[] iv : merged) System.out.println(iv[0] + \" \" + iv[1]);\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    ivs = []\n    for i in range(n):\n        ivs.append([int(d[1+2*i]), int(d[2+2*i])])\n    ivs.sort(key=lambda x: x[0])\n    merged = [ivs[0]]\n    for iv in ivs[1:]:\n        if iv[0] <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], iv[1])\n        else: merged.append(iv)\n    for iv in merged: print(f\"{iv[0]} {iv[1]}\")\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<pair<int, int>> ivs(n);\n    for (int i = 0; i < n; i++) cin >> ivs[i].first >> ivs[i].second;\n    sort(ivs.begin(), ivs.end());\n    vector<pair<int, int>> merged = {ivs[0]};\n    for (int i = 1; i < n; i++) {\n        if (ivs[i].first <= merged.back().second) merged.back().second = max(merged.back().second, ivs[i].second);\n        else merged.push_back(ivs[i]);\n    }\n    for (auto& iv : merged) cout << iv.first << \" \" << iv.second << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "expectedOutput": "1 6\n8 10\n15 18"
      },
      {
        "input": "2\n1 4\n4 5",
        "expectedOutput": "1 5"
      }
    ],
    "solution": {
      "approach": "Sort by start time, merge greedily when next start <= current end.",
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Sort Colors",
    "slug": "sorting-sort-colors",
    "topic": "Sorting",
    "difficulty": "Medium",
    "problemStatement": "Given an array nums with n objects colored red (0), white (1), or blue (2), sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers (0, 1, or 2).",
    "outputFormat": "Print sorted array.",
    "constraints": [
      "1 <= nums.length <= 300",
      "nums[i] is either 0, 1, or 2."
    ],
    "examples": [
      {
        "input": "6\n2 0 2 1 1 0",
        "output": "0 0 1 1 2 2",
        "explanation": "Sorted 0s, 1s, and 2s."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, mid = 0, r = n - 1;\n        while (mid <= r) {\n            if (a[mid] == 0) {\n                int t = a[l]; a[l++] = a[mid]; a[mid++] = t;\n            } else if (a[mid] == 1) mid++;\n            else {\n                int t = a[r]; a[r--] = a[mid]; a[mid] = t;\n            }\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    l, mid, r = 0, 0, n - 1\n    while mid <= r:\n        if a[mid] == 0:\n            a[l], a[mid] = a[mid], a[l]\n            l += 1; mid += 1\n        elif a[mid] == 1: mid += 1\n        else:\n            a[r], a[mid] = a[mid], a[r]\n            r -= 1\n    print(\" \".join(str(x) for x in a))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, mid = 0, r = n - 1;\n    while (mid <= r) {\n        if (a[mid] == 0) swap(a[l++], a[mid++]);\n        else if (a[mid] == 1) mid++;\n        else swap(a[r--], a[mid]);\n    }\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "6\n2 0 2 1 1 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "3\n2 0 1",
        "expectedOutput": "0 1 2"
      }
    ],
    "solution": {
      "approach": "Dutch National Flag algorithm with three pointers.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Kth Largest Element in an Array",
    "slug": "sorting-kth-largest-element",
    "topic": "Sorting",
    "difficulty": "Medium",
    "problemStatement": "Given an integer array nums and an integer k, return the kth largest element in the array.",
    "inputFormat": "First line contains n and k.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print the kth largest integer.",
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "6 2\n3 2 1 5 6 4",
        "output": "5",
        "explanation": "2nd largest is 5."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int i = 0; i < n; i++) {\n            pq.offer(sc.nextInt());\n            if (pq.size() > k) pq.poll();\n        }\n        System.out.println(pq.peek());\n    }\n}",
      "python": "import sys, heapq\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1])\n    nums = [int(x) for x in d[2:2+n]]\n    print(heapq.nlargest(k, nums)[-1])\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        pq.push(x);\n        if (pq.size() > k) pq.pop();\n    }\n    cout << pq.top() << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "6 2\n3 2 1 5 6 4",
        "expectedOutput": "5"
      },
      {
        "input": "9 4\n3 2 3 1 2 4 5 5 6",
        "expectedOutput": "4"
      }
    ],
    "solution": {
      "approach": "Min-heap of size k to maintain k largest elements.",
      "timeComplexity": "O(N log K)",
      "spaceComplexity": "O(K)"
    }
  },
  {
    "title": "Maximum Gap",
    "slug": "sorting-maximum-gap",
    "topic": "Sorting",
    "difficulty": "Hard",
    "problemStatement": "Given an integer array nums, return the maximum difference between two successive elements in its sorted form. If the array contains less than 2 elements, return 0. You must write an algorithm that runs in linear time.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print an integer.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "4\n3 6 9 1",
        "output": "3",
        "explanation": "Sorted [1, 3, 6, 9]. Max gap is 3."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int maxGap = 0;\n        for (int i = 1; i < n; i++) maxGap = Math.max(maxGap, a[i] - a[i - 1]);\n        System.out.println(maxGap);\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = sorted([int(x) for x in d[1:n+1]])\n    print(max((a[i] - a[i-1] for i in range(1, n)), default=0))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n) || n < 2) { cout << 0 << endl; return 0; }\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int maxGap = 0;\n    for (int i = 1; i < n; i++) maxGap = max(maxGap, a[i] - a[i-1]);\n    cout << maxGap << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n3 6 9 1",
        "expectedOutput": "3"
      },
      {
        "input": "1\n10",
        "expectedOutput": "0"
      }
    ],
    "solution": {
      "approach": "Bucket sort / radix sort pigeonhole principle.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Count of Smaller Numbers After Self",
    "slug": "sorting-count-smaller-numbers",
    "topic": "Sorting",
    "difficulty": "Hard",
    "problemStatement": "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print counts separated by spaces.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "4\n5 2 6 1",
        "output": "2 1 1 0",
        "explanation": "To right of 5: 2 and 1 (2). To right of 2: 1 (1). To right of 6: 1 (1)."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int[] counts = new int[n];\n        for (int i = 0; i < n; i++) {\n            int c = 0;\n            for (int j = i + 1; j < n; j++) if (a[j] < a[i]) c++;\n            counts[i] = c;\n        }\n        for (int i = 0; i < n; i++) System.out.print(counts[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = [int(x) for x in d[1:n+1]]\n    res = []\n    for i in range(n):\n        res.append(sum(1 for j in range(i + 1, n) if a[j] < a[i]))\n    print(\" \".join(str(x) for x in res))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    vector<int> counts(n, 0);\n    for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) if (a[j] < a[i]) counts[i]++;\n    for (int i = 0; i < n; i++) cout << counts[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n5 2 6 1",
        "expectedOutput": "2 1 1 0"
      },
      {
        "input": "1\n-1",
        "expectedOutput": "0"
      }
    ],
    "solution": {
      "approach": "Merge sort with index tracking or Binary Indexed Tree (Fenwick Tree).",
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Wiggle Sort II",
    "slug": "sorting-wiggle-sort-ii",
    "topic": "Sorting",
    "difficulty": "Hard",
    "problemStatement": "Given an integer array nums, reorder it such that nums[0] < nums[1] > nums[2] < nums[3].... Output the reordered array.",
    "inputFormat": "First line contains integer n.\nSecond line contains n space-separated integers.",
    "outputFormat": "Print the wiggle sorted array.",
    "constraints": [
      "1 <= nums.length <= 5 * 10^4"
    ],
    "examples": [
      {
        "input": "6\n1 5 1 1 6 4",
        "output": "1 6 1 5 1 4",
        "explanation": "One valid wiggle sort."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int[] res = new int[n];\n        int mid = (n + 1) / 2 - 1, end = n - 1;\n        for (int i = 0; i < n; i += 2) res[i] = a[mid--];\n        for (int i = 1; i < n; i += 2) res[i] = a[end--];\n        for (int i = 0; i < n; i++) System.out.print(res[i] + (i == n - 1 ? \"\" : \" \"));\n        System.out.println();\n    }\n}",
      "python": "import sys\n\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    a = sorted([int(x) for x in d[1:n+1]])\n    res = [0] * n\n    mid, end = (n + 1) // 2 - 1, n - 1\n    for i in range(0, n, 2):\n        res[i] = a[mid]; mid -= 1\n    for i in range(1, n, 2):\n        res[i] = a[end]; end -= 1\n    print(\" \".join(str(x) for x in res))\n\nif __name__ == '__main__':\n    main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    vector<int> res(n);\n    int mid = (n + 1) / 2 - 1, end = n - 1;\n    for (int i = 0; i < n; i += 2) res[i] = a[mid--];\n    for (int i = 1; i < n; i += 2) res[i] = a[end--];\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "6\n1 5 1 1 6 4",
        "expectedOutput": "1 6 1 5 1 4"
      }
    ],
    "solution": {
      "approach": "Sort and interleave lower and upper halves from end to avoid adjacent duplicates.",
      "timeComplexity": "O(N log N)",
      "spaceComplexity": "O(N)"
    }
  }
];
