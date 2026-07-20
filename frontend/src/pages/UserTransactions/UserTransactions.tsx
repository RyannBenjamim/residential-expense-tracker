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

  const [moradores, setMoradores] = useState<Person[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function carregarMoradores() {
      try {
        const dadosPeople = await getPeople();
        setMoradores(dadosPeople);

        if (!personId && dadosPeople.length > 0) {
          navigate(`/extrato-integrante/${dadosPeople[0].id}`, { replace: true });
        }
      } catch (error) {
        console.error('Erro ao buscar integrantes:', error);
      } finally {
        setLoadingInitial(false);
      }
    }

    carregarMoradores();
  }, [personId, navigate]);

  useEffect(() => {
    if (!personId) return;

    const currentPersonId = personId;

    async function carregarTransacoesDoUsuario() {
      setLoadingTransactions(true);
      try {
        const transacoes = await findByPersonId(currentPersonId);
        setUserTransactions(transacoes);
        setCurrentPage(1);
      } catch (error) {
        console.error(`Erro ao buscar transações da pessoa ${personId}:`, error);
        setUserTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    }

    carregarTransacoesDoUsuario();
  }, [personId]);

  const usuarioSelecionado = moradores.find(m => m.id === personId);

  const handleSelectChange = (id: string) => {
    if (id) {
      navigate(`/extrato-integrante/${id}`);
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const transacoesPaginadas = userTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < userTransactions.length;

  const handleDeletarTransacao = async (id: string) => {
    try {
      await removeTransaction(id);
      setUserTransactions((prev) => {
        const novaLista = prev.filter(t => t.id !== id);
        
        const totalPaginas = Math.ceil(novaLista.length / ITEMS_PER_PAGE);
        if (currentPage > totalPaginas && currentPage > 1) {
          setCurrentPage(totalPaginas);
        }

        return novaLista;
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(/\s+/);
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0] ? names[0][0].toUpperCase() : '?';
  };

  const moradoresOptions = moradores.map(m => ({
    value: m.id,
    label: m.name
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
          options={moradoresOptions}
          placeholder={moradores.length === 0 ? "Nenhum integrante cadastrado" : "Selecione um integrante"}
        />
      </div>

      {usuarioSelecionado ? (
        <div className={styles.content_layout}>
          <aside className={styles.profile_card}>
            <div className={styles.avatar}>
              {getInitials(usuarioSelecionado.name)}
            </div>
            <h2>{usuarioSelecionado.name}</h2>
            <p className={styles.user_age}>
              {usuarioSelecionado.age} {usuarioSelecionado.age === 1 ? 'ano' : 'anos'}
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
                  {transacoesPaginadas.map((t) => (
                    <TransactionItem 
                      key={t.id} 
                      transaction={t} 
                      personName={usuarioSelecionado.name}
                      onDelete={handleDeletarTransacao} 
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