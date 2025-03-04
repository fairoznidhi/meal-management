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
  height?:string;
};
const BarChart: React.FC<BarChartProps> = ({ data, color, height}) => {
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
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };
  console.log(modifiedData);
  return (
    <div className={`${height}`}>
      <Bar data={modifiedData} options={options}></Bar>
    </div>
  );
};

export default BarChart;
