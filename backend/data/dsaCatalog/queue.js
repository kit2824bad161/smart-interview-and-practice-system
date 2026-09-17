module.exports = [
  {
    "title": "Implement Stack using Queues",
    "slug": "queue-implement-stack-using-queues",
    "topic": "Queue",
    "difficulty": "Easy",
    "problemStatement": "Implement a last-in-first-out (LIFO) stack using only standard FIFO queues. Given q operations: 1 x (push x), 2 (pop and print value), 3 (print top).",
    "inputFormat": "First line: q. Next q lines: operation.",
    "outputFormat": "Print results for ops 2 and 3.",
    "constraints": [
      "1 <= q <= 1000"
    ],
    "examples": [
      {
        "input": "4\n1 1\n1 2\n3\n2",
        "output": "2\n2",
        "explanation": "Top is 2, popped 2."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int q = sc.nextInt();\n        Queue<Integer> qu = new LinkedList<>();\n        while (q-- > 0) {\n            int t = sc.nextInt();\n            if (t == 1) {\n                int x = sc.nextInt(); qu.offer(x);\n                for (int i = 0; i < qu.size() - 1; i++) qu.offer(qu.poll());\n            } else if (t == 2) System.out.println(qu.poll());\n            else System.out.println(qu.peek());\n        }\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    q = int(d[0]); idx = 1; qu = deque()\n    for _ in range(q):\n        t = int(d[idx]); idx += 1\n        if t == 1:\n            x = int(d[idx]); idx += 1; qu.append(x)\n            for _ in range(len(qu) - 1): qu.append(qu.popleft())\n        elif t == 2: print(qu.popleft())\n        else: print(qu[0])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    int q; if (!(cin >> q)) return 0;\n    queue<int> qu;\n    while (q--) {\n        int t; cin >> t;\n        if (t == 1) {\n            int x; cin >> x; qu.push(x);\n            for (int i = 0; i < (int)qu.size() - 1; i++) { qu.push(qu.front()); qu.pop(); }\n        } else if (t == 2) { cout << qu.front() << endl; qu.pop(); }\n        else cout << qu.front() << endl;\n    }\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n1 1\n1 2\n3\n2",
        "expectedOutput": "2\n2"
      }
    ],
    "solution": {
      "approach": "Rotate queue on push so newest element is at front.",
      "timeComplexity": "O(N) push, O(1) pop",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Number of Recent Calls",
    "slug": "queue-number-of-recent-calls",
    "topic": "Queue",
    "difficulty": "Easy",
    "problemStatement": "Count the number of recent requests within a certain time frame [t - 3000, t]. Given n timestamps in strictly increasing order, return count of recent requests for each call.",
    "inputFormat": "First line: n. Next n lines: t.",
    "outputFormat": "Print count for each call.",
    "constraints": [
      "1 <= n <= 10^4"
    ],
    "examples": [
      {
        "input": "4\n1\n100\n3001\n3002",
        "output": "1\n2\n3\n3",
        "explanation": "Calls within 3000ms."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 0; i < n; i++) {\n            int t = sc.nextInt(); q.offer(t);\n            while (q.peek() < t - 3000) q.poll();\n            System.out.println(q.size());\n        }\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); ts = [int(x) for x in d[1:n+1]]\n    q = deque()\n    for t in ts:\n        q.append(t)\n        while q[0] < t - 3000: q.popleft()\n        print(len(q))\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    queue<int> q;\n    for (int i = 0; i < n; i++) {\n        int t; cin >> t; q.push(t);\n        while (q.front() < t - 3000) q.pop();\n        cout << q.size() << endl;\n    }\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "4\n1\n100\n3001\n3002",
        "expectedOutput": "1\n2\n3\n3"
      }
    ],
    "solution": {
      "approach": "Sliding window queue dropping expired timestamps.",
      "timeComplexity": "O(1) amortized",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "First Unique Character in a String",
    "slug": "queue-first-unique-character",
    "topic": "Queue",
    "difficulty": "Easy",
    "problemStatement": "Given a string s, find the first non-repeating character in it and return its 0-based index. If it does not exist, return -1.",
    "inputFormat": "A single string s.",
    "outputFormat": "Print index or -1.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "examples": [
      {
        "input": "leetcode",
        "output": "0",
        "explanation": "\"l\" is at index 0 and unique."
      },
      {
        "input": "loveleetcode",
        "output": "2",
        "explanation": "\"v\" is at index 2."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : \"\";\n        int[] count = new int[26];\n        for (char c : s.toCharArray()) count[c - 'a']++;\n        for (int i = 0; i < s.length(); i++) {\n            if (count[s.charAt(i) - 'a'] == 1) { System.out.println(i); return; }\n        }\n        System.out.println(-1);\n    }\n}",
      "python": "import sys\nfrom collections import Counter\ndef main():\n    s = sys.stdin.read().strip()\n    c = Counter(s)\n    for i, ch in enumerate(s):\n        if c[ch] == 1: print(i); return\n    print(-1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    vector<int> count(26, 0);\n    for (char c : s) count[c - 'a']++;\n    for (int i = 0; i < s.size(); i++) if (count[s[i] - 'a'] == 1) { cout << i << endl; return 0; }\n    cout << -1 << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "leetcode",
        "expectedOutput": "0"
      },
      {
        "input": "aabb",
        "expectedOutput": "-1"
      }
    ],
    "solution": {
      "approach": "Two-pass frequency array or queue tracking uniquely seen characters.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Time Needed to Buy Tickets",
    "slug": "queue-time-needed-to-buy-tickets",
    "topic": "Queue",
    "difficulty": "Easy",
    "problemStatement": "There are n people in a line queueing to buy tickets, where tickets[i] is the number of tickets the ith person wants to buy. Each ticket purchase takes 1 second. Return the time taken for person at index k to finish buying all tickets.",
    "inputFormat": "First line: n and k. Second line: n ticket requests.",
    "outputFormat": "Print seconds taken.",
    "constraints": [
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "3 2\n2 3 2",
        "output": "6",
        "explanation": "Person at index 2 buys 2 tickets in 6 seconds."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int time = 0;\n        for (int i = 0; i < n; i++) time += Math.min(a[i], i <= k ? a[k] : a[k] - 1);\n        System.out.println(time);\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    time = sum(min(a[i], a[k] if i <= k else a[k] - 1) for i in range(n))\n    print(time)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n); for (int i = 0; i < n; i++) cin >> a[i];\n    int t = 0;\n    for (int i = 0; i < n; i++) t += min(a[i], i <= k ? a[k] : a[k] - 1);\n    cout << t << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 2\n2 3 2",
        "expectedOutput": "6"
      },
      {
        "input": "4 0\n5 1 1 1",
        "expectedOutput": "8"
      }
    ],
    "solution": {
      "approach": "Mathematical sum based on person k position in round-robin queue.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(1)"
    }
  },
  {
    "title": "Design Circular Queue",
    "slug": "queue-design-circular-queue",
    "topic": "Queue",
    "difficulty": "Medium",
    "problemStatement": "Design your implementation of the circular queue. Given capacity k and q operations: 1 x (enQueue, prints true/false), 2 (deQueue, prints true/false), 3 (print Front or -1), 4 (print Rear or -1).",
    "inputFormat": "First line: k and q. Next q lines: op.",
    "outputFormat": "Print outputs.",
    "constraints": [
      "1 <= k <= 1000"
    ],
    "examples": [
      {
        "input": "3 6\n1 1\n1 2\n1 3\n1 4\n4\n2",
        "output": "true\ntrue\ntrue\nfalse\n3\ntrue",
        "explanation": "enQueue 1-3 true, 4 false (full), Rear 3, deQueue true."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int k = sc.nextInt(), q = sc.nextInt();\n        int[] qArr = new int[k];\n        int head = 0, tail = -1, size = 0;\n        while (q-- > 0) {\n            int t = sc.nextInt();\n            if (t == 1) {\n                int v = sc.nextInt();\n                if (size == k) System.out.println(\"false\");\n                else { tail = (tail + 1) % k; qArr[tail] = v; size++; System.out.println(\"true\"); }\n            } else if (t == 2) {\n                if (size == 0) System.out.println(\"false\");\n                else { head = (head + 1) % k; size--; System.out.println(\"true\"); }\n            } else if (t == 3) System.out.println(size == 0 ? -1 : qArr[head]);\n            else System.out.println(size == 0 ? -1 : qArr[tail]);\n        }\n    }\n}",
      "python": "import sys\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    k, q = int(d[0]), int(d[1]); idx = 2\n    arr = [0] * k; head, tail, size = 0, -1, 0\n    for _ in range(q):\n        t = int(d[idx]); idx += 1\n        if t == 1:\n            v = int(d[idx]); idx += 1\n            if size == k: print(\"false\")\n            else: tail = (tail + 1) % k; arr[tail] = v; size += 1; print(\"true\")\n        elif t == 2:\n            if size == 0: print(\"false\")\n            else: head = (head + 1) % k; size -= 1; print(\"true\")\n        elif t == 3: print(-1 if size == 0 else arr[head])\n        else: print(-1 if size == 0 else arr[tail])\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int k, q; if (!(cin >> k >> q)) return 0;\n    vector<int> arr(k); int head = 0, tail = -1, size = 0;\n    while (q--) {\n        int t; cin >> t;\n        if (t == 1) {\n            int v; cin >> v;\n            if (size == k) cout << \"false\" << endl;\n            else { tail = (tail + 1) % k; arr[tail] = v; size++; cout << \"true\" << endl; }\n        } else if (t == 2) {\n            if (size == 0) cout << \"false\" << endl;\n            else { head = (head + 1) % k; size--; cout << \"true\" << endl; }\n        } else if (t == 3) cout << (size == 0 ? -1 : arr[head]) << endl;\n        else cout << (size == 0 ? -1 : arr[tail]) << endl;\n    }\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 6\n1 1\n1 2\n1 3\n1 4\n4\n2",
        "expectedOutput": "true\ntrue\ntrue\nfalse\n3\ntrue"
      }
    ],
    "solution": {
      "approach": "Array with head, tail, and modulo arithmetic.",
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(K)"
    }
  },
  {
    "title": "Rotten Oranges",
    "slug": "queue-rotten-oranges",
    "topic": "Queue",
    "difficulty": "Medium",
    "problemStatement": "You are given an m x n grid where 0 is empty, 1 is fresh orange, and 2 is rotten orange. Every minute, 4-directionally adjacent fresh oranges become rotten. Return minimum minutes until no fresh orange remains, or -1.",
    "inputFormat": "First line: m and n. Next m lines: n integers.",
    "outputFormat": "Print minutes or -1.",
    "constraints": [
      "1 <= m, n <= 10"
    ],
    "examples": [
      {
        "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
        "output": "4",
        "explanation": "All oranges rot in 4 minutes."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt(), n = sc.nextInt();\n        int[][] g = new int[m][n];\n        Queue<int[]> q = new LinkedList<>();\n        int fresh = 0;\n        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {\n            g[i][j] = sc.nextInt();\n            if (g[i][j] == 2) q.offer(new int[]{i, j});\n            else if (g[i][j] == 1) fresh++;\n        }\n        if (fresh == 0) { System.out.println(0); return; }\n        int mins = 0, dirs[][] = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!q.isEmpty()) {\n            int sz = q.size(); boolean rotted = false;\n            for (int k = 0; k < sz; k++) {\n                int[] cur = q.poll();\n                for (int[] d : dirs) {\n                    int ni = cur[0] + d[0], nj = cur[1] + d[1];\n                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && g[ni][nj] == 1) {\n                        g[ni][nj] = 2; fresh--; q.offer(new int[]{ni, nj}); rotted = true;\n                    }\n                }\n            }\n            if (rotted) mins++;\n        }\n        System.out.println(fresh == 0 ? mins : -1);\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    m, n = int(d[0]), int(d[1])\n    g = []; q = deque(); fresh = 0; idx = 2\n    for i in range(m):\n        row = [int(x) for x in d[idx:idx+n]]; idx += n; g.append(row)\n        for j in range(n):\n            if row[j] == 2: q.append((i, j))\n            elif row[j] == 1: fresh += 1\n    if fresh == 0: print(0); return\n    mins = 0\n    while q:\n        sz = len(q); rotted = False\n        for _ in range(sz):\n            r, c = q.popleft()\n            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and g[nr][nc] == 1:\n                    g[nr][nc] = 2; fresh -= 1; q.append((nr, nc)); rotted = True\n        if rotted: mins += 1\n    print(mins if fresh == 0 else -1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> g(m, vector<int>(n)); queue<pair<int, int>> q;\n    int fresh = 0;\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {\n        cin >> g[i][j];\n        if (g[i][j] == 2) q.push({i, j});\n        else if (g[i][j] == 1) fresh++;\n    }\n    if (fresh == 0) { cout << 0 << endl; return 0; }\n    int mins = 0, dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};\n    while (!q.empty()) {\n        int sz = q.size(); bool rotted = false;\n        while (sz--) {\n            auto [r, c] = q.front(); q.pop();\n            for (int d = 0; d < 4; d++) {\n                int nr = r + dr[d], nc = c + dc[d];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] == 1) {\n                    g[nr][nc] = 2; fresh--; q.push({nr, nc}); rotted = true;\n                }\n            }\n        }\n        if (rotted) mins++;\n    }\n    cout << (fresh == 0 ? mins : -1) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
        "expectedOutput": "4"
      },
      {
        "input": "3 3\n2 1 1\n0 1 1\n1 0 1",
        "expectedOutput": "-1"
      }
    ],
    "solution": {
      "approach": "Multi-source BFS using queue.",
      "timeComplexity": "O(M * N)",
      "spaceComplexity": "O(M * N)"
    }
  },
  {
    "title": "Open the Lock",
    "slug": "queue-open-the-lock",
    "topic": "Queue",
    "difficulty": "Medium",
    "problemStatement": "You have a lock with 4 circular wheels (0-9). Given a list of deadends and a target combination, return the minimum total turns required to reach target from \"0000\", or -1.",
    "inputFormat": "First line: n (deadends count). Second line: n deadends. Third line: target.",
    "outputFormat": "Print min turns or -1.",
    "constraints": [
      "1 <= deadends.length <= 500"
    ],
    "examples": [
      {
        "input": "5\n0201 0101 0102 1212 2002\n0202",
        "output": "6",
        "explanation": "Sequence of 6 turns."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Set<String> dead = new HashSet<>();\n        for (int i = 0; i < n; i++) dead.add(sc.next());\n        String target = sc.next();\n        if (dead.contains(\"0000\")) { System.out.println(-1); return; }\n        Queue<String> q = new LinkedList<>();\n        Set<String> vis = new HashSet<>(dead);\n        q.offer(\"0000\"); vis.add(\"0000\");\n        int turns = 0;\n        while (!q.isEmpty()) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                String cur = q.poll();\n                if (cur.equals(target)) { System.out.println(turns); return; }\n                for (int j = 0; j < 4; j++) {\n                    for (int diff : new int[]{-1, 1}) {\n                        char[] ch = cur.toCharArray();\n                        ch[j] = (char) ('0' + (ch[j] - '0' + diff + 10) % 10);\n                        String nxt = new String(ch);\n                        if (vis.add(nxt)) q.offer(nxt);\n                    }\n                }\n            }\n            turns++;\n        }\n        System.out.println(-1);\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); dead = set(d[1:n+1]); target = d[n+1]\n    if \"0000\" in dead: print(-1); return\n    q = deque([(\"0000\", 0)]); vis = set(dead); vis.add(\"0000\")\n    while q:\n        cur, turns = q.popleft()\n        if cur == target: print(turns); return\n        for i in range(4):\n            for diff in (-1, 1):\n                nxt = cur[:i] + str((int(cur[i]) + diff) % 10) + cur[i+1:]\n                if nxt not in vis: vis.add(nxt); q.append((nxt, turns + 1))\n    print(-1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <string>\n#include <vector>\n#include <queue>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    unordered_set<string> dead; for (int i = 0; i < n; i++) { string s; cin >> s; dead.insert(s); }\n    string target; cin >> target;\n    if (dead.count(\"0000\")) { cout << -1 << endl; return 0; }\n    queue<pair<string, int>> q; q.push({\"0000\", 0});\n    unordered_set<string> vis = dead; vis.insert(\"0000\");\n    while (!q.empty()) {\n        auto [cur, turns] = q.front(); q.pop();\n        if (cur == target) { cout << turns << endl; return 0; }\n        for (int i = 0; i < 4; i++) {\n            for (int diff : {-1, 1}) {\n                string nxt = cur;\n                nxt[i] = '0' + (cur[i] - '0' + diff + 10) % 10;\n                if (!vis.count(nxt)) { vis.insert(nxt); q.push({nxt, turns + 1}); }\n            }\n        }\n    }\n    cout << -1 << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "5\n0201 0101 0102 1212 2002\n0202",
        "expectedOutput": "6"
      }
    ],
    "solution": {
      "approach": "Shortest path BFS over combination state space (10^4 vertices).",
      "timeComplexity": "O(10^4)",
      "spaceComplexity": "O(10^4)"
    }
  },
  {
    "title": "Shortest Subarray with Sum at Least K",
    "slug": "queue-shortest-subarray-sum-k",
    "topic": "Queue",
    "difficulty": "Hard",
    "problemStatement": "Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1.",
    "inputFormat": "First line: n and k. Second line: n integers.",
    "outputFormat": "Print length or -1.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "3 3\n2 -1 2",
        "output": "3",
        "explanation": "Subarray [2, -1, 2] sum is 3."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(); long k = sc.nextLong();\n        long[] p = new long[n + 1];\n        for (int i = 0; i < n; i++) p[i + 1] = p[i] + sc.nextLong();\n        Deque<Integer> dq = new ArrayDeque<>();\n        int ans = n + 1;\n        for (int i = 0; i <= n; i++) {\n            while (!dq.isEmpty() && p[i] - p[dq.peekFirst()] >= k) ans = Math.min(ans, i - dq.pollFirst());\n            while (!dq.isEmpty() && p[i] <= p[dq.peekLast()]) dq.pollLast();\n            dq.offerLast(i);\n        }\n        System.out.println(ans <= n ? ans : -1);\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    p = [0] * (n + 1)\n    for i in range(n): p[i + 1] = p[i] + a[i]\n    dq = deque(); ans = n + 1\n    for i in range(n + 1):\n        while dq and p[i] - p[dq[0]] >= k: ans = min(ans, i - dq.popleft())\n        while dq and p[i] <= p[dq[-1]]: dq.pop()\n        dq.append(i)\n    print(ans if ans <= n else -1)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <deque>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; long long k; if (!(cin >> n >> k)) return 0;\n    vector<long long> p(n + 1, 0);\n    for (int i = 0; i < n; i++) { long long x; cin >> x; p[i + 1] = p[i] + x; }\n    deque<int> dq; int ans = n + 1;\n    for (int i = 0; i <= n; i++) {\n        while (!dq.empty() && p[i] - p[dq.front()] >= k) { ans = min(ans, i - dq.front()); dq.pop_front(); }\n        while (!dq.empty() && p[i] <= p[dq.back()]) dq.pop_back();\n        dq.push_back(i);\n    }\n    cout << (ans <= n ? ans : -1) << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "3 3\n2 -1 2",
        "expectedOutput": "3"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      }
    ],
    "solution": {
      "approach": "Prefix sums with monotonic increasing deque.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(N)"
    }
  },
  {
    "title": "Constrained Subsequence Sum",
    "slug": "queue-constrained-subsequence-sum",
    "topic": "Queue",
    "difficulty": "Hard",
    "problemStatement": "Given an integer array nums and an integer k, return the maximum sum of a non-empty subsequence of that array such that for every two consecutive integers in the subsequence, their indices differ by at most k.",
    "inputFormat": "First line: n and k. Second line: n integers.",
    "outputFormat": "Print max subsequence sum.",
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "5 2\n10 2 -10 5 20",
        "output": "37",
        "explanation": "Subsequence [10, 2, 5, 20] sum = 37."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int[] dp = new int[n];\n        Deque<Integer> dq = new ArrayDeque<>();\n        int ans = a[0];\n        for (int i = 0; i < n; i++) {\n            while (!dq.isEmpty() && dq.peekFirst() < i - k) dq.pollFirst();\n            dp[i] = a[i] + (!dq.isEmpty() ? Math.max(0, dp[dq.peekFirst()]) : 0);\n            ans = Math.max(ans, dp[i]);\n            while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i]) dq.pollLast();\n            dq.offerLast(i);\n        }\n        System.out.println(ans);\n    }\n}",
      "python": "import sys\nfrom collections import deque\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n, k = int(d[0]), int(d[1]); a = [int(x) for x in d[2:2+n]]\n    dp = [0] * n; dq = deque(); ans = a[0]\n    for i in range(n):\n        while dq and dq[0] < i - k: dq.popleft()\n        dp[i] = a[i] + (max(0, dp[dq[0]]) if dq else 0)\n        ans = max(ans, dp[i])\n        while dq and dp[dq[-1]] <= dp[i]: dq.pop()\n        dq.append(i)\n    print(ans)\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <deque>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (!(cin >> n >> k)) return 0;\n    vector<int> a(n), dp(n); for (int i = 0; i < n; i++) cin >> a[i];\n    deque<int> dq; int ans = a[0];\n    for (int i = 0; i < n; i++) {\n        while (!dq.empty() && dq.front() < i - k) dq.pop_front();\n        dp[i] = a[i] + (!dq.empty() ? max(0, dp[dq.front()]) : 0);\n        ans = max(ans, dp[i]);\n        while (!dq.empty() && dp[dq.back()] <= dp[i]) dq.pop_back();\n        dq.push_back(i);\n    }\n    cout << ans << endl;\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "5 2\n10 2 -10 5 20",
        "expectedOutput": "37"
      }
    ],
    "solution": {
      "approach": "DP optimized with monotonic sliding window deque.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(K)"
    }
  },
  {
    "title": "Jump Game IV",
    "slug": "queue-jump-game-iv",
    "topic": "Queue",
    "difficulty": "Hard",
    "problemStatement": "Given an array of integers arr, you are initially at the first index. In one step you can jump from index i to: i + 1, i - 1, or any j where arr[i] == arr[j]. Return minimum steps to reach the last index.",
    "inputFormat": "First line: n. Second line: n integers.",
    "outputFormat": "Print minimum jumps.",
    "constraints": [
      "1 <= arr.length <= 5 * 10^4"
    ],
    "examples": [
      {
        "input": "10\n100 -23 -23 404 100 23 23 23 3 404",
        "output": "3",
        "explanation": "0 -> 4 -> 3 -> 9 is 3 steps."
      }
    ],
    "starterCode": {
      "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        Map<Integer, List<Integer>> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n            map.computeIfAbsent(a[i], k -> new ArrayList<>()).add(i);\n        }\n        if (n == 1) { System.out.println(0); return; }\n        Queue<Integer> q = new LinkedList<>();\n        boolean[] vis = new boolean[n];\n        q.offer(0); vis[0] = true;\n        int steps = 0;\n        while (!q.isEmpty()) {\n            int sz = q.size();\n            while (sz-- > 0) {\n                int cur = q.poll();\n                if (cur == n - 1) { System.out.println(steps); return; }\n                List<Integer> nxt = map.get(a[cur]);\n                if (nxt != null) {\n                    for (int j : nxt) if (!vis[j]) { vis[j] = true; q.offer(j); }\n                    nxt.clear();\n                }\n                if (cur + 1 < n && !vis[cur + 1]) { vis[cur + 1] = true; q.offer(cur + 1); }\n                if (cur - 1 >= 0 && !vis[cur - 1]) { vis[cur - 1] = true; q.offer(cur - 1); }\n            }\n            steps++;\n        }\n    }\n}",
      "python": "import sys\nfrom collections import deque, defaultdict\ndef main():\n    d = sys.stdin.read().split()\n    if not d: return\n    n = int(d[0]); a = [int(x) for x in d[1:n+1]]\n    if n == 1: print(0); return\n    g = defaultdict(list)\n    for i, x in enumerate(a): g[x].append(i)\n    q = deque([0]); vis = [False] * n; vis[0] = True; steps = 0\n    while q:\n        for _ in range(len(q)):\n            cur = q.popleft()\n            if cur == n - 1: print(steps); return\n            for nxt in g[a[cur]]:\n                if not vis[nxt]: vis[nxt] = True; q.append(nxt)\n            g[a[cur]].clear()\n            for nxt in (cur - 1, cur + 1):\n                if 0 <= nxt < n and not vis[nxt]: vis[nxt] = True; q.append(nxt)\n        steps += 1\nif __name__ == '__main__': main()",
      "cpp": "#include <iostream>\n#include <vector>\n#include <queue>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> a(n); unordered_map<int, vector<int>> g;\n    for (int i = 0; i < n; i++) { cin >> a[i]; g[a[i]].push_back(i); }\n    if (n == 1) { cout << 0 << endl; return 0; }\n    queue<int> q; q.push(0); vector<bool> vis(n, false); vis[0] = true; int steps = 0;\n    while (!q.empty()) {\n        int sz = q.size();\n        while (sz--) {\n            int cur = q.front(); q.pop();\n            if (cur == n - 1) { cout << steps << endl; return 0; }\n            for (int nxt : g[a[cur]]) if (!vis[nxt]) { vis[nxt] = true; q.push(nxt); }\n            g[a[cur]].clear();\n            if (cur + 1 < n && !vis[cur + 1]) { vis[cur + 1] = true; q.push(cur + 1); }\n            if (cur - 1 >= 0 && !vis[cur - 1]) { vis[cur - 1] = true; q.push(cur - 1); }\n        }\n        steps++;\n    }\n    return 0;\n}"
    },
    "testCases": [
      {
        "input": "10\n100 -23 -23 404 100 23 23 23 3 404",
        "expectedOutput": "3"
      }
    ],
    "solution": {
      "approach": "BFS with neighbor list pruning after visiting equivalent values.",
      "timeComplexity": "O(N)",
      "spaceComplexity": "O(N)"
    }
  }
];
