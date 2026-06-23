import styles from './Spinner.module.css';

export default function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spin} style={{ width: size, height: size }} />
    </div>
  );
}
