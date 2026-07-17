export type TransactionType = 'Income' | 'Expense' | 0 | 1;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  personId: string;
  createdAt?: string; 
}

export interface CreateTransaction {
  description: string;
  amount: number; 
  type: TransactionType;
  personId: string;
}