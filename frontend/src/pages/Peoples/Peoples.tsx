import React, { useEffect, useState } from 'react';
import { 
  create as createPerson, 
  findAll as getPeople, 
  remove as removePerson 
} from '../../api/people.service'; 
import type { Person } from '../../types/people';
import styles from './styles.module.css';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination'; 

const ITEMS_PER_PAGE = 6;

const Peoples = () => {
  const [pessoas, setPessoas] = useState<Person[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function carregarPessoas() {
      try {
        const dados = await getPeople();
        setPessoas(dados);
      } catch (error) {
        console.error('Erro ao buscar pessoas do banco:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarPessoas();
  }, []);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !idade) return;

    try {
      const novaPessoa = await createPerson({
        name: nome.trim(),
        age: Number(idade),
      });

      setPessoas((prev) => [novaPessoa, ...prev]);
      setNome('');
      setIdade('');
      setCurrentPage(1); 
    } catch (error) {
      console.error('Erro ao cadastrar pessoa:', error);
    }
  };

  const handleDeletar = async (id: string) => {
    try {
      await removePerson(id);
      setPessoas((prev) => {
        const novaLista = prev.filter(p => p.id !== id);
        
        const totalPaginasApisDeletar = Math.ceil(novaLista.length / ITEMS_PER_PAGE);
        if (currentPage > totalPaginasApisDeletar && currentPage > 1) {
          setCurrentPage(totalPaginasApisDeletar);
        }
        
        return novaLista;
      });
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error);
    }
  };

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(/\s+/);
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0] ? names[0][0].toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className={styles.peoples_container}>
        <header className={styles.page_header}>
          <h1 className={styles.page_title}>Gerenciamento de Pessoas</h1>
        </header>
        <div className={styles.empty_state}>
          <Loading />
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPeople = pessoas.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < pessoas.length;

  return (
    <div className={styles.peoples_container}>
      <header className={styles.page_header}>
        <h1 className={styles.page_title}>Gerenciamento de Pessoas</h1>
        <p className={styles.page_subtitle}>Cadastre e gerencie os moradores da residência</p>
      </header>

      <div className={styles.peoples_layout}>
        <section className={styles.form_section}>
          <h2>Novo Integrante</h2>
          <form onSubmit={handleCadastrar} className={styles.form}>
            <div className={styles.input_group}>
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: Ryan Costa"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className={styles.input_group}>
              <label htmlFor="idade">Idade</label>
              <input
                id="idade"
                type="number"
                placeholder="Ex: 21"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                min="0"
                max="120"
                required
              />
            </div>

            <button type="submit" className={styles.submit_btn}>
              <span><i className="fa-solid fa-plus"></i></span> Adicionar Pessoa
            </button>
          </form>
        </section>

        <section className={styles.list_section}>
          <h2>Integrantes Atuais ({pessoas.length})</h2>
          
          {pessoas.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}><i className="fa-solid fa-user-group"></i></span>
              <p>Nenhuma pessoa cadastrada ainda.</p>
            </div>
          ) : (
            <>
              <div className={styles.cards_grid}>
                {currentPeople.map((pessoa) => (
                  <div key={pessoa.id} className={styles.person_card}>
                    <div className={styles.card_main}>
                      <div className={styles.avatar}>
                        {getInitials(pessoa.name)}
                      </div>
                      <div className={styles.info}>
                        <h3>{pessoa.name}</h3>
                        <p>{pessoa.age} {pessoa.age === 1 ? 'ano' : 'anos'}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeletar(pessoa.id)} 
                      className={styles.delete_btn}
                      title={`Remover ${pessoa.name}`}
                      aria-label={`Remover ${pessoa.name}`}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
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
    </div>
  );
};

export default Peoples;