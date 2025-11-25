import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  options = [],
  placeholder = "Select an option",
  className = "",
  label = "",
  error = "",
  disabled = false,
  required = false,
  ...props 
}, ref) => {
  const hasError = error && error.length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          "block text-sm font-medium text-gray-700",
          disabled && "text-gray-400",
          required && "after:content-['*'] after:text-red-500 after:ml-1"
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none",
            hasError && "border-red-300 focus:ring-red-500 focus:border-red-500",
            disabled && "bg-gray-50 text-gray-500 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="ChevronDown" 
            size={18} 
            className={cn(
              "text-gray-400",
              hasError && "text-red-400"
            )} 
          />
        </div>
      </div>
      
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;