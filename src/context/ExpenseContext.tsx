
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  userId?: string;
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
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  filterByMonth: (month: number, year: number) => Expense[];
  filterByDateRange: (startDate: Date, endDate: Date) => Expense[];
  getTotalExpenses: () => number;
  getAverageExpense: () => number;
  getHighestExpense: () => Expense | null;
  getLowestExpense: () => Expense | null;
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
  getDailyTotals: (month: number, year: number) => { date: string; total: number }[];
  getMonthlyTotals: (year: number) => { month: string; total: number }[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'budget-tracker-expenses';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isAuthenticated } = useAuth();
  const storageKey = userId ? `${LOCAL_STORAGE_KEY}-${userId}` : LOCAL_STORAGE_KEY;
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (!isAuthenticated) return [];
    
    const storedExpenses = localStorage.getItem(storageKey);
    if (storedExpenses) {
      try {
        // Convert string dates back to Date objects
        return JSON.parse(storedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
      } catch (error) {
        console.error('Error parsing expenses from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && userId) {
      localStorage.setItem(storageKey, JSON.stringify(expenses));
    }
  }, [expenses, isAuthenticated, userId, storageKey]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      userId: userId || undefined,
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
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

    // Convert to array and sort by date
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
