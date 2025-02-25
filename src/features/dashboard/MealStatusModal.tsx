{
  /*import React, { useState, useEffect } from "react";

interface MealStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (mealStatus: boolean, penalty: boolean) => void;
  initialStatus: boolean;
  initialPenalty: boolean;
  selectedDate: string; // Add selected date as a prop
  mealType: number;
}

const MealStatusModal: React.FC<MealStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  initialStatus,
  initialPenalty,
  selectedDate,
  mealType,
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


    // Convert mealType number to corresponding meal name
    const mealTypeName = mealType === 1 ? "Lunch" : mealType === 2 ? "Snacks" : "Meal";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Update {mealTypeName} Status</h2>

        {/* Meal Status Section 
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
              {mealTypeName} On
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === false} // "Meal Off" is checked if mealStatus is false
                onChange={() => setMealStatus(false)} // Set mealStatus to false for "Meal Off"
              />
              {mealTypeName} Off
            </label>
          </div>
        </div>

        {/* Penalty Section 
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Penalty</label>
          <label className="flex gap-x-2">
            <input
              type="checkbox"
              checked={penalty} // Checkbox is checked if penalty is true
              onChange={() => setPenalty(!penalty)} // Toggle penalty state on checkbox change
              disabled={!isPenaltyAllowed} // Disable penalty checkbox if not allowed
            />
            <p className="">Add Penalty</p>
          </label>
          {!isPenaltyAllowed && (
            <p className="text-red-500 text-xs mt-2">
              Penalty cannot be added for future dates.
            </p>
          )}
        </div>

        {/* Action Buttons 
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




import React, { useState, useEffect } from "react";

interface MealStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    mealStatus: boolean,
    penalty: boolean,
    penaltyValue: number
  ) => void;
  initialStatus: boolean;
  initialPenalty: boolean;
  selectedDate: string;
  mealType: number;
}

const MealStatusModal: React.FC<MealStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  initialStatus,
  initialPenalty,
  selectedDate,
  mealType,
}) => {
  const [mealStatus, setMealStatus] = useState<boolean>(initialStatus);
  const [penalty, setPenalty] = useState<boolean>(initialPenalty);
  const [penaltyValue, setPenaltyValue] = useState<number>(0); // New state for penalty value
  const [isPenaltyAllowed, setIsPenaltyAllowed] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setMealStatus(initialStatus);
      setPenalty(initialPenalty);
      setPenaltyValue(0); // Reset slider when modal opens
      checkPenaltyEligibility(selectedDate);
    }
  }, [isOpen, initialStatus, initialPenalty, selectedDate]);

  const checkPenaltyEligibility = (date: string) => {
    const today = new Date();
    const selectedDateObj = new Date(date);

    setIsPenaltyAllowed(selectedDateObj <= today);
  };

  const handleSave = () => {
    if (!isPenaltyAllowed && penalty) {
      alert("You cannot add a penalty to a future date.");
      return;
    }

    onUpdateStatus(mealStatus, penalty, penalty ? penaltyValue : 0);
    onClose();
  };

  if (!isOpen) return null;

  const mealTypeName =
    mealType === 1 ? "Lunch" : mealType === 2 ? "Snacks" : "Meal";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Update {mealTypeName} Status</h2>

        {/* Meal Status Section 
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Meal Status
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === true}
                onChange={() => setMealStatus(true)}
              />
              {mealTypeName} On
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === false}
                onChange={() => setMealStatus(false)}
              />
              {mealTypeName} Off
            </label>
          </div>
        </div>

        {/* Penalty Section 
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Penalty</label>
          <label className="flex gap-x-2">
            <input
              type="checkbox"
              checked={penalty}
              onChange={() => setPenalty(!penalty)}
              disabled={!isPenaltyAllowed}
            />
            <p>Add Penalty</p>
          </label>
          {!isPenaltyAllowed && (
            <p className="text-red-500 text-xs mt-2">
              Penalty cannot be added for future dates.
            </p>
          )}
          

        
        </div>

        {/* Action Buttons 
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
*/}



import React, { useState, useEffect } from "react";

interface MealStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    mealStatus: boolean,
    penalty: boolean,
    penaltyScore: number
  ) => void;
  initialStatus: boolean;
  initialPenalty: boolean;
  initialPenaltyScore: number; // Add initial penalty score as prop
  selectedDate: string;
  mealType: number;
}

const MealStatusModal: React.FC<MealStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  initialStatus,
  initialPenalty,
  initialPenaltyScore, // Access initial penalty score
  selectedDate,
  mealType,
}) => {
  const [mealStatus, setMealStatus] = useState<boolean>(initialStatus);
  const [penalty, setPenalty] = useState<boolean>(initialPenalty);
  const [penaltyScore, setPenaltyScore] = useState<number>(1); // Default to 1
  const [isPenaltyAllowed, setIsPenaltyAllowed] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setMealStatus(initialStatus);
      setPenalty(initialPenalty);

      // Set the initial penaltyScore based on the initialPenalty and initialPenaltyScore value
      if (initialPenalty) {
        setPenaltyScore(initialPenaltyScore); // Set to the existing penalty score
      } else {
        setPenaltyScore(1); // Default to 1 if no penalty exists
      }

      checkPenaltyEligibility(selectedDate);
    }
  }, [isOpen, initialStatus, initialPenalty, initialPenaltyScore, selectedDate]);

  const checkPenaltyEligibility = (date: string) => {
    const today = new Date();
    const selectedDateObj = new Date(date);

    setIsPenaltyAllowed(selectedDateObj <= today); // Disable penalty for future dates
  };

  const handleSave = () => {
    if (!isPenaltyAllowed && penalty) {
      alert("You cannot add a penalty to a future date.");
      return;
    }

    // Calculate the final penalty score if penalty is applied
    const finalPenaltyScore = penalty ? penaltyScore : 0;

    // Pass the values to the parent component
    onUpdateStatus(mealStatus, penalty, finalPenaltyScore);
    onClose();
  };

  if (!isOpen) return null;

  const mealTypeName =
    mealType === 1 ? "Lunch" : mealType === 2 ? "Snacks" : "Meal";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Update {mealTypeName} Status</h2>

        {/* Meal Status Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Meal Status
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === true}
                onChange={() => setMealStatus(true)}
              />
              {mealTypeName} On
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="mealStatus"
                checked={mealStatus === false}
                onChange={() => setMealStatus(false)}
              />
              {mealTypeName} Off
            </label>
          </div>
        </div>

        {/* Penalty Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Penalty</label>
          <label className="flex gap-x-2">
            <input
              type="checkbox"
              checked={penalty}
              onChange={() => setPenalty(!penalty)}
              disabled={!isPenaltyAllowed}
            />
            <p>Add Penalty</p>
          </label>
          {!isPenaltyAllowed && (
            <p className="text-red-500 text-xs mt-2">
              Penalty cannot be added for future dates.
            </p>
          )}

          {/* Show Slider only if penalty is selected */}
          {penalty && isPenaltyAllowed && (
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Penalty Value
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={penaltyScore}
                  onChange={(e) => setPenaltyScore(Number(e.target.value))}
                  className="w-full"
                />
                {/* Indicators */}
                <div className="absolute top-8 left-0 right-0 flex justify-between text-sm">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
              <p className="text-sm text-center mt-10">Penalty: {penaltyScore}</p>
            </div>
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
