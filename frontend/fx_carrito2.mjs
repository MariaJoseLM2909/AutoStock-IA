import fs from 'fs';
let l = fs.readFileSync('src/app/carrito/page.tsx', 'utf8').split('\n');
l[25] = "      const u = JSON.parse(localStorage.getItem('user') || '{}'); const { data } = await api.get('/carrito', { params: { idUsuario: u.idUsuario } });";
fs.writeFileSync('src/app/carrito/page.tsx', l.join('\n'));
console.log('ok');
