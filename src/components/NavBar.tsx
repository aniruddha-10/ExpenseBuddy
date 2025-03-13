
import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ChartPieIcon, ReceiptIcon } from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto py-2 flex items-center justify-between">
        <div className="text-xl font-bold">Budget Tracker</div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={location.pathname === '/expenses' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/expenses" className="flex items-center gap-2">
                <ReceiptIcon className="w-4 h-4" />
                Expenses
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === '/analysis' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/analysis" className="flex items-center gap-2">
                <ChartPieIcon className="w-4 h-4" />
                Analysis
              </Link>
            </Button>
          </nav>
          
          <UserButton afterSignOutUrl="/auth/sign-in" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
