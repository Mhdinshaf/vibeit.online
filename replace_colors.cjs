const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/\[#050b18\]/g, 'slate-900');
      content = content.replace(/#050b18/g, 'slate-900');
      content = content.replace(/\[#0a1122\]/g, 'slate-800');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

replaceInDir('d:/vibeit/vibeit.online/src');
