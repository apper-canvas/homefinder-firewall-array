import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ApperIcon name="Home" size={60} className="text-primary-600" />
          </div>
          <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-primary-300 to-primary-400 rounded-full opacity-20 animate-pulse mx-auto"></div>
        </div>
        
        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Property Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The property you're looking for seems to have moved, been sold, or never existed. 
          Let's help you find your perfect home!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            icon="Home"
            onClick={() => navigate("/")}
            className="shadow-lg hover:shadow-xl"
          >
            Browse Properties
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
            className="shadow-md hover:shadow-lg"
          >
            Go Back
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Search" size={24} className="text-accent-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Search Properties</h3>
            <p className="text-sm text-gray-600">
              Use our search to find properties by location, price, or features
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Map" size={24} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Map View</h3>
            <p className="text-sm text-gray-600">
              Explore properties on our interactive map
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Heart" size={24} className="text-secondary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Saved Favorites</h3>
            <p className="text-sm text-gray-600">
              Check your saved properties and favorites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;