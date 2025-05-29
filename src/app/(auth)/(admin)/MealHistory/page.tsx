"use client";

import { usePrint } from "@/app/hooks/usePrint";
import { Button } from "@/components/button";
import Table, { Column } from "@/components/Table";
import { TotalMeal, totalMealGroup } from "@/model/totalMealGroup";
import {
  usePatchTotalLunchSnacksCount,
  usePatchTotalMealGroup,
} from "@/services/mutations";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaPrint } from "react-icons/fa6";

const getMonthBoundaries = () => {
  const now = dayjs();
  const startOfMonth = now.startOf("month").toDate();
  const endOfMonth = now.endOf("month").toDate();
  return { startOfMonth, endOfMonth };
};

const calculateDaysInRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  return end.diff(start, "day") + 1;
};

const MealHistory = () => {
  const { startOfMonth, endOfMonth } = getMonthBoundaries();

  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(endOfMonth);
  const [totalMeal, setTotalMeal] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const daysInRange = calculateDaysInRange(startDate, endDate);

  const printRef = useRef<HTMLDivElement>(null);
  const { handlePrint } = usePrint();

  const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
  const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

  const { mutate: lunchMealCount } = usePatchTotalMealGroup(
    formattedStartDate,
    1,
    daysInRange
  );
  const { mutate: snacksMealCount } = usePatchTotalMealGroup(
    formattedStartDate,
    2,
    daysInRange
  );
  const { mutate: totalCount } = usePatchTotalLunchSnacksCount(
    formattedStartDate,
    daysInRange
  );

  const formatData = (
    lunchData: totalMealGroup[],
    snacksData: totalMealGroup[],
    totalCountData: TotalMeal
  ) => {
    const formattedData = lunchData.map((lunch) => {
      const matchingSnack = snacksData.find(
        (snack) => snack.date === lunch.date
      );
      const formattedDate = dayjs(lunch.date).format("DD MMM (ddd)");

      return {
        date: formattedDate,
        total_lunch: lunch.count || 0,
        total_snacks: matchingSnack?.count || 0,
      };
    });

    const totalRow = {
      date: "Total",
      total_lunch: totalCountData.total_lunch,
      total_snacks: totalCountData.total_snacks,
    };

    formattedData.push(totalRow);
    return formattedData;
  };

  useEffect(() => {
    setLoading(true);

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
      new Promise<TotalMeal>((resolve, reject) => {
        totalCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
    ])
      .then(([lunchData, snacksData, totalCountData]) => {
        if (!lunchData.length && !snacksData.length && !totalCountData) {
          setError("No meal data available for the selected date range.");
        } else {
          const formatted = formatData(lunchData, snacksData, totalCountData);
          setTotalMeal(formatted);
          setError(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("No Data Available");
        setLoading(false);
      });
  }, [startDate, endDate, daysInRange]);

  const columns: Column[] = [
    {
      key: "date",
      label: "Date",
      render: (value, row) => {
        return (
          <span className="font-medium text-gray-700 whitespace-nowrap">
            {value}
          </span>
        );
      },
    },
    {
      key: "total_lunch",
      label: "Total Lunch",
    },
    {
      key: "total_snacks",
      label: "Total Snacks",
    },
  ];

  return (
    <div className="p-4">
      <div className="bg-stone-50 p-2 mt-2 rounded-lg">
        <div className="flex justify-between items-end mt-2 px-4">
          <h2 className="text-3xl font-extrabold mb-4">Meal History</h2>
          <div className="mb-4 flex gap-4">
            <p className="font-semibold mt-2">Start Date</p>
            <input
              type="date"
              value={dayjs(startDate).format("YYYY-MM-DD")} // Format to YYYY-MM-DD
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border rounded px-2 py-1"
            />
            <p className="font-semibold mt-2">End Date</p>
            <input
              type="date"
              value={dayjs(endDate).format("YYYY-MM-DD")} // Format to YYYY-MM-DD
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border rounded px-2 py-1"
            />
            <Button
              label={<FaPrint />}
              utilityButton={true}
              size="none"
              onClick={() => handlePrint(printRef.current)}
            ></Button>
          </div>
        </div>

        {/* Table Display */}
        {loading && <span className="loading loading-dots loading-lg"></span>}
        {error && <p className="text-red-500">{error}</p>}

        <div ref={printRef}>
          {!loading && !error && totalMeal.length > 0 ? (
            <Table columns={columns} data={totalMeal} />
          ) : (
            !loading &&
            !error && <p>No meal records found for the selected date range.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealHistory;
