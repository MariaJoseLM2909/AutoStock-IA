'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import styles from './page.module.css';

function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      router.push(data.usuario.rol === 'ADMINISTRADOR' ? '/admin/productos' : '/catalogo');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}><Logo size={40} /></div>
        <h1 className={styles.title}>Iniciar sesion</h1>
        <p className={styles.sub}>Ingresa a tu cuenta para continuar</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label='Email' type='email' value={form.email} required
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label='Contrasena' type='password' value={form.password} required
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          {error && <p className={styles.error}>{error}</p>}
          <Button type='submit' fullWidth loading={loading}>Ingresar</Button>
        </form>
        <p className={styles.footer}>
          No tenes cuenta? <Link href='/register' className={styles.link}>Registrate</Link>
        </p>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });