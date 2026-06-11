import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/lib/i18n";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
  visitors: {
    label: "Count"
  },
  FUND: {
    label: "Fund",
    color: "hsl(var(--chart-1))"
  },
  JOCKEY: {
    label: "Jockey",
    color: "hsl(var(--chart-2))"
  },
  TRAINER: {
    label: "Trainer",
    color: "hsl(var(--chart-3))"
  },
  ADMIN: {
    label: "Admin",
    color: "hsl(var(--chart-4))"
  },
  OWNER: {
    label: "Owner",
    color: "hsl(var(--chart-5))"
  }
} satisfies ChartConfig;

interface ChartComponentProps {
  data: {
    type: string;
    value: string | number;
    color?: string;
  }[];
  title?: string;
  isLoading?: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, title, isLoading = false }) => {
  const t = useTranslations();
  // Define colors if not provided
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ];

  const chartData = data?.map((item, index) => ({
    browser: item.type,
    visitors: parseInt(item.value.toString(), 10) || 0,
    fill: item.color || colors[index % colors.length],
    color: item.color || colors[index % colors.length]
  }));

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        {title && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-col gap-2 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between w-full">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle empty data case
  if (!data || data?.length === 0) {
    return (
      <Card className="flex items-center justify-center h-60">
        <CardContent>
          <p className="text-muted-foreground">{t("No data available")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t("Total")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex flex-col gap-2">
          {data?.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium">{t(item.type)}</span>
              <span className="mx-2">|</span>
              <span className="text-muted-foreground">
                {t("Count")}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
export default ChartComponent;
