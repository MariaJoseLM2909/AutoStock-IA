'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function AdminReportesPage() {
  const { isAdmin, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'categorias' | 'stock'>('categorias');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/catalogo'); return; }
    const fetchData = async () => {
      try {
        const [catRes, stockRes] = await Promise.all([
          api.get<any>('/admin/reportes/categorias'),
          api.get<any>('/admin/reportes/stock'),
        ]);
        const catMap = catRes.data.categorias || {};
        const catArr = Object.entries(catMap).map(([cat, count]) => ({
          categoria: cat,
          totalProductos: count as number,
        }));
        setCategorias(catArr);
        setStockData(stockRes.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [authLoading, isAuthenticated, isAdmin]);

  const totalProductos = categorias.reduce((a, c) => a + c.totalProductos, 0);
  const criticos = (stockData.bajo || 0) + (stockData.sinStock || 0);

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
          <span className={styles.kpiVal}>{stockData.normal || 0}</span>
          <span className={styles.kpiLabel}>Stock normal</span>
        </div>
        <div className={styles.kpi}>
          <span className={`${styles.kpiVal} ${criticos > 0 ? styles.kpiWarn : ''}`}>{criticos}</span>
          <span className={styles.kpiLabel}>Stock bajo o agotado</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiVal}>{categorias.length}</span>
          <span className={styles.kpiLabel}>Categorias</span>
        </div>
      </div>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'categorias' ? styles.active : ''}`} onClick={() => setTab('categorias')}>Stock por categoria</button>
        <button className={`${styles.tab} ${tab === 'stock' ? styles.active : ''}`} onClick={() => setTab('stock')}>
          Estado de stock
          {criticos > 0 && <span className={styles.badge}>{criticos}</span>}
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className={styles.tableWrap}>
          {tab === 'categorias' ? (
            <table className={styles.table}>
              <thead><tr><th>Categoria</th><th>Productos</th></tr></thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.categoria}>
                    <td className={styles.catNombre}>{c.categoria}</td>
                    <td className={styles.bold}>{c.totalProductos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Estado</th><th>Cantidad</th></tr></thead>
              <tbody>
                <tr><td>Normal</td><td className={styles.bold}>{stockData.normal || 0}</td></tr>
                <tr><td><Badge variant="warning">Bajo</Badge></td><td className={styles.bold}>{stockData.bajo || 0}</td></tr>
                <tr><td><Badge variant="error">Agotado</Badge></td><td className={styles.bold}>{stockData.sinStock || 0}</td></tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </AdminLayout>
  );
}