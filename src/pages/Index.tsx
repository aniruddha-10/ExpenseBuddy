
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated 
    ? <Navigate to="/expenses" replace /> 
    : <Navigate to="/auth/sign-in" replace />;
};

export default Index;
