const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, '..', 'data', 'dsaCatalog');
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

function saveTopic(fileName, problems) {
  const filePath = path.join(catalogDir, fileName);
  const content = `module.exports = ${JSON.stringify(problems, null, 2)};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved ${problems.length} problems to ${fileName}`);
}

module.exports = { saveTopic };
