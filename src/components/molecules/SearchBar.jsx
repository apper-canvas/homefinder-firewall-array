import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  onSearch = () => {}, 
  placeholder = "Search by location, property type, or keywords...",
  className = "",
  defaultValue = "",
  showButton = true 
}) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search - trigger search after user stops typing
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("flex gap-2", className)}
    >
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          icon="Search"
          iconPosition="left"
          className="h-12 text-base"
        />
      </div>
      
      {showButton && (
        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          icon="Search"
          className="px-6"
        >
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchBar;