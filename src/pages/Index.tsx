
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Index = () => {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return isSignedIn 
    ? <Navigate to="/expenses" replace /> 
    : <Navigate to="/auth/sign-in" replace />;
};

export default Index;
