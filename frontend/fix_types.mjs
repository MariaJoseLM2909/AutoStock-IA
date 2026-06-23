import fs from 'fs';
let c = fs.readFileSync('src/types/index.ts', 'utf8');
c = c.replace('imagen?: string;', 'imagen?: string;\n  imagenUrl?: string;');
fs.writeFileSync('src/types/index.ts', c);
console.log('ok');
