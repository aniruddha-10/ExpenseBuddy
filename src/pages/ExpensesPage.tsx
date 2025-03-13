
import React from 'react';
import Layout from '@/components/Layout';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { useExpense } from '@/context/ExpenseContext';

const ExpensesPage: React.FC = () => {
  const { expenses } = useExpense();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your expenses with ease
          </p>
        </div>
        
        <ExpenseForm />
        <ExpenseList />
      </div>
    </Layout>
  );
};

export default ExpensesPage;
