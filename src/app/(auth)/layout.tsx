"use client";
import Sidebar from "@/components/sidebar";
import { useEmployeePhoto } from "@/services/queries";
import {
  ClipboardDocumentListIcon,
  HomeModernIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { getSession, SessionProvider, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import vslogo from "public/vslogo.png";
import { createContext, useEffect, useState } from "react";
type profilePictureType = {
  userProfilePicture: string;
  setUserProfilePicture: React.Dispatch<React.SetStateAction<string>>;
};
const defaultProfilePicture: profilePictureType = {
  userProfilePicture:
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  setUserProfilePicture: () => {},
};
export const ProfilePictureContext = createContext<profilePictureType>(
  defaultProfilePicture
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItemsAdmin = [
    { name: "Dashboard", route: "/adminDashboard", icon: HomeModernIcon },
    { name: "Employee List", route: "/employeeList", icon: UsersIcon },
    {
      name: "Meal Entry",
      route: "/adminmealPlan",
      icon: UserIcon ,
    },
    { name: "Menu", route: "/menuPlan", icon: ClipboardDocumentListIcon },
    //{ name: "My Profie", route: "/profile", icon: UserIcon },
    { name: "Meal History", route:"/MealHistory", icon: ClipboardDocumentListIcon }
  ];
  const sidebarItemsUser = [
    { name: "Dashboard", route: "/userDashboard", icon: HomeModernIcon },
    { name: "Profile", route: "/profile", icon: UserIcon },
  ];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setIsAdmin(session.user?.is_admin || false);
        setSession(session);
        console.log("session from auth layout", session);
      } else {
        setIsAdmin(false);
      }
    };
    checkSession();
  }, []);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  const { data: employeePhotoBlob, refetch: refetchEmployeePhotoBlob } =
    useEmployeePhoto();
  const [userProfilePicture, setUserProfilePicture] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );
  useEffect(() => {
    if (employeePhotoBlob) {
      const url = URL.createObjectURL(employeePhotoBlob);
      setUserProfilePicture(url);
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [employeePhotoBlob]);
  useEffect(() => {
    refetchEmployeePhotoBlob();
  }, [setUserProfilePicture]);
  return (
    <SessionProvider session={session}>
      <ProfilePictureContext.Provider
        value={{ userProfilePicture, setUserProfilePicture }}
      >
        <div className="mr-8 mt-1">
          <div className="navbar bg-base-100">
            <div className="flex-1"></div>
            <div className="flex-none gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={userProfilePicture}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href="/profile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a onClick={() => signOut({ callbackUrl: "/login" })}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-screen">
          {/* Sidebar
              <div className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} bg-gray-800 text-white fixed top-0 left-0 h-full`}>
                  <button
                  onClick={toggleSidebar}
                  className="p-2 bg-gray-700 hover:bg-gray-700 w-full text-center"
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
              </div>*/}

          <div
            className={`transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
            } bg-[#005A8F] text-white fixed top-0 left-0 h-full`}
          >
            <button
              onClick={toggleSidebar}
              className="p-2 bg-[#007CB1] hover:bg-[#] w-full  text-black text-center mb-7"
            >
              {isCollapsed ? ">>" : "<<"}
            </button>
            <div className="flex">
              <Image
                src={vslogo}
                alt="vlogo"
                className="w-10 h-10 border rounded-full bg-white ms-3 me-5 "
              ></Image>
              {/*<p className="text-white font-semibold mt-1 text-2xl font-serif">
                VivaMeal
              </p>*/}
               {!isCollapsed && (
    <p className="text-white font-semibold text-2xl font-serif ms-2 mt-1">
      VivaMeal
    </p>
  )}
            </div>
            <Sidebar
              items={isAdmin ? sidebarItemsAdmin : sidebarItemsUser}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 transition-all duration-300 ${
              isCollapsed ? "ml-16" : "ml-64"
            }`}
          >
            <div className="">
              <div>{children}</div>
            </div>
          </div>
        </div>
      </ProfilePictureContext.Provider>
    </SessionProvider>
  );
}
