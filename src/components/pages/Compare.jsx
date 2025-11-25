import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyFeatures from "@/components/molecules/PropertyFeatures";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import { toast } from "react-toastify";

const Compare = () => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getAll();
      
      // Add favorite status to each property
      const favorites = propertyService.getFavoriteIds();
      const propertiesWithFavorites = data.map(property => ({
        ...property,
        isFavorite: favorites.includes(property.Id)
      }));
      
      setAllProperties(propertiesWithFavorites);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const addPropertyToComparison = (property) => {
    if (selectedProperties.find(p => p.Id === property.Id)) {
      toast.warning("Property is already in comparison");
      return;
    }
    
    if (selectedProperties.length >= 3) {
      toast.warning("You can only compare up to 3 properties at once");
      return;
    }
    
    setSelectedProperties(prev => [...prev, property]);
    toast.success(`${property.title} added to comparison`);
  };

  const removePropertyFromComparison = (propertyId) => {
    setSelectedProperties(prev => prev.filter(p => p.Id !== propertyId));
    toast.info("Property removed from comparison");
  };

  const clearComparison = () => {
    setSelectedProperties([]);
    toast.info("Comparison cleared");
  };

  const formatPrice = (price, status) => {
    if (status === "for-rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "for-sale": { variant: "success", label: "For Sale" },
      "for-rent": { variant: "info", label: "For Rent" },
      "sold": { variant: "default", label: "Sold" },
      "pending": { variant: "warning", label: "Pending" }
    };
    
    const statusInfo = statusMap[status] || statusMap["for-sale"];
    return <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>;
  };

  const getComparisonData = () => {
    if (selectedProperties.length === 0) return [];
    
    return [
      {
        label: "Price",
        icon: "DollarSign",
        values: selectedProperties.map(p => formatPrice(p.price, p.status))
      },
      {
        label: "Location",
        icon: "MapPin",
        values: selectedProperties.map(p => `${p.location.city}, ${p.location.state}`)
      },
      {
        label: "Bedrooms",
        icon: "Bed",
        values: selectedProperties.map(p => p.bedrooms.toString())
      },
      {
        label: "Bathrooms",
        icon: "Bath",
        values: selectedProperties.map(p => p.bathrooms.toString())
      },
      {
        label: "Square Feet",
        icon: "Square",
        values: selectedProperties.map(p => p.squareFeet.toLocaleString())
      },
      {
        label: "Property Type",
        icon: "Home",
        values: selectedProperties.map(p => p.propertyType.charAt(0).toUpperCase() + p.propertyType.slice(1))
      },
      {
        label: "Year Built",
        icon: "Calendar",
        values: selectedProperties.map(p => p.yearBuilt.toString())
      },
      {
        label: "Lot Size",
        icon: "Maximize",
        values: selectedProperties.map(p => p.lotSize > 0 ? `${p.lotSize} acres` : "N/A")
      },
      {
        label: "Garage",
        icon: "Car",
        values: selectedProperties.map(p => p.garage > 0 ? `${p.garage} cars` : "None")
      }
    ];
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center">
              <ApperIcon name="GitCompare" size={24} className="text-accent-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Compare Properties
            </h1>
          </div>
          <p className="text-gray-600">
            Compare up to 3 properties side by side to make an informed decision.
          </p>
        </div>

        {selectedProperties.length === 0 ? (
          <Empty
            title="No properties selected for comparison"
            message="Select properties from the list below to start comparing their features, prices, and specifications side by side."
            icon="GitCompare"
            actionText="Browse Properties"
            onAction={() => navigate("/")}
          />
        ) : (
          <div className="space-y-8">
            {/* Comparison Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Comparing {selectedProperties.length} {selectedProperties.length === 1 ? "Property" : "Properties"}
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon="X"
                onClick={clearComparison}
              >
                Clear All
              </Button>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedProperties.map((property) => (
                <div key={property.Id} className="bg-surface rounded-xl shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    
                    <button
                      onClick={() => removePropertyFromComparison(property.Id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <ApperIcon name="X" size={16} className="text-gray-600" />
                    </button>

                    <div className="absolute top-3 left-3">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-2xl font-bold text-accent-500 mb-2">
                      {formatPrice(property.price, property.status)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                      <ApperIcon name="MapPin" size={14} className="text-gray-400" />
                      {property.location.city}, {property.location.state}
                    </p>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/property/${property.Id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-surface rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Property Specifications</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                        Feature
                      </th>
                      {selectedProperties.map((property, index) => (
                        <th 
                          key={property.Id} 
                          className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                        >
                          Property {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200">
                    {getComparisonData().map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-2">
                          <ApperIcon name={row.icon} size={16} className="text-primary-500" />
                          <span className="font-medium text-gray-900">{row.label}</span>
                        </td>
                        {row.values.map((value, valueIndex) => (
                          <td key={valueIndex} className="px-6 py-4 text-center text-gray-700">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Features Comparison */}
            <div className="bg-surface rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Features & Amenities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedProperties.map((property, index) => (
                  <div key={property.Id}>
                    <h4 className="font-semibold text-gray-900 mb-3">Property {index + 1}</h4>
                    <PropertyFeatures features={property.features} showAll={false} maxItems={8} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Property Selection */}
        {selectedProperties.length < 3 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Properties to Compare
              </h2>
              <span className="text-sm text-gray-500">
                {selectedProperties.length}/3 selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allProperties
                .filter(property => !selectedProperties.find(p => p.Id === property.Id))
                .slice(0, 8)
                .map((property) => (
                  <button
                    key={property.Id}
                    onClick={() => addPropertyToComparison(property)}
                    className="text-left bg-surface rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-300"
                  >
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    
                    <div className="text-lg font-bold text-accent-500 mb-1">
                      {formatPrice(property.price, property.status)}
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {property.location.city}, {property.location.state}
                    </p>
                  </button>
                ))}
            </div>
            
            {allProperties.length > 8 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  View All Properties
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;