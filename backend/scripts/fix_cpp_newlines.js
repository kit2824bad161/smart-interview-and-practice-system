const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../data/seedProblems.js');
let content = fs.readFileSync(file, 'utf8');

// Replace << "\n" with << endl
content = content.split('<< "\\n"').join('<< endl');
content = content.split('<< "\\\\n"').join('<< endl');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed C++ newlines in seedProblems.js');
