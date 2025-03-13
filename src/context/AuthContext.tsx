
import React, { createContext, useContext, useEffect } from 'react';
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  useUser
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Make sure to add VITE_CLERK_PUBLISHABLE_KEY to your environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Missing Clerk Publishable Key");
}

// Auth context for checking authentication state
const AuthContext = createContext<{ isAuthenticated: boolean; userId: string | null }>({
  isAuthenticated: false,
  userId: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={publishableKey || ''}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ClerkProvider>
  );
};

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id || null;

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: isSignedIn || false, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Protected route component
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
