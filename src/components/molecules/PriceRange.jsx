import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";

const PriceRange = ({ 
  min = 0, 
  max = 2000000, 
  step = 50000,
  defaultMin = 0,
  defaultMax = 2000000,
  onRangeChange = () => {},
  className = "" 
}) => {
  const [minValue, setMinValue] = useState(defaultMin);
  const [maxValue, setMaxValue] = useState(defaultMax);

  useEffect(() => {
    setMinValue(defaultMin);
    setMaxValue(defaultMax);
  }, [defaultMin, defaultMax]);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newMin = Math.min(value, maxValue - step);
    setMinValue(newMin);
    onRangeChange({ min: newMin, max: maxValue });
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value) || max;
    const newMax = Math.max(value, minValue + step);
    setMaxValue(newMax);
    onRangeChange({ min: minValue, max: newMax });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Min Price"
            value={minValue || ""}
            onChange={handleMinChange}
            min={min}
            max={max}
            step={step}
          />
        </div>
        
        <span className="text-gray-500 font-medium">to</span>
        
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Max Price"
            value={maxValue || ""}
            onChange={handleMaxChange}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
      
      {/* Range Display */}
      <div className="text-center">
        <span className="text-sm text-gray-600">
          {formatCurrency(minValue)} - {formatCurrency(maxValue)}
        </span>
      </div>
      
      {/* Visual Range Slider */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
            style={{
              marginLeft: `${(minValue / max) * 100}%`,
              width: `${((maxValue - minValue) / max) * 100}%`
            }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatCurrency(min)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;