import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    leftIcon, 
    rightIcon, 
    isFullWidth = false,
    children, 
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none';
    
    // Size variations
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-lg',
    };
    
    // Variant styles using our color system
    const variantStyles = {
      primary: 'bg-primary text-primary-white hover:bg-opacity-90 focus:ring-2 focus:ring-primary focus:ring-opacity-50',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50',
      accent: 'bg-accent-pink text-primary-white hover:bg-accent-pink-dark focus:ring-2 focus:ring-accent-pink focus:ring-opacity-50',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-800',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
    };
    
    // Width style
    const widthStyle = isFullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;