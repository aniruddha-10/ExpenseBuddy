
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Expense, CATEGORIES, ExpenseCategory } from '@/types/expense';
import { ExpenseContext, ExpenseContextType } from '@/hooks/useExpenseContext';
import { 
  fetchUserExpenses, 
  addExpenseToDb, 
  deleteExpenseFromDb 
} from '@/services/expenseService';
import {
  filterByMonth,
  filterByDateRange,
  getTotalExpenses,
  getAverageExpense,
  getHighestExpense,
  getLowestExpense,
  getExpensesByCategory,
  getDailyTotals,
  getMonthlyTotals
} from '@/utils/expenseUtils';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await fetchUserExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id'>) => {
    if (!isAuthenticated || !userId) {
      toast.error('You must be logged in to add expenses');
      return;
    }

    try {
      const newExpense = await addExpenseToDb(expense, userId);
      setExpenses((prev) => [newExpense, ...prev]);
      return;
    } catch (error: any) {
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const success = await deleteExpenseFromDb(id);
      if (success) {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      }
    } catch (error: any) {
      console.error('Error deleting expense:', error.message);
    }
  };

  // Create wrapper functions that use the utility functions with the current expenses state
  const contextValue: ExpenseContextType = {
    expenses,
    addExpense,
    deleteExpense,
    filterByMonth: (month, year) => filterByMonth(expenses, month, year),
    filterByDateRange: (startDate, endDate) => filterByDateRange(expenses, startDate, endDate),
    getTotalExpenses: () => getTotalExpenses(expenses),
    getAverageExpense: () => getAverageExpense(expenses),
    getHighestExpense: () => getHighestExpense(expenses),
    getLowestExpense: () => getLowestExpense(expenses),
    getExpensesByCategory: () => getExpensesByCategory(expenses, CATEGORIES),
    getDailyTotals: (month, year) => getDailyTotals(expenses, month, year),
    getMonthlyTotals: (year) => getMonthlyTotals(expenses, year),
    loading
  };

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Re-export for convenience
export { useExpense } from '@/hooks/useExpenseContext';
export type { ExpenseCategory, Expense };
export { CATEGORIES };
