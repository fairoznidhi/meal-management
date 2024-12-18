"use client"
{/*import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/admin_navbar/sidebar"





 export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const sidebarItems: string[] = ["Dashboard", "Employee List", "Meal Plan"];
    return <section className="items-center justify-center">
      <div className="flex gap-x-36 gap-y-10 ml-44">
         <div><Sidebar items={sidebarItems}></Sidebar></div>
         <div className="mb-5"><SearchBar></SearchBar>{children}</div>
      </div>
      </section>
    
  }


import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/admin_navbar/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
  const sidebarItems: string[] = ["Dashboard", "Employee List", "Meal Plan"];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className="items-center justify-center">
      <div className="flex">
      
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 ease-in-out bg-gray-800 text-white h-screen`}
        >
          <div className="p-4 flex justify-between items-center">
            <h2
              className={`text-lg font-bold ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              Admin
            </h2>
            <button
              onClick={toggleSidebar}
              className="text-white bg-gray-600 p-2 rounded-md hover:bg-gray-700"
            >
              {isCollapsed ? ">" : "<"}
            </button>
          </div>
          <Sidebar items={sidebarItems} isCollapsed={isCollapsed} />
        </div>

  
        <div className="flex-1 p-4">
          <div className="mb-5">
            <SearchBar />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}


import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/admin_navbar/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarItems = [
    { name: "Dashboard", route: "/admin/dashboard" },
    { name: "Employee List", route: "/admin/employee" },
    { name: "Meal Plan", route: "/admin/meal_plan" },
  ];

  return (
    <section className="flex">
      
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2
            className={`text-lg font-bold ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            Admin
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-white bg-gray-600 p-2 rounded-md hover:bg-gray-700"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>
        <Sidebar items={sidebarItems} isCollapsed={isCollapsed} />
      </div>

     
      <div
        className={`flex-1 p-4 ml-${isCollapsed ? "16" : "64"} transition-all duration-300 ease-in-out`}
      >
        <div className="mb-5">
          <SearchBar onSearch={"text"}/>
          {children}
        </div>
      </div>
    </section>
  );
}*/}




import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/admin_navbar/sidebar";

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
        className={`flex-1 ml-${isCollapsed ? "16" : "64"} transition-all duration-300`}
      >
        <div className="p-4">
          <SearchBar onSearch={"text"} />
          {children}
        </div>
      </div>
    </div>
  );
}

