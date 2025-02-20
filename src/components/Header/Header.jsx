import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="Logo" />
      </div>
      
      <nav className={styles.navigation}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <button className={styles.tryButton}>
        Try for Free
      </button>
    </header>
  );
};

export default Header; 