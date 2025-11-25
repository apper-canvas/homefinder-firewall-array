import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { cn } from "@/utils/cn";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";

const MapView = () => {
  const { searchQuery } = useOutletContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 47.6062, lng: -122.3321 });
  const [showPropertyList, setShowPropertyList] = useState(false);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const filters = {
        searchQuery: searchQuery || "",
        sortBy: "newest"
      };
      
      const data = await propertyService.searchProperties(filters);
      
      // Add favorite status to each property
      const favorites = propertyService.getFavoriteIds();
      const propertiesWithFavorites = data.map(property => ({
        ...property,
        isFavorite: favorites.includes(property.Id)
      }));
      
      setProperties(propertiesWithFavorites);
      
      // Set map center to first property if available
      if (data.length > 0 && data[0].location.coordinates) {
        setMapCenter(data[0].location.coordinates);
      }
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [searchQuery]);

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

  const formatPrice = (price, status) => {
    if (status === "for-rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
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
    <div className="h-screen flex relative">
      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Map" size={48} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900">Interactive Map View</h2>
            <p className="text-gray-600 max-w-md">
              This is a placeholder for the interactive map showing property locations. 
              In a full implementation, this would integrate with Google Maps or Mapbox.
            </p>
          </div>
        </div>

        {/* Property Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {properties.map((property, index) => {
            // Simulate marker positions based on property data
            const left = 20 + (index % 5) * 15;
            const top = 20 + Math.floor(index / 5) * 15;
            
            return (
              <div
                key={property.Id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${left}%`,
                  top: `${top}%`
                }}
              >
                <button
                  onClick={() => setSelectedProperty(property)}
                  className={cn(
                    "bg-accent-500 text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm font-semibold",
                    selectedProperty?.Id === property.Id && "bg-accent-600 scale-105"
                  )}
                >
                  {formatPrice(property.price, property.status)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="secondary"
            size="sm"
            icon="Plus"
            className="shadow-lg"
            onClick={() => {
              // Placeholder for zoom in
              console.log("Zoom in");
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            icon="Minus"
            className="shadow-lg"
            onClick={() => {
              // Placeholder for zoom out
              console.log("Zoom out");
            }}
          />
        </div>

        {/* Mobile Property List Toggle */}
        <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            variant="primary"
            icon={showPropertyList ? "Map" : "List"}
            onClick={() => setShowPropertyList(!showPropertyList)}
            className="shadow-lg"
          >
            {showPropertyList ? "Show Map" : "Show Properties"}
          </Button>
        </div>
      </div>

      {/* Property Sidebar - Desktop */}
      <div className={cn(
        "w-96 bg-surface shadow-xl overflow-hidden flex flex-col transition-transform duration-300",
        "hidden lg:flex"
      )}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {properties.length} Properties Found
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on map markers to view details
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {properties.map((property) => (
            <div
              key={property.Id}
              className={cn(
                "border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer",
                selectedProperty?.Id === property.Id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white"
              )}
              onClick={() => setSelectedProperty(property)}
            >
              <div className="p-4">
                <div className="flex gap-3">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-accent-500 text-lg">
                      {formatPrice(property.price, property.status)}
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {property.location.city}, {property.location.state}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.squareFeet.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Property List Overlay */}
      {showPropertyList && (
        <div className="lg:hidden absolute inset-0 bg-surface z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {properties.length} Properties
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowPropertyList(false)}
              />
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto h-full">
            <div className="grid gap-4">
              {properties.map((property) => (
                <PropertyCard
                  key={property.Id}
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                  className="shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Property Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedProperty(null)}
                />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <PropertyCard
                property={selectedProperty}
                onFavoriteToggle={handleFavoriteToggle}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;