import fs from 'fs';
let c = fs.readFileSync('src/app/catalogo/page.tsx', 'utf8');
c = c.replace(
  "const { data } = await api.get<PaginatedResponse<Producto>>('/productos', { params });",
  "const { data } = await api.get<any>('/productos', { params });"
);
c = c.replace(
  'setProductos(data.content);',
  'setProductos(Array.isArray(data) ? data : (data.content ?? []));'
);
c = c.replace(
  'setTotal(data.totalElements);',
  'setTotal(Array.isArray(data) ? data.length : (data.totalElements ?? 0));'
);
fs.writeFileSync('src/app/catalogo/page.tsx', c);
console.log('ok');
