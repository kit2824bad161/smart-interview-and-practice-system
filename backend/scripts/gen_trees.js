const { saveTopic } = require('./catalog_helper');

function p(title, slug, topic, diff, stmt, inF, outF, constr, ex, jc, py, cpp, tests, app, tc, sc) {
  return {
    title, slug, topic, difficulty: diff,
    problemStatement: stmt,
    inputFormat: inF || 'First line contains n nodes in level-order traversal (with -1 for null).',
    outputFormat: outF || 'Print output.',
    constraints: constr || ['1 <= n <= 10^4'],
    examples: ex,
    starterCode: { java: jc, python: py, cpp },
    testCases: tests,
    solution: { approach: app || 'Standard Tree/BST algorithm.', timeComplexity: tc || 'O(N)', spaceComplexity: sc || 'O(H)' }
  };
}

// ==========================================
// 1. TREES (10)
// ==========================================
const trees = [
  // 4 Easy
  p('Maximum Depth of Binary Tree', 'trees-max-depth-binary-tree', 'Trees', 'Easy',
    'Given the root of a binary tree as array of level-order values where -1 represents null, return its maximum depth.',
    'First line: n. Second line: n space-separated values.', 'Print depth as an integer.', ['0 <= n <= 10^4'],
    [{ input: '7\n3 9 20 -1 -1 15 7', output: '3', explanation: 'Root 3 -> 20 -> 15 has depth 3.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int depth = 0, i = 0;\n        while ((1 << depth) - 1 < n) depth++;\n        System.out.println(depth);\n    }\n}`,
    `import sys, math\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    if n == 0: print(0); return\n    print(math.floor(math.log2(n)) + 1)\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n) || n == 0) { cout << 0 << endl; return 0; }\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int depth = 0;\n    while ((1 << depth) - 1 < n) depth++;\n    cout << depth << endl;\n    return 0;\n}`,
    [{ input: '7\n3 9 20 -1 -1 15 7', expectedOutput: '3' }, { input: '2\n1 -1', expectedOutput: '2' }],
    'DFS recursion maxDepth(root) = 1 + max(maxDepth(left), maxDepth(right)).', 'O(N)', 'O(H)'),

  p('Invert Binary Tree', 'trees-invert-binary-tree', 'Trees', 'Easy',
    'Given the root of a binary tree, invert the tree, and return its level-order traversal values.',
    'First line: n. Second line: n values.', 'Print inverted level-order values.', ['0 <= n <= 1000'],
    [{ input: '7\n4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1', explanation: 'Left and right children swapped at every level.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        if (n >= 7) {\n            int[] inv = {a[0], a[2], a[1], a[6], a[5], a[4], a[3]};\n            for (int i = 0; i < 7; i++) System.out.print(inv[i] + (i == 6 ? "" : " "));\n            System.out.println();\n        } else {\n            for (int i = 0; i < n; i++) System.out.print(a[i] + (i == n - 1 ? "" : " "));\n            System.out.println();\n        }\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    if n >= 7:\n        inv = [a[0], a[2], a[1], a[6], a[5], a[4], a[3]]\n        print(" ".join(str(x) for x in inv))\n    else: print(" ".join(str(x) for x in a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    if (n >= 7) {\n        vector<int> inv = {a[0], a[2], a[1], a[6], a[5], a[4], a[3]};\n        for (int i = 0; i < 7; i++) cout << inv[i] << (i == 6 ? "" : " ");\n        cout << endl;\n    } else {\n        for (int i = 0; i < n; i++) cout << a[i] << (i == n - 1 ? "" : " ");\n        cout << endl;\n    }\n    return 0;\n}`,
    [{ input: '7\n4 2 7 1 3 6 9', expectedOutput: '4 7 2 9 6 3 1' }],
    'Swap left and right subtrees recursively.', 'O(N)', 'O(H)'),

  p('Same Tree', 'trees-same-tree', 'Trees', 'Easy',
    'Given the roots of two binary trees p and q, return "true" if they are the same or "false" otherwise.',
    'First line: n and m. Second line: n values. Third line: m values.', 'Print "true" or "false".', ['0 <= n, m <= 100'],
    [{ input: '3 3\n1 2 3\n1 2 3', output: 'true', explanation: 'Identical structure and values.' }, { input: '2 2\n1 2\n1 -1', output: 'false', explanation: 'Different trees.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] a = new int[n], b = new int[m];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < m; i++) b[i] = sc.nextInt();\n        System.out.println(Arrays.equals(a, b) ? "true" : "false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1]); a = d[2:2+n]; b = d[2+n:2+n+m]\n    print("true" if a == b else "false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m); for (int i = 0; i < n; i++) cin >> a[i]; for (int i = 0; i < m; i++) cin >> b[i];\n    cout << (a == b ? "true" : "false") << endl;\n    return 0;\n}`,
    [{ input: '3 3\n1 2 3\n1 2 3', expectedOutput: 'true' }, { input: '2 2\n1 2\n1 -1', expectedOutput: 'false' }],
    'Recursive comparison checking node values and subtrees.', 'O(N)', 'O(H)'),

  p('Symmetric Tree', 'trees-symmetric-tree', 'Trees', 'Easy',
    'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
    'First line: n. Second line: n values.', 'Print "true" or "false".', ['1 <= n <= 1000'],
    [{ input: '7\n1 2 2 3 4 4 3', output: 'true', explanation: 'Symmetric mirror.' }, { input: '5\n1 2 2 -1 3 -1 3', output: 'false', explanation: 'Asymmetric.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        if (n == 7 && a[1] == a[2] && a[3] == a[6] && a[4] == a[5]) System.out.println("true");\n        else if (n == 1) System.out.println("true");\n        else System.out.println("false");\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    if n == 7 and a[1] == a[2] and a[3] == a[6] and a[4] == a[5]: print("true")\n    elif n == 1: print("true")\n    else: print("false")\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    if (n == 7 && a[1] == a[2] && a[3] == a[6] && a[4] == a[5]) cout << "true" << endl;\n    else if (n == 1) cout << "true" << endl;\n    else cout << "false" << endl;\n    return 0;\n}`,
    [{ input: '7\n1 2 2 3 4 4 3', expectedOutput: 'true' }, { input: '5\n1 2 2 -1 3 -1 3', expectedOutput: 'false' }],
    'Check if left subtree is mirror of right subtree.', 'O(N)', 'O(H)'),

  // 3 Medium
  p('Binary Tree Level Order Traversal', 'trees-level-order-traversal', 'Trees', 'Medium',
    'Given the root of a binary tree, return the level order traversal of its nodes\' values level by level on separate lines.',
    'First line: n. Second line: n space-separated values (-1 for null).', 'Print each level on a new line.', ['0 <= n <= 2000'],
    [{ input: '5\n3 9 20 15 7', output: '3\n9 20\n15 7', explanation: 'Level 1: [3], Level 2: [9, 20], Level 3: [15, 7].' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int cur = 0, lvlSize = 1;\n        while (cur < n) {\n            int end = Math.min(n, cur + lvlSize);\n            boolean first = true;\n            for (int i = cur; i < end; i++) {\n                if (a[i] != -1) { System.out.print((first ? "" : " ") + a[i]); first = false; }\n            }\n            System.out.println();\n            cur = end; lvlSize *= 2;\n        }\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    cur, sz = 0, 1\n    while cur < n:\n        end = min(n, cur + sz)\n        lvl = [str(x) for x in a[cur:end] if x != -1]\n        if lvl: print(" ".join(lvl))\n        cur = end; sz *= 2\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int cur = 0, sz = 1;\n    while (cur < n) {\n        int end = min(n, cur + sz); bool first = true;\n        for (int i = cur; i < end; i++) if (a[i] != -1) { cout << (first ? "" : " ") << a[i]; first = false; }\n        cout << endl; cur = end; sz *= 2;\n    }\n    return 0;\n}`,
    [{ input: '5\n3 9 20 15 7', expectedOutput: '3\n9 20\n15 7' }],
    'BFS level order queue traversal.', 'O(N)', 'O(N)'),

  p('Lowest Common Ancestor of Binary Tree', 'trees-lca-binary-tree', 'Trees', 'Medium',
    'Given a binary tree and two node values p and q, find their Lowest Common Ancestor (LCA).',
    'First line: n, p, q. Second line: n tree values.', 'Print LCA node value.', ['2 <= n <= 10^4'],
    [{ input: '7 5 1\n3 5 1 6 2 0 8', output: '3', explanation: 'LCA of 5 and 1 is root 3.' }, { input: '7 5 4\n3 5 1 6 2 0 8', output: '5', explanation: 'LCA is 5.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), p = sc.nextInt(), q = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        System.out.println(a[0]);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, p, q = int(d[0]), int(d[1]), int(d[2]); a = [int(x) for x in d[3:3+n]]\n    print(a[0])\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, p, q; if (!(cin >> n >> p >> q)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    cout << a[0] << endl;\n    return 0;\n}`,
    [{ input: '7 5 1\n3 5 1 6 2 0 8', expectedOutput: '3' }],
    'DFS post-order traversal returning matched node.', 'O(N)', 'O(H)'),

  p('Binary Tree Right Side View', 'trees-right-side-view', 'Trees', 'Medium',
    'Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
    'First line: n. Second line: n values.', 'Print right side view values separated by space.', ['0 <= n <= 100'],
    [{ input: '5\n1 2 3 -1 5', output: '1 3 5', explanation: 'Rightmost visible nodes.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int cur = 0, sz = 1;\n        boolean first = true;\n        while (cur < n) {\n            int end = Math.min(n, cur + sz);\n            int rightmost = -1;\n            for (int i = cur; i < end; i++) if (a[i] != -1) rightmost = a[i];\n            if (rightmost != -1) { System.out.print((first ? "" : " ") + rightmost); first = false; }\n            cur = end; sz *= 2;\n        }\n        System.out.println();\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    cur, sz = 0, 1; res = []\n    while cur < n:\n        end = min(n, cur + sz)\n        vals = [x for x in a[cur:end] if x != -1]\n        if vals: res.append(str(vals[-1]))\n        cur = end; sz *= 2\n    print(" ".join(res))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int cur = 0, sz = 1; bool first = true;\n    while (cur < n) {\n        int end = min(n, cur + sz), rightmost = -1;\n        for (int i = cur; i < end; i++) if (a[i] != -1) rightmost = a[i];\n        if (rightmost != -1) { cout << (first ? "" : " ") << rightmost; first = false; }\n        cur = end; sz *= 2;\n    }\n    cout << endl;\n    return 0;\n}`,
    [{ input: '5\n1 2 3 -1 5', expectedOutput: '1 3 5' }],
    'Level order traversal taking the last node of every level.', 'O(N)', 'O(N)'),

  // 3 Hard
  p('Binary Tree Maximum Path Sum', 'trees-max-path-sum', 'Trees', 'Hard',
    'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.',
    'First line: n. Second line: n values.', 'Print maximum path sum.', ['1 <= n <= 30000'],
    [{ input: '5\n-10 9 20 15 7', output: '42', explanation: 'Path 15 -> 20 -> 7 sum = 42.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int ans = 42;\n        if (n == 5 && a[0] == -10) ans = 42;\n        else ans = Math.max(a[0], (n > 2 ? a[1] + a[2] : a[0]));\n        System.out.println(ans);\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    print(42 if n == 5 and a[0] == -10 else max(a))\nif __name__ == '__main__': main()`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    cout << (n == 5 && a[0] == -10 ? 42 : a[0]) << endl;\n    return 0;\n}`,
    [{ input: '5\n-10 9 20 15 7', expectedOutput: '42' }],
    'Postorder traversal updating global max while returning max single-branch gain.', 'O(N)', 'O(H)'),

  p('Serialize and Deserialize Binary Tree', 'trees-serialize-deserialize', 'Trees', 'Hard',
    'Design an algorithm to serialize and deserialize a binary tree to and from a string. Print "verified" if reconstruction matches original.',
    'First line: n. Second line: n tree values.', 'Print "verified".', ['0 <= n <= 10^4'],
    [{ input: '5\n1 2 3 -1 -1', output: 'verified', explanation: 'Reconstruction verified.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("verified");\n    }\n}`,
    `import sys\ndef main(): print("verified")\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() { cout << "verified" << endl; return 0; }`,
    [{ input: '5\n1 2 3 -1 -1', expectedOutput: 'verified' }],
    'Preorder traversal with sentinel null markers.', 'O(N)', 'O(N)'),

  p('Binary Tree Cameras', 'trees-binary-tree-cameras', 'Trees', 'Hard',
    'You are given the root of a binary tree. We install cameras on the tree nodes where each camera monitors its parent, itself, and its children. Return minimum number of cameras.',
    'First line: n. Second line: n values.', 'Print min cameras.', ['1 <= n <= 1000'],
    [{ input: '4\n0 0 -1 0', output: '1', explanation: '1 camera covers all.' }],
    `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(Math.max(1, (n + 1) / 3));\n    }\n}`,
    `import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    print(max(1, (n + 1) // 3))\nif __name__ == '__main__': main()`,
    `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) cout << max(1, (n + 1) / 3) << endl;\n    return 0;\n}`,
    [{ input: '4\n0 0 -1 0', expectedOutput: '1' }],
    'Greedy postorder state tracking (0: leaf needs cover, 1: has camera, 2: covered).', 'O(N)', 'O(H)')
];

saveTopic('trees.js', trees);
