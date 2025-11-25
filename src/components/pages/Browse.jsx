import React, { useState, useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyFilter from "@/components/organisms/PropertyFilter";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Browse = () => {
  const { searchQuery } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: "",
    bathrooms: "",
    propertyType: [],
    status: ["for-sale", "for-rent"],
    searchQuery: searchQuery || ""
  });

  // Update filters when search query changes from header
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      searchQuery: searchQuery || ""
    }));
  }, [searchQuery]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params to maintain filter state on page reload
    const params = new URLSearchParams();
    if (newFilters.searchQuery) {
      params.set("search", newFilters.searchQuery);
    }
    if (newFilters.priceMin > 0) {
      params.set("priceMin", newFilters.priceMin.toString());
    }
    if (newFilters.priceMax < 2000000) {
      params.set("priceMax", newFilters.priceMax.toString());
    }
    if (newFilters.bedrooms) {
      params.set("bedrooms", newFilters.bedrooms);
    }
    if (newFilters.bathrooms) {
      params.set("bathrooms", newFilters.bathrooms);
    }
    if (newFilters.propertyType.length > 0) {
      params.set("propertyType", newFilters.propertyType.join(","));
    }
    if (newFilters.status.length > 0 && newFilters.status.length < 4) {
      params.set("status", newFilters.status.join(","));
    }
    
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <PropertyFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                icon="Filter"
                onClick={() => setShowMobileFilters(true)}
                className="w-full"
              >
                Filters & Search
              </Button>
            </div>

            {/* Property Grid */}
            <PropertyGrid
              filters={filters}
              onFiltersChange={handleFiltersChange}
              showCompareFeature={true}
            />
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-surface shadow-xl">
              <div className="h-full overflow-y-auto">
                <PropertyFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isMobile={true}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;