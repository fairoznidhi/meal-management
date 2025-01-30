"use client";

import React, { createContext, useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table";
import { startOfWeek, endOfWeek, addDays, format, setWeek } from "date-fns";
import UserSettings from "@/features/userdash/UserSettings";
import UserStats from "@/features/userdash/UserStats";
import { BsPlus } from "react-icons/bs";
import { BsMinus } from "react-icons/bs";
import {
  useRangeMealPlan,
  useSingleEmployeeMealActivity,
} from "@/services/queries";
import {
  EmployeeEachDayMealDetails,
  EmployeeMealDetails,
} from "@/model/userMealActivity";
import { MenuDetails } from "@/model/rangeMealPlan";
import { getSession } from "next-auth/react";
import { usePatchGroupMealUpdate } from "@/services/mutations";
import { FaCaretSquareLeft } from "react-icons/fa";
import { FaCaretSquareRight } from "react-icons/fa";


type MealStatusContextType = {
  lunchStatus: boolean;
  setLunchStatus: React.Dispatch<React.SetStateAction<boolean>>;
  snacksStatus: boolean;
  setSnacksStatus: React.Dispatch<React.SetStateAction<boolean>>;
  mealStatusToggle: boolean;
  setMealStatusToggle: React.Dispatch<React.SetStateAction<boolean>>;
  update: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: MealStatusContextType = {
  lunchStatus: false,
  setLunchStatus: () => {},
  snacksStatus: false,
  setSnacksStatus: () => {},
  mealStatusToggle: false,
  setMealStatusToggle: () => {},
  update: false,
  setUpdate: () => {},
};

export const MealStatusContext =
  createContext<MealStatusContextType>(defaultValue);

const MealPlanTable = () => {
  const [lunchStatus, setLunchStatus] = useState(false);
  const [snacksStatus, setSnacksStatus] = useState(false);
  const [mealStatusToggle, setMealStatusToggle] = useState(false);
  const [update, setUpdate] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const today = format(new Date(), "yyyy-MM-dd");
  const [editTable, setEditTable] = useState(false);
  const isRowEditable = (rowDate: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const isBefore10AM =
      currentHour < 10 || (currentHour === 10 && currentMinutes === 0);
    if (!isBefore10AM) {
      return (
        rowDate >= format(addDays(new Date(), 1), "yyyy-MM-dd") && editTable
      );
    }
    return rowDate >= today && editTable;
  };
  const [session, setSession] = useState<Session | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(100);
  const { mutate } = usePatchGroupMealUpdate();
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
      }
    };
    checkSession();
  }, []);
  const columns: Column[] = [
    { key: "date", label: "Date" ,
      render:(value)=>{
        return <span>{format(new Date(value), "dd-MMM")}</span>;
      }
    },
    { key: "lunch", label: "Lunch" },
    {
      key: "lunchStatus",
      label: "Lunch Status",
      render: (value, row, rowIndex) => {
        const isEditable = isRowEditable(row.date);
        return (
          <div>
          <input
            type="checkbox"
            className={`toggle border-white bg-white hover:bg-white ${
              value === 1
                ? `${isEditable ? "[--tglbg:#00aa68]" : "[--tglbg:#66cc99]"}`
                : `${isEditable ? "[--tglbg:#d73545]" : "[--tglbg:#f06d7a]"}`
            } ${isEditable?'':'cursor-not-allowed'}`}
            checked={value === 1}
            onChange={() => {
              if (isEditable) {
                toggleRowStatus(rowIndex, row, "lunchStatus");
              }
            }}
          />
          </div>
        );
      },
    },
    {
      key: "lunchGuest",
      label: "Lunch Guest",
      render: (value, row, rowIndex) => {
        const isEditable = isRowEditable(row.date);
        return (
          <div className="flex items-center justify-center space-x-2">
            {isEditable && (
              <button
                onClick={() => {
                  const newValue = Math.max(0, parseInt(value, 10) - 1); // Decrease guest count, but not below 0
                  toggleRowStatus(rowIndex, row, "lunchGuest", newValue); // Pass the new value
                }}
                className="px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                -
              </button>
            )}
            <span>{value}</span>
            {isEditable && (
              <button
                onClick={() => {
                  const newValue = parseInt(value, 10) + 1;
                  toggleRowStatus(rowIndex, row, "lunchGuest", newValue);
                }}
                className="px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                +
              </button>
            )}
          </div>
        );
      },
    },
    { key: "snacks", label: "Snacks" },
    {
      key: "snacksStatus",
      label: "Snacks Status",
      render: (value, row, rowIndex) => {
        const isEditable = isRowEditable(row.date);
        return (
          <input
            type="checkbox"
            className={`toggle border-white bg-white hover:bg-white ${
              value === 1
                ? `${isEditable ? "[--tglbg:#00aa68]" : "[--tglbg:#66cc99]"}`
                : `${isEditable ? "[--tglbg:#d73545]" : "[--tglbg:#f06d7a]"}`
            } ${isEditable?'':'cursor-not-allowed'}`}
            checked={value === 1}
            onChange={() => {
              if (isEditable) {
                toggleRowStatus(rowIndex, row, "snacksStatus");
              }
            }}
          />
        );
      },
    },
    {
      key: "snacksGuest",
      label: "Snacks Guest",
      render: (value, row, rowIndex) => {
        const isEditable = isRowEditable(row.date);
        return (
          <div className="flex items-center justify-center space-x-2">
            {isEditable && (
              <button
                onClick={() => {
                  const newValue = Math.max(0, parseInt(value, 10) - 1);
                  toggleRowStatus(rowIndex, row, "snacksGuest", newValue);
                }}
                className="px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                -
              </button>
            )}
            <span>{value}</span>
            {isEditable && (
              <button
                onClick={() => {
                  const newValue = parseInt(value, 10) + 1; // Increase guest count
                  toggleRowStatus(rowIndex, row, "snacksGuest", newValue); // Pass the new value
                }}
                className="px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                +
              </button>
            )}
          </div>
        );
      },
    },
  ];
  const { data: mealActivityData, refetch: mealActivityRefetch } =
    useSingleEmployeeMealActivity(currentDate, "7");
  const { data: mealPlan } = useRangeMealPlan(currentDate, "7");
  const { data: nextWeekMealActivityData } = useSingleEmployeeMealActivity(
    format(addDays(currentDate, 7), "yyyy-MM-dd"),
    "7"
  );
  const [nextWeekDataAvailable, setNextWeekDataAvailable] = useState(false);
  useEffect(() => {
    if (nextWeekMealActivityData && nextWeekMealActivityData.length > 0) {
      setNextWeekDataAvailable(true);
    } else {
      setNextWeekDataAvailable(false);
    }
  }, [nextWeekMealActivityData]);
  const { data: prevWeekMealActivityData } = useSingleEmployeeMealActivity(
    format(addDays(currentDate, -7), "yyyy-MM-dd"),
    "7"
  );
  const [prevWeekDataAvailable, setPrevWeekDataAvailable] = useState(false);
  useEffect(() => {
    if (prevWeekMealActivityData && prevWeekMealActivityData.length > 0) {
      setPrevWeekDataAvailable(true);
    } else {
      setPrevWeekDataAvailable(false);
    }
  }, [prevWeekMealActivityData]);
  const getWeekData = () => {
    const weekData: Row[] = [];
    if (mealActivityData) {
      console.log("mealactivitydata: ", mealActivityData[0]);
      console.log("mealPlan: ", mealPlan);

      mealActivityData[0]?.employee_details.forEach(
        (employee: EmployeeEachDayMealDetails) => {
          const currentDayMenu = mealPlan
            ? mealPlan.find(
                (menu: RangeMenuDetails) => menu.date === employee.date
              )
            : null;

          weekData.push({
            date: employee.date || "No date",
            lunch: currentDayMenu
              ? currentDayMenu.menu?.find(
                  (m: MenuDetails) => m.meal_type === "lunch"
                )?.food || "Meal Plan Missing"
              : "Meal Plan Missing",
            lunchStatus: employee.meal?.[0]?.meal_status?.[0]?.status ? 1 : 0,
            lunchGuest: employee.meal?.[0]?.meal_status?.[0]?.guest_count,
            snacks: currentDayMenu
              ? currentDayMenu.menu?.find(
                  (m: MenuDetails) => m.meal_type === "snacks"
                )?.food || "Meal Plan Missing"
              : "Meal Plan Missing",
            snacksStatus: employee.meal?.[1]?.meal_status?.[0]?.status ? 1 : 0,
            snacksGuest: employee.meal?.[1]?.meal_status?.[0]?.guest_count,
          });
        }
      );
    }

    console.log("weekData: ", weekData);
    return weekData;
  };

  const [data, setData] = useState<Row[]>();
  useEffect(() => {
    const weekData = getWeekData();
    setData(weekData);
  }, [currentDate, mealActivityData]);
  useEffect(() => {
    mealActivityRefetch();
  }, [mealStatusToggle]);
  const handlePreviousWeek = () => {
    const newDate = format(addDays(currentDate, -7), "yyyy-MM-dd");
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = format(addDays(currentDate, 7), "yyyy-MM-dd");
    setCurrentDate(newDate);
    // refetch();
  };
  useEffect(() => {
    mealActivityRefetch();
  }, [update]);
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setData(updatedData);
  };
  const handleCancel = () => {
    setEditTable(false);
    setData(getWeekData());
  };
  const handleEditSave = () => {
    setEditTable(false);

    // Transform the data into the desired format
    const formattedData = data.flatMap((row) => {
      const employeeId = session?.user?.employee_id || 10; // Replace with actual employee ID from session or props

      // Create objects for lunch and snacks
      const lunchEntry = {
        date: row.date,
        employee_id: employeeId,
        meal_type: 1, // 1 for lunch
        status: row.lunchStatus === 1, // Convert to boolean
        guest_count: row.lunchGuest || 0, // Default to 0 if undefined
      };

      const snacksEntry = {
        date: row.date,
        employee_id: employeeId,
        meal_type: 2, // 2 for snacks
        status: row.snacksStatus === 1, // Convert to boolean
        guest_count: row.snacksGuest || 0, // Default to 0 if undefined
      };

      return [lunchEntry, snacksEntry];
    });
    console.log("Formatted Data:", formattedData);
    mutate(formattedData, {
      onSuccess: () => {
        setUpdate(!update);
        setAlertMessage("Meal updated successfully!");
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
  const toggleRowStatus = (
    rowIndex: number,
    row: any,
    key: string,
    newValue?: any
  ) => {
    const updatedData = [...data];
    if (newValue !== undefined) {
      updatedData[rowIndex][key] = newValue;
    } else {
      updatedData[rowIndex][key] = updatedData[rowIndex][key] === 1 ? 0 : 1;
    }
    setData(updatedData);
  };
  return (
    <div className="m-4">
      <MealStatusContext.Provider
        value={{
          mealStatusToggle,
          setMealStatusToggle,
          lunchStatus,
          setLunchStatus,
          snacksStatus,
          setSnacksStatus,
          update,
          setUpdate,
        }}
      >
        <div className="flex justify-between mb-8">
          {/* Stats */}
          <UserStats />
          {/* Global Meal Toggle */}
          <UserSettings />
        </div>

        {/* Week Navigation */}
        <div className={`flex items-center min-h-12 mb-4 relative`}>
          <h1 className="pl-2 text-3xl font-extrabold">Meal Entry</h1>
          <div className="flex items-center absolute left-1/2 transform -translate-x-1/2 ">
            <button
              onClick={handlePreviousWeek}
              className={`px-4 text-gray-300 text-4xl rounded hover:text-gray-400 
                ${
                  editTable
                    ? "text-gray-100 cursor-not-allowed hover:text-gray-100"
                    : ""
                }
                ${!prevWeekDataAvailable ? "hover:text-gray-300" : ""}`}
              disabled={editTable || !prevWeekDataAvailable}
            >
              <FaCaretSquareLeft />
            </button>
            <h3 className="text-lg text-center font-bold min-w-40 select-none">
              {format(currentDate, "dd MMM")} -{" "}
              {format(addDays(currentDate, 6), "dd MMM")}
            </h3>
            <button
              onClick={handleNextWeek}
              className={`px-4 text-gray-300 text-4xl rounded hover:text-gray-400 
                ${
                  editTable
                    ? "text-gray-100 cursor-not-allowed hover:text-gray-100"
                    : ""
                }
                ${!nextWeekDataAvailable ? "hover:text-gray-300" : ""}`}
              disabled={editTable || !nextWeekDataAvailable}
            >
              <FaCaretSquareRight />
            </button>
          </div>
          <div className="min-w-64 text-end flex flex-row justify-end ml-auto">
            {!editTable ? (
              <button
                className="px-4 py-2 border bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setEditTable(true);
                }}
              >
                Update Meal
              </button>
            ) : (
              <div className="min-w-64">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={data ?? []}
          // onEditRow={handleEditRow}
          {...(editTable ? { onEditRow: handleEditRow } : {})}
        />
        {/* Alert Notification */}
      {alertMessage && (
        <div className="fixed top-5 right-5 bg-gray-500 text-white px-4 pt-2 rounded-md shadow-md min-w-64">
          <p>{alertMessage}</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1 mt-4">
            <div className="bg-white h-1 transition-all duration-150" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      </MealStatusContext.Provider>
    </div>
  );
};

export default MealPlanTable;
