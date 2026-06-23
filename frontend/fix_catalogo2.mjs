import fs from 'fs';
let c = fs.readFileSync('src/app/catalogo/page.tsx', 'utf8');
c = c.replace('<Link href={/producto/} key={p.id}', '<Link href={"/producto/" + (p.idProducto || p.id)} key={p.idProducto || p.id}');
fs.writeFileSync('src/app/catalogo/page.tsx', c);
console.log('ok');
