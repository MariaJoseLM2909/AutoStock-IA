import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🚗</span>
          <h1>AutoStock IA</h1>
        </div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.loginBtn}>Iniciar Sesión</Link>
        </nav>
      </header>
      
      <main className={styles.main}>
        <h2 className={styles.title}>AutoStock IA</h2>
        <p className={styles.subtitle}>Sistema de gestión inteligente de repuestos automotores</p>
        <Link href="/login" className={styles.ctaBtn}>Iniciar Sesión</Link>
      </main>
    </div>
  );
}