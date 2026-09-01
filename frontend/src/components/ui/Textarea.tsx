import React from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <textarea
        className={clsx(
          'block w-full rounded-lg border-surface-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm',
          'border px-3 py-2 outline-none transition-colors min-h-[80px]',
          error && 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
