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
  lunchFlag,
}: {
  onUpdateSuccess?: () => void;
  lunchFlag: boolean;
}) => {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const { data: extraMeal,refetch:extraMealRefetch } = useExtraMeal(todayDate);
  
  const [lunchCount, setLunchCount] = useState(0);
  const [snackCount, setSnackCount] = useState(0);
  const { mutate } = usePatchExtraMeal(todayDate);
  const [tempLunchCount, setTempLunchCount] = useState(0);
  const [tempSnackCount, setTempSnackCount] = useState(0);
  const [instantGuestEditable, setInstantGuestEditable] = useState(false);

  useEffect(() => {
    if (extraMeal && !instantGuestEditable) {
      setLunchCount(extraMeal?.lunch_count ?? 0);
      setSnackCount(extraMeal?.snack_count ?? 0);
    }
  }, [extraMeal]);

  const handleInstantGuestEdit = () => {
      setTempLunchCount(lunchCount);
      setTempSnackCount(snackCount);
    setInstantGuestEditable(true);
  };

  const handleInstantGuestCancel = () => {
      setLunchCount(tempLunchCount);
      setSnackCount(tempSnackCount);
    setInstantGuestEditable(false);
  };

  const handleInstantGuestUpdate = () => {
    console.log("Lunch Count",lunchCount,"Snacks Count",snackCount)
    const payload = { lunch_count: lunchCount, snack_count: snackCount };
    mutate(payload, {
      onSuccess: () => {
        if(lunchCount)
          notificationToast("Guest(Lunch) updated", "success");
        else
          notificationToast("Guest(Snacks) updated", "success");
          if (onUpdateSuccess) {
          onUpdateSuccess(); // Call the parent's function
        }
        extraMealRefetch()
      },
      onError: () => {
        notificationToast("Failed to update guest", "error");
      },
    });
    setInstantGuestEditable(false);
    setTempLunchCount(lunchCount);
    setTempSnackCount(snackCount);
};

  return (
    <div>
      <div className="">
        {!instantGuestEditable ? (
          <div className="relative h-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{`Today's ${
                lunchFlag ? "Lunch" : "Snacks"
              } Guest`}</h3>
              <div className="text-2xl font-bold mt-2">{lunchFlag?lunchCount:snackCount}</div>
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
            <h3 className="text-lg font-semibold">{`Today's ${
              lunchFlag ? "Lunch" : "Snacks"
            } Guest`}</h3>
            <div className="flex items-center space-x-2 justify-between">
              <div></div>
              <div>
                <button
                  onClick={() => {
                    lunchFlag?
                    setLunchCount((prev) => Math.max(0, prev - 1)):
                    setSnackCount((prev) => Math.max(0, prev - 1))

                  }}
                  className="px-1 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-2xl font-bold px-2">{lunchFlag?lunchCount:snackCount}</span>
                <button
                  onClick={() => {
                    lunchFlag?
                    setLunchCount((prev) => Math.max(0, prev + 1)):
                    setSnackCount((prev) => Math.max(0, prev + 1))

                  }}
                  className="px-1 py-1 text-violet-500 bg-violet-100 rounded hover:bg-gray-200"
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
