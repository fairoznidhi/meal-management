"use client"
import React, { useState } from "react";

const SearchBar = ({ 
  data = [], 
  filterKey = "", 
  placeholder = "Search...", 
  onSearch 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) {
      const filteredData = data.filter((item) => {
        if (filterKey) {
          // Handle filtering when a specific key is provided
          return item[filterKey]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
        // Handle generic string filtering
        return item
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });

      onSearch(filteredData);
    }
  };

  return (
    <div className="ms-20 p-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-96 h-10 px-4 py-2 border rounded-md text-sm"
      />
    </div>
  );
};

export default SearchBar;
