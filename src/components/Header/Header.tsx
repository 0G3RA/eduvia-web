import styles from './Header.module.css';
import Image from "next/image";
import Link from 'next/link';
const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <div className={styles.logo}>
          <Image src="/eduvia-logo.svg" alt="Logo" width={32} height={32} />
        </div>
      
      <div className={styles.navigation}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/features">Features</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>

      <button className={styles.tryButton}>
          Почати безкоштовно
        </button>
      </nav>
    </header>
  );
};

export default Header; 