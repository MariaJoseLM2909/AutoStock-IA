import fs from 'fs';
let l = fs.readFileSync('src/app/admin/stock/page.tsx', 'utf8').split('\n');
l[25] = "      const { data } = await api.get<any>('/admin/stock');";
l[26] = "      const arr = Array.isArray(data) ? data : [];";
l[27] = "      setItems(arr.map((p) => ({ ...p, id: p.idProducto, nombre: p.nombre, categoria: p.categoria, stock: p.stock, estado: p.stock === 0 ? 'AGOTADO' : p.stock <= 3 ? 'CRITICO' : p.stock <= 5 ? 'BAJO' : 'OK' })));";
fs.writeFileSync('src/app/admin/stock/page.tsx', l.join('\n'));
console.log('ok');
