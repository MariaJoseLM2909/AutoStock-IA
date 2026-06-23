'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import styles from './page.module.css';

export default function ProductoDetallePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [producto, setProducto] = useState<any>(null);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [compatibilidades, setCompatibilidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCart, setAddingCart] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/productos/' + id);
        setProducto(prodRes.data);
        try { const cr = await api.get('/productos/' + id + '/compatibilidades'); setCompatibilidades(cr.data); } catch {}
        try { const sr = await api.get('/productos/' + id + '/sugerencias'); setSugerencias(sr.data); } catch {}
      } catch {
        router.push('/catalogo');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleAddCart = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setAddingCart(true);
    try {
      await api.post('/carrito/items', { productoId: Number(id), cantidad });
      setMsg('Agregado al carrito');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Error al agregar');
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) return (<PublicLayout><Spinner /></PublicLayout>);
  if (!producto) return null;

  const sv = producto.stock === 0 ? 'error' : producto.stock <= 5 ? 'warning' : 'success';
  const sl = producto.stock === 0 ? 'Sin stock' : producto.stock <= 5 ? 'Solo ' + producto.stock + ' unidades' : producto.stock + ' en stock';

  return (
    <PublicLayout>
      <div className='container'>
        <button className={styles.back} onClick={() => router.back()}>Volver al catalogo</button>
        <div className={styles.grid}>
          <div className={styles.imgWrap}>
            {producto.imagen
              ? (<img src={producto.imagen} alt={producto.nombre} />)
              : (<span className={styles.noImg}>X</span>)
            }
          </div>
          <div className={styles.info}>
            <span className={styles.cat}>{producto.categoria}</span>
            <h1 className={styles.nombre}>{producto.nombre}</h1>
            <p className={styles.marca}>Marca: <strong>{producto.marca}</strong></p>
            <p className={styles.desc}>{producto.descripcion}</p>
            <div className={styles.priceRow}>
              <span className={styles.precio}>{producto.precio.toLocaleString('es-AR')}</span>
              <Badge variant={sv}>{sl}</Badge>
            </div>
            {producto.stock > 0 && (
              <div className={styles.cantRow}>
                <label className={styles.cantLabel}>Cantidad</label>
                <div className={styles.cantControl}>
                  <button onClick={() => setCantidad(function(c) { return Math.max(1, c - 1); })}>-</button>
                  <span>{cantidad}</span>
                  <button onClick={() => setCantidad(function(c) { return Math.min(producto.stock, c + 1); })}>+</button>
                </div>
              </div>
            )}
            {msg && <p className={styles.cartMsg}>{msg}</p>}
            <Button onClick={handleAddCart} loading={addingCart} disabled={producto.stock === 0} size='lg' fullWidth>
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
          </div>
        </div>
        {compatibilidades.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vehiculos compatibles</h2>
            <div className={styles.compatGrid}>
              {compatibilidades.map(function(c) {
                return (
                  <div key={c.id} className={styles.compatCard}>
                    <span className={styles.compatMarca}>{c.marcaVehiculo}</span>
                    <span>{c.modeloVehiculo}</span>
                    <span className={styles.compatAnio}>{c.anio}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {sugerencias.length > 0 && (
          <section className={styles.section}>
            <div className={styles.iaHeader}>
              <h2 className={styles.sectionTitle}>Sugerencias IA</h2>
              <Badge variant='info'>IA</Badge>
            </div>
            <div className={styles.sugGrid}>
              {sugerencias.map(function(s) {
                return (
                  <a href={'/producto/' + s.id} key={s.id} className={styles.sugCard}>
                    <span className={styles.sugCat}>{s.categoria}</span>
                    <span className={styles.sugNombre}>{s.nombre}</span>
                    <span className={styles.sugPrecio}>{s.precio.toLocaleString('es-AR')}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}