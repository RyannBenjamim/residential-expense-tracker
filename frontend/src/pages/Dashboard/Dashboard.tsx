import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { getDashboard } from '../../api/people.service'; 
import type { Dashboard as DashboardData } from '../../types/people'; 
import styles from './styles.module.css';
import Loading from '../../components/Loading/Loading';

const Dashboard = () => {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const response = await getDashboard();
        setDados(response);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard_container}>
        <h1 className={styles.page_title}>Dashboard</h1>
        <div className={styles.loading_state}>
          <Loading />
        </div>
      </div>
    );
  }

  const people = dados?.people || [];
  const totalReceitas = dados?.generalIncome || 0;
  const totalDespesas = dados?.generalExpenses || 0;
  const saldoLiquido = dados?.netBalance || 0;

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
                {people.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td><strong>{pessoa.name}</strong></td>
                    <td className={styles.success}>R$ {pessoa.totalIncome.toFixed(2)}</td>
                    <td className={styles.danger}>R$ {pessoa.totalExpenses.toFixed(2)}</td>
                    <td className={pessoa.balance >= 0 ? styles.success : styles.danger}>
                      <strong>R$ {pessoa.balance.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.chart_section}>
          <h3>Comparativo de Saldos</h3>
          <div className={styles.chart_scroll_container}>
            <BarChart 
              width={people.length > 5 ? people.length * 80 : 500} 
              height={250} 
              data={people} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--color-surface)', 
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)' 
                }} 
              />
              <Bar dataKey="balance" barSize={40}>
                {people.map((entry) => (
                  <Cell 
                    key={`cell-${entry.id}`} 
                    fill={entry.balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;