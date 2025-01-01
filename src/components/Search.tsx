"use client";

import React from "react";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const Search: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 px-4 py-2 rounded w-[50vh]"
      />
    </div>
  );
};

export default Search;
