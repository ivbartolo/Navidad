import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
        <input
          id={id}
          type={type}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-christmas-gold focus:border-christmas-gold sm:text-sm dark:bg-dark-secondary dark:border-gray-600 dark:text-white ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);