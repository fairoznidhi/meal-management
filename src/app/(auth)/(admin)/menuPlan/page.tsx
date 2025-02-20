"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from "@/components/notificationToast";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";
import Modal from "@/components/modal";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

interface Meal {
  date: string;
  meal_type: string;
  food: string;
}

interface Row {
  date: string;
  lunch: string;
  snacks: string;
}

const MealPlanTable = () => {
  const [startDate, setStartDate] = useState(
    dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs(startDate).add(6, "day").format("YYYY-MM-DD")
  );
  const [mealData, setMealData] = useState<Row[]>([]);
  const [editedData, setEditedData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [showcopyModal, setShowcopyModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const start = dayjs(startDate);
        const end = start.add(6, "day");
        const dateSequence = [];
        for (
          let d = start;
          d.isBefore(end) || d.isSame(end);
          d = d.add(1, "day")
        ) {
          dateSequence.push(d.format("YYYY-MM-DD"));
        }

        const data = (await request({
          url: `/mealplan`,
          method: "GET",
          params: { start: startDate, days: 7 },
          useAuth: true,
        })) as Meal[] | null;

        const mealDataMap: Record<
          string,
          Record<string, string>
        > = data?.reduce((acc: any, meal: any) => {
          acc[meal.date] = meal.menu.reduce((mealAcc: any, item: any) => {
            mealAcc[item.meal_type] = item.food;
            return mealAcc;
          }, {});
          return acc;
        }, {}) || {};

        const formattedData: Row[] = dateSequence.map((date) => ({
          date,
          lunch: mealDataMap[date]?.lunch || "",
          snacks: mealDataMap[date]?.snacks || "",
        }));

        setMealData(formattedData);
        setEditedData(formattedData);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
        notificationToast("Failed to Load Menu", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate]);

  const changeWeek = (direction: "prev" | "next") => {
    setStartDate((prevDate) => {
      const newStartDate = dayjs(prevDate)
        .add(direction === "next" ? 7 : -7, "day")
        .format("YYYY-MM-DD");
      setEndDate(dayjs(newStartDate).add(6, "day").format("YYYY-MM-DD"));
      return newStartDate;
    });
  };

  // Handle input changes while editing
  const handleEditChange = (
    date: string,
    mealType: keyof Row,
    value: string
  ) => {
    setEditedData((prev) =>
      prev.map((row) =>
        row.date === date ? { ...row, [mealType]: value } : row
      )
    );
  };

  const handleSave = async () => {
    try {
      await request({
        url: "/mealplan",
        method: "POST",
        data: editedData.flatMap((row) => [
          { date: row.date, meal_type: "lunch", food: row.lunch },
          { date: row.date, meal_type: "snacks", food: row.snacks },
        ]),
        useAuth: true,
      });

      setMealData(editedData); // Sync mealData with editedData
      setIsEditing(false); // Exit edit mode
      notificationToast("Successfully Saved Menu", "success");
    } catch (err) {
      console.error("Error saving meal plan:", err);
      notificationToast("Failed to Save Menu", "error");
    }
  };

  const handleCopyMealsFromPreviousWeek = async () => {
    const previousWeekStart = dayjs(startDate)
      .subtract(7, "day")
      .format("YYYY-MM-DD");

    console.log(
      "📅 Copying meals from:",
      previousWeekStart,
      "to",
      dayjs(previousWeekStart).add(6, "day").format("YYYY-MM-DD")
    );

    try {
      // Fetch previous week's data
      const prevWeekMeals = (await request({
        url: `/mealplan`,
        method: "GET",
        params: { start: previousWeekStart, days: 7 }, // Fetch only the previous week's meals
        useAuth: true,
      })) as
        | { date: string; menu: { meal_type: string; food: string }[] }[]
        | null;

      console.log("📋 Previous Week's Meal Data:", prevWeekMeals); // Debugging

      if (!prevWeekMeals || prevWeekMeals.length === 0) {
        alert("No meals found for the previous week.");
        return;
      }

      // Reformat previous week's meals to fit the current week
      const mealsForCurrentWeek = prevWeekMeals.flatMap((meal) =>
        meal.menu.map((menuItem) => ({
          date: dayjs(meal.date).add(7, "day").format("YYYY-MM-DD"), // Shift date forward
          meal_type: menuItem.meal_type,
          food: menuItem.food,
        }))
      );

      console.log("🍽 Meals to be copied:", mealsForCurrentWeek); // Debugging

      // Send copied meals to the backend
      await request({
        url: "/mealplan",
        method: "POST",
        data: mealsForCurrentWeek, // Send as an array of objects
        useAuth: true,
      });

      //alert("Successfully copied meals from the previous week!");

      notificationToast(
        "Successfully copied meals from the previous week",
        "success"
      );
      // Update local state with new meal data
      //setMealData((prev) => [...prev, ...mealsForCurrentWeek]);

      setMealData((prev) => {
        // Convert existing data into a Map for easy merging
        const mealMap = new Map(prev.map((meal) => [meal.date, { ...meal }]));

        // Merge new meals into the mealMap
        mealsForCurrentWeek.forEach(({ date, meal_type, food }) => {
          if (!mealMap.has(date)) {
            mealMap.set(date, { date, lunch: "", snacks: "" });
          }
          if (meal_type === "lunch") {
            mealMap.get(date)!.lunch = food;
          } else if (meal_type === "snacks") {
            mealMap.get(date)!.snacks = food;
          }
        });

        // Convert back to an array
        return Array.from(mealMap.values());
      });
    } catch (err) {
      console.error("❌ Error copying meals:", err);
      alert("Failed to copy meals. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex right-[78vh] items-center mt-10 mb-8 absolute left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => changeWeek("prev")}
          className={`px-4 text-gray-300 text-4xl rounded hover:text-gray-400 ms-16`}
        >
          <FaCaretSquareLeft />
        </button>
        <h3 className="text-lg text-center font-bold min-w-40 select-none">
          {dayjs(startDate).format("DD MMM")}-{dayjs(endDate).format("DD MMM")}
        </h3>
        <button
          onClick={() => changeWeek("next")}
          className={`px-4 text-gray-300 text-4xl rounded hover:text-gray-400 `}
        >
          <FaCaretSquareRight />
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-black mt-20">
            <thead>
              <tr className="bg-gray-50 border border-black">
                <th className="border p-2">Date</th>
                <th className="border p-2">Lunch</th>
                <th className="border p-2">Snacks</th>
              </tr>
            </thead>
            <tbody>
              {mealData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-4">
                    No meal data available for this week.
                  </td>
                </tr>
              ) : (
                mealData.map((row) => (
                  <tr key={row.date} className="border text-center">
                    <td className="border p-2">
                      {dayjs(row.date).format("ddd, DD MMM")}
                    </td>
                    {["lunch", "snacks"].map((mealType) => (
                      <td key={mealType} className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={
                              editedData.find((r) => r.date === row.date)?.[
                                mealType as keyof Row
                              ] || ""
                            }
                            onChange={(e) =>
                              handleEditChange(
                                row.date,
                                mealType as keyof Row,
                                e.target.value
                              )
                            }
                            className="border p-1 w-full"
                          />
                        ) : (
                          row[mealType as keyof Row] || "—"
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end mt-4">
            {!isEditing ? (
              <div className="flex justify-end gap-x-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                >
                  Update Menu
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mr-2"
                >
                  Copy Menu
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedData(mealData);
                    setIsEditing(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">
                    Copy Meals from Previous Week
                  </h2>
                  <p>
                    Are you sure you want to copy the meals from the previous
                    week?
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleCopyMealsFromPreviousWeek();
                        setIsModalOpen(false);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                    >
                      Yes, Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MealPlanTable;
