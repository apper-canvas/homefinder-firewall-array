import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong while loading the properties.", 
  onRetry = null,
  className = "" 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background to-gray-100 flex items-center justify-center p-6",
      className
    )}>
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ApperIcon name="AlertCircle" size={40} className="text-red-500" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-20 animate-ping mx-auto"></div>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ApperIcon name="RefreshCw" size={20} />
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Refresh Page
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;