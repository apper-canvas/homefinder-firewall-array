import React, { useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Update URL search params
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <main>
        <Outlet context={{ searchQuery, onSearch: handleSearch }} />
      </main>
    </div>
  );
};

export default Layout;