const fs = require('fs');
const path = require('path');

const glob = (dir) => fs.readdirSync(dir).reduce((files, file) => {
  const name = path.join(dir, file);
  return fs.statSync(name).isDirectory() ? [...files, ...glob(name)] : [...files, name];
}, []);

const files = glob('src').filter(f => f.endsWith('.jsx'));
const tKeys = new Set();
const tPairs = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match t('...', '...') or t("...", "...")
  const re1 = /t\(\s*'((?:[^'\\]|\\.)*)'(?:\s*,\s*'((?:[^'\\]|\\.)*)')?/g;
  let m;
  while ((m = re1.exec(content)) !== null) {
    const en = m[1].replace(/\\'/g, "'");
    const ta = m[2] ? m[2].replace(/\\'/g, "'") : '';
    tKeys.add(en);
    if (ta && !tPairs[en]) tPairs[en] = ta;
  }
  const re2 = /t\(\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"((?:[^"\\]|\\.)*)")?/g;
  while ((m = re2.exec(content)) !== null) {
    const en = m[1].replace(/\\"/g, '"');
    const ta = m[2] ? m[2].replace(/\\"/g, '"') : '';
    tKeys.add(en);
    if (ta && !tPairs[en]) tPairs[en] = ta;
  }
});

console.log('Total unique t() keys found:', tKeys.size);
console.log('Total with Tamil translations found:', Object.keys(tPairs).length);

// Also check existing hindiDictionary.json
let hindiDict = {};
if (fs.existsSync('src/context/hindiDictionary.json')) {
  hindiDict = JSON.parse(fs.readFileSync('src/context/hindiDictionary.json', 'utf8'));
  console.log('Existing hindiDictionary keys:', Object.keys(hindiDict).length);
}

fs.writeFileSync('extracted_t_calls.json', JSON.stringify({
  keys: Array.from(tKeys),
  tamil: tPairs,
  hindi: hindiDict
}, null, 2));
