import fs from 'fs';
let l = fs.readFileSync('src/app/admin/stock/page.tsx', 'utf8').split('\n');
l[44] = "      await api.put('/admin/stock/' + id, null, { params: { cantidad: val } });";
fs.writeFileSync('src/app/admin/stock/page.tsx', l.join('\n'));
console.log(l[44]);
