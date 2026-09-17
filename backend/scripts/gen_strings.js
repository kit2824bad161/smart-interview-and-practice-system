const { saveTopic } = require('./catalog_helper');

// ==========================================
// 1. STRINGS
// ==========================================
const strings = [
  // Easy 1
  {
    title: 'Valid Anagram',
    slug: 'strings-valid-anagram',
    topic: 'Strings',
    difficulty: 'Easy',
    problemStatement: 'Given two strings s and t, return "true" if t is an anagram of s, and "false" otherwise.\nAn Anagram is a word formed by rearranging the letters of a different word, using all original letters exactly once.',
    inputFormat: 'First line contains string s.\nSecond line contains string t.',
    outputFormat: 'Print "true" or "false".',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    examples: [
      { input: 'anagram\nnagaram', output: 'true', explanation: 'Same characters and frequencies.' },
      { input: 'rat\ncar', output: 'false', explanation: 'Different characters.' },
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        String t = sc.next();\n        \n        if (s.length() != t.length()) {\n            System.out.println("false");\n            return;\n        }\n        int[] count = new int[26];\n        for (char c : s.toCharArray()) count[c - 'a']++;\n        for (char c : t.toCharArray()) {\n            if (--count[c - 'a'] < 0) {\n                System.out.println("false");\n                return;\n            }\n        }\n        System.out.println("true");\n    }\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if len(data) < 2: return\n    s, t = data[0], data[1]\n    if len(s) != len(t):\n        print("false")\n        return\n    from collections import Counter\n    print("true" if Counter(s) == Counter(t) else "false")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s, t;\n    if (!(cin >> s >> t)) return 0;\n    if (s.size() != t.size()) { cout << "false" << endl; return 0; }\n    vector<int> count(26, 0);\n    for (char c : s) count[c - 'a']++;\n    for (char c : t) {\n        if (--count[c - 'a'] < 0) {\n            cout << "false" << endl;\n            return 0;\n        }\n    }\n    cout << "true" << endl;\n    return 0;\n}`,
    },
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true' },
      { input: 'rat\ncar', expectedOutput: 'false' },
      { input: 'a\na', expectedOutput: 'true' },
      { input: 'ab\na', expectedOutput: 'false' },
    ],
    solution: { approach: 'Character frequency counter array of size 26.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Easy 2
  {
    title: 'Valid Palindrome',
    slug: 'strings-valid-palindrome',
    topic: 'Strings',
    difficulty: 'Easy',
    problemStatement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\nGiven a string s, return "true" if it is a palindrome, or "false" otherwise.',
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Print "true" or "false".',
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    examples: [
      { input: 'A man, a plan, a canal: Panama', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 'race a car', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {\n                System.out.println("false");\n                return;\n            }\n            l++; r--;\n        }\n        System.out.println("true");\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.readline().strip()\n    filtered = [c.lower() for c in s if c.isalnum()]\n    print("true" if filtered == filtered[::-1] else "false")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) return 0;\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) {\n            cout << "false" << endl;\n            return 0;\n        }\n        l++; r--;\n    }\n    cout << "true" << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false' },
      { input: ' ', expectedOutput: 'true' }
    ],
    solution: { approach: 'Two pointers checking alphanumeric characters from both ends.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Easy 3
  {
    title: 'Longest Common Prefix',
    slug: 'strings-longest-common-prefix',
    topic: 'Strings',
    difficulty: 'Easy',
    problemStatement: 'Write a function to find the longest common prefix string amongst an array of strings.\nIf there is no common prefix, return an empty line or "".',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated strings.',
    outputFormat: 'Print the longest common prefix.',
    constraints: ['1 <= n <= 200', '0 <= strings[i].length <= 200'],
    examples: [
      { input: '3\nflower flow flight', output: 'fl', explanation: '"fl" is common to all 3 words.' },
      { input: '3\ndog racecar car', output: '', explanation: 'No common prefix.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[] strs = new String[n];\n        for (int i = 0; i < n; i++) strs[i] = sc.next();\n        String prefix = strs[0];\n        for (int i = 1; i < n; i++) {\n            while (!strs[i].startsWith(prefix)) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) break;\n            }\n        }\n        System.out.println(prefix);\n    }\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data: return\n    n = int(data[0])\n    strs = data[1:n+1]\n    if not strs: return\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix: break\n    print(prefix)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<string> strs(n);\n    for (int i = 0; i < n; i++) cin >> strs[i];\n    string prefix = strs[0];\n    for (int i = 1; i < n; i++) {\n        while (strs[i].find(prefix) != 0) {\n            prefix = prefix.substr(0, prefix.size() - 1);\n            if (prefix.empty()) break;\n        }\n    }\n    cout << prefix << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '3\nflower flow flight', expectedOutput: 'fl' },
      { input: '3\ndog racecar car', expectedOutput: '' },
      { input: '1\napple', expectedOutput: 'apple' }
    ],
    solution: { approach: 'Horizontal scanning by progressively shortening the common prefix.', timeComplexity: 'O(S)', spaceComplexity: 'O(1)' }
  },
  // Easy 4
  {
    title: 'Reverse String',
    slug: 'strings-reverse-string',
    topic: 'Strings',
    difficulty: 'Easy',
    problemStatement: 'Write a program that reverses a string.',
    inputFormat: 'A single string on one line.',
    outputFormat: 'Print the reversed string.',
    constraints: ['1 <= s.length <= 10^5'],
    examples: [
      { input: 'hello', output: 'olleh', explanation: 'Reversed characters.' },
      { input: 'Hannah', output: 'hannaH', explanation: 'Case is preserved.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    print(s[::-1])\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        reverse(s.begin(), s.end());\n        cout << s << endl;\n    }\n    return 0;\n}`
    },
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'Hannah', expectedOutput: 'hannaH' }
    ],
    solution: { approach: 'Two-pointer swap from ends towards center.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Medium 1
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'strings-longest-substring-without-repeating-chars',
    topic: 'Strings',
    difficulty: 'Medium',
    problemStatement: 'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 'Single line containing string s.',
    outputFormat: 'Print an integer representing the length.',
    constraints: ['0 <= s.length <= 5 * 10^4'],
    examples: [
      { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 'bbbbb', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : "";\n        int maxLen = 0, l = 0;\n        Map<Character, Integer> map = new HashMap<>();\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (map.containsKey(c)) l = Math.max(l, map.get(c) + 1);\n            map.put(c, r);\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.readline().rstrip('\\r\\n')\n    used = {}\n    max_len = l = 0\n    for r, c in enumerate(s):\n        if c in used and l <= used[c]:\n            l = used[c] + 1\n        used[c] = r\n        max_len = max(max_len, r - l + 1)\n    print(max_len)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    unordered_map<char, int> seen;\n    int maxLen = 0, l = 0;\n    for (int r = 0; r < s.size(); r++) {\n        if (seen.count(s[r])) l = max(l, seen[s[r]] + 1);\n        seen[s[r]] = r;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    cout << maxLen << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3' },
      { input: 'bbbbb', expectedOutput: '1' },
      { input: 'pwwkew', expectedOutput: '3' }
    ],
    solution: { approach: 'Sliding window with hash map storing last visited index of each character.', timeComplexity: 'O(N)', spaceComplexity: 'O(min(N, M))' }
  },
  // Medium 2
  {
    title: 'Group Anagrams',
    slug: 'strings-group-anagrams',
    topic: 'Strings',
    difficulty: 'Medium',
    problemStatement: 'Given an array of strings strs, output the number of unique anagram groups.',
    inputFormat: 'First line contains integer n.\nSecond line contains n space-separated strings.',
    outputFormat: 'Print an integer representing the number of anagram groups.',
    constraints: ['1 <= n <= 10^4', '0 <= strs[i].length <= 100'],
    examples: [
      { input: '6\neat tea tan ate nat bat', output: '3', explanation: 'Groups are ["bat"], ["nat","tan"], ["ate","eat","tea"].' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Set<String> set = new HashSet<>();\n        for (int i = 0; i < n; i++) {\n            char[] arr = sc.next().toCharArray();\n            Arrays.sort(arr);\n            set.add(new String(arr));\n        }\n        System.out.println(set.size());\n    }\n}`,
      python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data: return\n    n = int(data[0])\n    strs = data[1:n+1]\n    groups = set(''.join(sorted(s)) for s in strs)\n    print(len(groups))\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    unordered_set<string> groups;\n    for (int i = 0; i < n; i++) {\n        string s; cin >> s;\n        sort(s.begin(), s.end());\n        groups.insert(s);\n    }\n    cout << groups.size() << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '6\neat tea tan ate nat bat', expectedOutput: '3' },
      { input: '1\na', expectedOutput: '1' }
    ],
    solution: { approach: 'Canonical form using sorted character strings as map keys.', timeComplexity: 'O(N * K log K)', spaceComplexity: 'O(N * K)' }
  },
  // Medium 3
  {
    title: 'String to Integer (atoi)',
    slug: 'strings-string-to-integer-atoi',
    topic: 'Strings',
    difficulty: 'Medium',
    problemStatement: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer. Clamp between -2^31 and 2^31 - 1.',
    inputFormat: 'A line containing string s.',
    outputFormat: 'Print 32-bit signed integer.',
    constraints: ['0 <= s.length <= 200'],
    examples: [
      { input: '42', output: '42', explanation: 'Direct conversion.' },
      { input: '   -42', output: '-42', explanation: 'Whitespace ignored.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";\n        if (s.isEmpty()) { System.out.println(0); return; }\n        int sign = 1, i = 0;\n        if (s.charAt(0) == '-') { sign = -1; i++; }\n        else if (s.charAt(0) == '+') { i++; }\n        long res = 0;\n        while (i < s.length() && Character.isDigit(s.charAt(i))) {\n            res = res * 10 + (s.charAt(i) - '0');\n            if (sign * res > Integer.MAX_VALUE) { System.out.println(Integer.MAX_VALUE); return; }\n            if (sign * res < Integer.MIN_VALUE) { System.out.println(Integer.MIN_VALUE); return; }\n            i++;\n        }\n        System.out.println((int)(sign * res));\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.readline().strip()\n    if not s: print(0); return\n    sign = 1\n    i = 0\n    if s[0] == '-': sign = -1; i = 1\n    elif s[0] == '+': i = 1\n    res = 0\n    while i < len(s) and s[i].isdigit():\n        res = res * 10 + int(s[i])\n        i += 1\n    val = sign * res\n    val = max(-2**31, min(2**31 - 1, val))\n    print(val)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <climits>\nusing namespace std;\n\nint main() {\n    string s;\n    if (!getline(cin, s)) return 0;\n    int i = 0, n = s.size();\n    while (i < n && s[i] == ' ') i++;\n    if (i == n) { cout << 0 << endl; return 0; }\n    int sign = 1;\n    if (s[i] == '-') { sign = -1; i++; }\n    else if (s[i] == '+') { i++; }\n    long long res = 0;\n    while (i < n && isdigit(s[i])) {\n        res = res * 10 + (s[i] - '0');\n        if (sign * res > INT_MAX) { cout << INT_MAX << endl; return 0; }\n        if (sign * res < INT_MIN) { cout << INT_MIN << endl; return 0; }\n        i++;\n    }\n    cout << sign * res << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '42', expectedOutput: '42' },
      { input: '   -42', expectedOutput: '-42' },
      { input: '4193 with words', expectedOutput: '4193' }
    ],
    solution: { approach: 'Skip leading spaces, check optional sign, accumulate digits and clamp overflow.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Hard 1
  {
    title: 'Minimum Window Substring',
    slug: 'strings-minimum-window-substring',
    topic: 'Strings',
    difficulty: 'Hard',
    problemStatement: 'Given two strings s and t of lengths m and n, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return an empty line.',
    inputFormat: 'First line contains string s.\nSecond line contains string t.',
    outputFormat: 'Print the minimum window substring.',
    constraints: ['m, n >= 1', 's and t consist of uppercase and lowercase English letters.'],
    examples: [
      { input: 'ADOBECODEBANC\nABC', output: 'BANC', explanation: 'The minimum window substring "BANC" includes A, B, and C.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next(), t = sc.next();\n        int[] target = new int[128];\n        for (char c : t.toCharArray()) target[c]++;\n        int required = t.length(), minLen = Integer.MAX_VALUE, start = 0, l = 0;\n        for (int r = 0; r < s.length(); r++) {\n            if (target[s.charAt(r)]-- > 0) required--;\n            while (required == 0) {\n                if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n                if (++target[s.charAt(l++)] > 0) required++;\n            }\n        }\n        System.out.println(minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen));\n    }\n}`,
      python: `import sys\nfrom collections import Counter\n\ndef main():\n    data = sys.stdin.read().split()\n    if len(data) < 2: return\n    s, t = data[0], data[1]\n    target = Counter(t)\n    required = len(t)\n    min_len = float('inf')\n    start = l = 0\n    for r, c in enumerate(s):\n        if target[c] > 0:\n            required -= 1\n        target[c] -= 1\n        while required == 0:\n            if r - l + 1 < min_len:\n                min_len = r - l + 1\n                start = l\n            target[s[l]] += 1\n            if target[s[l]] > 0:\n                required += 1\n            l += 1\n    print("" if min_len == float('inf') else s[start:start+min_len])\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    string s, t;\n    if (!(cin >> s >> t)) return 0;\n    vector<int> target(128, 0);\n    for (char c : t) target[c]++;\n    int required = t.size(), minLen = INT_MAX, start = 0, l = 0;\n    for (int r = 0; r < s.size(); r++) {\n        if (target[s[r]]-- > 0) required--;\n        while (required == 0) {\n            if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n            if (++target[s[l++]] > 0) required++;\n        }\n    }\n    cout << (minLen == INT_MAX ? "" : s.substr(start, minLen)) << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: 'ADOBECODEBANC\nABC', expectedOutput: 'BANC' },
      { input: 'a\na', expectedOutput: 'a' },
      { input: 'a\naa', expectedOutput: '' }
    ],
    solution: { approach: 'Two-pointer sliding window tracking required character count.', timeComplexity: 'O(|S| + |T|)', spaceComplexity: 'O(1)' }
  },
  // Hard 2
  {
    title: 'Valid Number',
    slug: 'strings-valid-number',
    topic: 'Strings',
    difficulty: 'Hard',
    problemStatement: 'Given a string s, return "true" if s is a valid number, or "false" otherwise. Valid numbers include integers, decimals, and optional exponents ("e" or "E").',
    inputFormat: 'A single string on one line.',
    outputFormat: 'Print "true" or "false".',
    constraints: ['1 <= s.length <= 20'],
    examples: [
      { input: '0', output: 'true', explanation: 'Valid integer.' },
      { input: 'e', output: 'false', explanation: 'Exponent without digits.' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        boolean seenDigit = false, seenDot = false, seenE = false;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (Character.isDigit(c)) seenDigit = true;\n            else if (c == '+' || c == '-') {\n                if (i > 0 && s.charAt(i - 1) != 'e' && s.charAt(i - 1) != 'E') { System.out.println("false"); return; }\n            } else if (c == '.') {\n                if (seenDot || seenE) { System.out.println("false"); return; }\n                seenDot = true;\n            } else if (c == 'e' || c == 'E') {\n                if (seenE || !seenDigit) { System.out.println("false"); return; }\n                seenE = true;\n                seenDigit = false;\n            } else { System.out.println("false"); return; }\n        }\n        System.out.println(seenDigit ? "true" : "false");\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    seen_digit = seen_dot = seen_e = False\n    for i, c in enumerate(s):\n        if c.isdigit(): seen_digit = True\n        elif c in '+-':\n            if i > 0 and s[i-1] not in 'eE': print("false"); return\n        elif c == '.':\n            if seen_dot or seen_e: print("false"); return\n            seen_dot = True\n        elif c in 'eE':\n            if seen_e or not seen_digit: print("false"); return\n            seen_e = True\n            seen_digit = False\n        else: print("false"); return\n    print("true" if seen_digit else "false")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    bool digit = false, dot = false, exp = false;\n    for (int i = 0; i < s.size(); i++) {\n        if (isdigit(s[i])) digit = true;\n        else if (s[i] == '+' || s[i] == '-') {\n            if (i > 0 && s[i-1] != 'e' && s[i-1] != 'E') { cout << "false" << endl; return 0; }\n        } else if (s[i] == '.') {\n            if (dot || exp) { cout << "false" << endl; return 0; }\n            dot = true;\n        } else if (s[i] == 'e' || s[i] == 'E') {\n            if (exp || !digit) { cout << "false" << endl; return 0; }\n            exp = true; digit = false;\n        } else { cout << "false" << endl; return 0; }\n    }\n    cout << (digit ? "true" : "false") << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '0', expectedOutput: 'true' },
      { input: 'e', expectedOutput: 'false' },
      { input: '53.5e93', expectedOutput: 'true' }
    ],
    solution: { approach: 'Deterministic finite state automaton / flag checking.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' }
  },
  // Hard 3
  {
    title: 'Longest Valid Parentheses',
    slug: 'strings-longest-valid-parentheses',
    topic: 'Strings',
    difficulty: 'Hard',
    problemStatement: 'Given a string containing just the characters "(" and ")", return the length of the longest valid (well-formed) parentheses substring.',
    inputFormat: 'A single string on one line.',
    outputFormat: 'Print an integer.',
    constraints: ['0 <= s.length <= 3 * 10^4'],
    examples: [
      { input: '(()', output: '2', explanation: 'Longest valid is "()".' },
      { input: ')()())', output: '4', explanation: 'Longest valid is "()()".' }
    ],
    starterCode: {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : "";\n        Stack<Integer> st = new Stack<>();\n        st.push(-1);\n        int maxLen = 0;\n        for (int i = 0; i < s.length(); i++) {\n            if (s.charAt(i) == '(') st.push(i);\n            else {\n                st.pop();\n                if (st.isEmpty()) st.push(i);\n                else maxLen = Math.max(maxLen, i - st.peek());\n            }\n        }\n        System.out.println(maxLen);\n    }\n}`,
      python: `import sys\n\ndef main():\n    s = sys.stdin.read().strip()\n    st = [-1]\n    max_len = 0\n    for i, c in enumerate(s):\n        if c == '(': st.append(i)\n        else:\n            st.pop()\n            if not st: st.append(i)\n            else: max_len = max(max_len, i - st[-1])\n    print(max_len)\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s; if (!(cin >> s)) { cout << 0 << endl; return 0; }\n    stack<int> st;\n    st.push(-1);\n    int maxLen = 0;\n    for (int i = 0; i < s.size(); i++) {\n        if (s[i] == '(') st.push(i);\n        else {\n            st.pop();\n            if (st.empty()) st.push(i);\n            else maxLen = max(maxLen, i - st.top());\n        }\n    }\n    cout << maxLen << endl;\n    return 0;\n}`
    },
    testCases: [
      { input: '(()', expectedOutput: '2' },
      { input: ')()())', expectedOutput: '4' },
      { input: '', expectedOutput: '0' }
    ],
    solution: { approach: 'Stack initialized with boundary index -1.', timeComplexity: 'O(N)', spaceComplexity: 'O(N)' }
  }
];

saveTopic('strings.js', strings);
