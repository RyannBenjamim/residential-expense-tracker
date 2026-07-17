import React, { useState } from 'react';

interface Morador {
  id: string;
  nome: string;
}

interface FormProps {
  moradores: Morador[];
  onAddTransaction: (data: { descricao: string; valor: number; tipo: 'receita' | 'despesa'; pessoaId: string }) => void;
  styles: Record<string, string>;
}

export const TransactionForm: React.FC<FormProps> = ({ moradores, onAddTransaction, styles }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [pessoaId, setPessoaId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valor || !pessoaId) return;

    onAddTransaction({
      descricao: descricao.trim(),
      valor: Math.abs(Number(valor)),
      tipo,
      pessoaId,
    });

    setDescricao('');
    setValor('');
    setPessoaId('');
  };

  return (
    <section className={styles.form_section}>
      <h2>Nova Transação</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.input_group}>
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Ex: Aluguel, Feira, Freelance"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="tipo">Tipo de Movimentação</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as 'receita' | 'despesa')}>
            <option value="despesa">🔻 Despesa (Saída)</option>
            <option value="receita">🔺 Receita (Entrada)</option>
          </select>
        </div>

        <div className={styles.input_group}>
          <label htmlFor="pessoa">Responsável</label>
          <select id="pessoa" value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
            <option value="">Selecione quem pagou/recebeu</option>
            {moradores.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
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