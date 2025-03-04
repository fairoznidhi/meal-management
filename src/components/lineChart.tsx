import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

type LineChartProps = {
  data: ChartData<"line">;
  color?: string[];
  height?: string;
  aspectRatio?: boolean;
};

const LineChart: React.FC<LineChartProps> = ({ data, color, height, aspectRatio }) => {
  const modifiedData = {
    labels: [...(data?.labels ?? [])],
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: color ? color[index % color.length] : "#50C878",
      backgroundColor: color ? color[index % color.length] : "#50C878",
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.2,
    })),
  };

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: aspectRatio,
    // responsive: true,
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
    interaction: {
      intersect: false,
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

  return (
    <div className={`${height}`}>
      <Line data={modifiedData} options={options} />
    </div>
  );
};

export default LineChart;
