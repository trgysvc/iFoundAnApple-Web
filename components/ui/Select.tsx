
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-gray-600 mb-1">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className="block w-full px-3 py-2 border border-brand-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
