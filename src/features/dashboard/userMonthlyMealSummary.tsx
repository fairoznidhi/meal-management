import LineChart from "@/components/lineChart";
import { useState } from "react";

type UserMonthlySummaryProps = {
  label: string[];
  lunch: number[];
  snack: number[];
  penalty: number[];
  count: number;
  setCount: (value: number) => void;
};

const UserMonthlyMealSummary: React.FC<UserMonthlySummaryProps> = ({
  label,
  lunch,
  snack,
  penalty,
  count,
  setCount,
}) => {
  return (
    <div className="bg-stone-50 rounded-xl mt-4 p-4">
      <div className="flex justify-between mb-2">
        <div className="pl-2">Monthly Meal Summary</div>
        <div>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[3, 6, 9].map((months) => (
              <option key={months} value={months}>
                Last {months} Months
              </option>
            ))}
          </select>
        </div>
      </div>
      <LineChart
        data={{
          labels: label,
          datasets: [
            { label: "Lunch", data: lunch },
            { label: "Snacks", data: snack },
            { label: "Penalty", data: penalty },
          ],
        }}
        color={["#bfdbfe", "green", "#7d58c2"]}
        aspectRatio={false}
        // height="250px"
      
      ></LineChart>
    </div>
  );
};

export default UserMonthlyMealSummary;
