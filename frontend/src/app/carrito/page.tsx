'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import api from '@/lib/api';
import { Carrito } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function CarritoPage() {
  const { isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchCarrito();
  }, [isAuthenticated, authLoading]);

  const fetchCarrito = async () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}'); const { data } = await api.get('/carrito', { params: { idUsuario: u.idUsuario } });
      setCarrito(data);
    } catch { setCarrito(null); }
    finally { setLoading(false); }
  };

  const updateCantidad = async (itemId: number, cantidad: number) => {
    if (cantidad < 1) return;
    setUpdatingId(itemId);
    try {
      await api.put('/carrito/items/' + itemId, null, { params: { cantidad } });
      await fetchCarrito();
    } finally { setUpdatingId(null); }
  };

  const eliminarItem = async (itemId: number) => {
    setUpdatingId(itemId);
    try {
      await api.delete(`/carrito/items/${itemId}`);
      await fetchCarrito();
    } finally { setUpdatingId(null); }
  };

  if (loading) return <PublicLayout><Spinner /></PublicLayout>;

  const items = carrito?.items ?? [];

  return (
    <PublicLayout>
      <div className="container">
        <h1 className={styles.title}>Mi carrito</h1>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <Button onClick={() => router.push('/catalogo')} variant="secondary">Ver catálogo</Button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.idItemCarrito} className={styles.item}>
                  <div className={styles.itemImg}>🔧</div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemNombre}>{item.nombreProducto}</span>
                    <span className={styles.itemMarca}></span>
                  </div>
                  <div className={styles.cantControl}>
                    <button onClick={() => updateCantidad(item.idItemCarrito!, item.cantidad - 1)} disabled={updatingId === item.idItemCarrito!}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => updateCantidad(item.idItemCarrito!, item.cantidad + 1)} disabled={updatingId === item.idItemCarrito!}>+</button>
                  </div>
                  <span className={styles.subtotal}>${item.subtotal.toLocaleString('es-AR')}</span>
                  <button className={styles.eliminar} onClick={() => eliminarItem(item.idItemCarrito!)} disabled={updatingId === item.idItemCarrito!}>✕</button>
                </div>
              ))}
            </div>
            <div className={styles.resumen}>
              <h2 className={styles.resumenTitle}>Resumen</h2>
              <div className={styles.resumenRow}>
                <span>Subtotal ({items.length} productos)</span>
                <span>${carrito?.total.toLocaleString('es-AR')}</span>
              </div>
              <div className={styles.resumenTotal}>
                <span>Total</span>
                <span className={styles.totalAmount}>${carrito?.total.toLocaleString('es-AR')}</span>
              </div>
              <Button fullWidth size="lg">Confirmar compra</Button>
              <Button fullWidth variant="ghost" onClick={() => router.push('/catalogo')}>Seguir comprando</Button>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
