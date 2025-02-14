import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);
type BarChartProps = {
  data: ChartData<"bar">;
  color?: string[];
};
const BarChart: React.FC<BarChartProps> = ({ data, color }) => {
  const modifiedData = {
    labels: [...(data?.labels ?? [])],
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: color ? color[index % color.length] : "red",
      borderRadius: 8,
    })),
  };
  const options = {
    // maintainAspectRatio:false,
    layout:{
        autoPadding:false,
        padding:0
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        align: "start" as const,
        labels: {
          boxHeight: 30, 
          boxWidth: 30, 
          padding: 0, 
          borderRadius:2
        },
      },
    },
  };
  console.log(modifiedData);
  return (
    <div>
      <Bar data={modifiedData} options={options}></Bar>
    </div>
  );
};

export default BarChart;
