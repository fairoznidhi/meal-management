"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({
  items,
  isCollapsed,
}: {
  items: { name: string; route: string ; icon: React.ComponentType<{ className: string }>}[];
  isCollapsed: boolean;
}) => {
  const pathname = usePathname(); // Get the current path

  return (
    <div>
     <div className="flex">
      
     </div>
    <ul className="space-y-4 p-4">
      {items.map((item, index) => {
        const isActive = pathname === item.route; // Check if the current path matches the route
        const Icon=item.icon;
        return (
          <li key={index}>
            <Link href={item.route} className={`block p-2 rounded-md ${
                  isActive
                    ? "bg-[#007CB1] text-white font-bold" // Active styles
                    : "hover:bg-[#007CB1] hover:text-white text-gray-300" // Default styles
                } ${isCollapsed ? "text-center text-sm" : "text-base"}`}>
             
                 {/* Render icon */}
                 <div className="flex gap-x-3">
                 <Icon
                  className={`h-6 w-6 ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                />

                {/*{isCollapsed ? item.name[0] : item.name}*/}
                {/* Render name only if not collapsed */}
                {!isCollapsed && <span>{item.name}</span>}
             </div>
            </Link>
          </li>
        );
      })}
    </ul>

    
</div>
  );
};

export default Sidebar;


