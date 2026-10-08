const fs = require('fs');
const path = require('path');

const glob = (dir) => fs.readdirSync(dir).reduce((files, file) => {
  const name = path.join(dir, file);
  return fs.statSync(name).isDirectory() ? [...files, ...glob(name)] : [...files, name];
}, []);

const files = glob('src').filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match lines with plain text between tags: >Some Text<
  const lines = content.split('\n');
  const untranslated = [];
  lines.forEach((line, idx) => {
    // Look for >Text< where Text doesn't contain { and has letters
    const matches = line.match(/>([^<>{}\n]+)</g);
    if (matches) {
      matches.forEach(m => {
        const text = m.slice(1, -1).trim();
        // Ignore whitespace, numbers, icons, punctuation, symbols
        if (text && /[a-zA-Z]{2,}/.test(text) && !text.includes('import ') && !text.includes('className=')) {
          untranslated.push({ line: idx + 1, text });
        }
      });
    }
  });
  if (untranslated.length > 0) {
    console.log(`\nFile: ${f} (${untranslated.length} possible untranslated text nodes)`);
    untranslated.slice(0, 8).forEach(u => console.log(`  L${u.line}: "${u.text}"`));
  }
});
