import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{leftIcon}</div>}
        <input
          className={clsx(
            'block w-full rounded-lg border-surface-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm',
            'border px-3 py-2 outline-none transition-colors',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">{rightIcon}</div>}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
