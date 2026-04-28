import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChart() {
  const data = {
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        label: "Sample Dataset",
        data: [12, 19, 3, 5, 8],
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <div className="chart">
      <Bar data={data} />
    </div>
  );
}

export default BarChart;
