
/**
 * Dashboard Page
 * 
 * A protected page that requires authentication to access.
 * Serves as the main entry point after authentication.
 * 
 * Interacts with:
 * - AuthContext to check authentication status
 * - Future wizard flow components for content generation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/Layout/PageLayout';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { pageTransition } from '@/lib/animations';

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <PageLayout className="bg-[#0d1425] text-white">
      <motion.div
        className="w-full max-w-4xl mx-auto px-6 py-12"
        initial="initial"
        animate="animate"
        variants={pageTransition}
      >
        <div className="glass-panel rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">Welcome, {currentUser?.displayName || 'User'}!</h1>
            <div className="flex space-x-3">
              <PrimaryButton
                variant="outline"
                onClick={() => navigate('/profile')}
                icon={<User className="h-4 w-4" />}
                className="border-slate-700 hover:bg-slate-800"
              >
                Profile
              </PrimaryButton>
              <PrimaryButton
                variant="outline"
                onClick={handleSignOut}
                icon={<LogOut className="h-4 w-4" />}
                className="border-slate-700 hover:bg-slate-800"
              >
                Sign out
              </PrimaryButton>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6 mt-4">
            You're now signed in to EngagePerfect AI. This is your dashboard where you'll be able to manage your content generation.
          </p>
        </div>
        
        <div className="glass-panel rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <p className="text-slate-300 mb-4">
            EngagePerfect AI helps you create engaging social media captions. Follow the 6-step wizard to generate content tailored to your needs.
          </p>
          
          <div className="mt-8">
            <PrimaryButton
              size="lg"
              onClick={() => navigate('/wizard')}
              className="w-full sm:w-auto"
            >
              Start Creating Content
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Dashboard;
