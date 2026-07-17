import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './styles.module.css';

interface PersonaBalance {
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

const Dashboard = () => {
  const dadosCasas: PersonaBalance[] = [
    { nome: 'Fulano', receitas: 5000, despesas: 2500, saldo: 2500 },
    { nome: 'Beltrano', receitas: 3200, despesas: 3500, saldo: -300 },
    { nome: 'Fulana', receitas: 6000, despesas: 800, saldo: 400 },
  ];

  const totalReceitas = dadosCasas.reduce((acc, curr) => acc + curr.receitas, 0);
  const totalDespesas = dadosCasas.reduce((acc, curr) => acc + curr.despesas, 0);
  const saldoLiquido = totalReceitas - totalDespesas;

  return (
    <div className={styles.dashboard_container}>
      <h1 className={styles.page_title}>Dashboard</h1>

      <div className={styles.cards_grid}>
        <div className={styles.card}>
          <h3>Total Receitas</h3>
          <p className={`${styles.value} ${styles.success}`}>R$ {totalReceitas.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Despesas</h3>
          <p className={`${styles.value} ${styles.danger}`}>R$ {totalDespesas.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Saldo Líquido</h3>
          <p className={`${styles.value} ${saldoLiquido >= 0 ? styles.success : styles.danger}`}>
            R$ {saldoLiquido.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={styles.dashboard_content}>
        
        <div className={styles.table_section}>
          <h3>Balanço por Pessoa</h3>
          <div className={styles.table_wrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Receitas</th>
                  <th>Despesas</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {dadosCasas.map((pessoa, index) => (
                  <tr key={index}>
                    <td><strong>{pessoa.nome}</strong></td>
                    <td className={styles.success}>R$ {pessoa.receitas.toFixed(2)}</td>
                    <td className={styles.danger}>R$ {pessoa.despesas.toFixed(2)}</td>
                    <td className={pessoa.saldo >= 0 ? styles.success : styles.danger}>
                      <strong>R$ {pessoa.saldo.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.chart_section}>
          <h3>Comparativo de Saldos</h3>
          <div className={styles.chart_wrapper}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosCasas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)' 
                  }} 
                />
                <Bar dataKey="saldo">
                  {dadosCasas.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.saldo >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;