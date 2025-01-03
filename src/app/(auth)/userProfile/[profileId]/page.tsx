'use client'

import { useSingleEmployee } from "@/services/queries";
import { useEffect, useState, use } from "react";
import Modal from "@/components/modal";
import ProfileDetails from "@/features/profile/ProfileDetails";
import ProfileDisplay from "@/features/profile/ProfileDisplay";
import { UserProfileDataType } from "@/services/types";

const SingleProfilePage = ({ params }: { params:Promise<{ profileId: number }> }) => {
  // useEffect(()=>{
  //   const fetchSession=async()=>{
  //     const session=await getSession();
  //     console.log(session)
  //   }
  //   fetchSession();
  // },[])

  const { profileId } = use<{ profileId: number }>(params);
  console.log(params)
  console.log(profileId)
  const { data, isLoading, error } = useSingleEmployee(profileId);
  const [formData, setFormData] = useState<UserProfileDataType | null>(null);
  const [profilePicture, setProfilePicture] = useState(
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const profile = data[0];
      console.log("Fetched data:", profile);
  
      setFormData({
        name: profile.name ?? '',
        email: profile.email ?? '',
        dept_id: profile.dept_id ?? 0,
        password: '****',
        remarks: profile.remarks ?? ''
      });
    }
  }, [data]);
  

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  const handleInputChange = (field: keyof UserProfileDataType, value: string) => {
    if (formData) {
      setFormData((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePicture(reader.result as string); // Update profile picture immediately
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setIsModalOpen(false); // Close the modal after saving
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading profile</h1>;
  }

  return (
    <div className="p-4 mx-24">
      {/* Profile Display */}
      <div className="flex flex-row justify-between items-center mt-8 mb-8">
        <div className="flex items-center ">
          <ProfileDisplay profilePicture={profilePicture} title="My Profile" />
          {formData && <h1 className="px-6 text-xl font-semibold">{formData.name}</h1>}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      {formData && <ProfileDetails formData={formData} />}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </>
        }
      >
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
            <img
              src={profilePicture}
              alt="New Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="text-sm"
          />
        </div>

        {/* Editable Profile Details */}
        {formData && (
          <ProfileDetails
            formData={formData}
            isEditable={true}
            onChange={handleInputChange}
          />
        )}
      </Modal>

      <button className="mt-28 border border-black p-2 rounded hover:bg-slate-300">
        Reset Password
      </button>
    </div>
  );
};

export default SingleProfilePage;
