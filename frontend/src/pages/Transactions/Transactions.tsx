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
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const ITEMS_PER_PAGE = 4;

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [residents, setResidents] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<'todos' | 'receita' | 'despesa'>('todos');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [transactionsData, peopleData] = await Promise.all([
          getTransactions(),
          getPeople()
        ]);
        setTransactions(transactionsData);
        setResidents(peopleData);
      } catch (error) {
        console.error('Error fetching data from database:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAddTransaction = async (data: { description: string; amount: number; type: TransactionType; personId: string }) => {
    try {
      const newTransaction = await createTransaction(data);
      setTransactions((prev) => [newTransaction, ...prev]);
      setCurrentPage(1); 
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await removeTransaction(transactionToDelete.id);

      setTransactions((prev) => {
        const updatedList = prev.filter(t => t.id !== transactionToDelete.id);
        
        const updatedFilteredList = updatedList.filter(t => {
          if (currentFilter === 'todos') return true;
          const isIncome = t.type === 'Income' || t.type === 0;
          const isExpense = t.type === 'Expense' || t.type === 1;
          return currentFilter === 'receita' ? isIncome : isExpense;
        });

        const totalPages = Math.ceil(updatedFilteredList.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(totalPages);
        }

        return updatedList;
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setTransactionToDelete(null);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (currentFilter === 'todos') return true;

    const isIncome = t.type === 'Income' || t.type === 0;
    const isExpense = t.type === 'Expense' || t.type === 1;

    if (currentFilter === 'receita') return isIncome;
    if (currentFilter === 'despesa') return isExpense;
    return true;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < filteredTransactions.length;

  const handleFilterChange = (newFilter: 'todos' | 'receita' | 'despesa') => {
    setCurrentFilter(newFilter);
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
          moradores={residents} 
          onAddTransaction={handleAddTransaction} 
        />

        <section className={styles.list_section}>
          <div className={styles.list_header}>
            <h2>Registros</h2>
            <TransactionFilter 
              currentFilter={currentFilter} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}><i className="fa-solid fa-receipt"></i></span>
              <p>Nenhuma movimentação encontrada.</p>
            </div>
          ) : (
            <>
              <div className={styles.transactions_list}>
                {paginatedTransactions.map((t) => {
                  const resident = residents.find(m => m.id === t.personId);
                  return (
                    <TransactionItem 
                      key={t.id} 
                      transaction={t} 
                      personName={resident ? resident.name : 'Desconhecido'}
                      onDelete={() => setTransactionToDelete(t)} 
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

      <ConfirmModal
        isOpen={Boolean(transactionToDelete)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover a transação "${transactionToDelete?.description}"? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
};

export default Transactions;