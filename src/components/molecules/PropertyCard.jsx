import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { toast } from "react-toastify";
import propertyService from "@/services/api/propertyService";

const PropertyCard = ({ 
  property, 
  onFavoriteToggle = null, 
  className = "",
  showCompareButton = false,
  onCompareToggle = null,
  isInComparison = false 
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation when clicking on action buttons
    if (e.target.closest("button")) return;
    navigate(`/property/${property.Id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      const isFavorite = await propertyService.toggleFavorite(property.Id);
      toast.success(isFavorite ? "Added to favorites!" : "Removed from favorites");
      if (onFavoriteToggle) {
        onFavoriteToggle(property.Id, isFavorite);
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(property);
    }
  };

  const formatPrice = (price) => {
    if (property.status === "for-rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    const statusMap = {
      "for-sale": { variant: "success", label: "For Sale" },
      "for-rent": { variant: "info", label: "For Rent" },
      "sold": { variant: "default", label: "Sold" },
      "pending": { variant: "warning", label: "Pending" }
    };
    
    const status = statusMap[property.status] || statusMap["for-sale"];
    return <Badge variant={status.variant} size="sm">{status.label}</Badge>;
  };

  return (
    <div 
      className={cn(
        "bg-surface rounded-xl shadow-md hover-lift cursor-pointer group overflow-hidden border border-gray-100 transition-all duration-300",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <ApperIcon 
            name="Heart" 
            size={18} 
            className={cn(
              "transition-all duration-200",
              property.isFavorite 
                ? "text-red-500 fill-red-500" 
                : "text-gray-600 hover:text-red-500"
            )}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>

        {/* Compare Button */}
        {showCompareButton && (
          <button
            onClick={handleCompareClick}
            className={cn(
              "absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md hover:shadow-lg",
              isInComparison 
                ? "bg-accent-500 text-white" 
                : "bg-white/80 hover:bg-white text-gray-600 hover:text-accent-600"
            )}
          >
            <ApperIcon 
              name="GitCompare" 
              size={18} 
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-display font-bold text-accent-500 mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-gray-600 mb-3 flex items-center gap-1">
          <ApperIcon name="MapPin" size={16} className="text-gray-400" />
          {property.location.city}, {property.location.state}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Bed" size={16} className="text-gray-400" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Bath" size={16} className="text-gray-400" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Square" size={16} className="text-gray-400" />
            <span>{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${property.Id}`);
            }}
          >
            View Details
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="Phone"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Contact feature coming soon!");
            }}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;