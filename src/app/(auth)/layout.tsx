"use client";
import Sidebar from "@/components/sidebar";
import { useEmployeePhoto, useTokenSingleEmployee } from "@/services/queries";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { Session } from "next-auth";
import { getSession, SessionProvider, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    { name: "Dashboard", route: "/adminDashboard", icon: Squares2X2Icon },
    { name: "Meal Update", route: "/mealUpdate", icon: CalendarDaysIcon },
    { name: "Menu", route: "/menuPlan", icon: NewspaperIcon },
    { name: "Employee List", route: "/employeeList", icon: UsersIcon },
    { name: "Meal History", route: "/MealHistory", icon: ClockIcon },
    { name: "Settings", route: "/Settings", icon: Cog6ToothIcon },
  ];
  const sidebarItemsUser = [
    { name: "Dashboard", route: "/userDashboard", icon: Squares2X2Icon },
    {
      name: "Meal Update",
      route: "/UserMealUpdate",
      icon: ClipboardDocumentCheckIcon,
    },
    { name: "Meal History", route: "/UserMealHistory", icon: ClockIcon },
  ];
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const { data: profileList } = useTokenSingleEmployee();
  const [adminView, setAdminView] = useState(() => {
    if (typeof window !== "undefined") {
      const storedAdminView = localStorage.getItem("adminView") === "true";
      return storedAdminView;
    }
  });
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
          {/* sidebar */}
          <div
            className={`transition-all duration-300 ${
              isCollapsed
                ? "w-20 transition duration-300 ease-in-out"
                : "w-64 transition duration-300 ease-in-out"
              // bg-[#005A8F]
            } bg-aliceBlue fixed h-full z-50 pt-8`}
            onClick={toggleSidebar}
          >
            <Sidebar
              items={
                isAdmin
                  ? adminView
                    ? sidebarItemsAdmin
                    : sidebarItemsUser
                  : sidebarItemsUser
              }
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
                      const view = !adminView;
                      localStorage.setItem("adminView", view.toString());
                      setAdminView((prev) => !prev);
                      router.push(
                        adminView ? "/userDashboard" : "/adminDashboard"
                      );
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
