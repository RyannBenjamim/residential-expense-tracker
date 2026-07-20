import React from 'react';
import type { Transaction } from '../../types/transactions';
import styles from './styles.module.css'; 
import { formatCurrencyBR } from '../../utils/formatCurrencyBR';

interface ItemProps {
  transaction: Transaction;
  personName: string;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<ItemProps> = ({ transaction, personName, onDelete }) => {
  const isReceita = transaction.type === 'Income' || transaction.type === 0;

  const formatarData = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('pt-BR');
    const dataObj = new Date(dateString);
    return dataObj.toLocaleDateString('pt-BR');
  };

  return (
    <div className={`${styles.transaction_item} ${isReceita ? styles.border_success : styles.border_danger}`}>
      <div className={styles.item_main}>
        <div className={styles.info_block}>
          <h3>{transaction.description}</h3>
          <div className={styles.meta_info}>
            <span className={styles.responsible}>
              <i className="fa-regular fa-user"></i> {personName}
            </span>
            <span className={styles.date}>
              <i className="fa-solid fa-calendar"></i> {formatarData(transaction.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.item_actions}>
        <span className={`${styles.price} ${isReceita ? styles.text_success : styles.text_danger}`}>
          {isReceita ? '+' : '-'} R$ {formatCurrencyBR(transaction.amount)}
        </span>
        
        <button 
          onClick={() => onDelete(transaction.id)} 
          className={styles.delete_btn}
          title="Excluir transação"
          aria-label="Excluir transação"
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};