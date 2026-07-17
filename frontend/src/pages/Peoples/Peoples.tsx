import React, { useState } from 'react';
import styles from './styles.module.css';

interface Persona {
  id: string;
  nome: string;
  idade: number;
}

const Peoples = () => {
  const [pessoas, setPessoas] = useState<Persona[]>([
    { id: '1', nome: 'Fulano Santos', idade: 21 },
    { id: '2', nome: 'Fulana Pereira', idade: 25 },
    { id: '3', nome: 'Beltrano Santos', idade: 42 },
  ]);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !idade) return;

    const novaPessoa: Persona = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      idade: Number(idade),
    };

    setPessoas([novaPessoa, ...pessoas]);
    setNome('');
    setIdade('');
  };

  const handleDeletar = (id: string) => {
    setPessoas(pessoas.filter(p => p.id !== id));
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className={styles.peoples_container}>
      <header className={styles.page_header}>
        <h1 className={styles.page_title}>Gerenciamento de Pessoas</h1>
        <p className={styles.page_subtitle}>Cadastre e gerencie os moradores da residência</p>
      </header>

      <div className={styles.peoples_layout}>
        {/* Formulário de Cadastro */}
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

        {/* Listagem de Integrantes */}
        <section className={styles.list_section}>
          <h2>Integrantes Atuais ({pessoas.length})</h2>
          
          {pessoas.length === 0 ? (
            <div className={styles.empty_state}>
              <span className={styles.empty_icon}>👥</span>
              <p>Nenhuma pessoa cadastrada ainda.</p>
            </div>
          ) : (
            <div className={styles.cards_grid}>
              {pessoas.map((pessoa) => (
                <div key={pessoa.id} className={styles.person_card}>
                  <div className={styles.card_main}>
                    <div className={styles.avatar}>
                      {getInitials(pessoa.nome)}
                    </div>
                    <div className={styles.info}>
                      <h3>{pessoa.nome}</h3>
                      <p>{pessoa.idade} {pessoa.idade === 1 ? 'ano' : 'anos'}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeletar(pessoa.id)} 
                    className={styles.delete_btn}
                    title={`Remover ${pessoa.nome}`}
                    aria-label={`Remover ${pessoa.nome}`}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Peoples;