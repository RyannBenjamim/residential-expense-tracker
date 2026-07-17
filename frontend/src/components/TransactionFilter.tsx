import React from 'react';

type FilterType = 'todos' | 'receita' | 'despesa';

interface FilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  styles: Record<string, string>;
}

export const TransactionFilter: React.FC<FilterProps> = ({ currentFilter, onFilterChange, styles }) => {
  return (
    <div className={styles.filter_tabs}>
      {(['todos', 'receita', 'despesa'] as FilterType[]).map((type) => (
        <button
          key={type}
          className={`${styles.tab_btn} ${currentFilter === type ? styles.tab_active : ''}`}
          onClick={() => onFilterChange(type)}
        >
          {type === 'todos' ? 'Todas' : type === 'receita' ? 'Receitas' : 'Despesas'}
        </button>
      ))}
    </div>
  );
};