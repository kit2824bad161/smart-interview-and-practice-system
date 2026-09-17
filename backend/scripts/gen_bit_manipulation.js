const { saveTopic } = require('./catalog_helper');

const problems = [
  // 4 Easy
  {
    title: "Single Number",
    slug: "bit-single-number",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using linear runtime complexity and constant extra space.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the single integer.",
    constraints: "1 <= n <= 30000 (n is odd), -30000 <= nums[i] <= 30000",
    examples: [
      { input: "3\\n2 2 1", output: "1", explanation: "2 XOR 2 = 0, 0 XOR 1 = 1." },
      { input: "5\\n4 1 2 1 2", output: "4", explanation: "4 appears once, others twice." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your XOR solution here
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
      { input: "3\n2 2 1", output: "1" },
      { input: "5\n4 1 2 1 2", output: "4" }
    ],
    hiddenTestCases: [
      { input: "1\n99", output: "99" },
      { input: "7\n10 20 30 20 10 30 5", output: "5" },
      { input: "5\n-1 -2 -1 -2 -3", output: "-3" }
    ]
  },
  {
    title: "Number of 1 Bits",
    slug: "bit-number-of-1-bits",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    description: "Write a function that takes the binary representation of a positive integer n and returns the number of set bits it has (also known as the Hamming weight).",
    inputFormat: "A single non-negative integer n.",
    outputFormat: "Print the count of set bits (1s) in its binary representation.",
    constraints: "0 <= n <= 2^31 - 1",
    examples: [
      { input: "11", output: "3", explanation: "11 in binary is 1011, which has 3 ones." },
      { input: "128", output: "1", explanation: "128 in binary is 10000000, which has 1 one." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Write your bit counting solution here
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
    long long n;
    if (cin >> n) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "11", output: "3" },
      { input: "128", output: "1" }
    ],
    hiddenTestCases: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "7", output: "3" },
      { input: "2147483647", output: "31" },
      { input: "1023", output: "10" }
    ]
  },
  {
    title: "Counting Bits Sum",
    slug: "bit-counting-bits-sum",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    description: "Given an integer n, return the total sum of the number of 1's in the binary representation of every number from 0 to n inclusive.",
    inputFormat: "A single non-negative integer n.",
    outputFormat: "Print the total sum of set bits from 0 to n.",
    constraints: "0 <= n <= 100000",
    examples: [
      { input: "2", output: "2", explanation: "0->0, 1->1, 2->1. Sum = 0+1+1 = 2." },
      { input: "5", output: "7", explanation: "0->0, 1->1, 2->1, 3->2, 4->1, 5->2. Sum = 7." }
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
      { input: "2", output: "2" },
      { input: "5", output: "7" }
    ],
    hiddenTestCases: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "10", output: "17" },
      { input: "16", output: "33" }
    ]
  },
  {
    title: "Power of Two Check",
    slug: "bit-power-of-two",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    description: "Given an integer n, return 1 if it is a power of two. Otherwise, return 0. An integer n is a power of two if there exists an integer x such that n == 2^x.",
    inputFormat: "A single integer n.",
    outputFormat: "Print 1 if power of two, otherwise 0.",
    constraints: "-2^31 <= n <= 2^31 - 1",
    examples: [
      { input: "1", output: "1", explanation: "2^0 = 1." },
      { input: "16", output: "1", explanation: "2^4 = 16." },
      { input: "3", output: "0", explanation: "3 is not a power of 2." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Check if n is power of two using bitwise operators
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
    long long n;
    if (cin >> n) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "1", output: "1" },
      { input: "16", output: "1" },
      { input: "3", output: "0" }
    ],
    hiddenTestCases: [
      { input: "0", output: "0" },
      { input: "-16", output: "0" },
      { input: "1024", output: "1" },
      { input: "1023", output: "0" }
    ]
  },

  // 3 Medium
  {
    title: "Single Number II",
    slug: "bit-single-number-ii",
    topic: "Bit Manipulation",
    difficulty: "Medium",
    description: "Given an integer array nums where every element appears three times except for one, which appears exactly once. Find the single element and return it.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the single unique integer.",
    constraints: "1 <= n <= 30000, -2^31 <= nums[i] <= 2^31 - 1",
    examples: [
      { input: "4\\n2 2 3 2", output: "3", explanation: "3 appears once, 2 appears three times." },
      { input: "7\\n0 1 0 1 0 1 99", output: "99", explanation: "99 appears once." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your bit-counting solution here
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
      { input: "4\n2 2 3 2", output: "3" },
      { input: "7\n0 1 0 1 0 1 99", output: "99" }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "5" },
      { input: "7\n-2 -2 1 -2 1 1 4", output: "4" },
      { input: "4\n-4 -4 -4 -5", output: "-5" }
    ]
  },
  {
    title: "Bitwise AND of Numbers Range",
    slug: "bit-bitwise-and-numbers-range",
    topic: "Bit Manipulation",
    difficulty: "Medium",
    description: "Given two integers left and right that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
    inputFormat: "Two integers left and right.",
    outputFormat: "Print the bitwise AND result.",
    constraints: "0 <= left <= right <= 2^31 - 1",
    examples: [
      { input: "5 7", output: "4", explanation: "5 (101) & 6 (110) & 7 (111) = 4 (100)." },
      { input: "0 0", output: "0", explanation: "Range [0, 0] produces 0." },
      { input: "1 2147483647", output: "0", explanation: "Most bits are flipped across this large range, result is 0." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long left = sc.nextLong();
        long right = sc.nextLong();
        // Write your bit-shift solution here
    }
}`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens: return
    left, right = int(tokens[0]), int(tokens[1])
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long left, right;
    if (cin >> left >> right) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "5 7", output: "4" },
      { input: "0 0", output: "0" },
      { input: "1 2147483647", output: "0" }
    ],
    hiddenTestCases: [
      { input: "12 12", output: "12" },
      { input: "9 12", output: "8" },
      { input: "26 30", output: "24" }
    ]
  },
  {
    title: "Subsets XOR Sum Equals K",
    slug: "bit-subsets-xor-sum-equals-k",
    topic: "Bit Manipulation",
    difficulty: "Medium",
    description: "Given an array of n integers and a target value k, find the number of non-empty subsets whose elements yield a bitwise XOR equal to k.",
    inputFormat: "First line contains n and k. Second line contains n integers.",
    outputFormat: "Print the count of subsets whose XOR sum is k.",
    constraints: "1 <= n <= 16, 0 <= nums[i], k <= 1024",
    examples: [
      { input: "3 2\\n1 2 3", output: "2", explanation: "Subsets: [2] (XOR=2) and [1, 3] (1^3=2)." },
      { input: "2 0\\n4 4", output: "1", explanation: "Subset [4, 4] XORs to 0." }
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
        // Write your solution here
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
      { input: "3 2\n1 2 3", output: "2" },
      { input: "2 0\n4 4", output: "1" }
    ],
    hiddenTestCases: [
      { input: "4 7\n1 2 4 8", output: "1" },
      { input: "3 5\n1 2 3", output: "0" },
      { input: "1 5\n5", output: "1" }
    ]
  },

  // 3 Hard
  {
    title: "Maximum XOR of Two Numbers in an Array",
    slug: "bit-maximum-xor-two-numbers",
    topic: "Bit Manipulation",
    difficulty: "Hard",
    description: "Given an integer array nums, return the maximum result of nums[i] XOR nums[j], where 0 <= i <= j < n.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the maximum XOR value.",
    constraints: "1 <= n <= 20000, 0 <= nums[i] <= 2^31 - 1",
    examples: [
      { input: "6\\n3 10 5 25 2 8", output: "28", explanation: "The maximum result is 5 XOR 25 = 28." },
      { input: "7\\n14 70 53 83 49 91 36", output: "127", explanation: "Maximum XOR between pairs is 127." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your Trie / Bitmask solution here
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
      { input: "6\n3 10 5 25 2 8", output: "28" },
      { input: "7\n14 70 53 83 49 91 36", output: "127" }
    ],
    hiddenTestCases: [
      { input: "2\n8 8", output: "0" },
      { input: "3\n0 0 0", output: "0" },
      { input: "4\n1 2 3 4", output: "7" }
    ]
  },
  {
    title: "Total Hamming Distance Across All Pairs",
    slug: "bit-total-hamming-distance",
    topic: "Bit Manipulation",
    difficulty: "Hard",
    description: "The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given an integer array nums, return the sum of Hamming distances between all pairs of the integers in nums.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the total sum of Hamming distances across all pairs (i < j).",
    constraints: "1 <= n <= 10000, 0 <= nums[i] <= 10^9",
    examples: [
      { input: "3\\n4 14 2", output: "6", explanation: "4=(0100), 14=(1110), 2=(0010). dist(4,14)=2, dist(4,2)=2, dist(14,2)=2. Total=6." },
      { input: "3\\n4 14 4", output: "4", explanation: "dist(4,14)=2, dist(4,4)=0, dist(14,4)=2. Total = 4." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();
        // Write your O(32 * n) solution here
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
      { input: "3\n4 14 2", output: "6" },
      { input: "3\n4 14 4", output: "4" }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "0" },
      { input: "4\n1 2 4 8", output: "12" },
      { input: "2\n0 1", output: "1" }
    ]
  },
  {
    title: "Count Triplets With Equal XOR",
    slug: "bit-triplets-equal-xor",
    topic: "Bit Manipulation",
    difficulty: "Hard",
    description: "Given an array of integers arr, we want to select three indices i, j and k where (0 <= i < j <= k < arr.length). Let a = arr[i] ^ ... ^ arr[j - 1] and b = arr[j] ^ ... ^ arr[k]. Return the number of triplets (i, j, k) such that a == b.",
    inputFormat: "First line contains integer n. Second line contains n integers.",
    outputFormat: "Print the number of valid triplets.",
    constraints: "1 <= n <= 300, 1 <= arr[i] <= 10^8",
    examples: [
      { input: "5\\n2 3 1 6 7", output: "4", explanation: "The triplets are (0,1,2), (0,2,2), (2,3,4) and (2,4,4)." },
      { input: "3\\n1 1 1", output: "3", explanation: "Triplets: (0,1,1), (1,2,2), (0,2,2) - all valid." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for(int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // Write your prefix XOR solution here
    }
}`,
      python: `import sys

def main():
    input_data = sys.stdin.read().split()
    if not input_data: return
    n = int(input_data[0])
    arr = [int(x) for x in input_data[1:1+n]]
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        vector<int> arr(n);
        for(int i = 0; i < n; i++) cin >> arr[i];
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "5\n2 3 1 6 7", output: "4" },
      { input: "3\n1 1 1", output: "3" }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "0" },
      { input: "4\n1 3 5 7", output: "3" },
      { input: "4\n7 11 12 9", output: "0" }
    ]
  }
];

saveTopic('bitManipulation.js', problems);
