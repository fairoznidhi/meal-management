"use client";
import AdminMonthlyMealData from "@/features/dashboard/adminMonthlyMealData";
import AdminWeeklyMealData from "@/features/dashboard/adminWeeklyMealData";
import InstantGuest from "@/features/dashboard/InstantGuest";
import PrintModal from "@/features/dashboard/printHTML";
import { FaPrint } from "react-icons/fa6";
import { BsBellFill } from "react-icons/bs";
import OfficeDailyPenaltyGraphAdmin from "@/features/dashboard/adminDashboard/graphs/officeDailyPenaltyGraphAdmin";
import { totalMealGroup } from "@/model/totalMealGroup";
import { usePatchTotalMealGroup } from "@/services/mutations";
import { useOfficeMonthlyPenalties } from "@/services/queries";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TelegramNotificationModal from "@/features/dashboard/adminDashboard/telegramNotificationModal";
import { Button } from "@/components/button";

const AdminDashboard = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const router = useRouter();
  const [lunchTotal, setLunchTotal] = useState<number | null>(null);
  const [snacksTotal, setSnacksTotal] = useState<number | null>(null);
  const [specialLunch, setSpecialLunch] = useState<number | null>(null);
  const [specialSnacks, setSpecialSnacks] = useState<number | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);
  const [TotalMealFetch, setTotalMealFetch] = useState(true);
  const { mutate: lunchMealCount } = usePatchTotalMealGroup(today, 1, 1);
  const { mutate: snacksMealCount } = usePatchTotalMealGroup(today, 2, 1);
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
        const lunchCount = lunchData.map((item) => item.count ?? 0);
        const snackCount = snacksData.map((item) => item.count ?? 0);
        const specialLunchCount = lunchData.map(
          (item) => item.special_count ?? 0
        );
        const specialSnackCount = snacksData.map(
          (item) => item.special_count ?? 0
        );
        setLunchTotal(lunchCount[0] - specialLunchCount[0]);
        setSnacksTotal(snackCount[0] - specialSnackCount[0]);
        setSpecialLunch(specialLunchCount[0]);
        setSpecialSnacks(specialSnackCount[0]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [TotalMealFetch]);
  const [thisMonthPenalty, setThisMonthPenalty] = useState<number | null>(null);
  const { data: monthlyPenalty } = useOfficeMonthlyPenalties(1);
  const h3ClassName = "text-lg font-semibold mb-2";
  useEffect(() => {
    if (monthlyPenalty) {
      setThisMonthPenalty(monthlyPenalty?.[0]?.count ?? 0);
    }
  }, [monthlyPenalty, thisMonthPenalty]);
  return (
    <div className="p-4">
      {/*<div className="absolute justify-between mb-7"><TotalBox></TotalBox></div> */}
      <div className="grid grid-cols-12 gap-2 mb-2">
        <div className="grid grid-cols-7 col-span-11 gap-2">
          {/* Todays total lunch */}
          <div
            className="p-4 bg-blue-200 hover:bg-blue-300 rounded-md text-center cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
              localStorage.setItem("MealType", "1");
              router.push("/mealUpdate");
            }}
          >
            <h3 className={`${h3ClassName}`}>Today&apos;s Total Lunch</h3>
            <p className="text-2xl font-bold">
              {lunchTotal !== null ? (
                lunchTotal
              ) : (
                <span className="loading loading-spinner loading-xs"></span>
              )}
            </p>
          </div>

          {/* Todays total snacks */}
          <div
            className="p-4 bg-blue-200 hover:bg-blue-300 rounded-md text-center cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
              localStorage.setItem("MealType", "2");
              router.push("/mealUpdate");
            }}
          >
            <h3 className={`${h3ClassName}`}>Today&apos;s Total Snacks</h3>
            <p className="text-2xl font-bold">
              {snacksTotal !== null ? (
                snacksTotal
              ) : (
                <span className="loading loading-spinner loading-xs"></span>
              )}
            </p>
          </div>

          {/* Special Meal Count */}

          <div className="p-4 bg-green-200 rounded-md text-center">
            <h3 className={`${h3ClassName}`}>Today&apos;s Special Lunch</h3>
            <p className="text-2xl font-bold">
              {specialLunch !== null ? (
                specialLunch
              ) : (
                <span className="loading loading-spinner loading-xs"></span>
              )}
            </p>
          </div>
          <div className="p-4 bg-green-200 rounded-md text-center">
            <h3 className={`${h3ClassName}`}>Today&apos;s Special Snacks</h3>
            <p className="text-2xl font-bold">
              {specialSnacks !== null ? (
                specialSnacks
              ) : (
                <span className="loading loading-spinner loading-xs"></span>
              )}
            </p>
          </div>

          {/* Instant guest Update */}
          <div className="p-4 bg-violet-200 hover:bg-violet-300 rounded-md text-center transition duration-300 ease-in-out">
            <InstantGuest
              onUpdateSuccess={() => {
                setTotalMealFetch(!TotalMealFetch);
              }}
              lunchFlag={true}
            />
          </div>
          <div className="p-4 bg-violet-200 hover:bg-violet-300 rounded-md text-center transition duration-300 ease-in-out">
            <InstantGuest
              onUpdateSuccess={() => {
                setTotalMealFetch(!TotalMealFetch);
              }}
              lunchFlag={false}
            />
          </div>
          {/* Penalty */}
          <div className="p-4 bg-rose-100 rounded-md text-center">
            <h3 className={`${h3ClassName}`}>Penalty of This Month</h3>
            <p className="text-2xl font-bold">
              {thisMonthPenalty !== null ? (
                thisMonthPenalty
              ) : (
                <span className="loading loading-spinner loading-xs"></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col  justify-end items-end h-full w-full rounded-md">
          {/* Telegram Notification */}
          <div className="mb-2">
            <Button
              label={<BsBellFill className="text-midnightBlue text-xl" />}
              size="sm"
              custom={true}
              fillButton={false}
              className="bg-blue-200 hover:bg-blue-300 p-3 px-3 rounded-md transition duration-300 ease-in-out"
              onClick={() => setIsNotificationModalOpen(true)}
            />
          </div>
          {/*Print meal */}
          <div className="">
            <Button
              label={<FaPrint className="text-midnightBlue text-xl" />}
              size="sm"
              custom={true}
              fillButton={false}
              className="bg-blue-200 hover:bg-blue-300 p-3 px-3 rounded-md transition duration-300 ease-in-out"
              onClick={() => setIsPrintModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <AdminWeeklyMealData />
        <AdminMonthlyMealData />
      </div>
      <div className="">
        <OfficeDailyPenaltyGraphAdmin />
      </div>
      <div>
        {/* Render PrintLunchModal and pass necessary props */}
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
          }}
        />
      </div>
      <div>
        <TelegramNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => {
            setIsNotificationModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
