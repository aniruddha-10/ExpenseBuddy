
import { ExpenseCategory, Expense, CATEGORIES } from '@/types/expense';
import { createContext, useContext } from 'react';

export interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'user_id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  filterByMonth: (month: number, year: number) => Expense[];
  filterByDateRange: (startDate: Date, endDate: Date) => Expense[];
  getTotalExpenses: () => number;
  getAverageExpense: () => number;
  getHighestExpense: () => Expense | null;
  getLowestExpense: () => Expense | null;
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
  getDailyTotals: (month: number, year: number) => { date: string; total: number }[];
  getMonthlyTotals: (year: number) => { month: string; total: number }[];
  loading: boolean;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export { CATEGORIES };
