export interface Person {
  id: string;
  name: string;
  age: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CreatePerson {
  name: string;
  age: number; 
}

export type UpdatePerson = Partial<CreatePerson>;

export interface Dashboard {
  people: Person[];
  generalIncome: number;
  generalExpenses: number;
  netBalance: number;
}