"use client"

import React, { useState} from "react";
import Sidebar from "@/components/sidebar";
import Image from "next/image";
import vslogo from "public/vslogo.png";
import { signOut } from "next-auth/react";


export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", route: "/UserDash" },
    { name: "My Profile", route: "/profile/2"},
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
          <div className="flex flex-col">
            <div className="flex-grow"><Sidebar items={sidebarItems} isCollapsed={isCollapsed} /></div>
            <div className="flex justify-center items-end my-8 absolute bottom-0 left-0 right-0">
              {!isCollapsed && 
              <button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>}
            </div>
          </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="">
        <div className="avatar relative">
          <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2 mt-10 ms-10 right-48">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
          </div>
          <p className="mt-12 ms-6 font-bold">UserName</p>
        </div>   
        <div className="relative"><Image src={vslogo} alt="vlogo" className="fixed top-2 right-5 w-20 h-20"></Image></div>
          <div>
            {children}
          </div> 
           
        </div>
      </div>
    </div>
  );
}


