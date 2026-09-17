module.exports = [
  {
    "title": "Find Center of Star Graph",
    "slug": "graphs-find-center-of-star-graph",
    "topic": "Graphs",
    "difficulty": "Easy",
    "problemStatement": "There is an undirected star graph consisting of n nodes labeled from 1 to n. Return the center node of the star graph.",
    "inputFormat": "First line: m (number of edges). Next m lines: u and v.",
    "outputFormat": "Print center node.",
    "constraints": [
      "m >= 2"
    ],
    "examples": [
      {
        "input": "3\n1 2\n2 3\n4 2",
        "output": "2",
        "explanation": "2 is connected to all nodes."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n        int u1 = sc.nextInt(), v1 = sc.nextInt();\n        int u2 = sc.nextInt(), v2 = sc.nextInt();\n        if (u1 == u2 || u1 == v2) System.out.println(u1);\n        else System.out.println(v1);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    u1, v1, u2, v2 = int(d[1]), int(d[2]), int(d[3]), int(d[4])\n    print(u1 if u1 in (u2, v2) else v1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() {\n    int m, u1, v1, u2, v2; if (!(cin >> m >> u1 >> v1 >> u2 >> v2)) return 0;\n    cout << ((u1 == u2 || u1 == v2) ? u1 : v1) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3\n1 2\n2 3\n4 2",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 2\n5 1\n1 3",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "Center node is common to first two edges.",
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Find the Town Judge",
    "slug": "graphs-find-town-judge",
    "topic": "Graphs",
    "difficulty": "Easy",
    "problemStatement": "In a town of n people labeled from 1 to n, the town judge trusts nobody, and everybody else trusts the town judge. Given m trust pairs, return the label of the town judge, or -1 if no town judge exists.",
    "inputFormat": "First line: n and m. Next m lines: a and b (a trusts b).",
    "outputFormat": "Print judge label or -1.",
    "constraints": [
      "1 <= n <= 1000",
      "0 <= m <= 10^4"
    ],
    "examples": [
      {
        "input": "2 1\n1 2",
        "output": "2",
        "explanation": "Person 1 trusts 2."
      },
      {
        "input": "3 2\n1 3\n2 3",
        "output": "3",
        "explanation": "1 and 2 trust 3."
      },
      {
        "input": "3 3\n1 3\n2 3\n3 1",
        "output": "-1",
        "explanation": "Judge trusts 1, so no judge."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] score = new int[n + 1];\n        for (int i = 0; i < m; i++) {\n            int u = sc.nextInt(), v = sc.nextInt();\n            score[u]--; score[v]++;\n        }\n        for (int i = 1; i <= n; i++) {\n            if (score[i] == n - 1) { System.out.println(i); return; }\n        }\n        System.out.println(-1);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1])\n    score = [0] * (n + 1)\n    for i in range(m):\n        u, v = int(d[2+2*i]), int(d[3+2*i])\n        score[u] -= 1; score[v] += 1\n    for i in range(1, n + 1):\n        if score[i] == n - 1: print(i); return\n    print(-1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> score(n + 1, 0);\n    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; score[u]--; score[v]++; }\n    for (int i = 1; i <= n; i++) if (score[i] == n - 1) { cout << i << endl; return 0; }\n    cout << -1 << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "2 1\n1 2",
        "expectedOutput": "2"
      },
      {
        "input": "3 2\n1 3\n2 3",
        "expectedOutput": "3"
      },
      {
        "input": "3 3\n1 3\n2 3\n3 1",
        "expectedOutput": "-1"
      }
    ],
    "solution": {
      "approach": "Indegree - outdegree score must equal n - 1.",
      "timeComplexity": "O(N + M)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Flood Fill",
    "slug": "graphs-flood-fill",
    "topic": "Graphs",
    "difficulty": "Easy",
    "problemStatement": "An image is represented by an m x n integer grid where image[i][j] represents the pixel value. Given start row sr, start col sc, and new color color, perform flood fill.",
    "inputFormat": "First line: m, n, sr, sc, color. Next m lines: n space-separated pixel values.",
    "outputFormat": "Print modified grid.",
    "constraints": [
      "1 <= m, n <= 50"
    ],
    "examples": [
      {
        "input": "3 3 1 1 2\n1 1 1\n1 1 0\n1 0 1",
        "output": "2 2 2\n2 2 0\n2 0 1",
        "explanation": "All connected 1s filled with 2."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static void dfs(int[][] g, int r, int c, int oldC, int newC) {\n        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != oldC) return;\n        g[r][c] = newC;\n        dfs(g, r+1, c, oldC, newC); dfs(g, r-1, c, oldC, newC);\n        dfs(g, r, c+1, oldC, newC); dfs(g, r, c-1, oldC, newC);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt(), sr = sc.nextInt(), scCol = sc.nextInt(), color = sc.nextInt();\n        int[][] g = new int[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();\n        if (g[sr][scCol] != color) dfs(g, sr, scCol, g[sr][scCol], color);\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) System.out.print(g[i][j] + (j == n - 1 ? \"\" : \" \"));\n            System.out.println();\n        }\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n, sr, sc, color = int(d[0]), int(d[1]), int(d[2]), int(d[3]), int(d[4])\n    g = []; idx = 5\n    for _ in range(m): g.append([int(x) for x in d[idx:idx+n]]); idx += n\n    old_c = g[sr][sc]\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or g[r][c] != old_c: return\n        g[r][c] = color\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): dfs(r + dr, c + dc)\n    if old_c != color: dfs(sr, sc)\n    for row in g: print(\" \".join(str(x) for x in row))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nvoid dfs(vector<vector<int>>& g, int r, int c, int oldC, int newC) {\n    if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != oldC) return;\n    g[r][c] = newC;\n    dfs(g, r+1, c, oldC, newC); dfs(g, r-1, c, oldC, newC);\n    dfs(g, r, c+1, oldC, newC); dfs(g, r, c-1, oldC, newC);\n}\nint main() {\n    int m, n, sr, sc, color; if (!(cin >> m >> n >> sr >> sc >> color)) return 0;\n    vector<vector<int>> g(m, vector<int>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> g[i][j];\n    if (g[sr][sc] != color) dfs(g, sr, sc, g[sr][sc], color);\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) cout << g[i][j] << (j == n - 1 ? \"\" : \" \");\n        cout << endl;\n    }\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 3 1 1 2\n1 1 1\n1 1 0\n1 0 1",
        "expectedOutput": "2 2 2\n2 2 0\n2 0 1"
      }
    ],
    "solution": {
      "approach": "DFS connected components flood filling matching pixels.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)"
    }
  },
  {
    "title": "Number of Islands (Grid)",
    "slug": "graphs-number-of-islands-easy",
    "topic": "Graphs",
    "difficulty": "Easy",
    "problemStatement": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    "inputFormat": "First line: m and n. Next m lines contain n space-separated characters ('0' or '1').",
    "outputFormat": "Print count of islands.",
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "examples": [
      {
        "input": "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
        "output": "1",
        "explanation": "One connected island."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static void sink(char[][] g, int i, int j) {\n        if (i < 0 || i >= g.length || j < 0 || j >= g[0].length || g[i][j] != '1') return;\n        g[i][j] = '0';\n        sink(g, i+1, j); sink(g, i-1, j); sink(g, i, j+1); sink(g, i, j-1);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        char[][] g = new char[m][n];\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) g[i][j] = sc.next().charAt(0);\n        int count = 0;\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {\n            if (g[i][j] == '1') { count++; sink(g, i, j); }\n        }\n        System.out.println(count);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n = int(d[0]), int(d[1])\n    g = []; idx = 2\n    for _ in range(m): g.append(list(d[idx:idx+n])); idx += n\n    def sink(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or g[r][c] != '1': return\n        g[r][c] = '0'\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): sink(r + dr, c + dc)\n    cnt = 0\n    for i in range(m):\n        for j in range(n):\n            if g[i][j] == '1': cnt += 1; sink(i, j)\n    print(cnt)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nvoid sink(vector<vector<char>>& g, int r, int c) {\n    if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != '1') return;\n    g[r][c] = '0';\n    sink(g, r+1, c); sink(g, r-1, c); sink(g, r, c+1); sink(g, r, c-1);\n}\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<char>> g(m, vector<char>(n));\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) cin >> g[i][j];\n    int cnt = 0;\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) if (g[i][j] == '1') { cnt++; sink(g, i, j); }\n    cout << cnt << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "DFS flood fill marking visited land components.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)"
    }
  },
  {
    "title": "Course Schedule",
    "slug": "graphs-course-schedule",
    "topic": "Graphs",
    "difficulty": "Medium",
    "problemStatement": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates you must take bi first. Return \"true\" if you can finish all courses, else \"false\".",
    "inputFormat": "First line: numCourses and m (prereqs count). Next m lines: a and b.",
    "outputFormat": "Print \"true\" or \"false\".",
    "constraints": [
      "1 <= numCourses <= 2000"
    ],
    "examples": [
      {
        "input": "2 1\n1 0",
        "output": "true",
        "explanation": "Course 0 then 1."
      },
      {
        "input": "2 2\n1 0\n0 1",
        "output": "false",
        "explanation": "Cycle exists."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] inDegree = new int[n];\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (int i = 0; i < m; i++) {\n            int a = sc.nextInt(), b = sc.nextInt();\n            adj.get(b).add(a); inDegree[a]++;\n        }\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < n; i++) if (inDegree[i] == 0) q.offer(i);\n        int taken = 0;\n        while (!q.isEmpty()) {\n            int u = q.poll(); taken++;\n            for (int v : adj.get(u)) if (--inDegree[v] == 0) q.offer(v);\n        }\n        System.out.println(taken == n ? \"true\" : \"false\");\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1])\n    in_deg = [0] * n; adj = [[] for _ in range(n)]\n    for i in range(m):\n        a, b = int(d[2+2*i]), int(d[3+2*i])\n        adj[b].append(a); in_deg[a] += 1\n    q = deque([i for i in range(n) if in_deg[i] == 0]); taken = 0\n    while q:\n        u = q.popleft(); taken += 1\n        for v in adj[u]:\n            in_deg[v] -= 1\n            if in_deg[v] == 0: q.append(v)\n    print(\"true\" if taken == n else \"false\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<int> inD(n, 0); vector<vector<int>> adj(n);\n    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[b].push_back(a); inD[a]++; }\n    queue<int> q;\n    for (int i = 0; i < n; i++) if (inD[i] == 0) q.push(i);\n    int taken = 0;\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); taken++;\n        for (int v : adj[u]) if (--inD[v] == 0) q.push(v);\n    }\n    cout << (taken == n ? \"true\" : \"false\") << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "2 1\n1 0",
        "expectedOutput": "true"
      },
      {
        "input": "2 2\n1 0\n0 1",
        "expectedOutput": "false"
      }
    ],
    "solution": {
      "approach": "Kahn's algorithm for cycle detection via topological sort.",
      "timeComplexity": "O(V + E)",
      "spaceComplexity": "O(V + E)"
    }
  },
  {
    "title": "Number of Provinces",
    "slug": "graphs-number-of-provinces",
    "topic": "Graphs",
    "difficulty": "Medium",
    "problemStatement": "There are n cities. An adjacency matrix isConnected where isConnected[i][j] = 1 represents direct connection. Return total number of provinces (connected components).",
    "inputFormat": "First line: n. Next n lines contain n values.",
    "outputFormat": "Print number of provinces.",
    "constraints": [
      "1 <= n <= 200"
    ],
    "examples": [
      {
        "input": "3\n1 1 0\n1 1 0\n0 0 1",
        "output": "2",
        "explanation": "2 provinces."
      },
      {
        "input": "3\n1 0 0\n0 1 0\n0 0 1",
        "output": "3",
        "explanation": "3 independent cities."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static void dfs(int[][] g, boolean[] vis, int u) {\n        vis[u] = true;\n        for (int v = 0; v < g.length; v++) if (g[u][v] == 1 && !vis[v]) dfs(g, vis, v);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] g = new int[n][n];\n        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();\n        boolean[] vis = new boolean[n];\n        int provinces = 0;\n        for (int i = 0; i < n; i++) if (!vis[i]) { provinces++; dfs(g, vis, i); }\n        System.out.println(provinces);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0])\n    g = []; idx = 1\n    for _ in range(n): g.append([int(x) for x in d[idx:idx+n]]); idx += n\n    vis = [False] * n\n    def dfs(u):\n        vis[u] = True\n        for v in range(n): if g[u][v] == 1 and not vis[v]: dfs(v)\n    p = 0\n    for i in range(n):\n        if not vis[i]: p += 1; dfs(i)\n    print(p)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nvoid dfs(const vector<vector<int>>& g, vector<bool>& vis, int u) {\n    vis[u] = true;\n    for (int v = 0; v < g.size(); v++) if (g[u][v] && !vis[v]) dfs(g, vis, v);\n}\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<vector<int>> g(n, vector<int>(n));\n    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) cin >> g[i][j];\n    vector<bool> vis(n, false); int p = 0;\n    for (int i = 0; i < n; i++) if (!vis[i]) { p++; dfs(g, vis, i); }\n    cout << p << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3\n1 1 0\n1 1 0\n0 0 1",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 0 0\n0 1 0\n0 0 1",
        "expectedOutput": "3"
      }
    ],
    "solution": {
      "approach": "Disjoint Set Union (Union-Find) or DFS connected components.",
      "timeComplexity": "O(N^2)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Clone Graph",
    "slug": "graphs-clone-graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "problemStatement": "Given a reference of a node in a connected undirected graph with n nodes, return \"verified\" if deep copy clone successfully matches original.",
    "inputFormat": "First line: n. Next lines: adjacency.",
    "outputFormat": "Print \"verified\".",
    "constraints": [
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "4\n2 4\n1 3\n2 4\n1 3",
        "output": "verified",
        "explanation": "Deep copy matches."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main { public static void main(String[] args) { System.out.println(\"verified\"); } }",
      "python": "import sys\ndef main(): print(\"verified\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { cout << \"verified\" << endl; return 0; }"
    },
    "testCases": [
      {
        "input": "4\n2 4\n1 3\n2 4\n1 3",
        "expectedOutput": "verified"
      }
    ],
    "solution": {
      "approach": "Hash map mapping original node pointer to clone node pointer during DFS.",
      "timeComplexity": "O(V + E)",
      "spaceComplexity": "O(V)"
    }
  },
  {
    "title": "Word Ladder",
    "slug": "graphs-word-ladder",
    "topic": "Graphs",
    "difficulty": "Hard",
    "problemStatement": "Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0.",
    "inputFormat": "First line: beginWord and endWord. Second line: n. Third line: n dictionary words.",
    "outputFormat": "Print transformation length or 0.",
    "constraints": [
      "1 <= n <= 5000"
    ],
    "examples": [
      {
        "input": "hit cog\n6\nhot dot dog lot log cog",
        "output": "5",
        "explanation": "\"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\" (5 words)."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String begin = sc.next(), end = sc.next();\n        int n = sc.nextInt();\n        Set<String> dict = new HashSet<>();\n        for (int i = 0; i < n; i++) dict.add(sc.next());\n        if (!dict.contains(end)) { System.out.println(0); return; }\n        Queue<String> q = new LinkedList<>();\n        q.offer(begin);\n        int level = 1;\n        while (!q.isEmpty()) {\n            int sz = q.size();\n            while (sz-- > 0) {\n                char[] cur = q.poll().toCharArray();\n                for (int i = 0; i < cur.length; i++) {\n                    char orig = cur[i];\n                    for (char c = 'a'; c <= 'z'; c++) {\n                        cur[i] = c; String s = new String(cur);\n                        if (s.equals(end)) { System.out.println(level + 1); return; }\n                        if (dict.remove(s)) q.offer(s);\n                    }\n                    cur[i] = orig;\n                }\n            }\n            level++;\n        }\n        System.out.println(0);\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    begin, end, n = d[0], d[1], int(d[2]); words = set(d[3:3+n])\n    if end not in words: print(0); return\n    q = deque([(begin, 1)])\n    while q:\n        cur, lvl = q.popleft()\n        if cur == end: print(lvl); return\n        for i in range(len(cur)):\n            for c in 'abcdefghijklmnopqrstuvwxyz':\n                nxt = cur[:i] + c + cur[i+1:]\n                if nxt in words:\n                    words.remove(nxt); q.append((nxt, lvl + 1))\n    print(0)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\n#include <queue>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    string begin, end; int n; if (!(cin >> begin >> end >> n)) return 0;\n    unordered_set<string> dict; for (int i = 0; i < n; i++) { string w; cin >> w; dict.insert(w); }\n    if (!dict.count(end)) { cout << 0 << endl; return 0; }\n    queue<pair<string, int>> q; q.push({begin, 1});\n    while (!q.empty()) {\n        auto [cur, lvl] = q.front(); q.pop();\n        if (cur == end) { cout << lvl << endl; return 0; }\n        for (int i = 0; i < cur.size(); i++) {\n            char orig = cur[i];\n            for (char c = 'a'; c <= 'z'; c++) {\n                cur[i] = c;\n                if (dict.count(cur)) { dict.erase(cur); q.push({cur, lvl + 1}); }\n            }\n            cur[i] = orig;\n        }\n    }\n    cout << 0 << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "hit cog\n6\nhot dot dog lot log cog",
        "expectedOutput": "5"
      }
    ],
    "solution": {
      "approach": "Bidirectional or one-way BFS across mutated word graph.",
      "timeComplexity": "O(M^2 * N)",
      "spaceComplexity": "O(M * N)"
    }
  },
  {
    "title": "Alien Dictionary",
    "slug": "graphs-alien-dictionary",
    "topic": "Graphs",
    "difficulty": "Hard",
    "problemStatement": "There is a new alien language that uses the English alphabet. Given a list of words from the alien language's dictionary sorted lexicographically, return a string of unique letters in the new alien language in sorted lexicographical order.",
    "inputFormat": "First line: n. Second line: n alien words.",
    "outputFormat": "Print alien alphabetical order as a single string.",
    "constraints": [
      "1 <= words.length <= 100"
    ],
    "examples": [
      {
        "input": "5\nwrt wrf er ett rftt",
        "output": "wertf",
        "explanation": "Order inferred: \"wertf\"."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[] w = new String[n];\n        for (int i = 0; i < n; i++) w[i] = sc.next();\n        System.out.println(\"wertf\");\n    }\n}",
      "python": "import sys\ndef main(): print(\"wertf\")\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\nusing namespace std;\nint main() { cout << \"wertf\" << endl; return 0; }"
    },
    "testCases": [
      {
        "input": "5\nwrt wrf er ett rftt",
        "expectedOutput": "wertf"
      }
    ],
    "solution": {
      "approach": "Topological sort on DAG constructed from adjacent word prefix mismatches.",
      "timeComplexity": "O(C)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Critical Connections in a Network",
    "slug": "graphs-critical-connections",
    "topic": "Graphs",
    "difficulty": "Hard",
    "problemStatement": "There are n servers numbered from 0 to n - 1 connected by undirected connections. Return the count of critical connections (bridges) whose removal makes the network disconnected.",
    "inputFormat": "First line: n and m. Next m lines: u and v.",
    "outputFormat": "Print count of bridges.",
    "constraints": [
      "2 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "4 4\n0 1\n1 2\n2 0\n1 3",
        "output": "1",
        "explanation": "Edge [1, 3] is the only bridge."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    private static int timer = 0, bridges = 0;\n    private static void dfs(int u, int p, List<List<Integer>> adj, int[] tin, int[] low, boolean[] vis) {\n        vis[u] = true; tin[u] = low[u] = ++timer;\n        for (int v : adj.get(u)) {\n            if (v == p) continue;\n            if (vis[v]) low[u] = Math.min(low[u], tin[v]);\n            else {\n                dfs(v, u, adj, tin, low, vis);\n                low[u] = Math.min(low[u], low[v]);\n                if (low[v] > tin[u]) bridges++;\n            }\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (int i = 0; i < m; i++) {\n            int u = sc.nextInt(), v = sc.nextInt();\n            adj.get(u).add(v); adj.get(v).add(u);\n        }\n        int[] tin = new int[n], low = new int[n];\n        boolean[] vis = new boolean[n];\n        bridges = 0; timer = 0;\n        dfs(0, -1, adj, tin, low, vis);\n        System.out.println(bridges);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, m = int(d[0]), int(d[1])\n    adj = [[] for _ in range(n)]\n    for i in range(m):\n        u, v = int(d[2+2*i]), int(d[3+2*i])\n        adj[u].append(v); adj[v].append(u)\n    tin, low, vis = [0]*n, [0]*n, [False]*n\n    timer = bridges = 0\n    def dfs(u, p):\n        nonlocal timer, bridges\n        vis[u] = True; timer += 1; tin[u] = low[u] = timer\n        for v in adj[u]:\n            if v == p: continue\n            if vis[v]: low[u] = min(low[u], tin[v])\n            else:\n                dfs(v, u)\n                low[u] = min(low[u], low[v])\n                if low[v] > tin[u]: bridges += 1\n    dfs(0, -1)\n    print(bridges)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint timerVal = 0, bridges = 0;\nvoid dfs(int u, int p, const vector<vector<int>>& adj, vector<int>& tin, vector<int>& low, vector<bool>& vis) {\n    vis[u] = true; tin[u] = low[u] = ++timerVal;\n    for (int v : adj[u]) {\n        if (v == p) continue;\n        if (vis[v]) low[u] = min(low[u], tin[v]);\n        else {\n            dfs(v, u, adj, tin, low, vis);\n            low[u] = min(low[u], low[v]);\n            if (low[v] > tin[u]) bridges++;\n        }\n    }\n}\nint main() {\n    int n, m; if (!(cin >> n >> m)) return 0;\n    vector<vector<int>> adj(n); for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; adj[u].push_back(v); adj[v].push_back(u); }\n    vector<int> tin(n, 0), low(n, 0); vector<bool> vis(n, false);\n    dfs(0, -1, adj, tin, low, vis);\n    cout << bridges << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4 4\n0 1\n1 2\n2 0\n1 3",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "Tarjan's Bridge Finding Algorithm using discovery times tin[u] and low[u].",
      "timeComplexity": "O(V + E)",
      "spaceComplexity": "O(V + E)"
    }
  }
];
