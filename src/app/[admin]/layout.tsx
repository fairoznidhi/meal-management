"use client"


import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", route: "/admin/dashboard" },
    { name: "Employee List", route: "/admin/employee" },
    { name: "Meal Plan", route: "/admin/meal_plan" },
  ];

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } bg-gray-800 text-white fixed top-0 left-0 h-full`}
      >
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-700 hover:bg-gray-600 w-full text-center"
        >
          {isCollapsed ? ">>" : "<<"}
        </button>
        <Sidebar items={sidebarItems} isCollapsed={isCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-4">
          <SearchBar onSearch={"text"} />
          {children}
        </div>
      </div>
    </div>
  );
}



