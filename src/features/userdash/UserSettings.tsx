"use client";
import { MealStatusContext } from "@/features/userdash/UserMealTable";
import { useToggleDefaultMealStatus } from "@/services/mutations";
import { useTokenSingleEmployee } from "@/services/queries";
import { addDays, format } from "date-fns";
import { useContext, useEffect, useState } from "react";

const UserSettings = () => {
  const { mealStatusToggle, setMealStatusToggle, update, setUpdate } =
    useContext(MealStatusContext);
  const { data: profileList } = useTokenSingleEmployee();
  const date = new Date();
  const currentHour = date.getHours();
  const selectedDate = currentHour >= 10 ? addDays(date, 1) : date;
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  console.log(formattedDate);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (profileList) {
      const profile = profileList[0];
      setMealStatusToggle(profile.default_status ?? false);
    }
  }, [profileList]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const handleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };
  const {mutate,isPending} = useToggleDefaultMealStatus(formattedDate);
  const handleMealStatus = () => {
    mutate(undefined, {
      onSuccess: () => {
        setMealStatusToggle(!mealStatusToggle);
        setUpdate(!update);
        setAlertMessage("Default Status Updated successfully!");
        setProgress(100);
        const interval = setInterval(() => {
          setProgress((prev) => Math.max(prev - 5, 0));
        }, 150);
        setTimeout(() => {
          setAlertMessage(null);
          clearInterval(interval);
        }, 3000);
      },
    });
  };
  return (
    <div className="flex items-center">
      <label className="mr-2 font-semibold">Default Status</label>
      <input
        type="checkbox"
        className={`toggle border-white bg-white hover:bg-white ${
          mealStatusToggle ? " [--tglbg:#00aa68] " : "[--tglbg:#d73545]"
        }`}
        checked={mealStatusToggle}
        onChange={handleMealStatus}
      />
      {/* Alert Notification */}
      {alertMessage && (
        <div className="fixed top-20 right-5 bg-gray-500 text-white px-4 pt-2 rounded-md shadow-md min-w-64">
          <p>{alertMessage}</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1 mt-4">
            <div
              className="bg-white h-1 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
    // <div className="flex">
    //   <details className="dropdown dropdown-end">
    //     <summary
    //       role="button"
    //       className="flex items-center gap-x-1"
    //       onClick={handleSettings}
    //     >
    //       <div
    //         className={`text-3xl ${
    //           settingsOpen ? "text-red-600 rotate-90" : "text-primary rotate-45"
    //         } transition-all duration-300`}
    //       >
    //         {settingsOpen ? <RxCross2 /> : <IoMdSettings />}
    //       </div>
    //     </summary>
    //     <div className="dropdown-content bg-neutral-50 menu rounded-box z-[1] w-52 p-4 mr-2 shadow">
    //   <div className="flex items-center">
    //   <label className="mr-2 font-semibold">Default Status</label>
    //   <input
    //     type="checkbox"
    //     className={`toggle border-white bg-white hover:bg-white ${mealStatusToggle?' [--tglbg:#00aa68] ':'[--tglbg:#d73545]'}`}
    //     checked={mealStatusToggle}
    //     onChange={handleMealStatus}
    //   />
    // </div>
    //     </div>
    //   </details>
    // </div>
  );
};

export default UserSettings;
