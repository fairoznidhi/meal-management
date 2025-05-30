"use client";

import UserMonthlyMealSummary from "@/features/dashboard/userMonthlyMealSummary";
import { MonthlyData } from "@/model/mealActivity";
import { useUserMonthlyData } from "@/services/queries";
import { useEffect, useState } from "react";
import { GaugeComponent } from "react-gauge-component";

const UserDashboard = () => {
  const [monthSpan, setMonthSpan] = useState(3);
  const [monthGraphLabel, setMonthGraphLabel] = useState<string[]>([]);
  const [monthLunchCount, setMonthLunchCount] = useState<number[]>([]);
  const [monthSnackCount, setMonthSnackCount] = useState<number[]>([]);
  const [monthPenaltyCount, setMonthPenaltyCount] = useState<number[]>([]);
  const { data: monthlyData } = useUserMonthlyData(monthSpan);
  const classVal = `p-4 rounded-md text-center py-8`;
  const pClassVal = `text-lg font-semibold pb-2`;
  const hClassVal = `text-2xl font-bold`;
  const [montlyOverview, setMontlyOverview] = useState<MonthlyData[]>([]);
  const [foodWaste, setFoodWaste] = useState(0);
  useEffect(() => {
    if (monthlyData) {
      setMontlyOverview(monthlyData);
      const penalty =
        (monthlyData?.[0]?.lunch_penalty ?? 0) +
        (monthlyData?.[0]?.snack_penalty ?? 0);
      const total =
        ((monthlyData?.[0]?.total_lunch ?? 0) +
          (monthlyData?.[0]?.total_snack ?? 1)) *
        5;
      let waste = penalty / total;
      if (isNaN(waste)) {
        waste = 0;
      }
      setFoodWaste(waste * 100);
    }
  }, [monthlyData]);
  useEffect(() => {
    if (monthlyData) {
      setMonthGraphLabel(
        monthlyData
          ?.map((monthMeal) => {
            const monthAbbreviation = monthMeal?.month?.substring(0, 3);
            const yearAbbreviation = monthMeal?.year?.toString();
            return `${monthAbbreviation} ${yearAbbreviation}`;
          })
          .reverse()
      );
      setMonthLunchCount(
        monthlyData?.map((monthMeal) => monthMeal?.total_lunch ?? 0).reverse()
      );
      setMonthSnackCount(
        monthlyData?.map((monthMeal) => monthMeal?.total_snack ?? 0).reverse()
      );
      setMonthPenaltyCount(
        monthlyData
          ?.map(
            (monthMeal) =>
              (monthMeal?.lunch_penalty ?? 0) + (monthMeal?.snack_penalty ?? 0)
          )
          .reverse()
      );
    }
  }, [monthSpan, monthlyData]);
  return (
    <div className="p-4">
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-8">
          {/*Lunch,snack,penalty count*/}
          <div className="grid grid-cols-3 gap-4">
            <div className={`${classVal} bg-green-200`}>
              <p className={`${pClassVal}`}>Total Lunch of this month</p>
              <h3 className={`${hClassVal}`}>
                {montlyOverview?.[0]?.total_lunch ?? 0}
              </h3>
            </div>
            <div className={`${classVal} bg-blue-200`}>
              <p className={`${pClassVal}`}>Total Snacks of this month</p>
              <h3 className={`${hClassVal}`}>
                {montlyOverview?.[0]?.total_snack ?? 0}
              </h3>
            </div>
            <div className={`${classVal} bg-violet-200`}>
              <p className={`${pClassVal}`}>Total Penalty of this month</p>
              <h3 className={`${hClassVal}`}>
                {(montlyOverview?.[0]?.lunch_penalty ?? 0) +
                  (montlyOverview?.[0]?.snack_penalty ?? 0)}
              </h3>
            </div>
          </div>
          {/*graph*/}
          <div>
            <UserMonthlyMealSummary
              label={monthGraphLabel}
              lunch={monthLunchCount}
              snack={monthSnackCount}
              penalty={monthPenaltyCount}
              count={monthSpan}
              setCount={setMonthSpan}
            />
          </div>
        </div>
        <div className="col-span-2 bg-gray-100 h-full rounded-lg py-8">
          <h3 className="text-center font-semibold">Food Wastage</h3>
          <GaugeComponent
            type="radial"
            value={foodWaste}
            labels={{
              valueLabel: {
                style: {
                  fill: "#656668",
                  fontSize: 36,
                  fontWeight: "extrabold",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
