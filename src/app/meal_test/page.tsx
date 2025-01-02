'use client'

{/*import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

const MealActivityComponent = () => {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        console.log(data);
        console.log(data[0].employee_details[0].date);
        console.log(data[0].employee_details[0].holiday);
        console.log(data[0].employee_name);
        console.log(data[0].employee_details[0].meal[0].meal_type);
        console.log(data[0].employee_details[0].meal[0].meal_status[0].status);
        console.log(data[0].employee_details[0].meal[0].meal_status[0].penalty);
        console.log(data[0].employee_details[0].meal[1].meal_type);
        console.log(data[0].employee_details[0].meal[1].meal_status[0].status);
        console.log(data[0].employee_details[0].meal[1].meal_status[0].penalty);

        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

 

  return (
    <div>
      <h1>Meal Activity Data</h1>
      <pre>{JSON.stringify(mealData, null, 2)}</pre>
    
    </div>
  );
};

export default MealActivityComponent;

import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

const MealActivityComponent = () => {
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        setMealData(data);
        // Log the required information for all objects
        data.forEach((item: any) => {
            
            console.log(item.employee_name);
          item.employee_details.forEach((employeeDetail: any) => {
            console.log(employeeDetail.date);
            console.log(employeeDetail.holiday);
            console.log(employeeDetail.meal[0].meal_type);
            console.log(employeeDetail.meal[0].meal_status[0].status);
            console.log(employeeDetail.meal[0].meal_status[0].penalty);
            console.log(employeeDetail.meal[1].meal_type);
            console.log(employeeDetail.meal[1].meal_status[0].status);
            console.log(employeeDetail.meal[1].meal_status[0].penalty);
          });
        });
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meal Activity Data</h1>
      <pre>{JSON.stringify(mealData, null, 2)}</pre>
    </div>
  );
};

export default MealActivityComponent;



import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

// Define the types for the data structure
interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_name: string;
  employee_details: EmployeeDetail[];
}


const MealActivityComponent = () => {
  const [mealData, setMealData] = useState<MealActivityData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meal Activity Data</h1>
      <table cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Holiday</th>
            <th>Meal Type 1</th>
            <th>Status 1</th>
            <th>Penalty 1</th>
            <th>Meal Type 2</th>
            <th>Status 2</th>
            <th>Penalty 2</th>
          </tr>
        </thead>
        <tbody>
          {mealData &&
            mealData.map((item: any, index: number) => (
              item.employee_details.map((employeeDetail: any, employeeIndex: number) => (
                <tr key={`${index}-${employeeIndex}`}>
                  <td>{item.employee_name}</td>
                  <td>{employeeDetail.date}</td>
                  <td>{employeeDetail.holiday ? "Yes" : "No"}</td>
                  <td>{employeeDetail.meal[0].meal_type}</td>
                  <td>{employeeDetail.meal[0].meal_status[0].status ? "Served" : "Not Served"}</td>
                  <td>{employeeDetail.meal[0].meal_status[0].penalty ? "Yes" : "No"}</td>
                  <td>{employeeDetail.meal[1].meal_type}</td>
                  <td>{employeeDetail.meal[1].meal_status[0].status ? "Served" : "Not Served"}</td>
                  <td>{employeeDetail.meal[1].meal_status[0].penalty ? "Yes" : "No"}</td>
                </tr>
              ))
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealActivityComponent;


import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

// Define the types for the data structure
interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_name: string;
  employee_details: EmployeeDetail[];
}

const MealActivityComponent = () => {
  const [mealData, setMealData] = useState<MealActivityData[] | null>(null); // Define the type for the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meal Activity Data</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Employee Name</th>
            <th className="border border-gray-300 p-2">Date</th>
           
            <th className="border border-gray-300 p-2">Meal Type 1</th>
            <th className="border border-gray-300 p-2">Status 1</th>
            
            <th className="border border-gray-300 p-2">Meal Type 2</th>
            <th className="border border-gray-300 p-2">Status 2</th>
            
          </tr>
        </thead>
        <tbody>
          {mealData &&
            mealData.map((item, index) =>
              item.employee_details.map((employeeDetail, employeeIndex) => (
                <tr key={`${index}-${employeeIndex}`}>
                  <td className="border border-gray-300 p-2">{item.employee_name}</td>
                  <td
                    className={`border border-gray-300 p-2 ${employeeDetail.holiday ? 'bg-blue-500 text-white' : ''}`}
                  >
                    {employeeDetail.date}
                  </td>
                  
                  <td className="border border-gray-300 p-2">
                    {employeeDetail.meal[0].meal_type}
                  </td>
                  <td className={`border border-gray-300 p-2 ${employeeDetail.meal[0].meal_status[0].penalty ? 'bg-red-500 text-white':''}`}>
                    {employeeDetail.meal[0].meal_status[0].status ? "Served" : "Not Served"}
                  </td>
                  
                  <td className="border border-gray-300 p-2">
                    {employeeDetail.meal[1].meal_type}
                  </td>
                  <td className={`border border-gray-300 p-2 ${employeeDetail.meal[1].meal_status[0].penalty? 'bg-red-500 text-white':''}`}>
                    {employeeDetail.meal[1].meal_status[0].status ? "Served" : "Not Served"}
                  </td>
                
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  );
};

export default MealActivityComponent;




import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

// Define the types for the data structure
interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_name: string;
  employee_details: EmployeeDetail[];
}

const MealActivityComponent = () => {
  const [mealData, setMealData] = useState<MealActivityData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<number | null>(null); // State for selected meal type

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filtered data based on the selected meal type
  const filteredMealData = mealData?.map((item) => ({
    ...item,
    employee_details: item.employee_details.map((detail) => ({
      ...detail,
      meal: detail.meal.filter((meal) =>
        selectedMealType === null || meal.meal_type === selectedMealType
      ),
    })).filter((detail) => detail.meal.length > 0),
  })).filter((item) => item.employee_details.length > 0);

  return (
    <div>
      <h1>Meal Activity Data</h1>

      {/* Dropdown for meal type filter 
      <div className="mb-4">
        <label htmlFor="mealTypeFilter" className="mr-2 font-bold">Filter by Meal Type:</label>
        <select
          id="mealTypeFilter"
          className="border border-gray-300 p-2 rounded"
          value={selectedMealType || ""}
          onChange={(e) =>
            setSelectedMealType(e.target.value ? parseInt(e.target.value) : null)
          }
        >
          <option value="">All Meal Types</option>
          <option value="1">Meal Type 1</option>
          <option value="2">Meal Type 2</option>
        </select>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Employee Name</th>
            <th className="border border-gray-300 p-2">Date</th>
            
            
            <th className="border border-gray-300 p-2">Status</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredMealData &&
            filteredMealData.map((item, index) =>
              item.employee_details.map((employeeDetail, employeeIndex) =>
                employeeDetail.meal.map((meal, mealIndex) => (
                  <tr key={`${index}-${employeeIndex}-${mealIndex}`}>
                    <td className="border border-gray-300 p-2">{item.employee_name}</td>
                    <td
                      className={`border border-gray-300 p-2 ${employeeDetail.holiday ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {employeeDetail.date}
                    </td>
                   
                   
                    <td
                      className={`border border-gray-300 p-2 ${
                        meal.meal_status[0].penalty ? 'bg-red-500 text-white' : ''
                      }`}
                    >
                      {meal.meal_status[0].status ? "Served" : "Not Served"}
                    </td>
                   
                  </tr>
                ))
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default MealActivityComponent;
*/}



import React, { useEffect, useState } from "react";
import { getMealActivity } from "@/services/MealActivity/api"; // Adjust the import path

// Define the types for the data structure
interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_name: string;
  employee_details: EmployeeDetail[];
}

const MealActivityComponent = () => {
  const [mealData, setMealData] = useState<MealActivityData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<number>(1); // Default to Meal Type 1

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealActivity("2025-01-01", 7); // Example parameters
        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meal Activity Data</h1>

      {/* Dropdown for meal type filter */}
      <div className="mb-4">
        <label htmlFor="mealTypeFilter" className="mr-2 font-bold">Filter by Meal Type:</label>
        <select
          id="mealTypeFilter"
          className="border border-gray-300 p-2 rounded"
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(parseInt(e.target.value))}
        >
          <option value="1">Meal Type 1</option>
          <option value="2">Meal Type 2</option>
        </select>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-4/5 items-center justify-center ms-40 mt-40">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Employee Name</th>
            {[...Array(7)].map((_, i) => (
              <th key={i} className="border border-gray-300 p-2">Date {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealData &&
            mealData.map((employee, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-center">{employee.employee_name}</td>
                {employee.employee_details.slice(0, 7).map((detail, detailIndex) => {
                  const meal = detail.meal.find((m) => m.meal_type === selectedMealType);
                  const status = meal?.meal_status[0];
                  return (
                    <td
                      key={detailIndex}
                      className={`border border-gray-300 p-2 text-center ${
                        detail.holiday ? 'bg-blue-500 text-white' : ''
                      } ${status?.penalty ? 'bg-red-500 text-white' : ''}`}
                    >
                      {status?.status ? "1" : "0"}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealActivityComponent;
