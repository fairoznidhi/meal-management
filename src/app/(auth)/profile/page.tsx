"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useEmployeePhoto, useTokenSingleEmployee } from "@/services/queries";
import ProfileDetails from "@/features/profile/ProfileDetails";
import ProfileDisplay from "@/features/profile/ProfileDisplay";
import { UserProfileDataType } from "@/services/types";
import { getSession } from "next-auth/react";
import { usePatchEmployeeProfile } from "@/services/mutations";
import ChangePassword from "@/features/changePassword/ChangePassword";
import { Session } from "next-auth";
import { ProfilePictureContext } from "../layout";

const ProfilePage = () => {
  const { setUserName } = useContext(ProfilePictureContext);
  const { data: profileList } = useTokenSingleEmployee();
  const { mutate } = usePatchEmployeeProfile();
  const [formData, setFormData] = useState<UserProfileDataType | null>(null);
  const [actualData, setActualData] = useState<UserProfileDataType | null>(
    null
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(100);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
        console.log("session from profile", session);
      }
    };
    checkSession();
  }, []);
  const [isEditProfile, setIsEditProfile] = useState(false);

  useEffect(() => {
    if (profileList) {
      const profile = profileList[0];
      setFormData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone_number: profile.phone_number,
        dept_name: profile.dept_name ?? "",
        remarks: profile.remarks ?? "n/a",
      });
      setActualData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone_number: profile.phone_number,
        dept_name: profile.dept_name ?? "",
        remarks: profile.remarks ?? "n/a",
      });
      setUserName(profile.name ?? "");
    }
  }, [profileList]);

  const handleCancelUpdate = () => {
    setIsEditProfile(false);
    setFormData(actualData);
  };
  useEffect(() => {
    console.log("formdata", formData);
  }, [formData]);

  const handleInputChange = (
    field: keyof UserProfileDataType,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };
  const handleEmployeeUpdate = () => {
    const data = new FormData();
    data.append("name", formData?.name ?? "");
    const name = data.get("name");
    if (typeof name === "string") {
      if (name.length===0) {
        alert(
          "Name cannot be empty"
        );
        return;
      }
    }
    setUserName(formData?.name ?? "");
    data.append("phone_number", formData?.phone_number ?? "");
    const phoneNumber = data.get("phone_number");
    if (typeof phoneNumber === "string") {
      if (phoneNumber.length !== 11 || !/^\d+$/.test(phoneNumber)) {
        alert(
          "Phone number must be exactly 11 digits and contain only numbers"
        );
        return;
      }
    }
    data.append("remarks", formData?.remarks ?? "");
    if (session) {
      data.append("employee_id", session?.user?.employee_id);
    }
    mutate(data, {
      onSettled: () => {
        setIsEditProfile(false);
        setAlertMessage("Profile updated successfully!");
        setProgress(100);
        const interval = setInterval(() => {
          setProgress((prev) => Math.max(prev - 5, 0));
        }, 150);
        setTimeout(() => {
          setAlertMessage(null);
          clearInterval(interval);
        }, 3000);
      },
      onError: (error) => {
        console.error("Error updating password:", error);
      },
    });
    const formDataObject = Object.fromEntries(data.entries());
    console.log("FormData as object:", formDataObject);
    setActualData(formData);
  };

  // const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.result) {
  //         setUserProfilePicture(reader.result as string); // Update profile picture immediately
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="p-4 mx-24 mt-16">
      <div className="flex flex-row justify-between items-center mt-8 mb-8">
        {/*Profile Picture and Name Display*/}
        <div className="flex items-center ">
          {formData && <ProfileDisplay />}
          {formData && (
            <h1 className="px-6 text-xl font-semibold">{formData.name}</h1>
          )}
        </div>
        {/* Edit Button */}
        {isEditProfile ? (
          <div>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2"
              onClick={handleCancelUpdate}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
              onClick={handleEmployeeUpdate}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditProfile(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Details */}
      {formData && (
        <ProfileDetails
          formData={formData}
          isEditable={isEditProfile}
          onChange={handleInputChange}
        />
      )}
      <div className="mb-12"></div>
      {!isEditProfile && <ChangePassword />}
      {/* Alert Notification */}
      {alertMessage && (
        <div className="fixed top-20 right-5 bg-gray-500 text-white px-4 pt-4 rounded-md shadow-md min-w-64">
          <p>{alertMessage}</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1 mt-4">
            <div
              className="bg-white h-1 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
