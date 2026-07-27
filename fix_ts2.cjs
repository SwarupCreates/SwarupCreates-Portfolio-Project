const fs = require('fs');
const path = require('path');

// 1. Fix icons
const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const iconFiles = fs.readdirSync(iconsDir);

iconFiles.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(iconsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove "import React from 'react';"
    content = content.replace(/import React from ['"]react['"];?\r?\n/g, '');
    
    // Replace "import React, { ... } from 'react';"
    content = content.replace(/import React,\s*\{/g, 'import {');
    
    fs.writeFileSync(filePath, content);
  }
});

// 2. Fix DevTools.tsx
const devToolsPath = path.join(__dirname, 'src', 'components', 'DevTools', 'DevTools.tsx');
let devToolsContent = fs.readFileSync(devToolsPath, 'utf8');
// Sometimes it's `catch (err) {` or `catch(err) {` or `catch (err: any) {`
devToolsContent = devToolsContent.replace(/catch\s*\([^)]+\)\s*\{/g, 'catch {');
fs.writeFileSync(devToolsPath, devToolsContent);

console.log('Fixed TS errors in icons and DevTools');
