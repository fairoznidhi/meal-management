"use client"
import React, { useState } from "react";
import SearchBar from "@/components/admin_navbar/searchbar";
import Sidebar from "@/components/admin_navbar/sidebar"





 export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const sidebarItems: string[] = ["Dashboard", "Employee List", "Meal Plan"];
    return <section className="items-center justify-center">
      <div className="flex gap-x-20 ml-44">
         <div><Sidebar items={sidebarItems}></Sidebar></div>
         <div className="me-20"><SearchBar></SearchBar>{children}</div>
      </div>
      </section>
    
  }
