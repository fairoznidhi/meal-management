"use client";
{/*import React, { createContext, useContext, useEffect, useState } from "react";
import { useEmployeePhoto, useTokenSingleEmployee } from "@/services/queries";
import ProfileDetails from "@/features/profile/ProfileDetails";
import ProfileDisplay from "@/features/profile/ProfileDisplay";
import { UserProfileDataType } from "@/services/types";
import { getSession } from "next-auth/react";
import { usePatchEmployeeProfile } from "@/services/mutations";
import ChangePassword from "@/features/changePassword/ChangePassword";
import { Session } from "next-auth";
import { ProfilePictureContext } from "../layout";
import notificationToast from "@/components/notificationToast";

const ProfilePage = () => {
  const { setUserName } = useContext(ProfilePictureContext);
  const { data: profileList } = useTokenSingleEmployee();
  const { mutate } = usePatchEmployeeProfile();
  const [formData, setFormData] = useState<UserProfileDataType | null>(null);
  const [actualData, setActualData] = useState<UserProfileDataType | null>(
    null
  );
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
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        phone_number: profile?.phone_number,
        dept_name: profile?.dept_name ?? "",
        remarks: profile?.remarks?.trim() ? profile.remarks : "No preference",
        preference_food:profile?.preference_food?[],
       
      });
      console.log("Profile formdata",formData)
      setActualData({
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        phone_number: profile?.phone_number,
        dept_name: profile?.dept_name ?? "",
        remarks: profile?.remarks?.trim() ? profile.remarks : "No preference",
        preference_food:profile?.preference_food??[],
        
      });
      setUserName(profile?.name ?? "");
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
        notificationToast("Profile updated successfully!","success")
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
        {/*Profile Picture and Name Display
        <div className="flex items-center ">
          {formData && <ProfileDisplay />}
          {formData && (
            <h1 className="px-6 text-xl font-semibold">{formData.name}</h1>
          )}
        </div>
        {/* Edit Button 
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

      {/* Profile Details  
      {formData && (
        <ProfileDetails
          formData={formData}
          isEditable={isEditProfile}
          onChange={handleInputChange}
          
        />
      )}
      <div className="mb-12"></div>
      {!isEditProfile && <ChangePassword />}

    </div>
  );
};

export default ProfilePage;


*/}




import React, { createContext, useContext, useEffect, useState } from "react";
import { useEmployeePhoto, useTokenSingleEmployee, useFetchPreferences } from "@/services/queries";
import ProfileDetails from "@/features/profile/ProfileDetails";
import ProfileDisplay from "@/features/profile/ProfileDisplay";
import { UserProfileDataType, Preference } from "@/services/types";
import { getSession } from "next-auth/react";
import { usePatchEmployeeProfile } from "@/services/mutations";
import ChangePassword from "@/features/changePassword/ChangePassword";
import { Session } from "next-auth";
import { ProfilePictureContext } from "../layout";
import notificationToast from "@/components/notificationToast";

const ProfilePage = () => {
  const { setUserName } = useContext(ProfilePictureContext);
  const { data: profileList } = useTokenSingleEmployee();
  const { mutate } = usePatchEmployeeProfile();
  const { data: preferences = [] } = useFetchPreferences(); // Fetching preferences

  const [formData, setFormData] = useState<UserProfileDataType | null>(null);
  const [actualData, setActualData] = useState<UserProfileDataType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isEditProfile, setIsEditProfile] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (profileList) {
      const profile = profileList[0];

      setFormData({
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        phone_number: profile?.phone_number ?? "",
        dept_name: profile?.dept_name ?? "",
        remarks: profile?.remarks?.trim() ? profile.remarks : "No preference",
        preference_food: profile?.preference_food ?? [],
       
      });

      setActualData({
        name: profile?.name ?? "",
        email: profile?.email ?? "",
        phone_number: profile?.phone_number ?? "",
        dept_name: profile?.dept_name ?? "",
        remarks: profile?.remarks?.trim() ? profile.remarks : "No preference",
        preference_food: profile?.preference_food ?? [],
        
      });

      setUserName(profile?.name ?? "");
    }
  }, [profileList]);

  const handleCancelUpdate = () => {
    setIsEditProfile(false);
    setFormData(actualData);
  };

  const handleInputChange = (field: keyof UserProfileDataType, value: string | string[] | number[]) => {
    if (field === 'preference_food') {
      // Ensure that only an array of food IDs (numbers) is passed for preference_food
      setFormData((prev) => ({
        ...prev!,
        [field]: value as number[],  // Type cast to number[] explicitly
      }));
    } else {
      // For other fields, handle as normal
      setFormData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };
  

  const handleEmployeeUpdate = () => {
    const data = new FormData();
    data.append("name", formData?.name ?? "");

    if (!formData?.name) {
      alert("Name cannot be empty");
      return;
    }

    data.append("phone_number", formData?.phone_number ?? "");

    if (formData?.phone_number?.length !== 11 || !/^\d+$/.test(formData.phone_number)) {
      alert("Phone number must be exactly 11 digits and contain only numbers");
      return;
    }

    data.append("remarks", formData?.remarks ?? "");

    if (session) {
      data.append("employee_id", session?.user?.employee_id);
      
    }

    //data.append("preference_food", JSON.stringify(formData?.preference_food ?? []));
    data.append("preference_food", (formData?.preference_food ?? []).join(","));
    

    mutate(data, {
      onSettled: () => {
        setIsEditProfile(false);
        notificationToast("Profile updated successfully!", "success");
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });

    setActualData(formData);
  };

  return (
    <div className="p-4 mx-24 mt-16">
      <div className="flex flex-row justify-between items-center mt-8 mb-8">
        <div className="flex items-center">
          {formData && <ProfileDisplay />}
          {formData && <h1 className="px-6 text-xl font-semibold">{formData.name}</h1>}
        </div>
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
          preferences={preferences.map((pref: Preference) => ({
            food: pref.food,
            food_id: pref.food_Id,
          }))} // Ensure preferences have both name and id
        />
      )}

      <div className="mb-12"></div>
      {!isEditProfile && <ChangePassword />}
    </div>
  );
};

export default ProfilePage;
