import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ExpenseCategory = 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Health' 
  | 'Travel' 
  | 'Education' 
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  user_id?: string;
}

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Health',
  'Travel',
  'Education',
  'Other'
];

interface ExpenseContextType {
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

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

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
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses = data.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));

      setExpenses(formattedExpenses);
    } catch (error: any) {
      console.error('Error fetching expenses:', error.message);
      toast.error('Failed to load your expenses');
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
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            ...expense,
            user_id: userId,
            date: expense.date.toISOString()
          }
        ])
        .select();

      if (error) throw error;

      const newExpense = {
        ...data[0],
        date: new Date(data[0].date)
      };
      
      setExpenses((prev) => [newExpense, ...prev]);
      return;
    } catch (error: any) {
      console.error('Error adding expense:', error.message);
      toast.error('Failed to add expense');
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error: any) {
      console.error('Error deleting expense:', error.message);
      toast.error('Failed to delete expense');
    }
  };

  const filterByMonth = (month: number, year: number) => {
    return expenses.filter((expense) => {
      const expenseDate = expense.date;
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
  };

  const filterByDateRange = (startDate: Date, endDate: Date) => {
    return expenses.filter((expense) => {
      const expenseDate = expense.date;
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getAverageExpense = () => {
    if (expenses.length === 0) return 0;
    return getTotalExpenses() / expenses.length;
  };

  const getHighestExpense = () => {
    if (expenses.length === 0) return null;
    return expenses.reduce((max, expense) => 
      expense.amount > max.amount ? expense : max, expenses[0]);
  };

  const getLowestExpense = () => {
    if (expenses.length === 0) return null;
    return expenses.reduce((min, expense) => 
      expense.amount < min.amount ? expense : min, expenses[0]);
  };

  const getExpensesByCategory = () => {
    const categorized = CATEGORIES.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    expenses.forEach((expense) => {
      categorized[expense.category] += expense.amount;
    });

    return categorized;
  };

  const getDailyTotals = (month: number, year: number) => {
    const filteredExpenses = filterByMonth(month, year);
    const dailyTotals: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      const dateStr = expense.date.toISOString().split('T')[0];
      dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + expense.amount;
    });

    return Object.entries(dailyTotals)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getMonthlyTotals = (year: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthlyTotals = Array(12).fill(0).map((_, idx) => ({
      month: monthNames[idx],
      total: 0
    }));

    expenses.forEach((expense) => {
      const expenseDate = expense.date;
      if (expenseDate.getFullYear() === year) {
        const month = expenseDate.getMonth();
        monthlyTotals[month].total += expense.amount;
      }
    });

    return monthlyTotals;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        filterByMonth,
        filterByDateRange,
        getTotalExpenses,
        getAverageExpense,
        getHighestExpense,
        getLowestExpense,
        getExpensesByCategory,
        getDailyTotals,
        getMonthlyTotals,
        loading
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
