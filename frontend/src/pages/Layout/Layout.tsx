import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './styles.module.css';

const Layout = () => {
  const location = useLocation();

  return (
    <div className={styles.global_container}>
      <header className={styles.header}>
        <div className={styles.header_content}>
          <div className={styles.logo}>
            <span><i className="fa-solid fa-sack-dollar"></i></span> Controle de Gastos
          </div>
          
          <nav className={styles.nav}>
            <Link 
              to="/" 
              className={`${styles.nav_link} ${location.pathname === '/' ? styles.active : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/pessoas" 
              className={`${styles.nav_link} ${location.pathname === '/pessoas' ? styles.active : ''}`}
            >
              Pessoas
            </Link>
            <Link 
              to="/transacoes" 
              className={`${styles.nav_link} ${location.pathname === '/transacoes' ? styles.active : ''}`}
            >
              Transações
            </Link>
          </nav>
        </div>
      </header>

      <div className={styles.main_container}>
        <main className={styles.main_content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout