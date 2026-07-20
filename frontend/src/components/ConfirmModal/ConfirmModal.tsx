import React from 'react';
import Button from '../Button/Button';
import styles from './styles.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <i className="fa-solid fa-triangle-exclamation"></i>
          <h3>{title}</h3>
        </div>

        <div className={styles.body}>
          <p>{message}</p>
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            className={`${styles.modal_btn} ${styles.cancel_btn}`}
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="danger"
            className={styles.modal_btn}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;