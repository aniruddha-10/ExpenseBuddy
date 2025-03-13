
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/sign-in');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-bold text-lg">ExpenseBuddy</Link>

        {isAuthenticated ? (
          <nav className="flex items-center gap-4">
            <Link to="/expenses" className="text-sm hover:text-primary transition-colors">
              Expenses
            </Link>
            <Link to="/analysis" className="text-sm hover:text-primary transition-colors">
              Analysis
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </nav>
        ) : (
          <nav>
            <Link to="/auth/sign-in">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
