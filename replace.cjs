const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets', 'icons');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/fill="#1A1A1A"/g, 'fill="var(--text-primary)"');
    content = content.replace(/fill="#FFFFFF"/g, 'fill="var(--background)"');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
