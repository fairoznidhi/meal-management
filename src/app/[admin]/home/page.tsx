"use client"
import React, { useState } from "react";

const CollapsibleSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${
          isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-lg font-bold ${isCollapsed ? "hidden" : "block"}`}>
            Sidebar
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-white bg-gray-600 p-2 rounded-md hover:bg-gray-700"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="p-2 hover:bg-gray-700 rounded-md">
            <a href="#" className={`${isCollapsed ? "text-sm" : "text-base"}`}>
              Item 1
            </a>
          </li>
          <li className="p-2 hover:bg-gray-700 rounded-md">
            <a href="#" className={`${isCollapsed ? "text-sm" : "text-base"}`}>
              Item 2
            </a>
          </li>
          <li className="p-2 hover:bg-gray-700 rounded-md">
            <a href="#" className={`${isCollapsed ? "text-sm" : "text-base"}`}>
              Item 3
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4">
        <h1 className="text-xl font-bold">Main Content</h1>
        <p>
          This is the main content area. The sidebar can collapse and expand by
          clicking the button.
        </p>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
