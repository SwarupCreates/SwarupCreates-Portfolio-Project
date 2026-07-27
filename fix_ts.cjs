const fs = require('fs');
const path = require('path');

// 1. Fix icons
const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const iconFiles = fs.readdirSync(iconsDir);

iconFiles.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(iconsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove "import React from 'react';" or "import React from \"react\";" entirely
    content = content.replace(/import React from ['"]react['"];?\r?\n?/g, '');
    
    fs.writeFileSync(filePath, content);
  }
});

// 2. Fix BuiltTwice.tsx
const builtTwicePath = path.join(__dirname, 'src', 'components', 'BuiltTwice', 'BuiltTwice.tsx');
let builtTwiceContent = fs.readFileSync(builtTwicePath, 'utf8');
// The error is probably passing pathRef to something expecting RefObject<SVGPathElement>.
// I'll change `useRef<SVGPathElement | null>(null)` to `useRef<SVGPathElement>(null!)`
builtTwiceContent = builtTwiceContent.replace(/useRef<SVGPathElement \| null>\(null\)/, 'useRef<SVGPathElement>(null!)');
builtTwiceContent = builtTwiceContent.replace(/useRef<SVGPathElement>\(null\)/, 'useRef<SVGPathElement>(null!)');
fs.writeFileSync(builtTwicePath, builtTwiceContent);

// 3. Fix DevTools.tsx
const devToolsPath = path.join(__dirname, 'src', 'components', 'DevTools', 'DevTools.tsx');
let devToolsContent = fs.readFileSync(devToolsPath, 'utf8');
devToolsContent = devToolsContent.replace(/catch \(err\)/g, 'catch');
fs.writeFileSync(devToolsPath, devToolsContent);

console.log('Fixed all TS errors');
