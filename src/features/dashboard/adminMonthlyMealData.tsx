import BarChart from "@/components/barChart";
import LineChart from "@/components/lineChart";
import { totalMealGroup } from "@/model/totalMealGroup";
import { usePatchTotalMealGroup } from "@/services/mutations";
import { useMealSummaryGraph } from "@/services/queries";
import { format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

const AdminMonthlyMealData = () => {
  const [selectedMonthRange, setSelectedMonthRange] = useState(3);
  const { data: MealSummaryGraph } = useMealSummaryGraph(selectedMonthRange);
  const [monthYear, setMonthYear] = useState<string[]>([]);
  const [lunchCount, setLunchCount] = useState<number[]>([]);
  const [snacksCount, setSnacksCount] = useState<number[]>([]);
  console.log("Meal Summary Graph", MealSummaryGraph);
  useEffect(() => {
    if (MealSummaryGraph) {
      setMonthYear(
        MealSummaryGraph?.map((monthMeal) => {
          const monthAbbreviation = monthMeal?.month?.substring(0, 3);
          const yearAbbreviation = monthMeal?.year?.toString();
          return `${monthAbbreviation} ${yearAbbreviation}`;
        }).reverse()
      );
      setLunchCount(MealSummaryGraph?.map((monthMeal) => monthMeal?.lunch ?? 0).reverse());
      setSnacksCount(MealSummaryGraph?.map((monthMeal) => monthMeal?.snack?? 0).reverse());
    }
  }, [selectedMonthRange, MealSummaryGraph]);
  return (
    <div className="bg-stone-50 rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <div className="pl-2">
          Monthly Meal Summary
        </div>
      <div>
        <select
          value={selectedMonthRange}
          onChange={(e) => setSelectedMonthRange(parseInt(e.target.value))}
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
          labels: monthYear,
          datasets: [
            { label: "Lunch", data: lunchCount },
            { label: "Snacks", data: snacksCount },
          ],
        }}
        color={["#bfdbfe", "green"]}
      ></LineChart>
    </div>
  );
};

export default AdminMonthlyMealData;
