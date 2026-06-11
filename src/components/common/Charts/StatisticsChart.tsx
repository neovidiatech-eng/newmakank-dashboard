import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsChart: React.FC<{
  labels: string[];
  dataValues: number[];
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  noDataMessage?: string;
  id?: string;
}> = ({
  labels,
  dataValues,
  title,
  backgroundColor = "rgba(75, 192, 192, 0.6)",
  borderColor = "rgba(75, 192, 192, 1)",
  noDataMessage,
  id = `chart-${Math.random().toString(36).substring(2, 9)}`
}) => {
  const t = useTranslations();
  const chartRef = useRef<ChartJS | null>(null);

  // Cleanup function to destroy chart instance on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!dataValues || dataValues.length === 0 || !labels || labels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="w-12 h-12 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        <p className="text-gray-600 font-medium">{noDataMessage || t("No data available")}</p>
        <p className="text-gray-500 text-sm mt-1">
          {t("Try adjusting your filters or check back later")}
        </p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: t(title),
        data: dataValues,
        backgroundColor,
        borderColor,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: t(title)
      }
    }
  };

  return (
    <Bar
      data={data}
      options={options}
      id={id}
      ref={reference => {
        if (reference) {
          chartRef.current = reference;
        }
      }}
    />
  );
};

export default StatisticsChart;
