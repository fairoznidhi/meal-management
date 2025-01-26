"use client";

import React, { createContext, useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table";
import { startOfWeek, endOfWeek, addDays, format, setWeek } from "date-fns";
import UserSettings from "@/components/UserSettings";
import UserStats from "@/components/UserStats";
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

type MealStatusContextType = {
  lunchStatus: boolean;
  setLunchStatus: React.Dispatch<React.SetStateAction<boolean>>;
  snacksStatus: boolean;
  setSnacksStatus: React.Dispatch<React.SetStateAction<boolean>>;
  mealStatusToggle: boolean;
  setMealStatusToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: MealStatusContextType = {
  lunchStatus: false,
  setLunchStatus: () => {},
  snacksStatus: false,
  setSnacksStatus: () => {},
  mealStatusToggle: false,
  setMealStatusToggle: () => {},
};

export const MealStatusContext =
  createContext<MealStatusContextType>(defaultValue);

const MealPlanTable = () => {
  const [lunchStatus, setLunchStatus] = useState(false);
  const [snacksStatus, setSnacksStatus] = useState(false);
  const [mealStatusToggle, setMealStatusToggle] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const today = format(new Date(), "yyyy-MM-dd");
  const [editTable, setEditTable] = useState(false);
  const isRowEditable = (rowDate: string) => {
    return rowDate >= today && editTable;
  };
  const [session, setSession] = useState<Session | null>(null);
  const { mutate} = usePatchGroupMealUpdate();
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
    { key: "date", label: "Date" },
    { key: "lunch", label: "Lunch" },
    {
      key: "lunchStatus",
      label: "Lunch Status",
      render: (value, row, rowIndex) => {
        const isEditable = isRowEditable(row.date);
        return (
          <button
            onClick={() => {
              if (isEditable) {
                toggleRowStatus(rowIndex, row, "lunchStatus");
              }
            }}
            className={`px-4 py-1 rounded ${
              value === 1 ? " text-green-500" : " text-red-500"
            }`}
          >
            {value === 1 ? "On" : "Off"}
          </button>
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
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
          <button
            onClick={() => {
              if (isEditable) {
                toggleRowStatus(rowIndex, row, "snacksStatus");
              }
            }}
            className={`px-4 py-1 rounded ${
              value === 1 ? " text-green-500" : " text-red-500"
            }`}
          >
            {value === 1 ? "On" : "Off"}
          </button>
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
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                )?.food || "Not Set"
              : "Meal Plan Missing",
            lunchStatus: employee.meal?.[0]?.meal_status?.[0]?.status ? 1 : 0,
            lunchGuest: employee.meal?.[0]?.meal_status?.[0]?.guest_count,
            snacks: currentDayMenu
              ? currentDayMenu.menu?.find(
                  (m: MenuDetails) => m.meal_type === "snacks"
                )?.food || "Not Set"
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
    mutate(formattedData);
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
        }}
      >
        <div className="flex justify-between mb-8">
          {/* Stats */}
          <UserStats />
          {/* Global Meal Toggle */}
          <UserSettings />
        </div>

        {/* Week Navigation */}
        <div
          className={`flex items-center mb-6 ${
            editTable ? "justify-center" : "justify-between "
          }`}
        >
          {!editTable && (
            <button
              onClick={handlePreviousWeek}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous Week
            </button>
          )}
          <h3 className="text-lg font-bold">
            {format(currentDate, "MMMM dd, yyyy")} -{" "}
            {format(addDays(currentDate, 7), "MMMM dd, yyyy")}
          </h3>
          {!editTable && (
            <button
              onClick={handleNextWeek}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Week
            </button>
          )}
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={data ?? []}
          // onEditRow={handleEditRow}
          {...(editTable ? { onEditRow: handleEditRow } : {})}
        />
        <div className="flex flex-row justify-end">
          {!editTable ? (
            <button
              className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
              onClick={() => {
                setEditTable(true);
              }}
            >
              Update Meal
            </button>
          ) : (
            <div className="mt-4">
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
      </MealStatusContext.Provider>
    </div>
  );
};

export default MealPlanTable;
