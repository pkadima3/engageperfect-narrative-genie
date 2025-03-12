
/**
 * Forgot Password Page
 * 
 * Provides a form for users to request a password reset email.
 * Sends a reset link to the provided email address.
 * 
 * Interacts with:
 * - AuthContext for password reset functionality
 * - SignIn page for returning to login
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { pageTransition } from '@/lib/animations';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Validation error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
      setEmailSent(true);
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
          <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
          <p className="text-slate-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="bg-primary/10 text-primary p-4 rounded-lg mb-6">
              <p>Password reset email sent! Check your inbox for further instructions.</p>
            </div>
            <Link to="/signin" className="inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <PrimaryButton 
              type="submit" 
              className="w-full" 
              size="lg"
              loading={loading}
            >
              Send reset link
            </PrimaryButton>

            <div className="text-center mt-4">
              <Link to="/signin" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </PageLayout>
  );
};

export default ForgotPassword;
