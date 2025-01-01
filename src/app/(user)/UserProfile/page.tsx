"use client"
import React, { useState } from "react";
import Modal from "@/components/modal";
import ProfileDetails from "@/features/profile/ProfileDetails";
import ProfileDisplay from "@/features/profile/ProfileDisplay";

;
const UserProfile = () => {
  
  

  return (
    <div className="p-4 mx-24">
      {/* Profile Display */}
      <ProfileDisplay profilePicture={profilePicture} title="My Profile" />

      {/* Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit Profile
      </button>

      {/* Profile Details */}
       <ProfileDetails formData={formData} />
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
        <ProfileDetails
          formData={formData}
          isEditable={true}
          onChange={handleInputChange}
        />
      </Modal>

      <button className="mt-28 border border-black p-2 rounded hover:bg-slate-300">Reset Password</button>
    </div>
  );
};

export default UserProfile;