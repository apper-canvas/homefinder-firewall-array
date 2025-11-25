import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import propertyService from "@/services/api/propertyService";

const Header = ({ onSearch = () => {}, searchQuery = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState(
    propertyService.getFavoriteIds().length
  );

  const navItems = [
    { path: "", label: "Browse", icon: "Grid3X3" },
    { path: "map", label: "Map View", icon: "Map" },
    { path: "favorites", label: "Favorites", icon: "Heart" },
    { path: "compare", label: "Compare", icon: "GitCompare" }
  ];

  const isActive = (path) => {
    if (path === "" && location.pathname === "/") return true;
    return location.pathname === `/${path}`;
  };

  const handleSearch = (query) => {
    onSearch(query);
    // Navigate to browse page if not already there
    if (location.pathname !== "/") {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  // Listen for storage changes to update favorite count
  React.useEffect(() => {
    const handleStorageChange = () => {
      setFavoriteCount(propertyService.getFavoriteIds().length);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events from our app
    const handleFavoriteUpdate = () => {
      setFavoriteCount(propertyService.getFavoriteIds().length);
    };

    window.addEventListener("favoriteUpdated", handleFavoriteUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">
              HomeFinder
            </span>
          </Link>

          {/* Search Bar - Hide on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar
              onSearch={handleSearch}
              defaultValue={searchQuery}
              placeholder="Search by location, property type, or keywords..."
              showButton={false}
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {navItems.map((item) => {
                const itemPath = item.path === "" ? "/" : `/${item.path}`;
                return (
                  <Link
                    key={item.path}
                    to={itemPath}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 relative",
                      isActive(item.path)
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    )}
                  >
                    <ApperIcon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    
                    {/* Favorite count badge */}
                    {item.path === "favorites" && favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {favoriteCount > 99 ? "99+" : favoriteCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button - Show navigation icons on mobile */}
            <div className="flex lg:hidden items-center gap-2">
              {navItems.slice(0, 3).map((item) => {
                const itemPath = item.path === "" ? "/" : `/${item.path}`;
                return (
                  <Link
                    key={item.path}
                    to={itemPath}
                    className={cn(
                      "p-2 rounded-lg relative",
                      isActive(item.path)
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    )}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    
                    {/* Favorite count badge */}
                    {item.path === "favorites" && favoriteCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {favoriteCount > 9 ? "9+" : favoriteCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="hidden md:block">
              <Button
                variant="accent"
                size="sm"
                icon="Plus"
                onClick={() => {
                  // Placeholder for list property functionality
                  alert("List property feature coming soon!");
                }}
              >
                List Property
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar
            onSearch={handleSearch}
            defaultValue={searchQuery}
            placeholder="Search properties..."
            showButton={false}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;