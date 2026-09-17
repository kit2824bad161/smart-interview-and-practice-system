const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, '..', 'data', 'dsaCatalog');
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

// Definition helper
function makeProblem({ title, slug, topic, difficulty, problemStatement, inputFormat, outputFormat, constraints, examples, javaMain, pyMain, cppMain, testCases, approach, timeComp, spaceComp }) {
  return {
    title,
    slug,
    topic,
    difficulty,
    problemStatement,
    inputFormat: inputFormat || 'First line contains integer n, followed by input elements.',
    outputFormat: outputFormat || 'Print the required result.',
    constraints: constraints || ['1 <= N <= 10^5', '-10^9 <= value <= 10^9'],
    examples: examples || [],
    starterCode: {
      java: javaMain || `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}`,
      python: pyMain || `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # Write your solution here\n\nif __name__ == '__main__':\n    main()`,
      cpp: cppMain || `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
    },
    testCases: testCases || [],
    solution: {
      approach: approach || 'Optimal algorithmic approach.',
      timeComplexity: timeComp || 'O(N)',
      spaceComplexity: spaceComp || 'O(1)',
    },
  };
}

console.log('Catalog directory prepared:', catalogDir);
