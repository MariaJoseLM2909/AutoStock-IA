import Navbar from './Navbar';
import styles from './PublicLayout.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className="container">
          <span>AutoStock IA &copy; 2026 - UTN Facultad Regional Mendoza</span>
        </div>
      </footer>
    </div>
  );
}
