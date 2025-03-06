"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSidebarExpand } from "react-icons/go";
import vslogo from "public/Vivasoft_logo_mark.svg";
import Image from "next/image";


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
    <div className="">
      <div className="flex items-center px-4 mb-2">
        <Image src={vslogo} alt="vlogo" className="w-10 h-10 ms-1 me-1"></Image>
        {/*<p className="text-white font-semibold mt-1 text-2xl font-serif">
                VivaMeal
              </p>*/}
        {!isCollapsed && (
          <p className="text-midnightBlue font-space font-extrabold text-2xl mt-1 pl-2">
            VivaMeal
          </p>
        )}
      </div>
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
                  {!isCollapsed && <p className="pl-2 w-64">{item.name}</p>}
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
