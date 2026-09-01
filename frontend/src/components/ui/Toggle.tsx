import React from 'react';
import clsx from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {(label || description) && (
        <div className="mr-4">
          {label && <span className="block text-sm font-medium text-slate-900">{label}</span>}
          {description && <span className="block text-sm text-slate-500 mt-1">{description}</span>}
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        className={clsx(
          checked ? 'bg-brand-600' : 'bg-slate-200',
          disabled && 'opacity-50 cursor-not-allowed',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={clsx(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </button>
    </div>
  );
}
