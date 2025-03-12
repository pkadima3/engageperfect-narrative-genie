
/**
 * PageLayout Component
 * 
 * Main layout wrapper for all pages in the application.
 * Provides consistent padding, max-width, and animation effects.
 * 
 * Props:
 * - children: React nodes to render inside the layout
 * - className: Additional CSS classes
 * - withAnimation: Boolean to enable/disable page transition animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pageTransition } from '@/lib/animations';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  withAnimation?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  withAnimation = true
}) => {
  const content = (
    <div 
      className={cn(
        'w-full min-h-screen flex flex-col',
        className
      )}
    >
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );

  if (withAnimation) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default PageLayout;
