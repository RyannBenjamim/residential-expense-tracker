import { TransactionForm } from '../../components/TransactionForm';
import { TransactionFilter } from '../../components/TransactionFilter';
import { TransactionItem } from '../../components/TransactionItem';
import styles from './styles.module.css';
import { useState } from 'react';

interface Transaction {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pessoaId: string;
  pessoaNome: string;
  data: string;
}

const Transactions = () => {
  const moradoresMock = [
    { id: '1', nome: 'Ryan Costa' },
    { id: '2', nome: 'Ana Silva' },
    { id: '3', nome: 'Carlos Souza' },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', descricao: 'Salário Dev', valor: 5000, tipo: 'receita', pessoaId: '1', pessoaNome: 'Ryan Costa', data: '2026-07-15' },
    { id: '2', descricao: 'Supermercado', valor: 850, tipo: 'despesa', pessoaId: '2', pessoaNome: 'Ana Silva', data: '2026-07-16' },
    { id: '3', descricao: 'Conta de Energia', valor: 320, tipo: 'despesa', pessoaId: '1', pessoaNome: 'Ryan Costa', data: '2026-07-17' },
  ]);

  const [filtroAtual, setFiltroAtual] = useState<'todos' | 'receita' | 'despesa'>('todos');

  const handleAddTransaction = (data: { descricao: string; valor: number; tipo: 'receita' | 'despesa'; pessoaId: string }) => {
    const moradorSelecionado = moradoresMock.find(m => m.id === data.pessoaId);

    const novaTransacao: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      pessoaNome: moradorSelecionado ? moradorSelecionado.nome : 'Desconhecido',
      data: new Date().toISOString().split('T')[0],
    };

    setTransactions([novaTransacao, ...transactions]);
  };

  const handleDeletar = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const transacoesFiltradas = transactions.filter(t => {
    if (filtroAtual === 'todos') return true;
    return t.tipo === filtroAtual;
  });

  return (
    <div className={styles.transactions_container}>
      <header className={styles.page_header}>
        <h1 className={styles.page_title}>Histórico de Transações</h1>
        <p className={styles.page_subtitle}>Adicione e controle as movimentações financeiras da residência</p>
      </header>

      <div className={styles.transactions_layout}>
        <TransactionForm 
          moradores={moradoresMock} 
          onAddTransaction={handleAddTransaction} 
          styles={styles} 
        />

        <section className={styles.list_section}>
          <div className={styles.list_header}>
            <h2>Registros</h2>
            <TransactionFilter 
              currentFilter={filtroAtual} 
              onFilterChange={setFiltroAtual} 
              styles={styles} 
            />
          </div>

          {transacoesFiltradas.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}>🧾</span>
              <p>Nenhuma movimentação encontrada para o filtro selecionado.</p>
            </div>
          ) : (
            <div className={styles.transactions_list}>
              {transacoesFiltradas.map((t) => (
                <TransactionItem 
                  key={t.id} 
                  transaction={t} 
                  onDelete={handleDeletar} 
                  styles={styles} 
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Transactions;