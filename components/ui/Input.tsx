
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-gray-600 mb-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm placeholder-brand-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
      />
    </div>
  );
};

export default Input;
