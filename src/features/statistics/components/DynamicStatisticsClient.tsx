import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { endpointName, endpoints } from "@/utils/endpoints";
import {
  Activity,
  AreaChart as AreaChartIcon,
  ArrowDownAZ,
  ArrowUpAZ,
  BarChart3,
  Database,
  Filter,
  Hash,
  LineChart as LineChartIcon,
  Loader2,
  PieChart as PieChartIcon,
  Search
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { toast } from "sonner";

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
  "#84cc16", // lime-500
  "#0ea5e9", // sky-500
  "#d946ef" // fuchsia-500
];

export function DynamicStatisticsClient() {
  const [endpoint, setEndpoint] = useState<string>("");
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [xAxisKey, setXAxisKey] = useState<string>("");
  const [yAxisKey, setYAxisKey] = useState<string>("");
  const [chartType, setChartType] = useState<string>("Bar");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState<string>("all");

  const allowedEndpoints = [
    "userStatistics",
    "storeStatistics",
    "subscriptionStatistics",
    "accountingStatistics",
    "ordersStatistics",
    "transactionsStatistics",
    "statistics"
  ];

  const endpointOptions = Object.keys(endpoints)
    .filter(key => allowedEndpoints.includes(key) || key.includes("Statistics"))
    .sort((a, b) => a.localeCompare(b));

  const handleFetch = async () => {
    if (!endpoint) {
      toast.error("Please select an endpoint.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetchHelper({
        endPoint: [endpoint as endpointName],
        method: "GET"
      });

      if (res.success) {
        let fetchedData = res.data;
        // If the data is not an array, try to find an array property
        if (!Array.isArray(fetchedData)) {
          if (typeof fetchedData === "object" && fetchedData !== null) {
            const possibleArrayKeys = Object.keys(fetchedData).filter(k =>
              Array.isArray(fetchedData[k])
            );
            if (possibleArrayKeys.length > 0) {
              fetchedData = fetchedData[possibleArrayKeys[0]];
            } else {
              // Wrap single object in array if no arrays are nested
              fetchedData = [fetchedData];
            }
          } else {
            toast.error("Endpoint did not return usable charting data.");
            setLoading(false);
            return;
          }
        }

        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setData(fetchedData);
          const keys = Object.keys(fetchedData[0]).filter(
            k => typeof fetchedData[0][k] !== "object"
          );
          setAvailableKeys(keys);
          setXAxisKey(keys[0] || "");

          // Pick the first numeric field as y-axis by default, if any
          const numericKey = keys.find(k => typeof fetchedData[0][k] === "number");
          setYAxisKey(numericKey || keys[1] || keys[0] || "");
          setSortBy(numericKey || "none");

          // Smart Chart Type Selection based on data characteristics
          if (fetchedData.length > 15) {
            setChartType("Area");
          } else if (fetchedData.length <= 5 && fetchedData.length > 1 && !numericKey) {
            setChartType("Pie");
          } else {
            setChartType("Bar");
          }

          toast.success("Data fetched successfully.");
        } else {
          setData([]);
          setAvailableKeys([]);
          toast.info("Endpoint returned empty data.");
        }
      } else {
        toast.error(res.message || "Failed to fetch data.");
      }
    } catch (error) {
      toast.error("Error fetching data.", { description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const getProcessedData = () => {
    if (!data) return [];

    let processed = [...data];

    // 1. Search
    if (searchQuery && xAxisKey) {
      processed = processed.filter(item =>
        String(item[xAxisKey]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Sort
    if (sortBy !== "none") {
      processed.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        } else {
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          if (strA < strB) return sortOrder === "asc" ? -1 : 1;
          if (strA > strB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    // 3. Limit
    if (limit !== "all") {
      processed = processed.slice(0, parseInt(limit));
    }

    return processed;
  };

  const processedData = getProcessedData();

  const renderChart = () => {
    if (!data || data.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <Database className="w-12 h-12 opacity-20" />
          <p>No data available to visualize.</p>
        </div>
      );

    if (!xAxisKey || !yAxisKey)
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <Activity className="w-12 h-12 opacity-20" />
          <p>Please select X and Y axes to generate the chart.</p>
        </div>
      );

    if (processedData.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <Filter className="w-12 h-12 opacity-20" />
          <p>No data matches the current filters.</p>
        </div>
      );

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-card/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl flex flex-col gap-1 z-50">
            <p className="font-semibold text-foreground mb-1 border-b border-border/40 pb-1">
              {label}
            </p>
            {payload.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: p.color || p.fill || COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{p.name}:</span>
                <span className="font-medium text-foreground">{p.value}</span>
              </div>
            ))}
          </div>
        );
      }
      return null;
    };

    switch (chartType) {
      case "Bar":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart {...commonProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border) / 0.5)"
              />
              <XAxis
                dataKey={xAxisKey}
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted) / 0.4)", radius: 4 }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey={yAxisKey}
                fill="url(#colorGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {processedData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "Line":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart {...commonProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border) / 0.5)"
              />
              <XAxis
                dataKey={xAxisKey}
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke={COLORS[0]}
                strokeWidth={4}
                dot={{ fill: COLORS[0], r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "Area":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border) / 0.5)"
              />
              <XAxis
                dataKey={xAxisKey}
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                stroke="hsl(var(--foreground) / 0.7)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey={yAxisKey}
                stroke={COLORS[0]}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorArea)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "Pie":
        return (
          <ResponsiveContainer width="100%" height={450}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Pie
                data={processedData}
                nameKey={xAxisKey}
                dataKey={yAxisKey}
                cx="50%"
                cy="50%"
                innerRadius={80} // Made it a donut chart for a more modern look
                outerRadius={160}
                paddingAngle={3}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return percent > 0.05 ? (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs font-semibold drop-shadow-md"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  ) : null;
                }}
                animationDuration={1000}
              >
                {processedData?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/60 bg-card/80 shadow-md backdrop-blur overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Data Source Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/20 p-4 rounded-xl border border-border/40">
            <div className="space-y-2 flex-grow w-full">
              <Label className="text-muted-foreground ml-1">Select System Endpoint</Label>
              <Select value={endpoint} onValueChange={setEndpoint}>
                <SelectTrigger className="w-full bg-background shadow-sm h-12 rounded-lg border-border/60 focus:ring-indigo-500">
                  <SelectValue placeholder="Browse available endpoints..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {endpointOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="cursor-pointer">
                      <div className="flex flex-col">
                        <span className="font-medium">{opt}</span>
                        <span className="text-xs text-muted-foreground opacity-80">
                          {(endpoints as any)[opt]}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleFetch}
              disabled={loading || !endpoint}
              className="w-full md:w-auto min-w-[140px] h-12 rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Search className="mr-2 h-5 w-5" />
              )}
              {loading ? "Fetching..." : "Fetch Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur transition-all duration-500 animate-in fade-in zoom-in-95">
          <CardHeader className="pb-4 border-b border-border/40 mb-4 bg-muted/10">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Visualization Explorer
              </CardTitle>

              <div className="flex items-center max-w-full overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/40 shrink-0">
                  <button
                    onClick={() => setChartType("Bar")}
                    className={cn(
                      "px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      chartType === "Bar"
                        ? "bg-background shadow-sm text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <BarChart3 className={cn("w-4 h-4", chartType === "Bar" && "animate-pulse")} />
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType("Line")}
                    className={cn(
                      "px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      chartType === "Line"
                        ? "bg-background shadow-sm text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <LineChartIcon
                      className={cn("w-4 h-4", chartType === "Line" && "animate-pulse")}
                    />
                    Line
                  </button>
                  <button
                    onClick={() => setChartType("Area")}
                    className={cn(
                      "px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      chartType === "Area"
                        ? "bg-background shadow-sm text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <AreaChartIcon
                      className={cn("w-4 h-4", chartType === "Area" && "animate-pulse")}
                    />
                    Area
                  </button>
                  <button
                    onClick={() => setChartType("Pie")}
                    className={cn(
                      "px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      chartType === "Pie"
                        ? "bg-background shadow-sm text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <PieChartIcon
                      className={cn("w-4 h-4", chartType === "Pie" && "animate-pulse")}
                    />
                    Pie
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Axes Mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent rounded-2xl border border-border/50">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs">
                      X
                    </span>
                    X-Axis Key (Categories)
                  </Label>
                  <Select value={xAxisKey} onValueChange={setXAxisKey}>
                    <SelectTrigger className="bg-background shadow-sm h-11 rounded-lg border-border/60">
                      <SelectValue placeholder="Select X-Axis Key" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKeys.map(k => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs">
                      Y
                    </span>
                    Y-Axis Key (Values)
                  </Label>
                  <Select value={yAxisKey} onValueChange={setYAxisKey}>
                    <SelectTrigger className="bg-background shadow-sm h-11 rounded-lg border-border/60">
                      <SelectValue placeholder="Select Y-Axis Key" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKeys.map(k => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-muted/30 rounded-2xl border border-border/40">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    Search
                  </Label>
                  <Input
                    placeholder={`Search ${xAxisKey || "data"}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-10 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    {sortOrder === "asc" ? (
                      <ArrowUpAZ className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownAZ className="w-3.5 h-3.5" />
                    )}
                    Sort By
                  </Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-background h-10 w-full flex-grow">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableKeys.map(k => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 shrink-0 bg-background"
                      onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
                      disabled={sortBy === "none"}
                    >
                      {sortOrder === "asc" ? (
                        <ArrowUpAZ className="w-4 h-4" />
                      ) : (
                        <ArrowDownAZ className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Limit Results
                  </Label>
                  <Select value={limit} onValueChange={setLimit}>
                    <SelectTrigger className="bg-background h-10">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data</SelectItem>
                      <SelectItem value="5">Top 5</SelectItem>
                      <SelectItem value="10">Top 10</SelectItem>
                      <SelectItem value="25">Top 25</SelectItem>
                      <SelectItem value="50">Top 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 pb-2 px-2 overflow-x-auto min-h-[480px] bg-background/50 p-6 rounded-2xl border border-border/40 shadow-inner relative">
                {renderChart()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
