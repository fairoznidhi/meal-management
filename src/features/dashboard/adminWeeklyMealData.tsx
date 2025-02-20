import BarChart from "@/components/barChart";
import { totalMealGroup } from "@/model/totalMealGroup";
import { usePatchTotalMealGroup } from "@/services/mutations";
import { format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

const AdminWeeklyMealData = () => {
  const firstDate = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const { mutate: lunchMealCount } = usePatchTotalMealGroup(firstDate, 1, 7);
  const { mutate: snacksMealCount } = usePatchTotalMealGroup(firstDate, 2, 7);
  const [week, setWeek] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [lunchCount, setLunchCount] = useState<number[]>([]);
  const [snacksCount, setSnacksCount] = useState<number[]>([]);
  useEffect(() => {
    Promise.all([
      new Promise<totalMealGroup[]>((resolve, reject) => {
        lunchMealCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
      new Promise<totalMealGroup[]>((resolve, reject) => {
        snacksMealCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
    ])
      .then(([lunchData, snacksData]) => {
        if (
          lunchData &&
          lunchData.length === 0 &&
          snacksData &&
          snacksData.length === 0
        ) {
          console.log("No data available");
        } else {
          setLunchCount(lunchData?.map((lunch) => lunch?.count ?? 0) || []);
          setSnacksCount(snacksData?.map((snack) => snack?.count ?? 0) || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [firstDate]);
  return (
    <div className="bg-stone-50 rounded-lg p-4">
      <div className="text-center mb-2">This Week Meal Summary</div>
      <BarChart
        data={{
          labels: week,
          datasets: [
            { label: "Lunch", data: lunchCount },
            { label: "Snacks", data: snacksCount },
          ],
        }}
        color={["#bfdbfe", "green"]}
      ></BarChart>
    </div>
  );
};

export default AdminWeeklyMealData;
