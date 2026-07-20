import { useEffect, useState } from 'react';
import { TransactionForm } from '../../components/TransactionForm/TransactionForm';
import { TransactionFilter } from '../../components/TransactionFilter/TransactionFilter';
import { TransactionItem } from '../../components/TransactionItem/TransactionItem';
import { findAll as getPeople } from '../../api/people.service';
import { 
  findAll as getTransactions, 
  create as createTransaction, 
  remove as removeTransaction 
} from '../../api/transactions.service';
import type { Person } from '../../types/people';
import type { Transaction, TransactionType } from '../../types/transactions';
import styles from './styles.module.css';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination';
import { Header } from '../../components/Header/Header';

const ITEMS_PER_PAGE = 4;

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [moradores, setMoradores] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState<'todos' | 'receita' | 'despesa'>('todos');
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosTransactions, dadosPeople] = await Promise.all([
          getTransactions(),
          getPeople()
        ]);
        setTransactions(dadosTransactions);
        setMoradores(dadosPeople);
      } catch (error) {
        console.error('Erro ao buscar dados do banco:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const handleAddTransaction = async (data: { description: string; amount: number; type: TransactionType; personId: string }) => {
    try {
      const novaTransacao = await createTransaction(data);
      setTransactions((prev) => [novaTransacao, ...prev]);
      setCurrentPage(1); 
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      throw error;
    }
  };

  const handleDeletar = async (id: string) => {
    try {
      await removeTransaction(id);
      setTransactions((prev) => {
        const novaLista = prev.filter(t => t.id !== id);
        
        const listaFiltradaAtualizada = novaLista.filter(t => {
          if (filtroAtual === 'todos') return true;
          const isIncome = t.type === 'Income' || t.type === 0;
          const isExpense = t.type === 'Expense' || t.type === 1;
          return filtroAtual === 'receita' ? isIncome : isExpense;
        });

        const totalPaginas = Math.ceil(listaFiltradaAtualizada.length / ITEMS_PER_PAGE);
        if (currentPage > totalPaginas && currentPage > 1) {
          setCurrentPage(totalPaginas);
        }

        return novaLista;
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const transacoesFiltradas = transactions.filter(t => {
    if (filtroAtual === 'todos') return true;

    const isIncome = t.type === 'Income' || t.type === 0;
    const isExpense = t.type === 'Expense' || t.type === 1;

    if (filtroAtual === 'receita') return isIncome;
    if (filtroAtual === 'despesa') return isExpense;
    return true;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const transacoesPaginadas = transacoesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < transacoesFiltradas.length;

  const handleFilterChange = (novoFiltro: 'todos' | 'receita' | 'despesa') => {
    setFiltroAtual(novoFiltro);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={styles.transactions_container}>
        <Header 
          title="Histórico de Transações" 
        />
        <div className={styles.empty_state}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.transactions_container}>
      <Header 
        title="Histórico de Transações" 
        subtitle="Adicione e controle as movimentações financeiras da residência" 
      />

      <div className={styles.transactions_layout}>
        <TransactionForm 
          moradores={moradores} 
          onAddTransaction={handleAddTransaction} 
        />

        <section className={styles.list_section}>
          <div className={styles.list_header}>
            <h2>Registros</h2>
            <TransactionFilter 
              currentFilter={filtroAtual} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {transacoesFiltradas.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}><i className="fa-solid fa-receipt"></i></span>
              <p>Nenhuma movimentação encontrada.</p>
            </div>
          ) : (
            <>
              <div className={styles.transactions_list}>
                {transacoesPaginadas.map((t) => {
                  const morador = moradores.find(m => m.id === t.personId);
                  return (
                    <TransactionItem 
                      key={t.id} 
                      transaction={t} 
                      personName={morador ? morador.name : 'Desconhecido'}
                      onDelete={handleDeletar} 
                    />
                  );
                })}
              </div>

              <Pagination 
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                setCurrentPage={setCurrentPage}
                marginTop_size="24px"
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Transactions;