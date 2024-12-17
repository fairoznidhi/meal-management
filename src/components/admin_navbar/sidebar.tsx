

import Link from "next/link";
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