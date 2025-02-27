"use client";
import Sidebar from "@/components/sidebar";
import { useEmployeePhoto, useTokenSingleEmployee } from "@/services/queries";
import {
  UsersIcon,
  CalendarDaysIcon,
  Squares2X2Icon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { FaHome, FaUsers, FaClipboardList, FaCalendarAlt, FaUtensils, FaChartBar, FaAtlas, FaAccusoft, FaBacon, FaBreadSlice, FaCalendarWeek, FaClipboardCheck } from "react-icons/fa";
import { Session } from "next-auth";
import { getSession, SessionProvider, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import vslogo from "public/Vivasoft_logo_mark.svg";
import profileImage from "public/profile-image.jpg";
import { createContext, useEffect, useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
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
    { name: "Dashboard", route: "/adminDashboard", icon: Squares2X2Icon },
    { name: "Meal Update", route: "/mealUpdate", icon: CalendarDaysIcon },
    { name: "Menu", route: "/menuPlan", icon: NewspaperIcon },
    { name: "Employee List", route: "/employeeList", icon: UsersIcon },
    { name: "Meal History", route: "/MealHistory", icon: ClockIcon },
  ];
  const sidebarItemsUser = [
    { name: "Dashboard", route: "/userDashboard", icon: Squares2X2Icon },
    // {
    //   name: "Meal Update",
    //   route: "/UserMealUpdate",
    //   icon: ClipboardDocumentCheckIcon,
    // },
    // { name: "Meal History", route: "/UserMealHistory", icon: ClockIcon },
  ];
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { data: profileList } = useTokenSingleEmployee();
  const [adminView, setAdminView] = useState(true);
  useEffect(() => {
    if (profileList) {
      const profile = profileList[0];
      setUserName(profile?.name ?? "");
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
              isCollapsed ? "w-20" : "w-64"
              // bg-[#005A8F]
            } bg-aliceBlue fixed h-full z-50 pt-8`}
            onClick={toggleSidebar}
          >
            {/* <button
              onClick={toggleSidebar}
              className="p-2 bg-[#005A8F] hover:bg-[#] w-full  text-[#005A8F] text-center mb-7"
              
            >
              {isCollapsed ? ">>" : "<<"}
            </button> */}
            <div className="flex items-center px-4 mb-2">
              <Image
                src={vslogo}
                alt="vlogo"
                className="w-10 h-10 ms-1 me-1"
              ></Image>
              {/*<p className="text-white font-semibold mt-1 text-2xl font-serif">
                VivaMeal
              </p>*/}
              {!isCollapsed && (
                <p className="text-midnightBlue font-space font-extrabold text-2xl mt-1 pl-2">
                  VivaMeal
                </p>
              )}
            </div>
            <Sidebar
              items={isAdmin ? adminView? sidebarItemsAdmin : sidebarItemsUser : sidebarItemsUser}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* navbar */}
          <div className=" fixed z-40 w-full h-[60px]">
            <div className="navbar bg-white border-dashed border-b-[1px] pt-2 px-8">
              {isAdmin && (
                <div>
                  <div
                    className={`text-gray-500 text-xs pr-1 ${
                      isCollapsed ? "pl-16" : "pl-60"
                    }`}
                  >
                    View as
                  </div>
                  <label
                    className="cursor-pointer bg-gray-100 px-4 py-1 rounded-lg text-gray-700 font-extrabold hover:bg-gray-300 transition"
                    onClick={() => {
                      setAdminView(!adminView);
                      router.push(adminView ? "/userDashboard" : "/adminDashboard");
                    }}
                  >
                    {adminView ? "Admin" : "Employee"}
                  </label>
                </div>
              )}
              <div className="flex-1"></div>
              <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                  
                  <div
                    className="flex items-center "
                    tabIndex={0}
                    role="button"
                  >
                    <div className="pr-4 text-base font-semibold text-gray-700">
                      {userName}
                    </div>
                    <div className="btn btn-ghost btn-circle avatar">
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

                    {isAdmin && (
                  <li>
                     <Link href="/Settings" className="justify-between">
                      Settings
                    </Link>
                  </li>
                  )}
                  
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
              isCollapsed ? "ml-20" : "ml-64"
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