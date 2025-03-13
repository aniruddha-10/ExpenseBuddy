
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC<{ view?: 'signIn' | 'signUp' }> = ({ view = 'signIn' }) => {
  const { isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-budget-purple to-budget-teal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      <Card className="w-full max-w-md relative z-10 border border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
        <CardHeader className="space-y-2">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-budget-purple">
              <path d="M18.75 1v4.75A2.25 2.25 0 0 1 16.5 8H4.5a2.25 2.25 0 0 1-2.25-2.25V1" />
              <path d="M7.5 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M7.5 13.5a6 6 0 0 0-6 6v3h12v-3a6 6 0 0 0-6-6Z" />
              <path d="M16.5 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M16.5 16.5a6 6 0 0 0-6 6v3h12v-3a6 6 0 0 0-6-6Z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-white">ExpenseBuddy</CardTitle>
          <CardDescription className="text-center text-white/80">
            {view === 'signIn' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 pr-10"
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-budget-purple hover:bg-budget-purple/90 text-white font-medium"
              disabled={loading}
            >
              {loading ? 'Processing...' : view === 'signIn' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2 text-white/80">
            {view === 'signIn' ? (
              <div>
                Don't have an account?{' '}
                <Button variant="link" className="p-0 text-white hover:text-white/80" onClick={() => navigate('/auth/sign-up')}>
                  Sign up
                </Button>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <Button variant="link" className="p-0 text-white hover:text-white/80" onClick={() => navigate('/auth/sign-in')}>
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
