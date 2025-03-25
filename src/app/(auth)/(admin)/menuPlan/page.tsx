"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from "@/components/notificationToast";
import { FaCaretSquareLeft, FaCaretSquareRight, FaExclamation, FaTimes } from "react-icons/fa";
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
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false); // Modal state
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [foodOptions, setFoodOptions] = useState<{ food_Id: number; food: string }[]>([]);
  const [addFoodModal, setAddFoodModal] = useState(false);
  const [newFood, setNewFood] = useState("");
 
  const [prefmodalOpen, setprefModalOpen] = useState(false);

  const [selectedPreferences, setSelectedPreferences] = useState<Record<string, { lunch: number[]; snacks: number[] }>>({});

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<"lunch" | "snacks">("lunch");

  const openprefModal = (date: string, mealType: "lunch" | "snacks") => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
  
    // Load selected preferences for the specific date and mealType
    const selectedMealPreferences = selectedPreferences[date]?.[mealType] || [];
    setSelectedOptions(selectedMealPreferences); // Populate selected options when opening the modal
    fetchFoodOptions();
    setprefModalOpen(true);
  };
  




  const closeprefModal = () => {
    setprefModalOpen(false);
   
  };

  const handleOptionChange = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  
 
  const handlePreferenceChange = (date: string, mealType: "lunch" | "snacks", foodId: number) => {
    setSelectedOptions((prev) => {
      const newSelectedOptions = prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId];

      // Update selected preferences for the specific date and meal type
      setSelectedPreferences((prevPreferences) => {
        const updatedPreferences = { ...prevPreferences };
        if (!updatedPreferences[date]) {
          updatedPreferences[date] = { lunch: [], snacks: [] };
        }
        updatedPreferences[date][mealType] = newSelectedOptions;
        return updatedPreferences;
      });
      return newSelectedOptions;
    });
};



  
  









  /*useEffect(() => {
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
*/


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
        Record<string, { food: string; preference_food: number[] }>
      > = data?.reduce((acc: any, meal: any) => {
        acc[meal.date] = meal.menu.reduce((mealAcc: any, item: any) => {
          mealAcc[item.meal_type] = {
            food: item.food,
            preference_food: item.preference_food || [],
          };
          return mealAcc;
        }, {});
        return acc;
      }, {}) || {};

      const formattedData: Row[] = dateSequence.map((date) => ({
        date,
        lunch: mealDataMap[date]?.lunch?.food || "",
        snacks: mealDataMap[date]?.snacks?.food || "",
      }));

      // Store preferences separately to maintain state
      const preferences: Record<string, { lunch: number[]; snacks: number[] }> = {};
      Object.keys(mealDataMap).forEach((date) => {
        preferences[date] = {
          lunch: mealDataMap[date]?.lunch?.preference_food || [],
          snacks: mealDataMap[date]?.snacks?.preference_food || [],
        };
      });

      setMealData(formattedData);
      setEditedData(formattedData);
      setSelectedPreferences(preferences); // Save preferences

    } catch (error) {
      console.error("Error fetching meal plan:", error);
      notificationToast("Failed to Load Menu", "error");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [startDate]);












  const fetchFoodOptions = async () => {
    try {
      const data = (await request({
        url: `/preference`,
        method: "GET",
        useAuth: true,
      })) as { food_Id: number; food: string }[] | null;
  
      if (data) {
        setFoodOptions(data);
      }
    } catch (error) {
      console.error("Error fetching food options:", error);
    }
  };
  




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

  /*const handleSave = async () => {
    try {
      await request({
        url: "/mealplan",
        method: "POST",
        data: editedData.flatMap((row) => [
          { date: row.date, meal_type: "lunch", food: row.lunch , preference:[]},
          { date: row.date, meal_type: "snacks", food: row.snacks, preference:[] },
        ]),
        useAuth: true,
      });
      console.log("Edited data",editedData);
      setMealData(editedData); // Sync mealData with editedData
      setIsEditing(false); // Exit edit mode
      notificationToast("Successfully Saved Menu", "success");
    } catch (err) {
      console.error("Error saving meal plan:", err);
      notificationToast("Failed to Save Menu", "error");
    }
  };*/



  const handleSave = async () => {
    try {
      // Prepare the meal data for saving
      const mealDataToSave = editedData.flatMap((row) => [
        {
          date: row.date,
          meal_type: "lunch",
          food: row.lunch,
          preference_food: selectedPreferences[row.date]?.lunch || [],
        },
        {
          date: row.date,
          meal_type: "snacks",
          food: row.snacks,
          preference_food: selectedPreferences[row.date]?.snacks || [],
        },
      ]);
  
      // Send meal data to API
      await request({
        url: "/mealplan",
        method: "POST",
        data: mealDataToSave,
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
          preference:[]
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
        setEditedData(Array.from(mealMap.values()));
        return Array.from(mealMap.values());
      });
    } catch (err) {
      console.error("❌ Error copying meals:", err);
      alert("Failed to copy meals. Please try again.");
    }
    




      
  };

  const handleAddFood = async () => {
    if (!newFood.trim()) return;

    try {
      // Simulate API PATCH request
      
      await request({
        url: "/preference",
        method: "POST",
        data: {food:newFood}, // Send as an array of objects
        useAuth: true,
      });

      // Update state to show new food option
      setFoodOptions((prev) => [...prev, { food: newFood, food_Id: Date.now() }]);

      // Close the modal
      setNewFood("");
      setAddFoodModal(false);
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };



 
  











  return (
    <div className="p-4">
     
     <div className="bg-stone-50 p-2 mt-2 rounded-lg h-[100vh]">
       <div className="flex items-center  my-2 relative mt-8">
                
      
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                  <button
                    onClick={()=>changeWeek("prev")}
                    className="px-4 text-gray-300 text-4xl rounded hover:text-gray-400"
                  >
                    <FaCaretSquareLeft />
                  </button>
                  <h2 className="p-2 text-base font-bold">
                   { /*{`Start Date: ${
                    startDate.toISOString().split("T")[0]
                  }`}*/}
                  {dayjs(startDate).format("DD MMM")}-{dayjs(endDate).format("DD MMM")}</h2>
                  <button
                    onClick={()=>changeWeek("next")}
                    className="px-4 text-gray-300 text-4xl rounded hover:text-gray-400"
                  >
                    <FaCaretSquareRight />
                  </button>
                </div>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table-auto w-full rounded-t-lg mt-10">
            <thead className="bg-gray-200 border-gray-200 rounded-t-lg sticky top-0">
              <tr className="h-14 rounded-lg">
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
                          <div className="flex items-center justify-between">
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
                          {/* Edit button */}
                        <button
                        onClick={() => openprefModal(row.date,mealType as "lunch"|"snacks")}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <FaExclamation />
                      </button>
                      </div>
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
                  onClick={() => setIsCopyModalOpen(true)}
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

            {/*  copy Modal */}
            {isCopyModalOpen && (
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
                      onClick={() => setIsCopyModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleCopyMealsFromPreviousWeek();
                        setIsCopyModalOpen(false);
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
       

       {/* Prefernce/food tag Modal */}
      {prefmodalOpen&& (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 relative">
            {/* Close Button (Top Right) */}
            <button
              onClick={closeprefModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-lg font-bold mb-4">
              Select  Food Tags for Counting Special Meals
            </h2>
            <div className="flex flex-col gap-3">
           {/* {foodOptions.map((food) => (
            <label key={food.food_Id} className="flex items-center space-x-2">
            <input
               type="checkbox"
               value={food.food_Id}
               checked={(selectedPreferences[selectedDate]?.[selectedMealType] || []).includes(food.food_Id)}
               onChange={() => handlePreferenceChange(selectedDate, selectedMealType, food.food_Id)}
             />
            <span>{food.food}</span>
            </label>
            ))}
            */}
             {foodOptions.map((food) => (
             <label key={food.food_Id} className="flex items-center space-x-2">
             <input
              type="checkbox"
              value={food.food_Id}
              checked={selectedOptions.includes(food.food_Id)} // Check if the food is selected
              onChange={() => handlePreferenceChange(selectedDate, selectedMealType, food.food_Id)}
             />
             <span>{food.food}</span>
             </label>
             ))}
             

             {/* "Add New" Option */}
             <button
                className="flex justify-start hover:bg-gray-200 py-2 mt-2"
                onClick={() => {
                  closeprefModal();
                  setAddFoodModal(true);
                }}
              >
                + Add New
              </button>



            <div className="flex justify-end"><button className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-auto m-2" onClick={closeprefModal}>Save</button></div>
             
            </div>
             





          </div>
          
        </div>
         )}


         {/* Add New Food Modal */}
      {addFoodModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 relative">
            {/* Close Button */}
            <button onClick={() => setAddFoodModal(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">
              <FaTimes size={20} />
            </button>

            <h2 className="text-lg font-bold mb-4">Add New Food Tag</h2>

            {/* Input Field */}
            <input
              type="text"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter food name"
            />

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white w-auto mt-4"
                onClick={handleAddFood}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}



      </div>
      </div>

  );
  
};
export default MealPlanTable;
