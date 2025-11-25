import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import { toast } from "react-toastify";

const PropertyGrid = ({ 
  filters = {}, 
  onFiltersChange = () => {},
  showCompareFeature = false,
  className = "" 
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [comparison, setComparison] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const searchFilters = {
        ...filters,
        sortBy
      };
      
      const data = await propertyService.searchProperties(searchFilters);
      
      // Add favorite status to each property
      const favorites = propertyService.getFavoriteIds();
      const propertiesWithFavorites = data.map(property => ({
        ...property,
        isFavorite: favorites.includes(property.Id)
      }));
      
      setProperties(propertiesWithFavorites);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, sortBy]);

  const handleFavoriteToggle = (propertyId, isFavorite) => {
    setProperties(prevProperties =>
      prevProperties.map(property =>
        property.Id === propertyId
          ? { ...property, isFavorite }
          : property
      )
    );

    // Trigger custom event for header to update count
    window.dispatchEvent(new Event("favoriteUpdated"));
  };

  const handleCompareToggle = (property) => {
    if (comparison.find(p => p.Id === property.Id)) {
      // Remove from comparison
      setComparison(prev => prev.filter(p => p.Id !== property.Id));
      toast.info(`${property.title} removed from comparison`);
    } else if (comparison.length < 3) {
      // Add to comparison
      setComparison(prev => [...prev, property]);
      toast.success(`${property.title} added to comparison`);
    } else {
      toast.warning("You can only compare up to 3 properties");
    }
  };

  const clearComparison = () => {
    setComparison([]);
    setShowComparison(false);
    toast.info("Comparison cleared");
  };

  const getSortOptions = () => [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "square-feet", label: "Largest First" }
  ];

  const getResultsText = () => {
    const count = properties.length;
    if (count === 0) return "No properties found";
    if (count === 1) return "1 property found";
    return `${count.toLocaleString()} properties found`;
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadProperties}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {getResultsText()}
          </h2>
          
          {showCompareFeature && comparison.length > 0 && (
            <Button
              variant="accent"
              size="sm"
              icon="GitCompare"
              onClick={() => setShowComparison(true)}
            >
              Compare ({comparison.length})
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showCompareFeature && comparison.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon="X"
              onClick={clearComparison}
            >
              Clear
            </Button>
          )}
          
          <Select
            options={getSortOptions()}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Empty
          title="No properties found"
          message="Try adjusting your search criteria or explore different areas."
          icon="Search"
          actionText="Reset Filters"
          onAction={() => {
            onFiltersChange({
              priceMin: 0,
              priceMax: 2000000,
              bedrooms: "",
              bathrooms: "",
              propertyType: [],
              status: ["for-sale", "for-rent"],
              searchQuery: ""
            });
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.Id}
              property={property}
              onFavoriteToggle={handleFavoriteToggle}
              showCompareButton={showCompareFeature}
              onCompareToggle={handleCompareToggle}
              isInComparison={comparison.some(p => p.Id === property.Id)}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && comparison.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Property Comparison
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowComparison(false)}
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparison.map((property) => (
                  <div key={property.Id} className="space-y-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{property.title}</h4>
                      <p className="text-2xl font-bold text-accent-500">
                        ${property.price.toLocaleString()}
                        {property.status === "for-rent" && "/mo"}
                      </p>
                      
                      <div className="space-y-1 text-sm">
                        <p><strong>Location:</strong> {property.location.city}, {property.location.state}</p>
                        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                        <p><strong>Square Feet:</strong> {property.squareFeet.toLocaleString()}</p>
                        <p><strong>Type:</strong> {property.propertyType}</p>
                        <p><strong>Year Built:</strong> {property.yearBuilt}</p>
                        {property.garage > 0 && (
                          <p><strong>Garage:</strong> {property.garage} cars</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;