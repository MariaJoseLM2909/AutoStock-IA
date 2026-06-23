'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/lib/api';
import { Producto } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import styles from './page.module.css';

const EMPTY: Omit<Producto, 'id'> = { nombre: '', descripcion: '', precio: 0, stock: 0, categoria: '', marca: '' };

export default function AdminProductosPage() {
  const { isAdmin, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<Omit<Producto, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/productos');
      setProductos(Array.isArray(data) ? data : data.content ?? []);
    } catch { setProductos([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/catalogo'); return; }
    fetchProductos();
  }, [authLoading, isAuthenticated, isAdmin]);

  const openCreate = () => { setEditando(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (p: Producto) => { setEditando(p); setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria: p.categoria, marca: p.marca }); setError(''); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.categoria.trim() || !form.marca.trim()) { setError('Nombre, categoría y marca son requeridos'); return; }
    if (form.precio <= 0) { setError('El precio debe ser mayor a 0'); return; }
    if (form.stock < 0) { setError('El stock no puede ser negativo'); return; }
    setSaving(true); setError('');
    try {
      if (editando) await api.put(`/admin/productos/${editando.id}`, form);
      else await api.post('/admin/productos', form);
      setModal(false);
      fetchProductos();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/productos/${id}`);
      setConfirmDelete(null);
      fetchProductos();
    } catch { setError('Error al eliminar'); }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: field === 'precio' || field === 'stock' ? Number(e.target.value) : e.target.value }));

  if (authLoading) return <AdminLayout><Spinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Productos</h1><p className={styles.sub}>{productos.length} productos registrados</p></div>
        <Button onClick={openCreate}>+ Nuevo producto</Button>
      </div>

      {loading ? <Spinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr>
              <th>Nombre</th><th>Categoría</th><th>Marca</th>
              <th>Precio</th><th>Stock</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.prodNombre}>{p.nombre}</span></td>
                  <td><Badge>{p.categoria}</Badge></td>
                  <td className={styles.muted}>{p.marca}</td>
                  <td className={styles.precio}>${p.precio.toLocaleString('es-AR')}</td>
                  <td><Badge variant={p.stock === 0 ? 'error' : p.stock <= 5 ? 'warning' : 'success'}>{p.stock}</Badge></td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(p.id)}>Eliminar</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editando ? 'Editar producto' : 'Nuevo producto'}</h2>
            <form onSubmit={handleSave} className={styles.form}>
              <Input label="Nombre" value={form.nombre} onChange={f('nombre')} required />
              <div className={styles.row}>
                <Input label="Categoría" value={form.categoria} onChange={f('categoria')} required />
                <Input label="Marca" value={form.marca} onChange={f('marca')} required />
              </div>
              <div className={styles.row}>
                <Input label="Precio" type="number" value={form.precio} onChange={f('precio')} required />
                <Input label="Stock" type="number" value={form.stock} onChange={f('stock')} required />
              </div>
              <Input label="Descripción" value={form.descripcion} onChange={f('descripcion')} />
              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.modalActions}>
                <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancelar</Button>
                <Button type="submit" loading={saving}>{editando ? 'Guardar cambios' : 'Crear producto'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Confirmar eliminación</h2>
            <p className={styles.confirmText}>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
