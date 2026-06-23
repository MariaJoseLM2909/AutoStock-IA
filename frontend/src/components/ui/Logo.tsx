import styles from './Logo.module.css';

interface LogoProps { size?: number; showText?: boolean; }

export default function Logo({ size = 36, showText = true }: LogoProps) {
  return (
    <div className={styles.wrapper}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#f59e0b"/>
        <path d="M7 26l2.5-8h21L33 26" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        <rect x="7" y="24" width="26" height="6" rx="3" fill="#1a1a1a"/>
        <circle cx="13" cy="30" r="3" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1.5"/>
        <circle cx="27" cy="30" r="3" fill="#f59e0b" stroke="#1a1a1a" strokeWidth="1.5"/>
        <path d="M12 22l1.5-5h13l1.5 5H12z" fill="#f59e0b"/>
        <rect x="18" y="14" width="4" height="4" rx="1" fill="#1a1a1a"/>
      </svg>
      {showText && (
        <div className={styles.text}>
          <span className={styles.auto}>Auto</span>
          <span className={styles.stock}>Stock</span>
          <span className={styles.ia}>IA</span>
        </div>
      )}
    </div>
  );
}
