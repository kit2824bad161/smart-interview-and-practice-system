const { saveTopic } = require('./catalog_helper');

const problems = [
  // 4 Easy
  {
    title: "Binary Watch Possible Times",
    slug: "backtracking-binary-watch",
    topic: "Backtracking",
    difficulty: "Easy",
    description: "A binary watch has 4 LEDs on the top to represent hours (0-11) and 6 LEDs on the bottom to represent minutes (0-59). Given an integer n representing the number of LEDs currently turned on, output the count of all valid times that could be displayed on the watch.",
    inputFormat: "A single integer n.",
    outputFormat: "A single integer representing the number of valid times.",
    constraints: "0 <= n <= 10",
    examples: [
      { input: "1", output: "10", explanation: "There are 10 times with 1 bit on: 1:00, 2:00, 4:00, 8:00, 0:01, 0:02, 0:04, 0:08, 0:16, 0:32." },
      { input: "9", output: "0", explanation: "No valid hour/minute pair has 9 active bits." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your backtracking/bit solution here
    }
}`,
      python: `import sys

def main():
    n = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "1", output: "10" },
      { input: "9", output: "0" }
    ],
    hiddenTestCases: [
      { input: "0", output: "1" },
      { input: "2", output: "45" },
      { input: "3", output: "120" },
      { input: "4", output: "210" },
      { input: "5", output: "252" }
    ]
  },
  {
    title: "Letter Case Permutation Count",
    slug: "backtracking-letter-case-permutation",
    topic: "Backtracking",
    difficulty: "Easy",
    description: "Given a string S containing only English letters and digits, count the total number of unique strings you can obtain by transforming each letter individually to be lowercase or uppercase.",
    inputFormat: "A single string S.",
    outputFormat: "A single integer representing the count of unique permutations.",
    constraints: "1 <= |S| <= 12",
    examples: [
      { input: "a1b2", output: "4", explanation: "4 permutations: a1b2, a1B2, A1b2, A1B2." },
      { input: "3z4", output: "2", explanation: "2 permutations: 3z4, 3Z4." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Write your solution here
    }
}`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "a1b2", output: "4" },
      { input: "3z4", output: "2" }
    ],
    hiddenTestCases: [
      { input: "12345", output: "1" },
      { input: "ab", output: "4" },
      { input: "abc", output: "8" },
      { input: "a1b2c3d4", output: "16" }
    ]
  },
  {
    title: "Sum of All Subset XOR Totals",
    slug: "backtracking-sum-of-all-subset-xor-totals",
    topic: "Backtracking",
    difficulty: "Easy",
    description: "The XOR total of an array is the bitwise XOR of all its elements, or 0 if the array is empty. Given an array nums of size n, compute the sum of all XOR totals for every subset of nums.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the total sum of all subset XOR values.",
    constraints: "1 <= n <= 12, 1 <= nums[i] <= 20",
    examples: [
      { input: "2\\n1 3", output: "6", explanation: "Subsets: [] -> 0, [1] -> 1, [3] -> 3, [1,3] -> 1^3=2. Sum = 0+1+3+2 = 6." },
      { input: "3\\n5 1 6", output: "28", explanation: "Sum of XOR totals across all 8 subsets is 28." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your backtracking solution here
    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data: return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:1+n]]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        vector<int> nums(n);
        for(int i = 0; i < n; i++) cin >> nums[i];
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "2\n1 3", output: "6" },
      { input: "3\n5 1 6", output: "28" }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "5" },
      { input: "4\n3 4 5 6", output: "480" },
      { input: "2\n2 2", output: "4" }
    ]
  },
  {
    title: "Count Balanced Parentheses Sequences",
    slug: "backtracking-count-balanced-parentheses",
    topic: "Backtracking",
    difficulty: "Easy",
    description: "Given an integer n, count how many combinations of well-formed parentheses can be formed using exactly n pairs of '(' and ')'.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the total count of valid combinations.",
    constraints: "1 <= n <= 10",
    examples: [
      { input: "1", output: "1", explanation: "Only () is valid." },
      { input: "3", output: "5", explanation: "5 combinations: ((())), (()()), (())(), ()(()), ()()()." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your solution here
    }
}`,
      python: `import sys

def main():
    n = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "1", output: "1" },
      { input: "3", output: "5" }
    ],
    hiddenTestCases: [
      { input: "2", output: "2" },
      { input: "4", output: "14" },
      { input: "5", output: "42" },
      { input: "6", output: "132" }
    ]
  },

  // 3 Medium
  {
    title: "Subsets Generation Count",
    slug: "backtracking-subsets",
    topic: "Backtracking",
    difficulty: "Medium",
    description: "Given an integer array nums of unique elements, print the total number of non-empty subsets whose element sum is strictly greater than a given threshold k.",
    inputFormat: "First line contains n and k. Second line contains n unique integers.",
    outputFormat: "Print the number of subsets with sum > k.",
    constraints: "1 <= n <= 15, -100 <= nums[i] <= 100, -1000 <= k <= 1000",
    examples: [
      { input: "3 2\\n1 2 3", output: "6", explanation: "Subsets with sum > 2: [3], [1,2], [1,3], [2,3], [1,2,3], sum(2)=2 not > 2." },
      { input: "2 10\\n1 2", output: "0", explanation: "Maximum subset sum is 3, none > 10." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your backtracking solution here
    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data: return
    n = int(input_data[0])
    k = int(input_data[1])
    nums = [int(x) for x in input_data[2:2+n]]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    if (cin >> n >> k) {
        vector<int> nums(n);
        for(int i = 0; i < n; i++) cin >> nums[i];
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "3 2\n1 2 3", output: "6" },
      { input: "2 10\n1 2", output: "0" }
    ],
    hiddenTestCases: [
      { input: "4 5\n1 2 3 4", output: "9" },
      { input: "3 0\n1 2 3", output: "7" },
      { input: "1 0\n5", output: "1" }
    ]
  },
  {
    title: "Combination Sum Ways",
    slug: "backtracking-combination-sum",
    topic: "Backtracking",
    difficulty: "Medium",
    description: "Given an array of distinct integers candidates and a target integer target, return the number of unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen from candidates an unlimited number of times.",
    inputFormat: "First line contains n and target. Second line contains n distinct integers.",
    outputFormat: "Print the total count of valid combinations.",
    constraints: "1 <= n <= 10, 1 <= candidates[i] <= 40, 1 <= target <= 40",
    examples: [
      { input: "4 7\\n2 3 6 7", output: "2", explanation: "2 combinations: [2,2,3] and [7]." },
      { input: "3 8\\n2 3 5", output: "3", explanation: "3 combinations: [2,2,2,2], [2,3,3], [3,5]." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        int[] candidates = new int[n];
        for(int i = 0; i < n; i++) candidates[i] = sc.nextInt();
        // Write your backtracking solution here
    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data: return
    n = int(input_data[0])
    target = int(input_data[1])
    candidates = [int(x) for x in input_data[2:2+n]]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    if (cin >> n >> target) {
        vector<int> candidates(n);
        for(int i = 0; i < n; i++) cin >> candidates[i];
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "4 7\n2 3 6 7", output: "2" },
      { input: "3 8\n2 3 5", output: "3" }
    ],
    hiddenTestCases: [
      { input: "1 2\n2", output: "1" },
      { input: "2 1\n2 3", output: "0" },
      { input: "3 10\n2 4 6", output: "3" }
    ]
  },
  {
    title: "Word Search on Grid",
    slug: "backtracking-word-search",
    topic: "Backtracking",
    difficulty: "Medium",
    description: "Given an m x n grid of characters and a string word, return 1 if word exists in the grid, or 0 otherwise. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word path.",
    inputFormat: "First line contains m and n. Next m lines contain n space-separated characters. Last line contains string word.",
    outputFormat: "Print 1 if found, otherwise 0.",
    constraints: "1 <= m, n <= 6, 1 <= |word| <= 15",
    examples: [
      { input: "3 4\\nA B C E\\nS F C S\\nA D E E\\nABCCED", output: "1", explanation: "ABCCED can be traced in the grid." },
      { input: "3 4\\nA B C E\\nS F C S\\nA D E E\\nABCB", output: "0", explanation: "ABCB cannot be formed without reusing B." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        int n = sc.nextInt();
        char[][] board = new char[m][n];
        for(int i = 0; i < m; i++) {
            for(int j = 0; j < n; j++) board[i][j] = sc.next().charAt(0);
        }
        String word = sc.next();
        // Write your backtracking DFS here
    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data: return
    m = int(input_data[0])
    n = int(input_data[1])
    idx = 2
    board = []
    for _ in range(m):
        board.append(input_data[idx:idx+n])
        idx += n
    word = input_data[idx]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    int m, n;
    if (cin >> m >> n) {
        vector<vector<char>> board(m, vector<char>(n));
        for(int i = 0; i < m; i++)
            for(int j = 0; j < n; j++) cin >> board[i][j];
        string word;
        cin >> word;
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "1" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", output: "0" }
    ],
    hiddenTestCases: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", output: "1" },
      { input: "1 1\nA\nA", output: "1" },
      { input: "1 1\nA\nB", output: "0" },
      { input: "2 2\nA B\nC D\nACDB", output: "1" }
    ]
  },

  // 3 Hard
  {
    title: "N-Queens Total Solutions",
    slug: "backtracking-n-queens",
    topic: "Backtracking",
    difficulty: "Hard",
    description: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the total number of distinct solutions to the n-queens puzzle.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the total count of distinct solutions.",
    constraints: "1 <= n <= 10",
    examples: [
      { input: "4", output: "2", explanation: "There are two distinct board solutions for 4-queens." },
      { input: "1", output: "1", explanation: "Only one queen on a 1x1 board." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write your N-Queens backtracking solution here
    }
}`,
      python: `import sys

def main():
    n = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "4", output: "2" },
      { input: "1", output: "1" }
    ],
    hiddenTestCases: [
      { input: "2", output: "0" },
      { input: "3", output: "0" },
      { input: "5", output: "10" },
      { input: "6", output: "4" },
      { input: "8", output: "92" }
    ]
  },
  {
    title: "Sudoku Board Validator",
    slug: "backtracking-sudoku-validator",
    topic: "Backtracking",
    difficulty: "Hard",
    description: "Determine if a 9 x 9 Sudoku board is valid. Each row, each column, and each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition. Empty cells are represented by '.' or '0'. Output 1 if valid, 0 if invalid.",
    inputFormat: "9 lines each with 9 space-separated tokens representing the Sudoku board.",
    outputFormat: "Print 1 if valid, 0 otherwise.",
    constraints: "Board dimensions are 9x9. Tokens in {'1'-'9', '.', '0'}.",
    examples: [
      {
        input: "5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9",
        output: "1",
        explanation: "The configuration follows all Sudoku row, column, and subgrid uniqueness rules."
      },
      {
        input: "8 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9",
        output: "0",
        explanation: "Top-left cell has 8 and row 4 cell 1 also has 8, violating column 0 uniqueness."
      }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[][] board = new char[9][9];
        for(int i = 0; i < 9; i++) {
            for(int j = 0; j < 9; j++) {
                board[i][j] = sc.next().charAt(0);
            }
        }
        // Write your solution here
    }
}`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if len(tokens) < 81: return
    board = [tokens[i*9:(i+1)*9] for i in range(9)]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<char>> board(9, vector<char>(9));
    for(int i = 0; i < 9; i++)
        for(int j = 0; j < 9; j++) cin >> board[i][j];
    // Write your solution here
    return 0;
}`
    },
    publicTestCases: [
      {
        input: "5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9",
        output: "1"
      },
      {
        input: "8 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9",
        output: "0"
      }
    ],
    hiddenTestCases: [
      {
        input: ". . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .",
        output: "1"
      },
      {
        input: "1 2 3 4 5 6 7 8 9\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .",
        output: "1"
      },
      {
        input: "1 2 3 4 5 6 7 8 1\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .",
        output: "0"
      }
    ]
  },
  {
    title: "Palindrome Partitioning Minimum Cuts",
    slug: "backtracking-palindrome-partitioning",
    topic: "Backtracking",
    difficulty: "Hard",
    description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.",
    inputFormat: "A single string s.",
    outputFormat: "Print the minimum cuts needed.",
    constraints: "1 <= |s| <= 100",
    examples: [
      { input: "aab", output: "1", explanation: "Partition ['aa', 'b'] uses 1 cut." },
      { input: "a", output: "0", explanation: "Already palindrome, 0 cuts." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Write your solution here
    }
}`,
      python: `import sys

def main():
    s = sys.stdin.read().strip()
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (cin >> s) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "aab", output: "1" },
      { input: "a", output: "0" }
    ],
    hiddenTestCases: [
      { input: "ab", output: "1" },
      { input: "racecar", output: "0" },
      { input: "abcba", output: "0" },
      { input: "leetcode", output: "5" }
    ]
  }
];

saveTopic('backtracking.js', problems);
