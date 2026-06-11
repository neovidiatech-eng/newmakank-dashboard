import { ChartContainer } from "@/components/ui/chart";
import * as Recharts from "recharts";

type Point = { date: string; value: number };

export default function SmallChart({
    data,
    title,
    color = "hsl(var(--chart-1))"
}: {
    data: Point[];
    title?: string;
    color?: string;
}) {
    // ChartContainer expects a config mapping keys to color values.
    const config = { value: { label: title || "Value", color } };

    return (
        <div className="col-span-1">
            <div className="rounded-md border bg-background p-3">
                {title ? <div className="mb-2 text-sm font-medium">{title}</div> : null}
                <ChartContainer config={config} style={{ height: 180 }}>
                    <Recharts.LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                        <Recharts.CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                        <Recharts.XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <Recharts.YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Recharts.Tooltip />
                        <Recharts.Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                        />
                    </Recharts.LineChart>
                </ChartContainer>
            </div>
        </div>
    );
}
