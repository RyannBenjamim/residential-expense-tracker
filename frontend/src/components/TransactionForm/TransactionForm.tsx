import React, { useState } from 'react';
import type { Person } from '../../types/people';
import type { TransactionType } from '../../types/transactions';
import styles from './styles.module.css'; 
import InputSelect from '../InputSelect/InputSelect';
import Button from '../Button/Button';
import Message from '../Message/Message';

interface FormProps {
  moradores: Person[];
  onAddTransaction: (data: { description: string; amount: number; type: TransactionType; personId: string }) => Promise<void> | void;
}

export const TransactionForm: React.FC<FormProps> = ({ moradores, onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [personId, setPersonId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!description.trim() || !amount || !personId) return;

    const selectedPerson = moradores.find((m) => m.id === personId);
    if (selectedPerson && selectedPerson.age < 18 && type === 'Income') {
      setErrorMessage('Menores de 18 anos só podem registrar despesas.');
      return;
    }

    try {
      await onAddTransaction({
        description: description.trim(),
        amount: Math.abs(Number(amount)),
        type,
        personId,
      });

      setDescription('');
      setAmount('');
      setPersonId('');
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.message || 'Erro ao criar transação.';
      setErrorMessage(apiMessage);
    }
  };

  const moradoresOptions = moradores.map(m => ({
    value: m.id,
    label: `${m.name} (${m.age} anos)`
  }));

  return (
    <section className={styles.form_section}>
      <h2>Nova Transação</h2>

      <Message text={errorMessage} type="error" />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.input_group}>
          <label htmlFor="description">Descrição</label>
          <input
            id="description"
            type="text"
            placeholder="Ex: Aluguel, Feira, Freelance"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
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
            onChange={(e) => {
              setAmount(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            required
          />
        </div>

        <InputSelect
          id="type"
          label="Tipo de Movimentação"
          value={type}
          onChange={(val) => {
            setType(val as TransactionType);
            if (errorMessage) setErrorMessage('');
          }}
          options={[
            { value: 'Expense', label: '🔻 Despesa (Saída)' },
            { value: 'Income', label: '🔺 Receita (Entrada)' },
          ]}
          required
        />

        <InputSelect 
          id="person"
          label="Responsável"
          value={personId}
          onChange={(val) => {
            setPersonId(val);
            if (errorMessage) setErrorMessage('');
          }}
          options={moradoresOptions}
          placeholder="Selecione quem pagou/recebeu"
          required
        />

        <Button type="submit" icon="fa-solid fa-sack-dollar">
          Lançar Transação
        </Button>
      </form>
    </section>
  );
};