import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";

const OrderStatusChart = ({ data }: { data: Array<Record<string, number>> }) => {
  const statuses = data?.map(item => Object.keys(item)[0]);
  const counts = data?.map(item => Object.values(item)[0]);

  const chartData = {
    labels: statuses.map(status => status.replace(/_/g, " ")),
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "right" as const }
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
