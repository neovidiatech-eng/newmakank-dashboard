import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const barChartConfig = {
  race: {
    label: "race",
    color: "hsl(var(--chart-1))"
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))"
  },
  label: {
    color: "hsl(var(--background))"
  }
} satisfies ChartConfig;

interface ChartData {
  type: string;
  value: number;
  color?: string;
}

interface BarChartComponentProps {
  data: ChartData[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  const chartData = data?.map(item => ({
    month: item.type,
    race: item.value,
    mobile: item.color ? parseInt(item.color, 10) : 0
  }));

  return (
    <Card>
      <CardContent>
        <ChartContainer config={barChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              color="black"
              className="text-black"
              axisLine={true}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="race" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="race" layout="vertical" fill="var(--color-race)" radius={4}>
              <LabelList
                dataKey="month"
                position="left"
                offset={-45}
                color="black"
                className="text-black"
                fontSize={12}
              />
              <LabelList
                dataKey="race"
                position="right"
                offset={10}
                className="text-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
        </div>
        {/* <div className="leading-none text-muted-foreground">
          Showing Top visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
};

export default BarChartComponent;
