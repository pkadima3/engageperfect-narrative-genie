
/**
 * FeatureCard Component
 * 
 * Displays a feature with icon, title, and description.
 * Used on the landing page to showcase app capabilities.
 * 
 * Props:
 * - icon: React node for the feature icon
 * - title: Feature title
 * - description: Feature description
 * - index: Used for staggered animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index = 0,
  className
}) => {
  return (
    <motion.div
      className={cn(
        'glass-card p-6 rounded-2xl flex flex-col items-start',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.1 + (index * 0.1),
        ease: 'easeOut'
      }}
    >
      <div className="bg-primary/10 p-3 rounded-xl text-primary mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
