'use client'


import React, { useState } from "react";
import { useGuests } from "@/services/EmployeeList/queries"; 
import { useToggleEmployeeStatus } from "@/services/mutations"; 
import GuestRow from "@/features/guestList/guestRow"; 

const GuestsTablePage = () => {
  
  const { data, isLoading, isError } = useGuests();
  
  if (isLoading) return <div><span className="loading loading-dots loading-lg"></span></div>;
  if (isError) return <div>Something went wrong while fetching guests.</div>;
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Guest List</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-center">Name</th>
            <th className="border px-4 py-2 text-center">Active Status</th>
          </tr>
        </thead>
        <tbody>
            {data && data.length > 0 ? (
             data.map((guest) => (
             <GuestRow key={guest.employee_id} guest={guest} />
            ))
         ) : (
         <tr>
         <td colSpan={2} className="border px-4 py-4 text-center text-gray-500">
             Guest list is empty.
         </td>
         </tr>
          )}
         </tbody>

      </table>
    </div>
  );
};

export default GuestsTablePage;

  