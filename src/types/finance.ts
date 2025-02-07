export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface CategoryExpenses {
  investment: ExpenseItem[];
  debt: ExpenseItem[];
  needs: ExpenseItem[];
  leisure: ExpenseItem[];
}

export interface MonthlyData {
  id: string;
  month: string;
  salary: number;
  expenses: CategoryExpenses;
}