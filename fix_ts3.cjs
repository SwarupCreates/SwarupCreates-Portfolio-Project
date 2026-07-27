const fs = require('fs');
const path = require('path');

// 1. Fix icons
const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const iconFiles = fs.readdirSync(iconsDir);

iconFiles.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(iconsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove "import * as React from 'react';" or "import * as React from \"react\""
    content = content.replace(/import \* as React from ['"]react['"];?\r?\n/g, '');
    
    fs.writeFileSync(filePath, content);
  }
});

// 2. Fix DevTools.tsx
const devToolsPath = path.join(__dirname, 'src', 'components', 'DevTools', 'DevTools.tsx');
let devToolsContent = fs.readFileSync(devToolsPath, 'utf8');
devToolsContent = devToolsContent.replace(/\.catch\(err => \{/g, '.catch(() => {');
fs.writeFileSync(devToolsPath, devToolsContent);

console.log('Fixed TS errors');
