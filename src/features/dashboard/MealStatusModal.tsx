import React, { useState } from "react";

interface MealStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (mealStatus: boolean, penalty: boolean) => void;
  initialStatus: boolean |null;
  initialPenalty: boolean;
}

const MealStatusModal: React.FC<MealStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  initialStatus,
  initialPenalty,
}) => {
  const [mealStatus, setMealStatus] = useState<boolean | null>(initialStatus);
  const [penalty, setPenalty] = useState<boolean>(initialPenalty);

  const handleSave = () => {
    onUpdateStatus(mealStatus || false, penalty);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-md w-1/3">
          <h2 className="text-xl font-bold mb-4">Update Meal Status</h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Meal Status</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="mealStatus"
                  checked={mealStatus === true}
                  onChange={() => setMealStatus(true)}
                />
                Meal On
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="mealStatus"
                  checked={mealStatus === false}
                  onChange={() => setMealStatus(false)}
                />
                Meal Off
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 me-2">Penalty</label>
            <label>
              <input
                type="checkbox"
                checked={penalty}
                onChange={() => setPenalty(!penalty)}
              />
              Add Penalty
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black p-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MealStatusModal;
