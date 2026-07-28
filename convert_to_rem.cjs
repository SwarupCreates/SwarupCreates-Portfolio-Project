const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip @media queries so we don't accidentally alter breakpoint logic
    if (line.includes('@media')) {
      continue;
    }
    
    // Skip html element font-size we just added
    if (line.includes('font-size: clamp')) {
      continue;
    }

    // Replace pixel values > 2 or < -2
    const regex = /(-?\d+(?:\.\d+)?)px/g;
    let newLine = line.replace(regex, (match, p1) => {
      const val = parseFloat(p1);
      if (Math.abs(val) > 2) {
        return `${val / 16}rem`;
      }
      return match;
    });

    if (newLine !== line) {
      lines[i] = newLine;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.css')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done!');
