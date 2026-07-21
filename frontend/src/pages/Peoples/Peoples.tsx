import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  create as createPerson, 
  findAll as getPeople, 
  remove as removePerson 
} from '../../api/people.service'; 
import type { Person } from '../../types/people';
import styles from './styles.module.css';
import Loading from '../../components/Loading/Loading';
import Pagination from '../../components/Pagination/Pagination'; 
import Button from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';

const ITEMS_PER_PAGE = 6;

const Peoples = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  useEffect(() => {
    async function loadPeople() {
      try {
        const data = await getPeople();
        setPeople(data);
      } catch (error) {
        console.error('Error fetching people from database:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPeople();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;

    try {
      const newPerson = await createPerson({
        name: name.trim(),
        age: Number(age),
      });

      setPeople((prev) => [newPerson, ...prev]);
      setName('');
      setAge('');
      setCurrentPage(1); 
    } catch (error) {
      console.error('Error registering person:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;

    try {
      await removePerson(personToDelete.id);
      setPeople((prev) => {
        const updatedList = prev.filter((p) => p.id !== personToDelete.id);
        
        const totalPages = Math.ceil(updatedList.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(totalPages);
        }
        
        return updatedList;
      });
    } catch (error) {
      console.error('Error deleting person:', error);
    } finally {
      setPersonToDelete(null);
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
        <Header title="Gerenciamento de Pessoas" />
        <div className={styles.empty_state}>
          <Loading />
        </div>
      </div>
    );
  }

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentPeople = people.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < people.length;

  return (
    <div className={styles.peoples_container}>
      <Header 
        title="Gerenciamento de Pessoas" 
        subtitle="Cadastre e gerencie os moradores da residência" 
      />

      <div className={styles.peoples_layout}>
        <section className={styles.form_section}>
          <h2>Novo Integrante</h2>
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.input_group}>
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="120"
                required
              />
            </div>

            <Button type="submit" icon="fa-solid fa-plus">
              Adicionar Pessoa
            </Button>
          </form>
        </section>

        <section className={styles.list_section}>
          <h2>Integrantes Atuais ({people.length})</h2>
          
          {people.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}><i className="fa-solid fa-user-group"></i></span>
              <p>Nenhuma pessoa cadastrada ainda.</p>
            </div>
          ) : (
            <>
              <div className={styles.cards_grid}>
                {currentPeople.map((person) => (
                  <div key={person.id} className={styles.person_card}>
                    <div className={styles.card_main}>
                      <div className={styles.avatar}>
                        {getInitials(person.name)}
                      </div>
                      <div className={styles.info}>
                        <h3>{person.name}</h3>
                        <p>{person.age} {person.age === 1 ? 'ano' : 'anos'}</p>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <Link 
                        to={`/extrato-integrante/${person.id}`} 
                        className={styles.extrato_btn}
                        title={`Ver extrato de ${person.name}`}
                      >
                        <i className="fa-solid fa-receipt"></i>
                      </Link>

                      <button 
                        onClick={() => setPersonToDelete(person)} 
                        className={styles.delete_btn}
                        title={`Remover ${person.name}`}
                        aria-label={`Remover ${person.name}`}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
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

      <ConfirmModal
        isOpen={Boolean(personToDelete)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover ${personToDelete?.name}? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPersonToDelete(null)}
      />
    </div>
  );
};

export default Peoples;