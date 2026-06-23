import fs from 'fs';
let c = fs.readFileSync('src/app/catalogo/page.tsx', 'utf8');
const old = '<Link href={/producto/} key={p.id} className={styles.card}>';
const neo = '<Link href={"/producto/" + (p.idProducto ?? p.id)} key={p.idProducto ?? p.id} className={styles.card}>';
c = c.split(old).join(neo);
fs.writeFileSync('src/app/catalogo/page.tsx', c);
console.log(c.includes(neo) ? 'ok' : 'not replaced');
