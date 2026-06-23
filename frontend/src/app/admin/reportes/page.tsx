'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/lib/api';
import { ReporteCategoria, ReporteStock } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function AdminReportesPage() {
  const { isAdmin, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState<ReporteCategoria[]>([]);
  const [criticos, setCriticos] = useState<ReporteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'categorias' | 'stock'>('categorias');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/catalogo'); return; }
    const fetchData = async () => {
      try {
        const [catRes, stockRes] = await Promise.all([
          api.get<ReporteCategoria[]>('/admin/reportes/categorias'),
          api.get<ReporteStock[]>('/admin/reportes/stock'),
        ]);
        setCategorias(catRes.data);
        setCriticos(stockRes.data.filter(s => s.estado !== 'OK'));
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [authLoading, isAuthenticated, isAdmin]);

  const totalProductos = categorias.reduce((a, c) => a + c.totalProductos, 0);
  const totalUnidades = categorias.reduce((a, c) => a + c.totalUnidades, 0);

  if (authLoading) return <AdminLayout><Spinner /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className={styles.title}>Reportes</h1>
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <span className={styles.kpiVal}>{totalProductos}</span>
          <span className={styles.kpiLabel}>Productos totales</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiVal}>{totalUnidades}</span>
          <span className={styles.kpiLabel}>Unidades en stock</span>
        </div>
        <div className={styles.kpi}>
          <span className={`${styles.kpiVal} ${criticos.length > 0 ? styles.kpiWarn : ''}`}>{criticos.length}</span>
          <span className={styles.kpiLabel}>Productos con stock bajo</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiVal}>{categorias.length}</span>
          <span className={styles.kpiLabel}>Categorías</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'categorias' ? styles.active : ''}`} onClick={() => setTab('categorias')}>Stock por categoría</button>
        <button className={`${styles.tab} ${tab === 'stock' ? styles.active : ''}`} onClick={() => setTab('stock')}>
          Alertas de stock
          {criticos.length > 0 && <span className={styles.badge}>{criticos.length}</span>}
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableWrap}>
          {tab === 'categorias' ? (
            <table className={styles.table}>
              <thead><tr><th>Categoría</th><th>Productos</th><th>Unidades</th><th>Distribución</th></tr></thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.categoria}>
                    <td className={styles.catNombre}>{c.categoria}</td>
                    <td>{c.totalProductos}</td>
                    <td className={styles.bold}>{c.totalUnidades}</td>
                    <td>
                      <div className={styles.barWrap}>
                        <div className={styles.bar} style={{ width: `${totalUnidades > 0 ? (c.totalUnidades / totalUnidades) * 100 : 0}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Estado</th></tr></thead>
              <tbody>
                {criticos.length === 0 ? (
                  <tr><td colSpan={4} className={styles.empty}>Sin alertas de stock</td></tr>
                ) : criticos.map(s => (
                  <tr key={s.id}>
                    <td className={styles.bold}>{s.nombre}</td>
                    <td><Badge>{s.categoria}</Badge></td>
                    <td>{s.stock}</td>
                    <td><Badge variant={s.estado === 'AGOTADO' || s.estado === 'CRITICO' ? 'error' : 'warning'}>{s.estado}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
