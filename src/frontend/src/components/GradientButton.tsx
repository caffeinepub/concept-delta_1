import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      default: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg bg-gradient-to-r from-brand-navy to-brand-blue font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
