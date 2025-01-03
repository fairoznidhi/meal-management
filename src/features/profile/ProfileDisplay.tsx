"use client";

import React from "react";

type ProfileDisplayProps = {
  profilePicture: string;
  title: string;
};

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profilePicture, title }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-32 h-32 rounded-md overflow-hidden">
        <img
          src={profilePicture}
          alt="Profile"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default ProfileDisplay;
