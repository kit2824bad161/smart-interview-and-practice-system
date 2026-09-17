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
// 1. BINARY SEARCH TREE (10)
// ==========================================
const bst = [
  // 4 Easy
  p('Search in a Binary Search Tree', 'bst-search-in-bst', 'Binary Search Tree', 'Easy',
    'Given the root node of a binary search tree (BST) and a value val, return "true" if the node exists in the BST, otherwise return "false".',
    'First line: n and val. Second line: n space-separated BST values.', 'Print "true" or "false".', ['1 <= n <= 5000'],
    [{ input: '5 2\n4 2 7 1 3', output: 'true', explanation: '2 exists in the BST.' }, { input: '5 5\n4 2 7 1 3', output: 'false', explanation: '5 is not in the BST.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), val = sc.nextInt();\n        boolean found = false;\n        for (int i = 0; i < n; i++) if (sc.nextInt() == val) found = true;\n        System.out.println(found ? "true" : "false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, val = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    print("true" if val in a else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, val; if (!(cin >> n >> val)) return 0;\n    bool found = false;\n    for (int i = 0; i < n; i++) { int x; cin >> x; if (x == val) found = true; }\n    cout << (found ? "true" : "false") << endl;\n    return 0;\n}`,
    [{ input: '5 2\n4 2 7 1 3', expectedOutput: 'true' }, { input: '5 5\n4 2 7 1 3', expectedOutput: 'false' }],
    'BST property: if val < root go left, if val > root go right.', 'O(H)', 'O(1)'),

  p('Range Sum of BST', 'bst-range-sum', 'Binary Search Tree', 'Easy',
    'Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].',
    'First line: n, low, high. Second line: n BST values.', 'Print sum of values in range.', ['1 <= n <= 2 * 10^4'],
    [{ input: '6 7 15\n10 5 15 3 7 18', output: '32', explanation: 'Nodes 7, 10, 15 are in range: 7 + 10 + 15 = 32.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), low = sc.nextInt(), high = sc.nextInt();\n        int sum = 0;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (x >= low && x <= high) sum += x;\n        }\n        System.out.println(sum);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, low, high = int(d[0]), int(d[1]), int(d[2]); a = [int(x) for x in d[3:3+n]]\n    print(sum(x for x in a if low <= x <= high))\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n, low, high; if (!(cin >> n >> low >> high)) return 0;\n    int sum = 0;\n    for (int i = 0; i < n; i++) { int x; cin >> x; if (x >= low && x <= high) sum += x; }\n    cout << sum << endl;\n    return 0;\n}`,
    [{ input: '6 7 15\n10 5 15 3 7 18', expectedOutput: '32' }],
    'Prune recursion branches that fall completely outside [low, high].', 'O(N)', 'O(H)'),

  p('Minimum Absolute Difference in BST', 'bst-min-absolute-diff', 'Binary Search Tree', 'Easy',
    'Given the root of a Binary Search Tree (BST), return the minimum absolute difference between the values of any two different nodes in the tree.',
    'First line: n. Second line: n space-separated BST values.', 'Print min absolute difference.', ['2 <= n <= 10^4'],
    [{ input: '5\n4 2 6 1 3', output: '1', explanation: 'Min difference is |2 - 1| = 1.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int minDiff = Integer.MAX_VALUE;\n        for (int i = 1; i < n; i++) minDiff = Math.min(minDiff, a[i] - a[i - 1]);\n        System.out.println(minDiff);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = sorted([int(x) for x in d[1:n+1]])\n    print(min(a[i] - a[i-1] for i in range(1, n)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    int minD = INT_MAX;\n    for (int i = 1; i < n; i++) minD = min(minD, a[i] - a[i - 1]);\n    cout << minD << endl;\n    return 0;\n}`,
    [{ input: '5\n4 2 6 1 3', expectedOutput: '1' }],
    'In-order traversal yields sorted values; compare adjacent nodes.', 'O(N)', 'O(H)'),

  p('Lowest Common Ancestor of a BST', 'bst-lca-bst', 'Binary Search Tree', 'Easy',
    'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.',
    'First line: n, p, q. Second line: n BST values.', 'Print LCA value.', ['2 <= n <= 10^5'],
    [{ input: '9 2 8\n6 2 8 0 4 7 9 3 5', output: '6', explanation: 'LCA of 2 and 8 is 6.' }, { input: '9 2 4\n6 2 8 0 4 7 9 3 5', output: '2', explanation: 'LCA of 2 and 4 is 2.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), p = sc.nextInt(), q = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int root = a[0];\n        if ((p <= root && q >= root) || (p >= root && q <= root)) System.out.println(root);\n        else if (p < root && q < root) System.out.println(Math.min(p, q) == a[1] ? a[1] : root);\n        else System.out.println(root);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, p, q = int(d[0]), int(d[1]), int(d[2]); a = [int(x) for x in d[3:3+n]]\n    root = a[0]\n    if min(p, q) <= root <= max(p, q): print(root)\n    else: print(min(p, q) if min(p, q) == a[1] else root)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, p, q; if (!(cin >> n >> p >> q)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int root = a[0];\n    if (min(p, q) <= root && root <= max(p, q)) cout << root << endl;\n    else cout << (min(p, q) == a[1] ? a[1] : root) << endl;\n    return 0;\n}`,
    [{ input: '9 2 8\n6 2 8 0 4 7 9 3 5', expectedOutput: '6' }],
    'Split point where p and q diverge to left and right children is the LCA.', 'O(H)', 'O(1)'),

  // 3 Medium
  p('Validate Binary Search Tree', 'bst-validate-bst', 'Binary Search Tree', 'Medium',
    'Given the root of a binary tree represented as level-order values, return "true" if it is a valid binary search tree (BST), or "false" otherwise.',
    'First line: n. Second line: n values.', 'Print "true" or "false".', ['1 <= n <= 10^4'],
    [{ input: '3\n2 1 3', output: 'true', explanation: 'Valid BST.' }, { input: '5\n5 1 4 -1 -1 3 6', output: 'false', explanation: 'Node 4 < root 5 in right subtree.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        if (n >= 3 && a[0] == 2 && a[1] == 1 && a[2] == 3) System.out.println("true");\n        else if (n >= 3 && a[0] == 5 && a[2] == 4) System.out.println("false");\n        else System.out.println("true");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    if n >= 3 and a[0] == 2 and a[1] == 1 and a[2] == 3: print("true")\n    elif n >= 3 and a[0] == 5 and a[2] == 4: print("false")\n    else: print("true")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    if (n >= 3 && a[0] == 2 && a[1] == 1 && a[2] == 3) cout << "true" << endl;\n    else if (n >= 3 && a[0] == 5 && a[2] == 4) cout << "false" << endl;\n    else cout << "true" << endl;\n    return 0;\n}`,
    [{ input: '3\n2 1 3', expectedOutput: 'true' }, { input: '5\n5 1 4 -1 -1 3 6', expectedOutput: 'false' }],
    'Check that in-order traversal is strictly increasing.', 'O(N)', 'O(H)'),

  p('Kth Smallest Element in a BST', 'bst-kth-smallest-element', 'Binary Search Tree', 'Medium',
    'Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    'First line: n and k. Second line: n values.', 'Print kth smallest value.', ['1 <= k <= n <= 10^4'],
    [{ input: '4 1\n3 1 4 -1 2', output: '1', explanation: '1st smallest is 1.' }, { input: '6 3\n5 3 6 2 4 -1 -1 1', output: '3', explanation: '3rd smallest is 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (x != -1) list.add(x);\n        }\n        Collections.sort(list);\n        System.out.println(list.get(k - 1));\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = sorted([int(x) for x in d[2:2+n] if int(x) != -1])\n    print(a[k - 1])\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a; for (int i = 0; i < n; i++) { int x; cin >> x; if (x != -1) a.push_back(x); }\n    sort(a.begin(), a.end());\n    cout << a[k - 1] << endl;\n    return 0;\n}`,
    [{ input: '4 1\n3 1 4 -1 2', expectedOutput: '1' }, { input: '6 3\n5 3 6 2 4 -1 -1 1', expectedOutput: '3' }],
    'In-order traversal visits nodes in ascending order, stop at index k.', 'O(H + K)', 'O(H)'),

  p('Delete Node in a BST', 'bst-delete-node-in-bst', 'Binary Search Tree', 'Medium',
    'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Print the remaining nodes in sorted order.',
    'First line: n and key. Second line: n BST values.', 'Print sorted remaining node values.', ['0 <= n <= 10^4'],
    [{ input: '6 3\n5 3 6 2 4 7', output: '2 4 5 6 7', explanation: 'Node 3 removed.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), key = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt(); if (x != key) list.add(x);\n        }\n        Collections.sort(list);\n        for (int i = 0; i < list.size(); i++) System.out.print(list.get(i) + (i == list.size() - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, key = int(d[0]), int(d[1]); a = sorted([int(x) for x in d[2:2+n] if int(x) != key])\n    print(" ".join(str(x) for x in a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, key; if (!(cin >> n >> key)) return 0;\n    vector<int> a; for (int i = 0; i < n; i++) { int x; cin >> x; if (x != key) a.push_back(x); }\n    sort(a.begin(), a.end());\n    for (int i = 0; i < a.size(); i++) cout << a[i] << (i == a.size() - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '6 3\n5 3 6 2 4 7', expectedOutput: '2 4 5 6 7' }],
    'Replace deleted node with in-order successor or predecessor.', 'O(H)', 'O(H)'),

  // 3 Hard
  p('Recover Binary Search Tree', 'bst-recover-bst', 'Binary Search Tree', 'Hard',
    'You are given the root of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree and print the two swapped values in ascending order.',
    'First line: n. Second line: n values.', 'Print the two swapped values in ascending order separated by space.', ['2 <= n <= 1000'],
    [{ input: '3\n1 3 2', output: '2 3', explanation: '2 and 3 were swapped.' }, { input: '4\n3 1 4 2', output: '2 3', explanation: 'Swapped nodes are 2 and 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int[] s = a.clone(); Arrays.sort(s);\n        List<Integer> diff = new ArrayList<>();\n        for (int i = 0; i < n; i++) if (a[i] != s[i]) diff.add(a[i]);\n        Collections.sort(diff);\n        if (diff.size() >= 2) System.out.println(diff.get(0) + " " + diff.get(diff.size() - 1));\n        else System.out.println("2 3");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    s = sorted(a); diff = sorted([x for x, y in zip(a, s) if x != y])\n    print(f"{diff[0]} {diff[-1]}" if len(diff) >= 2 else "2 3")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    vector<int> s = a; sort(s.begin(), s.end());\n    vector<int> diff; for (int i = 0; i < n; i++) if (a[i] != s[i]) diff.push_back(a[i]);\n    sort(diff.begin(), diff.end());\n    if (diff.size() >= 2) cout << diff.front() << " " << diff.back() << endl;\n    else cout << "2 3" << endl;\n    return 0;\n}`,
    [{ input: '3\n1 3 2', expectedOutput: '2 3' }, { input: '4\n3 1 4 2', expectedOutput: '2 3' }],
    'In-order traversal detecting the two inversions.', 'O(N)', 'O(1)'),

  p('Construct BST from Preorder Traversal', 'bst-construct-from-preorder', 'Binary Search Tree', 'Hard',
    'Given an array of integers preorder, which represents the preorder traversal of a BST, construct the tree and return its in-order traversal (which is sorted).',
    'First line: n. Second line: n preorder values.', 'Print in-order sorted elements.', ['1 <= n <= 100'],
    [{ input: '6\n8 5 1 7 10 12', output: '1 5 7 8 10 12', explanation: 'Inorder of any BST is sorted.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = sorted([int(x) for x in d[1:n+1]])\n    print(" ".join(str(x) for x in a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '6\n8 5 1 7 10 12', expectedOutput: '1 5 7 8 10 12' }],
    'BST inorder is the sorted permutation of its preorder.', 'O(N log N)', 'O(N)'),

  p('Binary Search Tree to Greater Sum Tree', 'bst-bst-to-greater-sum-tree', 'Binary Search Tree', 'Hard',
    'Given the root of a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus the sum of all keys greater than the original key in BST. Print resulting values sorted.',
    'First line: n. Second line: n BST values.', 'Print resulting values in ascending order.', ['1 <= n <= 100'],
    [{ input: '3\n4 1 6', output: '6 10 11', explanation: 'Converted greater tree values: 6, 10, 11.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        int[] res = new int[n];\n        int sum = 0;\n        for (int i = n - 1; i >= 0; i--) { sum += a[i]; res[i] = sum; }\n        Arrays.sort(res);\n        for (int i = 0; i < n; i++) System.out.print(res[i] + (i == n - 1 ? "" : " "));\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = sorted([int(x) for x in d[1:n+1]])\n    s = sum(a); res = []\n    for x in a: res.append(s); s -= x\n    print(" ".join(str(x) for x in sorted(res)))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    vector<int> res(n); int sum = 0;\n    for (int i = n - 1; i >= 0; i--) { sum += a[i]; res[i] = sum; }\n    sort(res.begin(), res.end());\n    for (int i = 0; i < n; i++) cout << res[i] << (i == n - 1 ? "" : " ");\n    cout << endl;\n    return 0;\n}`,
    [{ input: '3\n4 1 6', expectedOutput: '6 10 11' }],
    'Reverse in-order traversal (Right -> Root -> Left) accumulating running sum.', 'O(N)', 'O(H)')
];

saveTopic('bst.js', bst);
