"use client";
import { ProfilePictureContext } from "@/app/(auth)/layout";
import { usePatchEmployeeProfile } from "@/services/mutations";
import { getSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

const ProfileDisplay = () => {
  const { mutate } = usePatchEmployeeProfile();
  const [session, setSession] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(100);
  const {userProfilePicture,setUserProfilePicture}=useContext(ProfilePictureContext);

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      if (userSession) {
        setSession(userSession);
      }
    };
    fetchSession();
  }, []);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.employee_id) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("employee_id", session.user.employee_id);

    mutate(formData, {
      onSuccess: () => {
        const imageUrl = URL.createObjectURL(file);
        setUserProfilePicture(imageUrl);

        setAlertMessage("Profile picture updated successfully!");
        setProgress(100);
        const interval = setInterval(() => {
          setProgress((prev) => Math.max(prev - 5, 0));
        }, 150);
        setTimeout(() => {
          setAlertMessage(null);
          clearInterval(interval);
        }, 3000);
      },
      onError: () => {
        setAlertMessage("Failed to update profile picture.");
        setProgress(100);

        const interval = setInterval(() => {
          setProgress((prev) => Math.max(prev - 5, 0));
        }, 150);

        setTimeout(() => {
          setAlertMessage(null);
          clearInterval(interval);
        }, 3000);
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Alert Notification */}
      {alertMessage && (
        <div className="fixed top-20 right-5 bg-gray-500 text-white px-4 pt-2 rounded-md shadow-md min-w-64">
          <p>{alertMessage}</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1 mt-4">
            <div className="bg-white h-1 transition-all duration-150" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      <div className="relative w-32 h-32 rounded-md overflow-hidden">
        <img
          src={userProfilePicture}
          alt={"title"}
          className="object-cover w-full h-full"
        />
        <label
          htmlFor="profile-upload"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
        >
          Change
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProfileDisplay;
