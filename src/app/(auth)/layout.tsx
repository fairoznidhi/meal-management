"use client"
import {useEffect, useState } from "react";
import Image from "next/image";
import { getSession, signOut, SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import vslogo from "public/vslogo.png";
import Sidebar from "@/components/sidebar";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const sidebarItemsAdmin = [
        { name: "Dashboard", route: "/adminDashboard" },
        { name: "Employee List", route: "/employeeList" },
        { name: "Meal Plan", route: "/mealPlan" },
        { name: "Profile", route: "/profile"},
      ];
      const sidebarItemsUser = [
        { name: "Dashboard", route: "/userDashboard" },
        { name: "Profile", route: "/profile"},
      ];
      const [isCollapsed, setIsCollapsed] = useState(false);
      const [isAdmin,setIsAdmin]=useState(false)
      const [session, setSession] = useState<Session | null>(null);
      useEffect(() => {
        const checkSession = async () => {
          const session = await getSession();
          if (session) {
            setIsAdmin(session.user?.is_admin || false);
            setSession(session);
          } else {
            setIsAdmin(false);
          }
        };
        checkSession();
      }, []);
      const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
      };
  return (
        <SessionProvider session={session}>
            <div className="flex h-screen">
                {/* Sidebar */}
              <div className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} bg-gray-800 text-white fixed top-0 left-0 h-full`}>
                  <button
                  onClick={toggleSidebar}
                  className="p-2 bg-gray-700 hover:bg-gray-600 w-full text-center"
                  >
                  {isCollapsed ? ">>" : "<<"}
                  </button>
                  <div className="flex flex-col">
                  <div className="flex-grow"><Sidebar items={isAdmin ? sidebarItemsAdmin : sidebarItemsUser} isCollapsed={isCollapsed} /></div>
                  <div className="flex justify-center items-end my-8 absolute bottom-0 left-0 right-0">
                      {!isCollapsed && 
                      <button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>}
                  </div>
                  </div>
              </div>
                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"
                    }`}
                >
                    <div className="">
                    <div className="relative"><Image src={vslogo} alt="vlogo" className="fixed top-2 right-5 w-20 h-20"></Image></div>
                    <div>
                        {children}
                        </div> 
                    
                    </div>
                </div>
            </div>
        </SessionProvider>
  );
}



