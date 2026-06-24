'use client';
import { useState, useEffect, useCallback } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import api from '@/lib/api';
import { Producto, PaginatedResponse } from '@/types';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({ nombre: '', categoria: '', marca: '' });
  const [search, setSearch] = useState({ nombre: '', categoria: '', marca: '' });
  const PAGE_SIZE = 12;

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, size: PAGE_SIZE };
      if (search.nombre) params.busqueda = search.nombre;
      if (!search.nombre && search.categoria) params.categoria = search.categoria;
      if (!search.nombre && search.marca) params.marca = search.marca;
      const { data } = await api.get<any>('/productos', { params });
      setProductos(Array.isArray(data) ? data : (data.content ?? []));
      setTotal(Array.isArray(data) ? data.length : (data.totalElements ?? 0));
    } catch {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch({ ...filters });
  };

  const stockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="error">Sin stock</Badge>;
    if (stock <= 5) return <Badge variant="warning">Últimas unidades</Badge>;
    return <Badge variant="success">Disponible</Badge>;
  };

  return (
    <PublicLayout>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Catálogo de repuestos</h1>
          <span className={styles.count}>{total} productos</span>
        </div>

        <form onSubmit={handleSearch} className={styles.filters}>
          <input className={styles.filterInput} placeholder="Buscar por nombre..."
            value={filters.nombre} onChange={e => setFilters(p => ({ ...p, nombre: e.target.value }))} />
          <input className={styles.filterInput} placeholder="Categoría..."
            value={filters.categoria} onChange={e => setFilters(p => ({ ...p, categoria: e.target.value }))} />
          <input className={styles.filterInput} placeholder="Marca..."
            value={filters.marca} onChange={e => setFilters(p => ({ ...p, marca: e.target.value }))} />
          <Button type="submit" size="sm">Buscar</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => {
            setFilters({ nombre: '', categoria: '', marca: '' });
            setSearch({ nombre: '', categoria: '', marca: '' });
            setPage(0);
          }}>Limpiar</Button>
        </form>

        {loading ? <Spinner /> : (
          <>
            {productos.length === 0 ? (
              <div className={styles.empty}>No se encontraron productos</div>
            ) : (
              <div className={styles.grid}>
                {productos.map(p => (
                  <Link href={"/producto/" + (p.idProducto ?? p.id)} key={p.idProducto ?? p.id} className={styles.card}>
                    <div className={styles.cardImg}>
                      {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <span className={styles.noImg}>🔧</span>}
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.categoria}>{p.categoria}</span>
                      <h3 className={styles.nombre}>{p.nombre}</h3>
                      <p className={styles.marca}>{p.marca}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.precio}>${p.precio.toLocaleString('es-AR')}</span>
                        {stockBadge(p.stock)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {total > PAGE_SIZE && (
              <div className={styles.pagination}>
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                <span className={styles.pageInfo}>Página {page + 1} de {Math.ceil(total / PAGE_SIZE)}</span>
                <Button variant="secondary" size="sm" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
