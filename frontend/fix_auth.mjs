import fs from 'fs';
let c = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
c = c.replace('if (t && u) {', 'if (t && u && u !== "undefined") {');
fs.writeFileSync('src/context/AuthContext.tsx', c);
console.log('ok');
