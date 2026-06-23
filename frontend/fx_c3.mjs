import fs from 'fs';
let l = fs.readFileSync('src/app/carrito/page.tsx', 'utf8').split('\n');
l[18] = "  useEffect(() => {";
l[19] = "    if (authLoading) return;";
l[20] = "    if (!isAuthenticated) { router.push('/login'); return; }";
l[21] = "    fetchCarrito();";
fs.writeFileSync('src/app/carrito/page.tsx', l.join('\n'));
console.log('ok');
