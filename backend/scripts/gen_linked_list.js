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
    solution: { approach: app || 'Standard approach.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(1)' }
  };
}

// ==========================================
// 1. LINKED LIST (10)
// ==========================================
const linkedList = [
  // 4 Easy
  p('Reverse Linked List', 'linked-list-reverse-linked-list', 'Linked List', 'Easy',
    'Given the head of a singly linked list represented as space-separated node values, reverse the list and return the reversed list values.',
    'First line: n. Second line: n space-separated node values.', 'Print reversed list values.', ['0 <= n <= 5000'],
    [{ input: '5\n1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Reversed order.' }, { input: '2\n1 2', output: '2 1', explanation: 'Reversed list.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = n - 1; i >= 0; i--) System.out.print(a[i] + (i == 0 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = d[1:n+1]\n    print(" ".join(reversed(a)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = n - 1; i >= 0; i--) cout << a[i] << (i == 0 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1' }, { input: '1\n10', expectedOutput: '10' }],
    'Iterative pointer reversal: prev, curr, next.', 'O(N)', 'O(1)'),

  p('Merge Two Sorted Lists', 'linked-list-merge-two-sorted-lists', 'Linked List', 'Easy',
    'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return its elements.',
    'First line: n and m. Second line: n sorted values. Third line: m sorted values.', 'Print merged sorted values.', ['0 <= n, m <= 50'],
    [{ input: '3 3\n1 2 4\n1 3 4', output: '1 1 2 3 4 4', explanation: 'Merged sorted sequence.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] a = new int[n], b = new int[m];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) b[i] = sc.nextInt();\n        int i = 0, j = 0;\n        boolean first = true;\n        while (i < n && j < m) {\n            int v = (a[i] <= b[j]) ? a[i++] : b[j++];\n            System.out.print((first ? "" : " ") + v);\n            first = false;\n        }\n        while (i < n) { System.out.print((first ? "" : " ") + a[i++]); first = false; }\n        while (j < m) { System.out.print((first ? "" : " ") + b[j++]); first = false; }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]; b = [int(x) for x in d[2+n:2+n+m]]\n    print(" ".join(str(x) for x in sorted(a + b)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m); for (int i = 0; i < n; i++) cin >> a[i]; for (int i = 0; i < m; i++) cin >> b[i];\n    vector<int> res; int i = 0, j = 0;\n    while (i < n && j < m) res.push_back((a[i] <= b[j]) ? a[i++] : b[j++]);\n    while (i < n) res.push_back(a[i++]);\n    while (j < m) res.push_back(b[j++]);\n    for (int k = 0; k < res.size(); k++) cout << res[k] << (k == res.size() - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '3 3\n1 2 4\n1 3 4', expectedOutput: '1 1 2 3 4 4' }],
    'Dummy head comparison merge.', 'O(N + M)', 'O(1)'),

  p('Linked List Cycle', 'linked-list-linked-list-cycle', 'Linked List', 'Easy',
    'Given head, the head of a linked list, determine if the linked list has a cycle in it. Given n elements and pos (0-based index the tail points to, or -1 if no cycle). Print "true" or "false".',
    'First line: n and pos. Second line: n node values.', 'Print "true" or "false".', ['0 <= n <= 10^4', '-1 <= pos < n'],
    [{ input: '4 1\n3 2 0 -4', output: 'true', explanation: 'Tail connects to index 1.' }, { input: '1 -1\n1', output: 'false', explanation: 'No cycle.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), pos = sc.nextInt();\n        System.out.println(pos != -1 ? "true" : "false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, pos = int(d[0]), int(d[1])\n    print("true" if pos != -1 else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n, pos; if (!(cin >> n >> pos)) return 0;\n    cout << (pos != -1 ? "true" : "false") << endl;\n    return 0;\n}`,
    [{ input: '4 1\n3 2 0 -4', expectedOutput: 'true' }, { input: '1 -1\n1', expectedOutput: 'false' }],
    'Floyd\'s Tortoise and Hare cycle-finding algorithm.', 'O(N)', 'O(1)'),

  p('Middle of the Linked List', 'linked-list-middle-of-linked-list', 'Linked List', 'Easy',
    'Given the head of a singly linked list, return the value of the middle node. If there are two middle nodes, return the second middle node.',
    'First line: n. Second line: n integers.', 'Print middle node value.', ['1 <= n <= 100'],
    [{ input: '5\n1 2 3 4 5', output: '3', explanation: 'Middle is 3.' }, { input: '6\n1 2 3 4 5 6', output: '4', explanation: 'Second middle is 4.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        System.out.println(a[n / 2]);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    print(a[n // 2])\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    cout << a[n / 2] << endl;\n    return 0;\n}`,
    [{ input: '5\n1 2 3 4 5', expectedOutput: '3' }, { input: '6\n1 2 3 4 5 6', expectedOutput: '4' }],
    'Slow and fast pointers (fast moves 2 steps, slow moves 1).', 'O(N)', 'O(1)'),

  // 3 Medium
  p('Remove Nth Node From End of List', 'linked-list-remove-nth-node-from-end', 'Linked List', 'Medium',
    'Given the head of a linked list, remove the nth node from the end of the list and return the remaining elements.',
    'First line: size and n. Second line: size integers.', 'Print updated list.', ['1 <= sz <= 30'],
    [{ input: '5 2\n1 2 3 4 5', output: '1 2 3 5', explanation: '2nd from end (4) is removed.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int sz = sc.nextInt(), n = sc.nextInt();\n        int[] a = new int[sz];\n        for (int i = 0; i < sz; i++) a[i] = sc.nextInt();\n        int removeIdx = sz - n;\n        boolean first = true;\n        for (int i = 0; i < sz; i++) {\n            if (i == removeIdx) continue;\n            System.out.print((first ? "" : " ") + a[i]);\n            first = false;\n        }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    sz, n = int(d[0]), int(d[1]); a = d[2:2+sz]\n    del a[sz - n]\n    print(" ".join(a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int sz, n; if (!(cin >> sz >> n)) return 0;\n    vector<int> a(sz); for (int i = 0; i < sz; i++) cin >> a[i];\n    int rem = sz - n; bool first = true;\n    for (int i = 0; i < sz; i++) {\n        if (i == rem) continue;\n        cout << (first ? "" : " ") << a[i]; first = false;\n    }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5 2\n1 2 3 4 5', expectedOutput: '1 2 3 5' }, { input: '1 1\n1', expectedOutput: '' }],
    'Two pointers with n gap between them.', 'O(N)', 'O(1)'),

  p('Add Two Numbers', 'linked-list-add-two-numbers', 'Linked List', 'Medium',
    'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as a linked list in reverse order.',
    'First line: n and m. Second line: n digits. Third line: m digits.', 'Print resulting digits in reverse order separated by space.', ['1 <= n, m <= 100'],
    [{ input: '3 3\n2 4 3\n5 6 4', output: '7 0 8', explanation: '342 + 465 = 807 -> [7, 0, 8].' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] a = new int[n], b = new int[m];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) b[i] = sc.nextInt();\n        List<Integer> res = new ArrayList<>();\n        int carry = 0, i = 0, j = 0;\n        while (i < n || j < m || carry > 0) {\n            int s = carry + (i < n ? a[i++] : 0) + (j < m ? b[j++] : 0);\n            res.add(s % 10);\n            carry = s / 10;\n        }\n        for (int k = 0; k < res.size(); k++) System.out.print(res.get(k) + (k == res.size() - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]; b = [int(x) for x in d[2+n:2+n+m]]\n    res = []; carry = 0; i = j = 0\n    while i < n or j < m or carry:\n        s = carry + (a[i] if i < n else 0) + (b[j] if j < m else 0)\n        res.append(str(s % 10)); carry = s // 10\n        i += 1; j += 1\n    print(" ".join(res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m); for (int i = 0; i < n; i++) cin >> a[i]; for (int i = 0; i < m; i++) cin >> b[i];\n    vector<int> res; int carry = 0, i = 0, j = 0;\n    while (i < n || j < m || carry) {\n        int s = carry + (i < n ? a[i++] : 0) + (j < m ? b[j++] : 0);\n        res.push_back(s % 10); carry = s / 10;\n    }\n    for (int k = 0; k < res.size(); k++) cout << res[k] << (k == res.size() - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '3 3\n2 4 3\n5 6 4', expectedOutput: '7 0 8' }],
    'Digit by digit simulation with carry.', 'O(max(N, M))', 'O(max(N, M))'),

  p('Reorder List', 'linked-list-reorder-list', 'Linked List', 'Medium',
    'Reorder list L0 -> L1 -> ... -> Ln-1 -> Ln into L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2....',
    'First line: n. Second line: n integers.', 'Print reordered list.', ['1 <= n <= 5 * 10^4'],
    [{ input: '4\n1 2 3 4', output: '1 4 2 3', explanation: 'Reordered form.' }, { input: '5\n1 2 3 4 5', output: '1 5 2 4 3', explanation: 'Reordered 5 elements.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, r = n - 1;\n        boolean first = true;\n        while (l <= r) {\n            System.out.print((first ? "" : " ") + a[l++]); first = false;\n            if (l <= r) { System.out.print(" " + a[r--]); }\n        }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    res = []; l, r = 0, n - 1\n    while l <= r:\n        res.append(str(a[l])); l += 1\n        if l <= r: res.append(str(a[r])); r -= 1\n    print(" ".join(res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int l = 0, r = n - 1; bool first = true;\n    while (l <= r) {\n        cout << (first ? "" : " ") << a[l++]; first = false;\n        if (l <= r) cout << " " << a[r--];\n    }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '4\n1 2 3 4', expectedOutput: '1 4 2 3' }, { input: '5\n1 2 3 4 5', expectedOutput: '1 5 2 4 3' }],
    'Find middle, reverse second half, merge alternatively.', 'O(N)', 'O(1)'),

  // 3 Hard
  p('Merge k Sorted Lists', 'linked-list-merge-k-sorted-lists', 'Linked List', 'Hard',
    'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return its values.',
    'First line: k. Next k lines contain count of elements followed by the sorted elements.', 'Print merged sorted values.', ['0 <= k <= 10^4'],
    [{ input: '3\n3 1 4 5\n3 1 3 4\n2 2 6', output: '1 1 2 3 4 4 5 6', explanation: 'All 3 lists merged in sorted order.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int k = sc.nextInt();\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int i = 0; i < k; i++) {\n            int len = sc.nextInt();\n            for (int j = 0; j < len; j++) pq.offer(sc.nextInt());\n        }\n        boolean first = true;\n        while (!pq.isEmpty()) {\n            System.out.print((first ? "" : " ") + pq.poll()); first = false;\n        }\n        System.out.println();\n    }\n}`,
    `import sys, heapq\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    k = int(d[0]); idx = 1; pq = []\n    for _ in range(k):\n        cnt = int(d[idx]); idx += 1\n        for _ in range(cnt): pq.append(int(d[idx])); idx += 1\n    heapq.heapify(pq)\n    res = []\n    while pq: res.append(str(heapq.heappop(pq)))\n    print(" ".join(res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\nint main() {\n    int k; if (!(cin >> k)) return 0;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < k; i++) {\n        int cnt; cin >> cnt;\n        while (cnt--) { int x; cin >> x; pq.push(x); }\n    }\n    bool first = true;\n    while (!pq.empty()) { cout << (first ? "" : " ") << pq.top(); pq.pop(); first = false; }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '3\n3 1 4 5\n3 1 3 4\n2 2 6', expectedOutput: '1 1 2 3 4 4 5 6' }],
    'Min-heap of k list heads.', 'O(N log K)', 'O(K)'),

  p('Reverse Nodes in k-Group', 'linked-list-reverse-nodes-in-k-group', 'Linked List', 'Hard',
    'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.',
    'First line: n and k. Second line: n integers.', 'Print modified list elements.', ['1 <= k <= n <= 5000'],
    [{ input: '5 2\n1 2 3 4 5', output: '2 1 4 3 5', explanation: 'First two pairs reversed, last element remains.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i + k <= n; i += k) {\n            int l = i, r = i + k - 1;\n            while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }\n        }\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    for i in range(0, n - k + 1, k):\n        a[i:i+k] = reversed(a[i:i+k])\n    print(" ".join(str(x) for x in a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i + k <= n; i += k) reverse(a.begin() + i, a.begin() + i + k);\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5 2\n1 2 3 4 5', expectedOutput: '2 1 4 3 5' }, { input: '5 3\n1 2 3 4 5', expectedOutput: '3 2 1 4 5' }],
    'Check if k nodes exist, then reverse k subsegment iteratively.', 'O(N)', 'O(1)'),

  p('Copy List with Random Pointer', 'linked-list-copy-list-with-random-pointer', 'Linked List', 'Hard',
    'A linked list of length n is given such that each node contains an additional random pointer. Given n pairs of (val, random_index), construct a deep copy and print the resulting node values.',
    'First line: n. Next n lines: val and random_index (-1 if null).', 'Print node values separated by space.', ['0 <= n <= 1000'],
    [{ input: '5\n7 -1\n13 0\n11 4\n10 2\n1 0', output: '7 13 11 10 1', explanation: 'Deep copy of node values.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] vals = new int[n];\n        for (int i = 0; i < n; i++) { vals[i] = sc.nextInt(); sc.nextInt(); }\n        for (int i = 0; i < n; i++) System.out.print(vals[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); vals = [d[1+2*i] for i in range(n)]\n    print(" ".join(vals))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> vals(n);\n    for (int i = 0; i < n; i++) { int r; cin >> vals[i] >> r; }\n    for (int i = 0; i < n; i++) cout << vals[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5\n7 -1\n13 0\n11 4\n10 2\n1 0', expectedOutput: '7 13 11 10 1' }],
    'Interweave cloned nodes with original nodes to copy random pointers in O(1) space.', 'O(N)', 'O(1)')
];

saveTopic('linkedList.js', linkedList);
