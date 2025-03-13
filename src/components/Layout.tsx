
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wallet, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Budget Tracker
          </h1>
          <nav className="flex space-x-1">
            <NavItem to="/" icon={<Wallet className="w-4 h-4 mr-2" />} label="Expenses" />
            <NavItem to="/analysis" icon={<BarChart3 className="w-4 h-4 mr-2" />} label="Analysis" />
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Budget Tracker - Track your expenses with ease
        </div>
      </footer>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default Layout;
