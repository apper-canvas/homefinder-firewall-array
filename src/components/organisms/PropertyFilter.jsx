import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import PriceRange from "@/components/molecules/PriceRange";
import FilterSection from "@/components/molecules/FilterSection";
import propertyService from "@/services/api/propertyService";

const PropertyFilter = ({ 
  onFiltersChange = () => {},
  filters = {},
  className = "",
  isMobile = false,
  onClose = () => {}
}) => {
  const [localFilters, setLocalFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: "",
    bathrooms: "",
    propertyType: [],
    status: ["for-sale", "for-rent"],
    ...filters
  });

  const propertyTypes = propertyService.getPropertyTypes();
  const statusTypes = propertyService.getStatusTypes();

  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const updatedFilters = {
      ...localFilters,
      [key]: value
    };
    
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handlePriceRangeChange = ({ min, max }) => {
    const updatedFilters = {
      ...localFilters,
      priceMin: min,
      priceMax: max
    };
    
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handlePropertyTypeChange = (type, checked) => {
    const updatedTypes = checked
      ? [...localFilters.propertyType, type]
      : localFilters.propertyType.filter(t => t !== type);
    
    handleFilterChange("propertyType", updatedTypes);
  };

  const handleStatusChange = (status, checked) => {
    const updatedStatuses = checked
      ? [...localFilters.status, status]
      : localFilters.status.filter(s => s !== status);
    
    handleFilterChange("status", updatedStatuses);
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceMin: 0,
      priceMax: 2000000,
      bedrooms: "",
      bathrooms: "",
      propertyType: [],
      status: ["for-sale", "for-rent"]
    };
    
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getBedroomOptions = () => [
    { value: "", label: "Any" },
    { value: "0", label: "Studio" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" }
  ];

  const getBathroomOptions = () => [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "1.5", label: "1.5+" },
    { value: "2", label: "2+" },
    { value: "2.5", label: "2.5+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" }
  ];

  const formatPropertyTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatStatusLabel = (status) => {
    const statusMap = {
      "for-sale": "For Sale",
      "for-rent": "For Rent",
      "sold": "Sold",
      "pending": "Pending"
    };
    return statusMap[status] || status;
  };

  return (
    <div className={cn(
      "bg-surface rounded-xl shadow-md border border-gray-100",
      isMobile ? "p-4" : "p-6",
      className
    )}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClose}
          />
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Filter Properties</h2>
          <p className="text-sm text-gray-600">Narrow down your search to find the perfect property.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Price Range */}
        <FilterSection title="Price Range" icon="DollarSign" defaultOpen={true}>
          <PriceRange
            min={0}
            max={2000000}
            step={25000}
            defaultMin={localFilters.priceMin}
            defaultMax={localFilters.priceMax}
            onRangeChange={handlePriceRangeChange}
          />
        </FilterSection>

        {/* Bedrooms & Bathrooms */}
        <FilterSection title="Rooms" icon="Bed" defaultOpen={true}>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Bedrooms"
              options={getBedroomOptions()}
              value={localFilters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
            />
            <Select
              label="Bathrooms"
              options={getBathroomOptions()}
              value={localFilters.bathrooms}
              onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
            />
          </div>
        </FilterSection>

        {/* Property Type */}
        <FilterSection title="Property Type" icon="Home" defaultOpen={true}>
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.propertyType.includes(type)}
                  onChange={(e) => handlePropertyTypeChange(type, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {formatPropertyTypeLabel(type)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Status */}
        <FilterSection title="Availability" icon="CheckCircle" defaultOpen={true}>
          <div className="space-y-3">
            {statusTypes.map((status) => (
              <label key={status} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.status.includes(status)}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {formatStatusLabel(status)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full"
            icon="RotateCcw"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;