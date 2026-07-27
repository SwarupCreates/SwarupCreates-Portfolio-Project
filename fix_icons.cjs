const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets', 'icons');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix unused React import
    content = content.replace(/import React(,[^;]+)? from 'react';\n/g, (match, p1) => {
      if (p1) {
        return `import ${p1.replace(/^, /, '')} from 'react';\n`;
      }
      return '';
    });
    
    // Fix type-only import for SVGProps
    content = content.replace(/import \{([^}]*SVGProps[^}]*)\} from "react"/g, 'import type { $1 } from "react"');
    content = content.replace(/import \{([^}]*SVGProps[^}]*)\} from 'react'/g, "import type { $1 } from 'react'");
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in ${file}`);
  }
});
