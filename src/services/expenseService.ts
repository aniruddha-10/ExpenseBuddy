
import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types/expense';
import { toast } from 'sonner';

export const fetchUserExpenses = async () => {
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

    return formattedExpenses;
  } catch (error: any) {
    console.error('Error fetching expenses:', error.message);
    toast.error('Failed to load your expenses');
    return [];
  }
};

export const addExpenseToDb = async (expense: Omit<Expense, 'id' | 'user_id'>, userId: string) => {
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

    return {
      ...data[0],
      date: new Date(data[0].date)
    };
  } catch (error: any) {
    console.error('Error adding expense:', error.message);
    toast.error('Failed to add expense');
    throw error;
  }
};

export const deleteExpenseFromDb = async (id: string) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting expense:', error.message);
    toast.error('Failed to delete expense');
    return false;
  }
};
