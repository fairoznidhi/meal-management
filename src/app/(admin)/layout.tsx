"use client"


import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import vslogo from "public/vslogo.png";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", route: "/dashboard" },
    { name: "Employee List", route: "/employee" },
    { name: "Meal Plan", route: "/meal_plan" },
    { name: "Profie", route: "/profile"},
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
        <div className="">
        <div className="relative"><Image src={vslogo} alt="vlogo" className="fixed top-2 right-5 w-20 h-20"></Image></div>
          <div>
            {children}</div> 
           
        </div>
      </div>
    </div>
  );
}



