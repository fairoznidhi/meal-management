"use client"
import React, { useState } from "react";
import PrintLunchModal from "@/features/dashboard/printHTML";

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Button to trigger modal */}
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Print Today's Lunch
      </button>

      {/* Render PrintLunchModal and pass necessary props */}
      <PrintLunchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ParentComponent;
