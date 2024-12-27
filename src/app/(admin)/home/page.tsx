"use client"

import React, { useState } from "react";

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "250px" }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">Sidebar</h2>
          <ul className="mt-4">
            <li className="py-2">Home</li>
            <li className="py-2">About</li>
            <li className="py-2">Contact</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-transform duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          </button>
          <div className="mt-4">
            <h1 className="text-2xl font-bold">Main Content</h1>
            <p className="mt-2">
              This is the main content area. When the sidebar appears, this
              content is pushed to the right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
