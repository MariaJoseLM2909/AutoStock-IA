import fs from 'fs';
let l = fs.readFileSync('src/app/admin/stock/page.tsx', 'utf8').split('\n');
l[25] = "      const { data } = await api.get<any>('/admin/stock');";
l[26] = "      setItems(Array.isArray(data) ? data : []);";
fs.writeFileSync('src/app/admin/stock/page.tsx', l.join('\n'));
console.log('ok');
