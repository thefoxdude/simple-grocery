import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  isConfirm = false,
  mainPassword = '', 
  className = '',
  showBottomRadius = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = isConfirm && value && value !== mainPassword;

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={showPassword ? "text" : "password"}
        required
        className={`appearance-none relative block w-full px-3 py-2 
                   border border-emerald-300 dark:border-gray-600
                   placeholder-emerald-400 dark:placeholder-emerald-500
                   text-emerald-900 dark:text-emerald-100
                   bg-white dark:bg-gray-800
                   focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                   dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                   sm:text-sm
                   rounded-md
                   ${hasError ? 'border-red-300 dark:border-red-700' : ''}
                   ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2
                 text-emerald-500 hover:text-emerald-600 
                 dark:text-emerald-400 dark:hover:text-emerald-300
                 focus:outline-none z-20"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      {hasError && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
          Passwords do not match
        </p>
      )}
    </div>
  );
};

export default PasswordInput;