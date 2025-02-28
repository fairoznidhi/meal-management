import LineChart from '@/components/lineChart';
import { useOfficeDailyPenalties } from '@/services/queries';
import React, { useEffect, useState } from 'react';

const OfficeDailyPenaltyGraphAdmin = () => {
    const [selectedDaysRange, setSelectedDaysRange] = useState(30);
    const {data:DailyPenaltyData}=useOfficeDailyPenalties(selectedDaysRange);
    const [labels,setLabels]=useState<string[]>([]);
    const [penaltyCount,setPenaltyCount]=useState<number[]>([]);
    useEffect(() => {
        if (DailyPenaltyData) {
            setLabels(
                DailyPenaltyData.map(item => 
                    item.date 
                        ? new Date(item.date).toLocaleDateString("en-US", { 
                            month: "short", day: "2-digit", year: "numeric" 
                        }) 
                        : ""
                ).reverse()
            );
            setPenaltyCount(DailyPenaltyData.map(item => item.count ?? 0).reverse());
        }
    }, [selectedDaysRange, DailyPenaltyData]);
    
    return (
      <div className="bg-stone-50 rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <div className="pl-2">
            Daily Penalty
          </div>
        <div>
          <select
            value={selectedDaysRange}
            onChange={(e) => setSelectedDaysRange(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[30, 60, 90].map((months) => (
              <option key={months} value={months}>
                Last {months} Days
              </option>
            ))}
          </select>
        </div>
        </div>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              { label: "Penalty", data: penaltyCount },
            ],
          }}
          color={["#7d58c2"]}
          aspectRatio={false}
        ></LineChart>
      </div>
    );
  };

export default OfficeDailyPenaltyGraphAdmin;