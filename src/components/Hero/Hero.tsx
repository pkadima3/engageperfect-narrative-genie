
/**
 * Hero Component
 * 
 * The main hero section displayed on the landing page.
 * Contains headline, subheadline, and call-to-action buttons.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PrimaryButton from '../Buttons/PrimaryButton';

const Hero: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center text-center py-16 md:py-24">
      <motion.div
        className="space-y-6 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div 
          className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Introducing EngagePerfect AI
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Create captivating social media captions in seconds
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Generate scroll-stopping captions for any platform, tailored to your brand voice and audience.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <PrimaryButton 
            size="lg" 
            icon={<ArrowRight size={18} />} 
            iconPosition="right"
          >
            Start Creating
          </PrimaryButton>
          <PrimaryButton 
            size="lg" 
            variant="outline"
          >
            See Examples
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
