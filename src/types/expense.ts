
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
