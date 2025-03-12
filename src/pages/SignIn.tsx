
/**
 * Sign In Page
 * 
 * Provides a form for users to sign in to their account with email/password
 * or through Google authentication. Also includes links to sign up and
 * reset password pages.
 * 
 * Interacts with:
 * - AuthContext for authentication operations
 * - SignUp page for new account creation
 * - ForgotPassword page for password reset
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Google } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { pageTransition } from '@/lib/animations';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the AuthContext
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google."
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the AuthContext
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout className="bg-[#0d1425] text-white">
      <motion.div 
        className="w-full max-w-md mx-auto px-6 py-12"
        initial="initial"
        animate="animate"
        variants={pageTransition}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign in to your account</h1>
          <p className="text-slate-400">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-slate-300">
              Remember me
            </label>
          </div>

          <PrimaryButton 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={loading}
          >
            Sign in
          </PrimaryButton>

          <div className="relative flex items-center justify-center mt-8 mb-4">
            <div className="border-t border-slate-700 w-full"></div>
            <div className="text-center text-sm text-slate-400 bg-[#0d1425] px-3 absolute">
              Or continue with
            </div>
          </div>

          <PrimaryButton
            type="button"
            variant="outline"
            className="w-full border-slate-700 hover:bg-slate-800"
            size="lg"
            onClick={handleGoogleSignIn}
            icon={<Google className="h-5 w-5" />}
            disabled={loading}
          >
            Continue with Google
          </PrimaryButton>
        </form>
      </motion.div>
    </PageLayout>
  );
};

export default SignIn;
