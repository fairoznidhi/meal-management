"use client"

import React, { useState } from "react";


const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    mobile: "1234567890",
    department: "Development",
    notes: "Some notes here...",
  });

  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    password: false,
    mobile: false,
    department: true,
    notes: false,
  });

  const handleInputChange = (field:string, value:string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: keyof typeof formData) => {
    setIsEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="p-4 mx-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Edit your Profile</h2>
        <div className="relative w-52 h-52 rounded overflow-hidden">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10">
        {Object.keys(formData).map((field) => {
          if (field === "department") {
            return (
              <div key={field} className="flex items-center">
                <label
                  htmlFor={field}
                  className="block w-32 font-medium text-gray-700"
                >
                  Department:
                </label>
                <select
                  id={field}
                  className="bg-gray-100 rounded-md px-4 py-2 flex-1 w-96"
                 
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                >
                  <option value="Call Center">Call Center</option>
                  <option value="Development">Development</option>
                  
                </select>
                
              </div>
            );
          }

          return (
            <div key={field} className="flex items-center my-10">
              <label
                htmlFor={field}
                className="block w-24 font-medium text-gray-700"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                id={field}
                type={field === "password" ? "password" : "text"}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                disabled={!isEditable[field]}
                className={`bg-gray-100 rounded-md px-4 py-2 flex-1 ${
                  isEditable[field] ? "bg-white border border-gray-300" : ""
                }`}
              />
              <button
                onClick={() => toggleEdit(field)}
                className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
      <button className="border p-2 rounded mt-10 hover:bg-green-100">Save all changes</button>
    </div>
  );
};

export default AdminProfile;
