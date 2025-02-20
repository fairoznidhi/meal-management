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
  import { ChartData } from "chart.js";
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
  };
  
  const LineChart: React.FC<LineChartProps> = ({ data, color, height }) => {
    const modifiedData = {
      labels: [...(data?.labels ?? [])],
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: color ? color[index % color.length] : "blue",
        backgroundColor: color ? color[index % color.length] + "50" : "blue50", // Transparent fill color
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    };
  
    const options = {
      layout: {
        autoPadding: false,
        padding: 0,
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
            boxHeight: 20,
            boxWidth: 20,
            padding: 0,
            borderRadius: 2,
          },
        },
      },
    };
  
    console.log(modifiedData);
    return (
      <div className={`${height}`}>
        <Line data={modifiedData} options={options}></Line>
      </div>
    );
  };
  
  export default LineChart;
  