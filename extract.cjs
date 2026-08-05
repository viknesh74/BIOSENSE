const fs = require('fs');
const path = require('path');
const glob = (dir) => fs.readdirSync(dir).reduce((files, file) => {
  const name = path.join(dir, file);
  const isDirectory = fs.statSync(name).isDirectory();
  return isDirectory ? [...files, ...glob(name)] : [...files, name];
}, []);
const files = glob('src').filter(f => f.endsWith('.jsx'));
const keys = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /t\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  const regex2 = /t\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)/g;
  while ((match = regex2.exec(content)) !== null) {
    keys.add(match[1]);
  }
});
fs.writeFileSync('english_keys.json', JSON.stringify(Array.from(keys), null, 2));
console.log('Extracted ' + keys.size + ' keys.');
