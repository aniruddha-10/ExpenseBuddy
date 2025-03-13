
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, BarChart2, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const ExpenseSummary: React.FC = () => {
  const { 
    getTotalExpenses, 
    getAverageExpense, 
    getHighestExpense,
    getLowestExpense 
  } = useExpense();

  const totalExpenses = getTotalExpenses();
  const averageExpense = getAverageExpense();
  const highestExpense = getHighestExpense();
  const lowestExpense = getLowestExpense();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Across all recorded expenses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageExpense.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per expense entry</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-budget-red" />
        </CardHeader>
        <CardContent>
          {highestExpense ? (
            <>
              <div className="text-2xl font-bold">${highestExpense.amount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {highestExpense.title} on {format(highestExpense.date, 'MMM dd, yyyy')}
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lowest Expense</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-budget-green" />
        </CardHeader>
        <CardContent>
          {lowestExpense ? (
            <>
              <div className="text-2xl font-bold">${lowestExpense.amount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {lowestExpense.title} on {format(lowestExpense.date, 'MMM dd, yyyy')}
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">$0.00</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
