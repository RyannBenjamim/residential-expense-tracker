import React, { useState } from 'react';
import type { Person } from '../../types/people';
import type { TransactionType } from '../../types/transactions';
import styles from './styles.module.css'; 

interface FormProps {
  moradores: Person[];
  onAddTransaction: (data: { description: string; amount: number; type: TransactionType; personId: string }) => void;
}

export const TransactionForm: React.FC<FormProps> = ({ moradores, onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [personId, setPersonId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !personId) return;

    onAddTransaction({
      description: description.trim(),
      amount: Math.abs(Number(amount)),
      type,
      personId,
    });

    setDescription('');
    setAmount('');
    setPersonId('');
  };

  return (
    <section className={styles.form_section}>
      <h2>Nova Transação</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.input_group}>
          <label htmlFor="description">Descrição</label>
          <input
            id="description"
            type="text"
            placeholder="Ex: Aluguel, Feira, Freelance"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="amount">Valor (R$)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="type">Tipo de Movimentação</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
            <option value="Expense">🔻 Despesa (Saída)</option>
            <option value="Income">🔺 Receita (Entrada)</option>
          </select>
        </div>

        <div className={styles.input_group}>
          <label htmlFor="person">Responsável</label>
          <select id="person" value={personId} onChange={(e) => setPersonId(e.target.value)} required>
            <option value="">Selecione quem pagou/recebeu</option>
            {moradores.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submit_btn}>
          <span><i className="fa-solid fa-sack-dollar"></i></span> Lançar Transação
        </button>
      </form>
    </section>
  );
};