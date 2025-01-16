import React from "react";

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
  employee_id: string;
  employee_name: string;
  employee_details: EmployeeDetail[];
}

interface DynamicTableBodyProps {
  filteredMealPlan: MealActivityData[] | null;
  headerDates: { fullDate: string; day: string }[];
  selectedMealType: number;
  handleCellClick: (
    employeeId: string,
    employeeName: string,
    date: string,
    status: MealStatus | null
  ) => void;
}

const DynamicTableBody: React.FC<DynamicTableBodyProps> = ({
  filteredMealPlan,
  headerDates,
  selectedMealType,
  handleCellClick,
}) => {
  return (
    <tbody>
      {/* Employee Rows */}
      {filteredMealPlan &&
        filteredMealPlan.map((employee, index) => (
          <tr key={index}>
            <td className="border border-gray-300 p-2 text-center">
              {employee.employee_name}
            </td>
            {employee.employee_details.map((detail, detailIndex) => {
              const meal = detail.meal.find(
                (m) => m.meal_type === selectedMealType
              );
              const status = meal?.meal_status[0];
              return (
                <td
                  key={detailIndex}
                  className={`border border-gray-300 p-2 text-center ${
                    detail.holiday ? "bg-blue-100 text-white" : ""
                  } ${status?.penalty ? "bg-red-300 text-white" : ""}`}
                  onClick={() =>
                    handleCellClick(
                      employee.employee_id,
                      employee.employee_name,
                      detail.date,
                      status || null
                    )
                  }
                >
                  <span
                    className={`${
                      status?.status ? "text-green-500" : "text-red-500"
                    } `}
                  >
                    {status?.status ? "Yes" : "No"}
                  </span>
                </td>
              );
            })}
          </tr>
        ))}

      {/* Guests Row */}
      <tr>
        <td className="border border-gray-300 p-2 text-center font-bold">
          Guests
        </td>
        {headerDates.map((header, index) => (
          <td
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-100"
          >
            {Math.floor(Math.random() * 5)} {/* Replace with dynamic guest data */}
          </td>
        ))}
      </tr>
    </tbody>
  );
};

export default DynamicTableBody;
