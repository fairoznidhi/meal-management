"use client";
import { ProfilePictureContext } from "@/app/(auth)/layout";
import notificationToast from "@/components/notificationToast";
import { usePatchEmployeeProfile } from "@/services/mutations";
import { getSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

const ProfileDisplay = () => {
  const { mutate } = usePatchEmployeeProfile();
  const [session, setSession] = useState<any>(null);
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
        notificationToast("Profile picture updated successfully!","success");
      },
      onError: () => {
        notificationToast("Failed to update profile picture.","error");
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
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
