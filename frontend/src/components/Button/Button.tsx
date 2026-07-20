import type { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: string;
  variant?: 'primary' | 'danger';
}

const Button = ({
  children,
  icon,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span>
          <i className={icon}></i>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;