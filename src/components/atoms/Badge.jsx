import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  variant = "default", 
  size = "md", 
  children, 
  className = "",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full border";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-primary-300",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 border-secondary-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border-accent-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;