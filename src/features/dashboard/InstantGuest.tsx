"use client";
import { useExtraMeal } from "@/services/queries";
import React, { useEffect, useState } from "react";
import { FaTimes, FaCheck, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
import { usePatchExtraMeal } from "@/services/mutations";
import notificationToast from "@/components/notificationToast";

{
  /*const InstantGuest = () => {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const { data: extraMeal } = useExtraMeal(todayDate);
  const { mutate } = usePatchExtraMeal(todayDate);

  const [count, setCount] = useState(0);
  const [tempCount, setTempCount] = useState(0); // Store temp count for cancel
  const [instantGuestEditable, setInstantGuestEditable] = useState(false);

  useEffect(() => {
    if (extraMeal) {
      setCount(extraMeal?.count ?? 0);
    }
  }, [extraMeal]);

  const handleInstantGuestEdit = () => {
    setTempCount(count);
    setInstantGuestEditable(true);
  };

  const handleInstantGuestCancel = () => {
    setCount(tempCount);
    setInstantGuestEditable(false);
  };

  const handleInstantGuestUpdate = () => {
    mutate(count,{
      onSuccess:()=>{
        notificationToast("Guest updated","success")
      },
      onError:()=>{
        notificationToast("Failed to update guest","error")
      }
    });
    setInstantGuestEditable(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Instant Guest</h3>
      <div>
        {!instantGuestEditable ? (
          <div className="flex justify-between items-center">
            <div></div>
            <div className="text-xl">{count}</div>
            <button
              className="text-violet-600 hover:text-violet-700 text-[20px]"
              onClick={handleInstantGuestEdit}
            >
              <FaEdit />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 justify-between">
            <div></div>
            <div>
              <button
                onClick={() => setCount((prev) => Math.max(0, prev - 1))}
                className="px-2 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-xl px-2">{count}</span>
              <button
                onClick={() => setCount((prev) => prev + 1)}
                className="px-2 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
              >
                +
              </button>
            </div>
            <div className="flex justify-end items-center">
              <button
                className="text-red-500 mr-1 text-[20px]"
                onClick={handleInstantGuestCancel}
              >
                <FaTimes />
              </button>
              <button
                className="text-green-500 text-[20px]"
                onClick={handleInstantGuestUpdate}
              >
                <FaCheck />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantGuest;
*/
}

const InstantGuest = ({
  onUpdateSuccess,
}: {
  onUpdateSuccess?: () => void;
}) => {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const { data: extraMeal } = useExtraMeal(todayDate);
  const { mutate } = usePatchExtraMeal(todayDate);

  const [count, setCount] = useState(0);
  const [tempCount, setTempCount] = useState(0);
  const [instantGuestEditable, setInstantGuestEditable] = useState(false);

  useEffect(() => {
    if (extraMeal) {
      setCount(extraMeal?.count ?? 0);
    }
  }, [extraMeal]);

  const handleInstantGuestEdit = () => {
    setTempCount(count);
    setInstantGuestEditable(true);
  };

  const handleInstantGuestCancel = () => {
    setCount(tempCount);
    setInstantGuestEditable(false);
  };

  const handleInstantGuestUpdate = () => {
    mutate(count, {
      onSuccess: () => {
        notificationToast("Guest updated", "success");
        if (onUpdateSuccess) {
          onUpdateSuccess(); // Call the parent's function
        }
      },
      onError: () => {
        notificationToast("Failed to update guest", "error");
      },
    });
    setInstantGuestEditable(false);
  };

  return (
    <div>
      <div className="">
        {!instantGuestEditable ? (
          <div className="relative h-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-9">{`Today's Guest`}</h3>
              <div className="text-2xl font-bold mt-2">{count}</div>
            </div>
            <button
              className="absolute bottom-0 right-0 text-violet-600 hover:text-violet-700 text-[20px] p-2"
              onClick={handleInstantGuestEdit}
            >
              <FaEdit />
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">{`Today's Guest`}</h3>
            <div className="flex items-center space-x-2 justify-between">
              <div></div>
              <div>
                <button
                  onClick={() => setCount((prev) => Math.max(0, prev - 1))}
                  className="px-2 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-2xl font-bold px-2">{count}</span>
                <button
                  onClick={() => setCount((prev) => prev + 1)}
                  className="px-2 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <div className="flex justify-end items-center">
                <button
                  className="text-red-500 mr-1 text-[20px]"
                  onClick={handleInstantGuestCancel}
                >
                  <FaTimes />
                </button>
                <button
                  className="text-green-500 text-[20px]"
                  onClick={handleInstantGuestUpdate}
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantGuest;
