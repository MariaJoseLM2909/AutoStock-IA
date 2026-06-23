import fs from 'fs';
let lines = fs.readFileSync('src/app/producto/[id]/page.tsx', 'utf8').split('\n');
lines[27] = '        const prodRes = await api.get(' + "'/productos/' + id);" ;
lines[28] = '        setProducto(prodRes.data);';
lines[29] = '        try { const cr = await api.get(' + "'/productos/' + id + '/compatibilidades'); setCompatibilidades(cr.data); } catch {}";
lines[30] = '        try { const sr = await api.get(' + "'/productos/' + id + '/sugerencias'); setSugerencias(sr.data); } catch {}";
fs.writeFileSync('src/app/producto/[id]/page.tsx', lines.join('\n'));
console.log('ok');
