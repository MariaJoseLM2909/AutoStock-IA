'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.apellido.trim()) e.apellido = 'Requerido';
    if (!form.email.includes('@')) e.email = 'Email inválido';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.usuario);
      router.push('/catalogo');
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Error al registrarse' });
    } finally {
      setLoading(false);
    }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}><Logo size={40} /></div>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.sub}>Registrate para comprar en AutoStock IA</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input label="Nombre" value={form.nombre} onChange={f('nombre')} error={errors.nombre} required />
            <Input label="Apellido" value={form.apellido} onChange={f('apellido')} error={errors.apellido} required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={f('email')} error={errors.email} required />
          <Input label="Contraseña" type="password" value={form.password} onChange={f('password')} error={errors.password} required />
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          <Button type="submit" fullWidth loading={loading}>Registrarse</Button>
        </form>
        <p className={styles.footer}>
          ¿Ya tenés cuenta? <Link href="/login" className={styles.link}>Ingresá</Link>
        </p>
      </div>
    </div>
  );
}
