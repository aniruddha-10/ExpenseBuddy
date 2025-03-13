
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AuthPage: React.FC<{ view?: 'signIn' | 'signUp' }> = ({ view = 'signIn' }) => {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // If user is already signed in, redirect to expenses page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/expenses');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = view === 'signIn' 
        ? await signIn(email, password)
        : await signUp(email, password);
        
      if (error) {
        throw error;
      }
      
      if (view === 'signUp') {
        toast.success('Account created! Please check your email for verification.');
      } else {
        toast.success('Successfully signed in!');
        navigate('/expenses');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Budget Tracker</CardTitle>
          <CardDescription className="text-center">
            {view === 'signIn' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : view === 'signIn' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2">
            {view === 'signIn' ? (
              <div>
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => navigate('/auth/sign-up')}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <Button variant="link" className="p-0" onClick={() => navigate('/auth/sign-in')}>
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
