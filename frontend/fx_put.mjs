import fs from 'fs';
let l = fs.readFileSync('src/app/carrito/page.tsx', 'utf8').split('\n');
l[36] = "      await api.put('/carrito/items/' + itemId, null, { params: { cantidad } });";
fs.writeFileSync('src/app/carrito/page.tsx', l.join('\n'));
console.log(l[36]);
