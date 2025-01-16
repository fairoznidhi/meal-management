"use client"


import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import vslogo from "public/vslogo.png";
import { HomeModernIcon, UsersIcon, ClipboardDocumentListIcon, UserIcon } from "@heroicons/react/24/outline";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", route: "/adminDashboard", icon:HomeModernIcon },
    { name: "Employee List", route: "/employee", icon:UsersIcon },
    { name: "Meal Plan", route: "/meal_plan", icon:ClipboardDocumentListIcon },
    { name: "My Profie", route: "/profile", icon:UserIcon},
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
        } bg-[#005A8F] text-white fixed top-0 left-0 h-full`}
      >
        <button
          onClick={toggleSidebar}
          className="p-2 bg-[#005A8F] hover:bg-[#005A8F] w-full text-right text-black"
        >

          <Image src={vslogo} alt="vlogo" className="w-10 h-10 border rounded-full bg-white ms-1 me-5 "></Image>
         
          {isCollapsed ? "" : ""}
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
        {/*<div className="relative"><Image src={vslogo} alt="vlogo" className="fixed top-2 right-5 w-10 h-10 border border-black rounded-full"></Image></div>*/}
          <div>
            {children}</div> 
           
        </div>
      </div>
    </div>
  );
}



