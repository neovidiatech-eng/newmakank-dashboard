import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useTranslations } from "@/lib/i18n";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, TimeScale, Tooltip, Legend);

const OrdersLineChart = ({ data }) => {
  const chartData = {
    labels: data.map(point => new Date(point.x).toISOString()), // مثل: 04/07/2025
    datasets: [
      {
        label: "Ratings",
        data: data.map(point => point.y),
        fill: true,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        scales: {
          x: {
            type: "timeseries",
            time: {
              unit: "day",
              tooltipFormat: "dd/MM/yyyy HH:mm" // تنسيق التاريخ في التولتيب
            },
            title: {
              display: true,
              text: "Date"
            }
          },
          y: {
            beginAtZero: true,
            min: 0,
            max: 5,
            title: {
              display: true,
              text: "Orders"
            }
          }
        }
      }
    }
  };
  const t = useTranslations();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Rating Over Time")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

export default OrdersLineChart;
