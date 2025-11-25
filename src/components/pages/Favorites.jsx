import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import PropertyCard from "@/components/molecules/PropertyCard";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getFavorites();
      
      // Sort favorites
      const sortedFavorites = sortFavorites(data, sortBy);
      setFavorites(sortedFavorites);
    } catch (err) {
      setError("Failed to load favorite properties. Please try again.");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortFavorites = (properties, sortBy) => {
    const sorted = [...properties];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      case "square-feet":
        return sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      const sortedFavorites = sortFavorites(favorites, sortBy);
      setFavorites(sortedFavorites);
    }
  }, [sortBy]);

  const handleFavoriteToggle = (propertyId, isFavorite) => {
    if (!isFavorite) {
      // Remove from favorites list
      setFavorites(prevFavorites =>
        prevFavorites.filter(property => property.Id !== propertyId)
      );
    }

    // Trigger custom event for header to update count
    window.dispatchEvent(new Event("favoriteUpdated"));
  };

  const getSortOptions = () => [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "square-feet", label: "Largest First" },
    { value: "alphabetical", label: "A-Z" }
  ];

  const getResultsText = () => {
    const count = favorites.length;
    if (count === 0) return "No favorite properties";
    if (count === 1) return "1 favorite property";
    return `${count} favorite properties`;
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadFavorites}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <ApperIcon name="Heart" size={24} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-600">
            Keep track of properties you're interested in and compare them side by side.
          </p>
        </div>

        {/* Results Header */}
        {favorites.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              {getResultsText()}
            </h2>

            <Select
              options={getSortOptions()}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-48"
            />
          </div>
        )}

        {/* Properties Grid */}
        {favorites.length === 0 ? (
          <Empty
            title="No favorite properties yet"
            message="Start browsing properties and click the heart icon to save them here for easy access and comparison."
            icon="Heart"
            actionText="Browse Properties"
            onAction={() => window.location.href = "/"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.Id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}

        {/* Tips Section */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Make the Most of Your Favorites
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <ApperIcon name="GitCompare" size={18} className="text-primary-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Compare Properties</div>
                  <div className="text-gray-600">Use the compare feature to see properties side by side</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Bell" size={18} className="text-primary-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Price Alerts</div>
                  <div className="text-gray-600">Get notified when prices change on your favorites</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Share2" size={18} className="text-primary-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Share with Others</div>
                  <div className="text-gray-600">Share your favorite properties with family and friends</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;