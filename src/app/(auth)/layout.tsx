"use client";
import Sidebar from "@/components/sidebar";
import { useEmployeePhoto, useTokenSingleEmployee } from "@/services/queries";
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
import profileImage from "public/profile-image.jpg";
import { createContext, useEffect, useState } from "react";
type profilePictureType = {
  userProfilePicture: string;
  setUserProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};
const defaultProfilePicture: profilePictureType = {
  userProfilePicture: profileImage.src,
  setUserProfilePicture: () => {},
  userName: "",
  setUserName: () => {},
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
      name: "Meal Plan",
      route: "/adminmealPlan",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Menu Plan", route: "/menuPlan", icon: ClipboardDocumentListIcon },
    { name: "My Profie", route: "/profile", icon: UserIcon },
  ];
  const sidebarItemsUser = [
    { name: "Dashboard", route: "/userDashboard", icon: HomeModernIcon },
    { name: "Profile", route: "/profile", icon: UserIcon },
  ];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { data: profileList } = useTokenSingleEmployee();
  useEffect(() => {
      if (profileList) {
        const profile = profileList[0];
        setUserName(profile.name ?? "")
      }
    }, [profileList]);
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
    profileImage.src
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
  const [userName, setUserName] = useState("");
  return (
    <SessionProvider session={session}>
      <ProfilePictureContext.Provider
        value={{
          userProfilePicture,
          setUserProfilePicture,
          userName,
          setUserName,
        }}
      >
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
          {/* sidebar */}
          <div
            className={`transition-all duration-300 ${
              isCollapsed ? "w-16" : "w-64"
            } bg-[#005A8F] text-white fixed h-full z-50`}
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
              <p className="text-white font-semibold mt-1 text-2xl font-serif">
                VivaMeal
              </p>
            </div>
            <Sidebar
              items={isAdmin ? sidebarItemsAdmin : sidebarItemsUser}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* navbar */}
          <div className=" fixed z-40 w-full h-[60px]">
            <div className="navbar bg-base-100 pt-2 px-8">
              <div className="flex-1"></div>
              <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                  <div className="flex items-center " tabIndex={0}
                      role="button">
                    <div className="pr-4 text-base font-semibold text-gray-700">{userName}</div>
                    <div
  
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS Navbar component"
                          src={userProfilePicture}
                        />
                      </div>
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

          {/* Main Content */}
          <div
            className={`flex-1 transition-all duration-300 ${
              isCollapsed ? "ml-16" : "ml-64"
            }`}
          >
            <div className="">
              <div className="mt-[60px]">{children}</div>
            </div>
          </div>
        </div>
      </ProfilePictureContext.Provider>
    </SessionProvider>
  );
}
