
/**
 * Sign Up Page
 * 
 * Provides a form for new users to create an account with username,
 * email, and password. Also includes a link to sign in for existing users.
 * 
 * Interacts with:
 * - AuthContext for account creation
 * - SignIn page for existing users
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Google } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { pageTransition } from '@/lib/animations';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    if (!agreeToTerms) {
      toast({
        title: "Validation error",
        description: "You must agree to the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await signUp(username, email, password);
      toast({
        title: "Account created",
        description: "Your account has been successfully created."
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the AuthContext
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast({
        title: "Account created",
        description: "Your account has been successfully created with Google."
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
          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-slate-400">
            Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox 
              id="terms" 
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <PrimaryButton 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={loading}
          >
            Sign up
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
            onClick={handleGoogleSignUp}
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

export default SignUp;
