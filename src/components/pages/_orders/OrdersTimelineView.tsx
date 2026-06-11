import * as React from "react";
import {
  Timeline,
  TimelineCurrentTime,
  TimelineHeader,
  TimelineProvider,
  TimelineRow,
  TimelineSlot,
  TimelineSlotContent,
  TimelineSlotLabel
} from "@/components/timeline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OrderRecord = {
  id?: number | string;
  status?: string;
  createdAt?: string;
  date?: string;
  invoice?: { total?: number };
  totalPriceAfterDiscount?: number;
  Delivery?: { User?: { name?: string } };
  Address?: { title?: string };
};

type OrdersTimelineViewProps = {
  orders: OrderRecord[];
};

const STATUS_CONFIG = [
  { id: "PENDING", label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "PREPARING", label: "Preparing", className: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "READY_PICKUP", label: "Ready", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "ON_THE_WAY", label: "On the way", className: "bg-violet-100 text-violet-700 border-violet-200" },
  { id: "DELIVERED", label: "Delivered", className: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "CANCELLED", label: "Cancelled", className: "bg-rose-100 text-rose-700 border-rose-200" },
  { id: "OTHER", label: "Other", className: "bg-muted text-muted-foreground border-border" }
];

const DEFAULT_DURATION_MINUTES = 45;

const statusDurationMap: Record<string, number> = {
  PENDING: 45,
  PREPARING: 60,
  READY_PICKUP: 30,
  ON_THE_WAY: 50,
  DELIVERED: 30,
  CANCELLED: 20,
  OTHER: 30
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export default function OrdersTimelineView({ orders }: OrdersTimelineViewProps) {
  const today = React.useMemo(() => new Date(), []);

  const todaysOrders = React.useMemo(() => {
    return (orders || []).filter(order => {
      const rawDate = order.createdAt ?? order.date;
      if (!rawDate) return false;
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) return false;
      return isSameDay(parsedDate, today);
    });
  }, [orders, today]);

  const { rows, slots, totalRevenue, totalOrders } = React.useMemo(() => {
    const statusMap = new Map(STATUS_CONFIG.map(status => [status.id, { ...status, count: 0 }]));
    const timelineSlots = [] as {
      id: string;
      rowId: string;
      startTime: string;
      duration: number;
      title: string;
      subtitle: string;
      statusId: string;
    }[];

    let revenue = 0;

    todaysOrders.forEach(order => {
      const rawDate = order.createdAt ?? order.date;
      if (!rawDate) return;
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) return;

      const statusId = STATUS_CONFIG.some(status => status.id === order.status) ? order.status! : "OTHER";
      const displayStatus = statusMap.get(statusId) ?? statusMap.get("OTHER");
      if (displayStatus) {
        displayStatus.count += 1;
      }

      const total = order.invoice?.total ?? order.totalPriceAfterDiscount ?? 0;
      revenue += Number(total) || 0;

      const id = String(order.id ?? `${statusId}-${parsedDate.getTime()}`);
      const title = `Order #${order.id ?? "-"}`;
      const subtitleParts = [order.Delivery?.User?.name, order.Address?.title].filter(Boolean);
      const subtitle = subtitleParts.length > 0 ? subtitleParts.join(" · ") : "No assigned delivery";

      timelineSlots.push({
        id,
        rowId: statusId,
        startTime: formatTime(parsedDate),
        duration: statusDurationMap[statusId] ?? DEFAULT_DURATION_MINUTES,
        title,
        subtitle,
        statusId
      });
    });

    const timelineRows = Array.from(statusMap.values()).map(status => ({
      id: status.id,
      label: status.label,
      count: status.count,
      className: status.className
    }));

    return {
      rows: timelineRows,
      slots: timelineSlots,
      totalRevenue: revenue,
      totalOrders: todaysOrders.length
    };
  }, [todaysOrders]);

  return (
    <Card className="border-muted/60 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">Orders calendar</CardTitle>
          <p className="text-sm text-muted-foreground">
            Timeline view of today&apos;s orders, grouped by status and scheduled time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{today.toLocaleDateString(undefined, { weekday: "long" })}</Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{totalOrders} orders</Badge>
          <Badge variant="outline">Revenue {totalRevenue.toLocaleString()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 py-12 text-center">
            <span className="text-sm font-medium">No orders scheduled for today.</span>
            <span className="text-xs text-muted-foreground">New orders will appear on the timeline automatically.</span>
          </div>
        ) : (
          <TimelineProvider
            config={{ startHour: 8, endHour: 22, snapIntervalMinutes: 15, columnWidth: 160 }}
            className="rounded-xl border border-border/60 bg-background"
          >
            <Timeline slots={slots} rows={rows} className="rounded-xl">
              <TimelineHeader columnLabel={<span className="text-xs uppercase text-muted-foreground">Status</span>} />
              <TimelineCurrentTime nowLabel="Now" />
              <div className="min-w-full">
                {rows.map(row => (
                  <TimelineRow
                    key={row.id}
                    row={row}
                    slots={slots}
                    className="bg-background/60"
                    renderRowHeader={() => (
                      <div className="flex w-full items-center justify-between px-3 py-2">
                        <span className="text-xs font-semibold text-muted-foreground">{row.label}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            row.className
                          )}
                        >
                          {row.count}
                        </span>
                      </div>
                    )}
                  >
                    {slot => (
                      <TimelineSlot
                        slot={slot}
                        className={cn(
                          "border bg-gradient-to-br p-2 text-foreground",
                          slot.statusId === "PENDING" && "from-amber-100/80 to-amber-200/80 border-amber-200",
                          slot.statusId === "PREPARING" && "from-blue-100/80 to-blue-200/80 border-blue-200",
                          slot.statusId === "READY_PICKUP" && "from-emerald-100/80 to-emerald-200/80 border-emerald-200",
                          slot.statusId === "ON_THE_WAY" && "from-violet-100/80 to-violet-200/80 border-violet-200",
                          slot.statusId === "DELIVERED" && "from-slate-100/80 to-slate-200/80 border-slate-200",
                          slot.statusId === "CANCELLED" && "from-rose-100/80 to-rose-200/80 border-rose-200",
                          slot.statusId === "OTHER" && "from-muted/60 to-muted border-border"
                        )}
                      >
                        <TimelineSlotLabel className="text-[11px] font-semibold">
                          {slot.title}
                        </TimelineSlotLabel>
                        <TimelineSlotContent className="text-[10px] text-muted-foreground">
                          {slot.subtitle}
                        </TimelineSlotContent>
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {slot.startTime} · {slot.duration} min
                        </div>
                      </TimelineSlot>
                    )}
                  </TimelineRow>
                ))}
              </div>
            </Timeline>
          </TimelineProvider>
        )}
      </CardContent>
    </Card>
  );
}
