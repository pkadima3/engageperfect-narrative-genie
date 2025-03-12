
/**
 * PrimaryButton Component
 * 
 * A customizable button component with multiple variants and animations.
 * Used throughout the application for primary actions.
 * 
 * Props:
 * - children: React node to render inside the button
 * - onClick: Function to call when button is clicked
 * - variant: 'default' | 'ghost' | 'outline'
 * - size: 'sm' | 'md' | 'lg'
 * - className: Additional CSS classes
 * - disabled: Boolean to disable the button
 * - icon: Optional icon component to display
 * - iconPosition: 'left' | 'right'
 * - loading: Boolean to show loading state
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define props interface without extending HTML button attributes
interface PrimaryButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  name?: string;
  value?: string | ReadonlyArray<string> | number;
  autoFocus?: boolean;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      className,
      icon,
      iconPosition = 'left',
      loading = false,
      disabled,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-lg',
      lg: 'text-base px-6 py-3 rounded-xl'
    };

    // Variant classes
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary-light shadow-sm',
      ghost: 'bg-transparent text-foreground hover:bg-secondary/80',
      outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10'
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(
          'font-medium inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </motion.button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
