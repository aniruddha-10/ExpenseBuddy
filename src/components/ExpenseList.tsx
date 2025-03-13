import React, { useState } from 'react';
import { useExpense, ExpenseCategory } from '@/context/ExpenseContext';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrashIcon, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

const getCategoryColor = (category: ExpenseCategory) => {
  const colors: Record<ExpenseCategory, string> = {
    Food: 'bg-budget-green text-white',
    Transportation: 'bg-budget-purple text-white',
    Entertainment: 'bg-budget-teal text-white',
    Shopping: 'bg-budget-yellow text-black',
    Utilities: 'bg-budget-purple text-white',
    Health: 'bg-red-500 text-white',
    Travel: 'bg-blue-500 text-white',
    Education: 'bg-yellow-500 text-black',
    Other: 'bg-gray-500 text-white',
  };

  return colors[category] || 'bg-gray-500 text-white';
};

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, loading } = useExpense();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());
  
  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ];

  const filteredExpenses = expenses.filter(expense => {
    return (
      expense.date.getMonth() === parseInt(selectedMonth) &&
      expense.date.getFullYear() === parseInt(selectedYear)
    );
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = a.date.getTime();
    const dateB = b.date.getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleDeleteExpense = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteExpense(id);
      toast.success('Expense deleted successfully!');
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Expenses</h2>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={`Sort by date ${sortOrder === 'asc' ? 'oldest first' : 'newest first'}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      ) : sortedExpenses.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">No expenses found for this period</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedExpenses.map(expense => (
            <Card key={expense.id} className="expense-card overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{expense.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {format(expense.date, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xl font-bold">${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <Badge className={getCategoryColor(expense.category)}>
                    {expense.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                    disabled={isDeleting === expense.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {isDeleting === expense.id ? 
                      'Deleting...' : 
                      <TrashIcon className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
