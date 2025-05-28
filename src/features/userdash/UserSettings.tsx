"use client";
import notificationToast from "@/components/notificationToast";
import { MealStatusContext } from "@/features/userdash/UserMealTable";
import { useToggleDefaultMealStatus } from "@/services/mutations";
import { useTokenSingleEmployee } from "@/services/queries";
import { addDays, format } from "date-fns";
import { useContext, useEffect, useState } from "react";

const UserSettings = () => {
  const {
    mealStatusToggleLunch,
    setMealStatusToggleLunch,
    mealStatusToggleSnacks,
    setMealStatusToggleSnacks,
    update,
    setUpdate,
  } = useContext(MealStatusContext);
  const { data: profileList } = useTokenSingleEmployee();
  const date = new Date();
  const currentHour = date.getHours();
  const selectedDate = currentHour >= 10 ? addDays(date, 1) : date;
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  useEffect(() => {
    if (profileList) {
      const profile = profileList[0];
      setMealStatusToggleLunch(profile?.default_status_lunch ?? false);
      setMealStatusToggleSnacks(profile?.default_status_snacks ?? false);
    }
  }, [profileList]);
  const { mutate, isPending } = useToggleDefaultMealStatus();
  const handleMealStatusLunch = () => {
    mutate(
      { date: formattedDate, meal_type: 1, status: !mealStatusToggleLunch },
      {
        onSuccess: () => {
          setMealStatusToggleLunch(!mealStatusToggleLunch);
          setUpdate(!update);
          notificationToast(
            "Default status Lunch updated successfully!",
            "success"
          );
        },
        onError: (error) => {
          console.error("Error updating default status Lunch:", error);
          notificationToast("Failed to update default status Lunch!", "error");
        },
      }
    );
  };
  const handleMealStatusSnacks = () => {
    mutate(
      { date: formattedDate, meal_type: 2, status: !mealStatusToggleSnacks },
      {
        onSuccess: () => {
          setMealStatusToggleSnacks(!mealStatusToggleSnacks);
          setUpdate(!update);
          notificationToast(
            "Default status Snacks updated successfully!",
            "success"
          );
        },
        onError: (error) => {
          console.error("Error updating default status Lunch:", error);
          notificationToast("Failed to update default status Lunch!", "error");
        },
      }
    );
  };
  return (
    <div className="card bg-base-50 shadow rounded-box grid flex-grow place-items-center p-4 px-6 mr-2">
  <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
    Default Meal Status
  </h2>

  <div className="flex items-center justify-between divide-x divide-gray-300">
    {/* Lunch */}
    <div className="flex items-center justify-between w-1/2 pr-4">
      <span className="text-gray-700 font-medium">Lunch</span>
      <input
        type="checkbox"
        className={`toggle border-white bg-white hover:bg-white ${
          mealStatusToggleLunch ? "[--tglbg:#00aa68]" : "[--tglbg:#d73545]"
        }`}
        checked={mealStatusToggleLunch}
        onChange={handleMealStatusLunch}
      />
    </div>

    {/* Snacks */}
    <div className="flex items-center justify-between w-1/2 pl-4">
      <span className="text-gray-700 font-medium pr-2">Snacks</span>
      <input
        type="checkbox"
        className={`toggle border-white bg-white hover:bg-white ${
          mealStatusToggleSnacks ? "[--tglbg:#00aa68]" : "[--tglbg:#d73545]"
        }`}
        checked={mealStatusToggleSnacks}
        onChange={handleMealStatusSnacks}
      />
    </div>
  </div>
</div>
  );
};

export default UserSettings;
