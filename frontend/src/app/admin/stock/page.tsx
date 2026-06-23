'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/lib/api';
import { ReporteStock } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function AdminStockPage() {
  const { isAdmin, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<ReporteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [newStock, setNewStock] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<any>('/admin/stock');
      const arr = Array.isArray(data) ? data : [];
      setItems(arr.map((p) => ({ ...p, id: p.idProducto, nombre: p.nombre, categoria: p.categoria, stock: p.stock, estado: p.stock === 0 ? 'AGOTADO' : p.stock <= 3 ? 'CRITICO' : p.stock <= 5 ? 'BAJO' : 'OK' })));
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/catalogo'); return; }
    fetchStock();
  }, [authLoading, isAuthenticated, isAdmin]);

  const handleUpdate = async (id: number) => {
    const val = parseInt(newStock);
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    try {
      await api.put(`/admin/stock/${id}`, { cantidad: val });
      setEditId(null); setNewStock('');
      fetchStock();
    } finally { setSaving(false); }
  };

  const estadoVariant = (e: string): 'error' | 'warning' | 'success' => {
    if (e === 'AGOTADO' || e === 'CRITICO') return 'error';
    if (e === 'BAJO') return 'warning';
    return 'success';
  };

  const filtered = items.filter(i =>
    i.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    i.categoria.toLowerCase().includes(filter.toLowerCase())
  );

  if (authLoading) return <AdminLayout><Spinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Gestión de Stock</h1><p className={styles.sub}>{items.length} productos</p></div>
        <input className={styles.search} placeholder="Filtrar por nombre o categoría..." value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Estado</th><th>Actualizar</th>
            </tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className={styles.nombre}>{item.nombre}</td>
                  <td><Badge>{item.categoria}</Badge></td>
                  <td className={styles.stockNum}>{item.stock}</td>
                  <td><Badge variant={estadoVariant(item.estado)}>{item.estado}</Badge></td>
                  <td>
                    {editId === item.id ? (
                      <div className={styles.editRow}>
                        <input className={styles.stockInput} type="number" min="0" value={newStock}
                          onChange={e => setNewStock(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleUpdate(item.id)} autoFocus />
                        <Button size="sm" loading={saving} onClick={() => handleUpdate(item.id)}>OK</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>X</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => { setEditId(item.id); setNewStock(String(item.stock)); }}>
                        Editar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
