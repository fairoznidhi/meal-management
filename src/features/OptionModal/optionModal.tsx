import React from "react";

const OptionModal = ({
  isOpen,
  onClose,
  onChangeStatus,
  onAddPenalty,
}: {
  isOpen: boolean;
  onClose: () => void;
  onChangeStatus: () => void;
  onAddPenalty: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md shadow-lg w-64">
        <h2 className="text-lg font-bold mb-4">Options</h2>
        <button
          onClick={onChangeStatus}
          className="block w-full text-left p-2 rounded-md bg-gray-200 mb-4"
        >
          Change Status
        </button>
        <button
          onClick={onAddPenalty}
          className="block w-full text-left p-2 rounded-md bg-gray-200"
        >
          Add Penalty
        </button>
        <button
          onClick={onClose}
          className="block w-full text-left p-2 rounded-md mt-4 bg-gray-300 text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OptionModal;
