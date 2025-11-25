import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found",
  message = "Try adjusting your search criteria or explore different areas.",
  actionText = "Reset Filters",
  onAction = null,
  icon = "Home",
  className = "" 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center",
      className
    )}>
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ApperIcon name={icon} size={40} className="text-primary-500" />
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-primary-300 to-primary-400 rounded-full opacity-20 animate-pulse mx-auto"></div>
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={20} />
          {actionText}
        </button>
      )}
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md">
        <div className="text-center">
          <ApperIcon name="Search" size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Adjust search</p>
        </div>
        <div className="text-center">
          <ApperIcon name="MapPin" size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Change location</p>
        </div>
        <div className="text-center">
          <ApperIcon name="Filter" size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Remove filters</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;