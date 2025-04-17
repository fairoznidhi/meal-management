
import LineChart from '@/components/lineChart';
import { useOfficeDailyPenalties } from '@/services/queries';
import React, { useEffect, useState } from 'react';

const OfficeDailyPenaltyGraphAdmin = () => {
  const [selectedDaysRange, setSelectedDaysRange] = useState(30);
  const { data: DailyPenaltyData } = useOfficeDailyPenalties(selectedDaysRange);

  // Combined state for labels and penalty counts
  const [chartData, setChartData] = useState<{ labels: string[]; penaltyCount: number[] }>({
    labels: [],
    penaltyCount: [],
  });

  useEffect(() => {
    if (DailyPenaltyData) {
      const formattedData = DailyPenaltyData.map(item => ({
        label: item.date
          ? new Date(item.date).toLocaleDateString("en-US", { 
              month: "short", day: "2-digit", year: "numeric" 
            }) 
          : "",
        count: item.count ?? 0,
      })).reverse(); // Reverse to maintain the order

      setChartData({
        labels: formattedData.map(item => item.label),
        penaltyCount: formattedData.map(item => item.count),
      });
    }
  }, [selectedDaysRange, DailyPenaltyData]);

  return (
    <div className="bg-stone-50 rounded-xl p-4 mt-2">
      <div className="flex justify-between mb-2">
        <div className="pl-2">Daily Penalty</div>
        <div>
          <select
            value={selectedDaysRange}
            onChange={(e) => setSelectedDaysRange(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[30, 60, 90].map((days) => (
              <option key={days} value={days}>
                Last {days} Days
              </option>
            ))}
          </select>
        </div>
      </div>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [{ label: "Penalty", data: chartData.penaltyCount }],
        }}
        color={["#7d58c2"]}
        aspectRatio={false}
      />
    </div>
  );
};

export default OfficeDailyPenaltyGraphAdmin;
