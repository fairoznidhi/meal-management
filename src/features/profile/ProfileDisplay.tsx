"use client";

import React from "react";

type ProfileDisplayProps = {
  profilePicture: string;
  title: string;
};

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profilePicture, title }) => {
  return (
    <div className="flex justify-between items-center mb-8 mt-28">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="relative w-52 h-52 rounded overflow-hidden">
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
