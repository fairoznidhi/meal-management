"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const Search: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 px-4 py-2 rounded w-[50vh] pl-10"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
    </div>
  );
};

export default Search;
