
import React from 'react';
import Layout from '@/components/Layout';
import ExpenseSummary from '@/components/ExpenseSummary';
import DailyExpensesChart from '@/components/DailyExpensesChart';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalysisPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Expense Analysis</h1>
          <p className="text-muted-foreground">
            Visualize and analyze your spending patterns
          </p>
        </div>
        
        <ExpenseSummary />

        <Tabs defaultValue="charts" className="w-full">
          <TabsList>
            <TabsTrigger value="charts">Expense Charts</TabsTrigger>
            <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-6 pt-4">
            <DailyExpensesChart />
            <MonthlyExpensesChart />
          </TabsContent>
          
          <TabsContent value="breakdown" className="pt-4">
            <CategoryPieChart />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AnalysisPage;
