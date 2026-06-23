import fs from 'fs';
let c = fs.readFileSync('src/app/producto/[id]/page.tsx', 'utf8');
c = c.replace(
  const [prodRes, compatRes, sugRes] = await Promise.all([
          api.get('/productos/' + id),
          api.get('/productos/' + id + '/compatibilidades'),
          api.get('/productos/' + id + '/sugerencias'),
        ]);
        setProducto(prodRes.data);
        setCompatibilidades(compatRes.data);
        setSugerencias(sugRes.data);
      } catch {
        router.push('/catalogo');,
  const prodRes = await api.get('/productos/' + id);
        setProducto(prodRes.data);
        try { const compatRes = await api.get('/productos/' + id + '/compatibilidades'); setCompatibilidades(compatRes.data); } catch {}
        try { const sugRes = await api.get('/productos/' + id + '/sugerencias'); setSugerencias(sugRes.data); } catch {}
      } catch {
        router.push('/catalogo');
);
fs.writeFileSync('src/app/producto/[id]/page.tsx', c);
console.log('ok');
