import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
