import PublicLayout from '@/components/layout/PublicLayout';
import styles from './page.module.css';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <PublicLayout>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>
            Repuestos automotores<br />
            <span className={styles.highlight}>con asistencia inteligente</span>
          </h1>
          <p className={styles.subtitle}>
            Encontrá el repuesto exacto para tu vehículo. Filtrá por marca, modelo y año,
            y dejá que nuestra IA te sugiera las piezas compatibles.
          </p>
          <div className={styles.cta}>
            <Link href="/catalogo"><Button size="lg">Ver catálogo</Button></Link>
            <Link href="/register"><Button size="lg" variant="secondary">Crear cuenta</Button></Link>
          </div>
        </div>
      </div>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.icon}>🔍</div>
              <h3>Búsqueda inteligente</h3>
              <p>Filtrá por categoría, marca y precio. Encontrá lo que necesitás en segundos.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>🤖</div>
              <h3>Asistente IA</h3>
              <p>Ingresá tu vehículo y el sistema sugiere los repuestos compatibles automáticamente.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.icon}>📦</div>
              <h3>Stock en tiempo real</h3>
              <p>Disponibilidad actualizada al instante. Sin sorpresas al momento de comprar.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
