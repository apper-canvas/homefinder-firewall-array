import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PropertyFeatures = ({ features = [], className = "", showAll = true, maxItems = 6 }) => {
  const displayFeatures = showAll ? features : features.slice(0, maxItems);
  const hiddenCount = features.length - maxItems;

  const getFeatureIcon = (feature) => {
    const featureMap = {
      "City Views": "Building2",
      "Hardwood Floors": "TreePine",
      "Stainless Steel Appliances": "ChefHat",
      "In-Unit Laundry": "Shirt",
      "Balcony": "Building",
      "Gym Access": "Dumbbell",
      "Original Hardwood": "TreePine",
      "Restored Details": "Sparkles",
      "Modern Kitchen": "ChefHat",
      "Private Garden": "Trees",
      "Fireplace": "Flame",
      "Crown Molding": "Home",
      "Water Views": "Waves",
      "Private Dock": "Anchor",
      "Designer Kitchen": "ChefHat",
      "Rooftop Terrace": "Building2",
      "Smart Home": "Smartphone",
      "Wine Cellar": "Wine",
      "Exposed Brick": "Brick",
      "High Ceilings": "ArrowUp",
      "Pet Friendly": "Heart",
      "Walkable": "MapPin",
      "Large Backyard": "Trees",
      "Updated Kitchen": "ChefHat",
      "Master Suite": "Bed",
      "Two-Car Garage": "Car",
      "Deck": "Home",
      "Storage": "Archive",
      "Concrete Floors": "Square",
      "Open Layout": "Layout",
      "Industrial Features": "Zap",
      "Ocean Views": "Waves",
      "Beach Access": "Palmtree",
      "Pool": "Waves",
      "Concierge": "UserCheck",
      "Valet Parking": "Car",
      "Mountain Views": "Mountain",
      "Hot Tub": "Waves",
      "Ski Access": "Mountain",
      "Natural Setting": "Trees",
      "Bay Views": "Waves",
      "Floor-to-Ceiling Windows": "Square",
      "Historic Character": "Clock",
      "Original Details": "Sparkles",
      "Modern Updates": "Zap",
      "Parking": "Car",
      "Prime Location": "MapPin",
      "Open Concept": "Layout",
      "Shiplap Walls": "Home",
      "Covered Porch": "Home",
      "Barn Doors": "DoorOpen",
      "Farmhouse Sink": "Home",
      "Large Lot": "Maximize",
      "Skyline Views": "Building2",
      "Private Terrace": "Building",
      "Chef's Kitchen": "ChefHat",
      "Master Suite": "Bed",
      "Doorman": "UserCheck"
    };

    return featureMap[feature] || "CheckCircle";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {displayFeatures.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon 
              name={getFeatureIcon(feature)} 
              size={16} 
              className="text-primary-500" 
            />
            <span className="text-sm font-medium text-gray-700">{feature}</span>
          </div>
        ))}
        
        {!showAll && hiddenCount > 0 && (
          <Badge variant="accent" size="sm">
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PropertyFeatures;