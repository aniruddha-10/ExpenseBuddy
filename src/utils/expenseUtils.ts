
import { Expense, ExpenseCategory } from '@/types/expense';

export const filterByMonth = (expenses: Expense[], month: number, year: number) => {
  return expenses.filter((expense) => {
    const expenseDate = expense.date;
    return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
  });
};

export const filterByDateRange = (expenses: Expense[], startDate: Date, endDate: Date) => {
  return expenses.filter((expense) => {
    const expenseDate = expense.date;
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

export const getTotalExpenses = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getAverageExpense = (expenses: Expense[]) => {
  if (expenses.length === 0) return 0;
  return getTotalExpenses(expenses) / expenses.length;
};

export const getHighestExpense = (expenses: Expense[]) => {
  if (expenses.length === 0) return null;
  return expenses.reduce((max, expense) => 
    expense.amount > max.amount ? expense : max, expenses[0]);
};

export const getLowestExpense = (expenses: Expense[]) => {
  if (expenses.length === 0) return null;
  return expenses.reduce((min, expense) => 
    expense.amount < min.amount ? expense : min, expenses[0]);
};

export const getExpensesByCategory = (expenses: Expense[], categories: ExpenseCategory[]) => {
  const categorized = categories.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  expenses.forEach((expense) => {
    categorized[expense.category] += expense.amount;
  });

  return categorized;
};

export const getDailyTotals = (expenses: Expense[], month: number, year: number) => {
  const filteredExpenses = filterByMonth(expenses, month, year);
  const dailyTotals: Record<string, number> = {};

  filteredExpenses.forEach((expense) => {
    const dateStr = expense.date.toISOString().split('T')[0];
    dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + expense.amount;
  });

  return Object.entries(dailyTotals)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getMonthlyTotals = (expenses: Expense[], year: number) => {
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
