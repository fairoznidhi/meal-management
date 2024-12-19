"use client";




import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({
  items,
  isCollapsed,
}: {
  items: { name: string; route: string }[];
  isCollapsed: boolean;
}) => {
  const pathname = usePathname(); // Get the current path

  return (
    <ul className="space-y-4 p-4">
      {items.map((item, index) => {
        const isActive = pathname === item.route; // Check if the current path matches the route
        return (
          <li key={index}>
            <Link href={item.route} className={`block p-2 rounded-md ${
                  isActive
                    ? "bg-gray-700 text-white font-bold" // Active styles
                    : "hover:bg-gray-700 hover:text-white text-gray-300" // Default styles
                } ${isCollapsed ? "text-center text-sm" : "text-base"}`}>
             
                {isCollapsed ? item.name[0] : item.name}
             
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;



