import React from 'react';

interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pessoaNome: string;
  data: string;
}

interface ItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  styles: Record<string, string>;
}

export const TransactionItem: React.FC<ItemProps> = ({ transaction, onDelete, styles }) => {
  const isReceita = transaction.tipo === 'receita';

  return (
    <div className={`${styles.transaction_item} ${isReceita ? styles.border_success : styles.border_danger}`}>
      <div className={styles.item_main}>
        <div className={styles.info_block}>
          <h3>{transaction.descricao}</h3>
          <div className={styles.meta_info}>
            <span className={styles.responsible}><i className="fa-regular fa-user"></i> {transaction.pessoaNome}</span>
            <span className={styles.date}><i className="fa-solid fa-calendar"></i> {transaction.data.split('-').reverse().join('/')}</span>
          </div>
        </div>
      </div>

      <div className={styles.item_actions}>
        <span className={`${styles.price} ${isReceita ? styles.text_success : styles.text_danger}`}>
          {isReceita ? '+' : '-'} R$ {transaction.valor.toFixed(2)}
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