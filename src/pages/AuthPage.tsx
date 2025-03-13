
import React from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC<{ view?: 'signIn' | 'signUp' }> = ({ view = 'signIn' }) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  // If user is already signed in, redirect to expenses page
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/expenses');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
            <p className="text-gray-600 mt-2">Manage your finances easily</p>
          </div>
          
          {view === 'signIn' ? (
            <SignIn 
              routing="path" 
              path="/auth/sign-in"
              signUpUrl="/auth/sign-up"
              redirectUrl="/expenses"
            />
          ) : (
            <SignUp 
              routing="path" 
              path="/auth/sign-up"
              signInUrl="/auth/sign-in"
              redirectUrl="/expenses"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
