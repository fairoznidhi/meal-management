"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({
  items,
  isCollapsed,
}: {
  items: {
    name: string;
    route: string;
    icon: React.ComponentType<{ className: string }>;
  }[];
  isCollapsed: boolean;
}) => {
  const pathname = usePathname(); // Get the current path

  return (
    <div>
      <div className="flex"></div>
      <ul className="space-y-2 p-4">
        {items.map((item, index) => {
          const isActive = pathname === item.route; // Check if the current path matches the route
          const Icon = item.icon;
          return (
            <li
              key={index}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link
                href={item.route}
                className={`flex items-center rounded-md min-h-12 ${
                  isActive
                    ? "bg-vivaBlue text-white" // Active styles
                    : "hover:bg-white text-midnightBlue" // Default styles
                } ${isCollapsed ? "" : ""}`}
              >
                {/* Render icon*/}
                <div className="flex items-center">
                  <Icon
                    className={`h-6 shrink-0 px-3 ${
                      isActive ? "text-white" : "text-midnightBlue"
                    }`}
                  />

                  {/*{isCollapsed ? item.name[0] : item.name}*/}
                  {/* Render name only if not collapsed */}
                  {!isCollapsed && <p className="pl-2 min-w-64">{item.name}</p>}
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
