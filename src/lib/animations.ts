
/**
 * Animation utilities for the EngagePerfect AI app
 * Contains custom animation variants for Framer Motion and helper functions
 */

import { Variants } from "framer-motion";

// Fade in animation with customizable duration and delay
export const fadeIn = (duration: number = 0.5, delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

// Slide up animation with fade
export const slideUp = (duration: number = 0.5, delay: number = 0, y: number = 20): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

// Slide down animation with fade
export const slideDown = (duration: number = 0.5, delay: number = 0, y: number = -20): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

// Scale in animation with fade
export const scaleIn = (duration: number = 0.5, delay: number = 0, scale: number = 0.95): Variants => ({
  hidden: { opacity: 0, scale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

// Staggered children animation for lists
export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// For page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};
