
import React, { useState } from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

const MonthlyExpensesChart: React.FC = () => {
  const { getMonthlyTotals } = useExpense();

  // Generate list of years from 5 years ago to 5 years in the future
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  const monthlyTotals = getMonthlyTotals(parseInt(selectedYear));

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">${payload[0].value?.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-container">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your monthly spending for {selectedYear}</CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTotals}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month"
                tickFormatter={(value) => value.substring(0, 3)}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                fill="url(#monthlyGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesChart;
