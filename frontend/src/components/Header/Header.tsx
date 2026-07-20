import styles from './styles.module.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className={styles.page_header}>
      <h1 className={styles.page_title}>{title}</h1>
      {subtitle && <p className={styles.page_subtitle}>{subtitle}</p>}
    </header>
  );
}