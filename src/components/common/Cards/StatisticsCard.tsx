import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";

interface StatisticsCardProps {
  className?: string;
  iconBackgroundColor?: string;
  backgroundColor?: string;
  value?: number | string;
  title: string;
  bgColor?: string;
  icon?: React.ReactElement;
  prefix?: string;
  isLoading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatisticsCard({
  value,
  title,
  icon,
  className,
  bgColor,
  prefix,
  isLoading = false,
  trend
}: StatisticsCardProps): JSX.Element {
  const t = useTranslations();

  return (
    <Card
      style={{ backgroundColor: bgColor }}
      className={cn(
        "w-full border-none shadow-card transition-all hover:shadow-card-hover duration-200",
        className
      )}
    >
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          {icon && <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>}
          <div>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-3xl font-bold text-card-foreground">
                {prefix && <span className="text-muted-foreground text-sm mr-1">{prefix}</span>}
                {value}
              </div>
            )}
            <div className="mt-1 text-sm font-medium text-muted-foreground">{t(`${title}`)}</div>
          </div>
        </div>
        {/* Trend indicator */}
        {trend && !isLoading && (
          <div className="hidden md:flex items-center gap-1">
            <div className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </div>
            <div
              className={`h-8 w-10 rounded-md ${trend.isPositive ? "bg-green-100" : "bg-red-100"}`}
            ></div>
          </div>
        )}
        {/* Placeholder for when trend is not provided */}
        {!trend && (
          <div className="hidden md:block">
            <div className="h-10 w-16 rounded-md bg-muted/50"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
