import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findAll as getPeople } from '../../api/people.service';
import { findByPersonId, remove as removeTransaction } from '../../api/transactions.service';
import type { Person } from '../../types/people';
import type { Transaction } from '../../types/transactions';
import { TransactionItem } from '../../components/TransactionItem/TransactionItem';
import InputSelect from '../../components/InputSelect/InputSelect';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination';
import styles from './styles.module.css';

const ITEMS_PER_PAGE = 5;

const UserTransactions = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();

  const [residents, setResidents] = useState<Person[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadResidents() {
      try {
        const peopleData = await getPeople();
        setResidents(peopleData);

        if (!personId && peopleData.length > 0) {
          navigate(`/extrato-integrante/${peopleData[0].id}`, { replace: true });
        }
      } catch (error) {
        console.error('Error fetching residents:', error);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadResidents();
  }, [personId, navigate]);

  useEffect(() => {
    if (!personId) return;

    const currentPersonId = personId;

    async function loadUserTransactions() {
      setLoadingTransactions(true);
      try {
        const transactions = await findByPersonId(currentPersonId);
        setUserTransactions(transactions);
        setCurrentPage(1);
      } catch (error) {
        console.error(`Error fetching transactions for person ${personId}:`, error);
        setUserTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    }

    loadUserTransactions();
  }, [personId]);

  const selectedUser = residents.find(r => r.id === personId);

  const handleSelectChange = (id: string) => {
    if (id) {
      navigate(`/extrato-integrante/${id}`);
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedTransactions = userTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < userTransactions.length;

  const handleDeleteTransaction = async (id: string) => {
    try {
      await removeTransaction(id);
      setUserTransactions((prev) => {
        const updatedList = prev.filter(t => t.id !== id);
        
        const totalPages = Math.ceil(updatedList.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(totalPages);
        }

        return updatedList;
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(/\s+/);
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0] ? names[0][0].toUpperCase() : '?';
  };

  const residentsOptions = residents.map(r => ({
    value: r.id,
    label: r.name
  }));

  if (loadingInitial) {
    return (
      <div className={styles.container}>
        <div className={styles.empty_state}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.page_header}>
        <h1 className={styles.page_title}>Extrato por Integrante</h1>
        <p className={styles.page_subtitle}>Histórico financeiro individual do morador</p>
      </header>

      <div className={styles.select_box}>
        <InputSelect 
          id="user-select"
          label="Buscar Integrante:"
          value={personId || ''} 
          onChange={handleSelectChange}
          options={residentsOptions}
          placeholder={residents.length === 0 ? "Nenhum integrante cadastrado" : "Selecione um integrante"}
        />
      </div>

      {selectedUser ? (
        <div className={styles.content_layout}>
          <aside className={styles.profile_card}>
            <div className={styles.avatar}>
              {getInitials(selectedUser.name)}
            </div>
            <h2>{selectedUser.name}</h2>
            <p className={styles.user_age}>
              {selectedUser.age} {selectedUser.age === 1 ? 'ano' : 'anos'}
            </p>
            <div className={styles.meta_info}>
              <span>Total de movimentações: <strong>{userTransactions.length}</strong></span>
            </div>
          </aside>

          <section className={styles.list_section}>
            <h3>Histórico de Movimentações</h3>
            
            {loadingTransactions ? (
              <div className={styles.loading_wrapper}>
                <Loading />
              </div>
            ) : userTransactions.length === 0 ? (
              <div className={styles.empty_state_inside}>
                <span className={styles.empty_icon}><i className="fa-solid fa-receipt"></i></span>
                <p>Este usuário não possui transações registradas.</p>
              </div>
            ) : (
              <>
                <div className={styles.transactions_list}>
                  {paginatedTransactions.map((t) => (
                    <TransactionItem 
                      key={t.id} 
                      transaction={t} 
                      personName={selectedUser.name}
                      onDelete={handleDeleteTransaction} 
                    />
                  ))}
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
      ) : (
        <div className={styles.empty_state}>
          <p>Integrante não encontrado ou nenhum morador cadastrado.</p>
        </div>
      )}
    </div>
  );
};

export default UserTransactions;