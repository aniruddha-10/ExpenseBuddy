
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/expenses" replace />;
  }
  
  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-budget-purple/80 to-budget-teal/80 backdrop-blur-sm"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">ExpenseBuddy</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-xl mx-auto animate-fade-in">
            Take control of your finances with our intuitive expense tracking and budgeting tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/sign-in">
              <Button size="lg" className="bg-white text-budget-purple hover:bg-white/90">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button size="lg" variant="outline" className="border-white text-budget-purple hover:bg-white/10">
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h3 className="font-bold text-xl mb-2">Track Expenses</h3>
              <p className="text-white/80">Easily record and categorize your daily expenses to see where your money goes.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h3 className="font-bold text-xl mb-2">Visual Analytics</h3>
              <p className="text-white/80">Get helpful insights with beautiful charts and graphs to visualize your spending habits.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h3 className="font-bold text-xl mb-2">Budget Smart</h3>
              <p className="text-white/80">Make informed financial decisions and stay on top of your financial goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
