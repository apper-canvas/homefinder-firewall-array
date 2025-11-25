import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterSection = ({ 
  title, 
  children, 
  defaultOpen = true,
  className = "",
  icon = null 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-gray-200 pb-4", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left hover:text-primary-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && (
            <ApperIcon 
              name={icon} 
              size={18} 
              className="text-gray-500" 
            />
          )}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={18} 
          className="text-gray-500 transition-transform duration-200" 
        />
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterSection;