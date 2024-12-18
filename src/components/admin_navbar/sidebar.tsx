"use client";

{/*import Link from "next/link";
import React from "react";

// Define a type for the sidebar items
interface SidebarProps {
  items: string[];  // Array of strings (each item is a string)
}
const Sidebar: React.FC<SidebarProps>=({items})=>{
    return (
        
      <div className="bg-base-200 text-base-content min-h-full w-80 p-4 fixed top-0 left-0">
    <ul className="menu text-2xl text-bold mt-20 py-10 gap-y-6">
    {items.map((item, index) => (
          <li key={index}>
            <a>{item}</a>
          </li>
        ))}
    </ul>
  </div>
    );
}
export default Sidebar

import React from "react";

const Sidebar = ({
  items,
  isCollapsed,
}: {
  items: string[];
  isCollapsed: boolean;
}) => {
  return (
    <ul className="space-y-4 p-4">
      {items.map((item, index) => (
        <li
          key={index}
          className={`p-2 hover:bg-gray-700 rounded-md ${
            isCollapsed ? "text-center text-sm" : "text-base"
          }`}
        >
          {isCollapsed ? (
            <span title={item}>{item[0]}</span> // Show only the first letter as a tooltip
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;




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
  return (
    <ul className="space-y-4 p-4">
      {items.map((item, index) => (
        <li key={index} className="p-2 rounded-md hover:bg-gray-700">
          <Link href={item.route} className={`block ${
                isCollapsed ? "text-center text-sm" : "text-base"
              }`}>
            
              {isCollapsed ? item.name[0] : item.name}
           
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
*/}



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
