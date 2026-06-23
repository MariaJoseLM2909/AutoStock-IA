import fs from 'fs';
let c = fs.readFileSync('src/app/producto/[id]/page.tsx', 'utf8');
c = c.replace(
  "await api.post('/carrito/items', { productoId: Number(id), cantidad });",
  "const u = JSON.parse(localStorage.getItem('user') || '{}'); await api.post('/carrito/items', { idUsuario: u.idUsuario, idProducto: Number(id), cantidad });"
);
fs.writeFileSync('src/app/producto/[id]/page.tsx', c);
console.log(c.includes('idUsuario') ? 'ok' : 'not replaced');
