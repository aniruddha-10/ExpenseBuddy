
import React from 'react';
import { useExpense, CATEGORIES, ExpenseCategory } from '@/context/ExpenseContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    Food: '#34D399', // green
    Transportation: '#8B5CF6', // purple
    Entertainment: '#0EA5E9', // teal
    Shopping: '#FBBF24', // yellow
    Utilities: '#9333EA', // darker purple
    Health: '#F87171', // red
    Travel: '#3B82F6', // blue
    Education: '#F59E0B', // amber
    Other: '#6B7280', // gray
  };

  return colors[category] || '#6B7280';
};

const CategoryPieChart: React.FC = () => {
  const { getExpensesByCategory, getTotalExpenses } = useExpense();
  const expensesByCategory = getExpensesByCategory();
  const totalExpenses = getTotalExpenses();

  // Prepare data for the pie chart, filtering out categories with zero value
  const pieData = CATEGORIES.map(category => ({
    name: category,
    value: expensesByCategory[category] || 0,
    percentage: totalExpenses > 0 
      ? ((expensesByCategory[category] || 0) / totalExpenses * 100).toFixed(1) 
      : '0'
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">${data.value.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name as ExpenseCategory)} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No expense data to display</p>
            </div>
          )}
        </div>
        
        {pieData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pieData.map((entry) => (
              <Badge
                key={entry.name}
                variant="outline"
                className="justify-start gap-2 px-2 py-1"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(entry.name as ExpenseCategory) }}
                />
                <span className="truncate">{entry.name}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
