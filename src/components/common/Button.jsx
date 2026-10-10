import React from 'react';

/**
 * Clean reusable button component matching the SaaS design system guidelines.
 * Features comfortable 14-16px typography across all sizes.
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm border border-transparent disabled:bg-blue-300',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent disabled:bg-slate-50 disabled:text-slate-400',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 disabled:opacity-50'
  };

  const sizes = {
    sm: 'text-sm px-3.5 py-1.5',
    md: 'text-sm sm:text-base px-4.5 py-2.5',
    lg: 'text-base sm:text-lg px-6 py-3',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

