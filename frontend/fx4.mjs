import fs from 'fs';
let lines = fs.readFileSync('src/app/catalogo/page.tsx', 'utf8').split('\n');
lines[81] = '                  <Link href={"/producto/" + (p.idProducto ?? p.id)} key={p.idProducto ?? p.id} className={styles.card}>';
fs.writeFileSync('src/app/catalogo/page.tsx', lines.join('\n'));
console.log(lines[81]);
