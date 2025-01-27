
import React, { useState, useEffect } from "react";

interface MealStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (mealStatus: boolean, penalty: boolean) => void;
  initialStatus: boolean;
  initialPenalty: boolean;
  selectedDate: string; // Add selected date as a prop
}

const MealStatusModal: React.FC<MealStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  initialStatus,
  initialPenalty,
  selectedDate,
}) => {
  const [mealStatus, setMealStatus] = useState<boolean>(initialStatus);
  const [penalty, setPenalty] = useState<boolean>(initialPenalty);
  const [isPenaltyAllowed, setIsPenaltyAllowed] = useState<boolean>(true);

  // Sync state with initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setMealStatus(initialStatus); // Reset to initial status
      setPenalty(initialPenalty); // Reset to initial penalty
      checkPenaltyEligibility(selectedDate); // Check if penalty is allowed for the selected date
    }
  }, [isOpen, initialStatus, initialPenalty, selectedDate]);

  // Function to check if the penalty can be applied based on the selected date
  const checkPenaltyEligibility = (date: string) => {
    const today = new Date();
    console.log(today);
    const selectedDateObj = new Date(date);
    console.log(selectedDateObj);
    // Compare if selected date is in the future
    if (selectedDateObj > today) {
      setIsPenaltyAllowed(false);
    } else {
      setIsPenaltyAllowed(true);
    }
  };


  const handleSave = () => {
    // If penalty is not allowed, show alert
    if (!isPenaltyAllowed && penalty) {
      alert("You cannot add a penalty to a future date.");
      return;
    }

    // Pass the mealStatus and penalty values to the parent on save
    onUpdateStatus(mealStatus, penalty);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Update Meal Status</h2>

        {/* Meal Status Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Meal Status</label>
          <div>
            <label>
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === true} // "Meal On" is checked if mealStatus is true
                onChange={() => setMealStatus(true)} // Set mealStatus to true for "Meal On"
              />
              Meal On
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === false} // "Meal Off" is checked if mealStatus is false
                onChange={() => setMealStatus(false)} // Set mealStatus to false for "Meal Off"
              />
              Meal Off
            </label>
          </div>
        </div>

        {/* Penalty Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Penalty</label>
          <label>
            <input
              type="checkbox"
              checked={penalty} // Checkbox is checked if penalty is true
              onChange={() => setPenalty(!penalty)} // Toggle penalty state on checkbox change
              disabled={!isPenaltyAllowed} // Disable penalty checkbox if not allowed
            />
            Add Penalty
          </label>
          {!isPenaltyAllowed && (
            <p className="text-red-500 text-xs mt-2">
              Penalty cannot be added for future dates.
            </p>
          )}
        </div>

        {/* Action Buttons */}
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
  );
};

export default MealStatusModal;


