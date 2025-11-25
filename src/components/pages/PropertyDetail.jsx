import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyFeatures from "@/components/molecules/PropertyFeatures";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const loadProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getById(id);
      if (!data) {
        setError("Property not found");
        return;
      }
      
      setProperty(data);
      setIsFavorite(propertyService.isFavorite(data.Id));
    } catch (err) {
      setError("Failed to load property details. Please try again.");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!property) return;
    
    try {
      const newFavoriteStatus = await propertyService.toggleFavorite(property.Id);
      setIsFavorite(newFavoriteStatus);
      toast.success(newFavoriteStatus ? "Added to favorites!" : "Removed from favorites");
      
      // Trigger custom event for header to update count
      window.dispatchEvent(new Event("favoriteUpdated"));
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handlePreviousImage = () => {
    if (!property) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!property) return;
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const formatPrice = (price) => {
    if (property?.status === "for-rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    if (!property) return null;
    
    const statusMap = {
      "for-sale": { variant: "success", label: "For Sale" },
      "for-rent": { variant: "info", label: "For Rent" },
      "sold": { variant: "default", label: "Sold" },
      "pending": { variant: "warning", label: "Pending" }
    };
    
    const status = statusMap[property.status] || statusMap["for-sale"];
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const getPropertySpecs = () => {
    if (!property) return [];
    
    return [
      { icon: "Bed", label: "Bedrooms", value: property.bedrooms },
      { icon: "Bath", label: "Bathrooms", value: property.bathrooms },
      { icon: "Square", label: "Square Feet", value: property.squareFeet.toLocaleString() },
      { icon: "Home", label: "Property Type", value: property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) },
      { icon: "Calendar", label: "Year Built", value: property.yearBuilt },
      ...(property.lotSize > 0 ? [{ icon: "Maximize", label: "Lot Size", value: `${property.lotSize} acres` }] : []),
      ...(property.garage > 0 ? [{ icon: "Car", label: "Garage", value: `${property.garage} cars` }] : [])
    ];
  };

  if (loading) return <Loading />;
  
  if (error || !property) {
    return (
      <ErrorView
        message={error || "Property not found"}
        onRetry={loadProperty}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back to Results
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl overflow-hidden shadow-md">
              <div className="relative h-96 lg:h-[500px]">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <ApperIcon name="ChevronLeft" size={20} className="text-gray-800" />
                    </button>
                    
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <ApperIcon name="ChevronRight" size={20} className="text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteToggle}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={24} 
                    className={cn(
                      "transition-all duration-200",
                      isFavorite 
                        ? "text-red-500 fill-red-500" 
                        : "text-gray-600 hover:text-red-500"
                    )}
                  />
                </button>
              </div>
              
              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                          index === currentImageIndex
                            ? "border-primary-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl font-display font-bold text-accent-500 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  {getStatusBadge()}
                </div>
              </div>
              
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-3">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <ApperIcon name="MapPin" size={18} className="text-gray-400" />
                <span>{property.location.address}</span>
              </div>
              <p className="text-gray-600 mb-4">
                {property.location.city}, {property.location.state} {property.location.zip}
              </p>
              
              <div className="text-sm text-gray-500">
                Listed on {format(new Date(property.listingDate), "MMMM d, yyyy")}
              </div>
            </div>

            {/* Property Specifications */}
            <div className="bg-surface rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {getPropertySpecs().map((spec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name={spec.icon} size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{spec.label}</div>
                      <div className="font-semibold text-gray-900">{spec.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-surface rounded-xl p-6 shadow-md space-y-3">
              <Button
                variant="primary"
                size="lg"
                icon="Phone"
                className="w-full"
                onClick={() => toast.info("Contact feature coming soon!")}
              >
                Contact Agent
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                icon="Calendar"
                className="w-full"
                onClick={() => toast.info("Schedule tour feature coming soon!")}
              >
                Schedule Tour
              </Button>
              
              <Button
                variant="accent"
                size="lg"
                icon="Share2"
                className="w-full"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: property.title,
                      text: `Check out this property: ${property.title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }
                }}
              >
                Share Property
              </Button>
            </div>
          </div>
        </div>

        {/* Description and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Description */}
          <div className="bg-surface rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-surface rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
            <PropertyFeatures features={property.features} showAll={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;