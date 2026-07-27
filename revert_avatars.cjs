const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets', 'icons');
const avatarFiles = ['BuildAvatar.tsx', 'ThinkAvatar.tsx', 'RefineAvatar.tsx'];

avatarFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/var\(--text-primary\)/g, '#1A1A1A');
  content = content.replace(/var\(--background\)/g, '#FFFFFF');
  fs.writeFileSync(filePath, content);
  console.log(`Reverted colors in ${file}`);
});
