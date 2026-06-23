import fs from 'fs';
let c = fs.readFileSync('src/app/catalogo/page.tsx', 'utf8');
const backtick = String.fromCharCode(96);
const oldStr = '<Link href={' + backtick + '/producto/' + backtick + '} key={p.id} className={styles.card}>';
const newStr = '<Link href={"/producto/" + (p.idProducto ?? p.id)} key={p.idProducto ?? p.id} className={styles.card}>';
c = c.split(oldStr).join(newStr);
fs.writeFileSync('src/app/catalogo/page.tsx', c);
console.log(c.includes(newStr) ? 'ok' : 'not replaced');
