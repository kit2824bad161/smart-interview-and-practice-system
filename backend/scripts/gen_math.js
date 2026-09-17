const { saveTopic } = require('./catalog_helper');

const problems = [
  // 4 Easy
  {
    title: "Palindrome Number",
    slug: "math-palindrome-number",
    topic: "Basic Mathematics",
    difficulty: "Easy",
    description: "Given an integer x, return 1 if x is a palindrome, and 0 otherwise. An integer is a palindrome when it reads the same forward and backward.",
    inputFormat: "A single integer x.",
    outputFormat: "Print 1 if palindrome, otherwise 0.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    examples: [
      { input: "121", output: "1", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "-121", output: "0", explanation: "From left to right it reads -121. From right to left it becomes 121-." },
      { input: "10", output: "0", explanation: "Reads 01 from right to left." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long x = sc.nextLong();
        // Write your solution here
    }
}`,
      python: `import sys

def main():
    x = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long x;
    if (cin >> x) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "121", output: "1" },
      { input: "-121", output: "0" },
      { input: "10", output: "0" }
    ],
    hiddenTestCases: [
      { input: "0", output: "1" },
      { input: "12321", output: "1" },
      { input: "1000021", output: "0" },
      { input: "7", output: "1" }
    ]
  },
  {
    title: "Count Primes Less Than N",
    slug: "math-count-primes",
    topic: "Basic Mathematics",
    difficulty: "Easy",
    description: "Given an integer n, return the number of prime numbers that are strictly less than n.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the count of prime numbers < n.",
    constraints: "0 <= n <= 5000000",
    examples: [
      { input: "10", output: "4", explanation: "There are 4 prime numbers less than 10, they are 2, 3, 5, 7." },
      { input: "0", output: "0", explanation: "No primes less than 0." },
      { input: "1", output: "0", explanation: "No primes less than 1." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Write Sieve of Eratosthenes solution here
    }
}`,
      python: `import sys

def main():
    n = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
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
      { input: "10", output: "4" },
      { input: "0", output: "0" },
      { input: "1", output: "0" }
    ],
    hiddenTestCases: [
      { input: "2", output: "0" },
      { input: "3", output: "1" },
      { input: "20", output: "8" },
      { input: "100", output: "25" },
      { input: "1000", output: "168" }
    ]
  },
  {
    title: "Greatest Common Divisor and LCM",
    slug: "math-gcd-and-lcm",
    topic: "Basic Mathematics",
    difficulty: "Easy",
    description: "Given two positive integers a and b, compute and print their Greatest Common Divisor (GCD) and Least Common Multiple (LCM) separated by a space.",
    inputFormat: "Two space-separated integers a and b.",
    outputFormat: "Print GCD and LCM separated by a single space.",
    constraints: "1 <= a, b <= 10^9",
    examples: [
      { input: "12 18", output: "6 36", explanation: "GCD is 6, LCM is (12*18)/6 = 36." },
      { input: "5 7", output: "1 35", explanation: "GCD is 1 (co-prime), LCM is 35." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        // Compute GCD using Euclidean algorithm and LCM = (a*b)/gcd
    }
}`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens: return
    a, b = int(tokens[0]), int(tokens[1])
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    if (cin >> a >> b) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "12 18", output: "6 36" },
      { input: "5 7", output: "1 35" }
    ],
    hiddenTestCases: [
      { input: "1 1", output: "1 1" },
      { input: "100 25", output: "25 100" },
      { input: "24 36", output: "12 72" },
      { input: "1000000000 500000000", output: "500000000 1000000000" }
    ]
  },
  {
    title: "Roman to Integer",
    slug: "math-roman-to-integer",
    topic: "Basic Mathematics",
    difficulty: "Easy",
    description: "Given a roman numeral s, convert it to an integer. Symbol values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.",
    inputFormat: "A single string s containing valid Roman numerals.",
    outputFormat: "Print the corresponding integer value.",
    constraints: "1 <= |s| <= 15, s contains only characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
    examples: [
      { input: "III", output: "3", explanation: "III = 3." },
      { input: "LVIII", output: "58", explanation: "L = 50, V= 5, III = 3." },
      { input: "MCMXCIV", output: "1994", explanation: "M = 1000, CM = 900, XC = 90 and IV = 4." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Write your conversion logic here
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
      { input: "III", output: "3" },
      { input: "LVIII", output: "58" },
      { input: "MCMXCIV", output: "1994" }
    ],
    hiddenTestCases: [
      { input: "I", output: "1" },
      { input: "IV", output: "4" },
      { input: "IX", output: "9" },
      { input: "XL", output: "40" },
      { input: "XC", output: "90" },
      { input: "CD", output: "400" },
      { input: "CM", output: "900" },
      { input: "MMMCMXCIX", output: "3999" }
    ]
  },

  // 3 Medium
  {
    title: "Factorial Trailing Zeroes",
    slug: "math-factorial-trailing-zeroes",
    topic: "Basic Mathematics",
    difficulty: "Medium",
    description: "Given an integer n, return the number of trailing zeroes in n! (factorial of n). The solution should have logarithmic time complexity O(log_5 n).",
    inputFormat: "A single non-negative integer n.",
    outputFormat: "Print the count of trailing zeroes.",
    constraints: "0 <= n <= 10^9",
    examples: [
      { input: "3", output: "0", explanation: "3! = 6, no trailing zero." },
      { input: "5", output: "1", explanation: "5! = 120, one trailing zero." },
      { input: "25", output: "6", explanation: "25/5 + 25/25 = 5 + 1 = 6." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // Write your Legendre's formula solution here
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
      { input: "3", output: "0" },
      { input: "5", output: "1" },
      { input: "25", output: "6" }
    ],
    hiddenTestCases: [
      { input: "0", output: "0" },
      { input: "10", output: "2" },
      { input: "100", output: "24" },
      { input: "1000", output: "249" }
    ]
  },
  {
    title: "Modular Fast Exponentiation",
    slug: "math-modular-fast-exponentiation",
    topic: "Basic Mathematics",
    difficulty: "Medium",
    description: "Given three integers base a, power b, and modulo m, calculate (a^b) % m using binary exponentiation in O(log b) time.",
    inputFormat: "Three space-separated integers a, b, and m.",
    outputFormat: "Print the result of (a^b) % m.",
    constraints: "0 <= a <= 10^9, 0 <= b <= 10^9, 1 <= m <= 10^9+7",
    examples: [
      { input: "2 10 1000", output: "24", explanation: "2^10 = 1024. 1024 % 1000 = 24." },
      { input: "3 5 7", output: "5", explanation: "3^5 = 243. 243 % 7 = 5." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        long m = sc.nextLong();
        // Write binary exponentiation here
    }
}`,
      python: `import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens: return
    a, b, m = int(tokens[0]), int(tokens[1]), int(tokens[2])
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b, m;
    if (cin >> a >> b >> m) {
        // Write your solution here
    }
    return 0;
}`
    },
    publicTestCases: [
      { input: "2 10 1000", output: "24" },
      { input: "3 5 7", output: "5" }
    ],
    hiddenTestCases: [
      { input: "5 0 13", output: "1" },
      { input: "7 2 5", output: "4" },
      { input: "2 30 1000000007", output: "73741817" }
    ]
  },
  {
    title: "Excel Sheet Column Number",
    slug: "math-excel-sheet-column-number",
    topic: "Basic Mathematics",
    difficulty: "Medium",
    description: "Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number. (A -> 1, B -> 2, ..., Z -> 26, AA -> 27, AB -> 28, ...).",
    inputFormat: "A single uppercase string columnTitle.",
    outputFormat: "Print the corresponding column number as an integer.",
    constraints: "1 <= columnTitle.length <= 7, columnTitle consists only of uppercase English letters.",
    examples: [
      { input: "A", output: "1", explanation: "Column A is 1." },
      { input: "AB", output: "28", explanation: "1 * 26 + 2 = 28." },
      { input: "ZY", output: "701", explanation: "26 * 26 + 25 = 701." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Base 26 to decimal conversion
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
      { input: "A", output: "1" },
      { input: "AB", output: "28" },
      { input: "ZY", output: "701" }
    ],
    hiddenTestCases: [
      { input: "Z", output: "26" },
      { input: "AA", output: "27" },
      { input: "AAA", output: "703" },
      { input: "FXSHRXW", output: "2147483647" }
    ]
  },

  // 3 Hard
  {
    title: "Consecutive Numbers Sum",
    slug: "math-consecutive-numbers-sum",
    topic: "Basic Mathematics",
    difficulty: "Hard",
    description: "Given an integer n, return the number of ways you can write n as the sum of consecutive positive integers. The expression must contain at least one positive integer.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the total number of valid consecutive sequences.",
    constraints: "1 <= n <= 10^9",
    examples: [
      { input: "5", output: "2", explanation: "5 = 5 or 2 + 3." },
      { input: "9", output: "3", explanation: "9 = 9, 4 + 5, or 2 + 3 + 4." },
      { input: "15", output: "4", explanation: "15 = 15, 7 + 8, 4 + 5 + 6, or 1 + 2 + 3 + 4 + 5." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // k consecutive integers: k*x + k*(k-1)/2 = n
        // Loop k while k*(k-1)/2 < n
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
      { input: "5", output: "2" },
      { input: "9", output: "3" },
      { input: "15", output: "4" }
    ],
    hiddenTestCases: [
      { input: "1", output: "1" },
      { input: "3", output: "2" },
      { input: "100", output: "3" },
      { input: "1000000000", output: "10" }
    ]
  },
  {
    title: "Integer Break Maximum Product",
    slug: "math-integer-break-maximum-product",
    topic: "Basic Mathematics",
    difficulty: "Hard",
    description: "Given an integer n, break it into the sum of k positive integers, where k >= 2, and maximize the product of those integers. Return the maximum product you can get.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the maximum product.",
    constraints: "2 <= n <= 58",
    examples: [
      { input: "2", output: "1", explanation: "2 = 1 + 1, 1 * 1 = 1." },
      { input: "10", output: "36", explanation: "10 = 3 + 3 + 4, 3 * 3 * 4 = 36." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Mathematical reasoning: factors of 3 maximize product
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
      { input: "2", output: "1" },
      { input: "10", output: "36" }
    ],
    hiddenTestCases: [
      { input: "3", output: "2" },
      { input: "4", output: "4" },
      { input: "5", output: "6" },
      { input: "6", output: "9" },
      { input: "8", output: "18" },
      { input: "12", output: "81" }
    ]
  },
  {
    title: "Nth Ugly Number",
    slug: "math-nth-ugly-number",
    topic: "Basic Mathematics",
    difficulty: "Hard",
    description: "An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return the nth ugly number. 1 is typically treated as an ugly number.",
    inputFormat: "A single integer n.",
    outputFormat: "Print the nth ugly number.",
    constraints: "1 <= n <= 1690",
    examples: [
      { input: "10", output: "12", explanation: "[1, 2, 3, 4, 5, 6, 8, 9, 10, 12] is the sequence of the first 10 ugly numbers." },
      { input: "1", output: "1", explanation: "1 has no prime factors, therefore all of its prime factors are limited to 2, 3, and 5." }
    ],
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Dynamic programming / 3 pointer approach (factors 2, 3, 5)
    }
}`,
      python: `import sys

def main():
    n = int(sys.stdin.read().strip())
    # Write your solution here

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
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
      { input: "10", output: "12" },
      { input: "1", output: "1" }
    ],
    hiddenTestCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "4", output: "4" },
      { input: "5", output: "5" },
      { input: "6", output: "6" },
      { input: "7", output: "8" },
      { input: "15", output: "24" }
    ]
  }
];

saveTopic('math.js', problems);
