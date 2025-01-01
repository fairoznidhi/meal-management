"use client";

import React from "react";

type ModalProps = {
  isOpen: boolean; // Controls visibility of the modal
  onClose: () => void; // Function to close the modal
  title: string; // Modal title
  children: React.ReactNode; // Content of the modal
  footer?: React.ReactNode; // Optional footer content
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mb-6">{children}</div>
        {footer && <div className="flex justify-end mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;