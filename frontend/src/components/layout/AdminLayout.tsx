'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/ui/Logo';
import styles from './AdminLayout.module.css';

const NAV = [
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/stock', label: 'Stock' },
  { href: '/admin/reportes', label: 'Reportes' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const handleLogout = () => { logout(); router.push('/'); };
  if (!mounted) return null;
  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Logo size={28} />
          <span className={styles.adminBadge}>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={styles.navItem + (pathname === n.href ? ' ' + styles.active : '')}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <span className={styles.userInfo}>{user?.nombre} {user?.apellido}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesion</button>
        </div>
      </aside>
      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}