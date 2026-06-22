'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import styles from './register.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
      });
      login(response, form.email);
      router.push('/catalogo');
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span>🚗</span>
          <h2>AutoStock IA</h2>
          <p>Repuestos automotrices inteligentes</p>
        </div>
        
        <h3 className={styles.title}>Crear cuenta</h3>
        <p className={styles.subtitle}>Completá tus datos para registrarte</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" required />
            </div>
          </div>
          
          <div className={styles.field}>
            <label>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
          </div>
          
          <div className={styles.field}>
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" required />
          </div>
          
          <div className={styles.field}>
            <label>Confirmar contraseña</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repetí tu contraseña" required />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Cargando...' : 'Registrarme'}
          </button>
        </form>
        
        <p className={styles.links}>
          ¿Ya tenés cuenta? <Link href="/login" className={styles.link}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}