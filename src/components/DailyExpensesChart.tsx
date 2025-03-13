
import React, { useState } from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, getDaysInMonth } from 'date-fns';
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

const DailyExpensesChart: React.FC = () => {
  const { getDailyTotals } = useExpense();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  // Generate list of years from 5 years ago to 5 years in the future
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

  const dailyTotals = getDailyTotals(parseInt(selectedMonth), parseInt(selectedYear));

  // If there's no data, create empty data with dates for the month
  const emptyData = () => {
    const daysInMonth = getDaysInMonth(new Date(parseInt(selectedYear), parseInt(selectedMonth)));
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(parseInt(selectedYear), parseInt(selectedMonth), i + 1).toISOString().split('T')[0];
      return { date, total: 0 };
    });
  };

  const chartData = dailyTotals.length > 0 ? dailyTotals : emptyData();

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{format(new Date(label), 'MMMM dd, yyyy')}</p>
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
            <CardTitle>Daily Expenses</CardTitle>
            <CardDescription>Your daily spending for the selected month</CardDescription>
          </div>
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'dd')}
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
                fill="url(#dailyGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyExpensesChart;
