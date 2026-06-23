'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin, authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const handleLogout = () => { logout(); router.push('/'); };
  if (!mounted || authLoading) return (
    <nav className={styles.nav}>
      <div className={'container ' + styles.inner}>
        <Link href='/'><Logo size={32} /></Link>
      </div>
    </nav>
  );
  return (
    <nav className={styles.nav}>
      <div className={'container ' + styles.inner}>
        <Link href={isAdmin ? '/admin/productos' : isAuthenticated ? '/catalogo' : '/'}>
          <Logo size={32} />
        </Link>
        <div className={styles.links}>
          {!isAuthenticated && <Link href='/catalogo' className={styles.link}>Catalogo</Link>}
          {isAuthenticated && !isAdmin && <>
            <Link href='/catalogo' className={styles.link}>Catalogo</Link>
            <Link href='/carrito' className={styles.link}>Carrito</Link>
            <Link href='/perfil' className={styles.link}>Perfil</Link>
          </>}
          {isAdmin && <>
            <Link href='/admin/productos' className={styles.link}>Productos</Link>
            <Link href='/admin/stock' className={styles.link}>Stock</Link>
            <Link href='/admin/reportes' className={styles.link}>Reportes</Link>
          </>}
        </div>
        <div className={styles.actions}>
          {!isAuthenticated ? <>
            <Link href='/login'><Button variant='ghost' size='sm'>Ingresar</Button></Link>
            <Link href='/register'><Button size='sm'>Registrarse</Button></Link>
          </> : <>
            <span className={styles.userName}>{user?.nombre}</span>
            <Button variant='ghost' size='sm' onClick={handleLogout}>Salir</Button>
          </>}
        </div>
      </div>
    </nav>
  );
}