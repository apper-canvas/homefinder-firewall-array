import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  variant = "primary", 
  size = "md", 
  children, 
  className = "", 
  icon = null, 
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500 transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 text-white shadow-md hover:shadow-lg focus:ring-secondary-500 transform hover:scale-105",
    accent: "bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white shadow-md hover:shadow-lg focus:ring-accent-500 transform hover:scale-105",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500 transform hover:scale-105"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && "transform-none hover:scale-100",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={size === "sm" ? 14 : size === "lg" ? 20 : size === "xl" ? 24 : 16} 
          className="animate-spin" 
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          size={size === "sm" ? 14 : size === "lg" ? 20 : size === "xl" ? 24 : 16} 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          size={size === "sm" ? 14 : size === "lg" ? 20 : size === "xl" ? 24 : 16} 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;