"use client";

import React, { useState } from "react";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, RotateCcw, ShoppingBag } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface DriverOrdersTableProps {
  deliveryId: number;
}

export default function DriverOrdersTable({ deliveryId }: DriverOrdersTableProps): JSX.Element {
  const t = useTranslations();
  const columns = OrdersColumns();

  // Date Range Filtering state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [datePreset, setDatePreset] = useState<string>("ALL");

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const today = new Date().toISOString().split("T")[0];

    if (preset === "TODAY") {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === "WEEK") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split("T")[0]);
      setEndDate(today);
    } else if (preset === "MONTH") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split("T")[0]);
      setEndDate(today);
    } else if (preset === "ALL") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleResetDates = () => {
    setDatePreset("ALL");
    setStartDate("");
    setEndDate("");
  };

  const extraParams: Record<string, unknown> = {
    deliveryId
  };
  if (startDate) {
    extraParams.clientStartDate = startDate;
  }
  if (endDate) {
    extraParams.clientEndDate = endDate;
  }

  return (
    <div className="space-y-4">
      {/* Date Filter Bar */}
      <Card className="border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>تصفية طلبات المندوب حسب التاريخ</span>
            </div>
            {(startDate || endDate || datePreset !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetDates}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                إعادة ضبط
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={datePreset === "TODAY" ? "default" : "outline"}
              onClick={() => handlePresetChange("TODAY")}
              className="text-xs h-8"
            >
              اليوم
            </Button>
            <Button
              size="sm"
              variant={datePreset === "WEEK" ? "default" : "outline"}
              onClick={() => handlePresetChange("WEEK")}
              className="text-xs h-8"
            >
              آخر 7 أيام
            </Button>
            <Button
              size="sm"
              variant={datePreset === "MONTH" ? "default" : "outline"}
              onClick={() => handlePresetChange("MONTH")}
              className="text-xs h-8"
            >
              آخر 30 يوم
            </Button>
            <Button
              size="sm"
              variant={datePreset === "ALL" ? "default" : "outline"}
              onClick={() => handlePresetChange("ALL")}
              className="text-xs h-8"
            >
              الكل (All Time)
            </Button>
          </div>

          {/* Custom Date Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0 min-w-8">من:</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset("CUSTOM");
                }}
                className="h-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0 min-w-8">إلى:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset("CUSTOM");
                }}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table with Pagination */}
      <TableWithQuery
        endPoint={["orders"]}
        columns={columns as any}
        cardHeader="جميع طلبات المندوب (مقسمة لصفحات)"
        extraParams={extraParams}
        tableActions={{
          onInfo: "/orders",
          fixedActions: true
        }}
        filters={[
          {
            name: "status",
            type: "select",
            width: 3,
            label: "حالة الطلب",
            options: [
              { label: "تم التوصيل (DELIVERED)", value: "DELIVERED" },
              { label: "في الطريق (ON_THE_WAY)", value: "ON_THE_WAY" },
              { label: "جاهز للاستلام (READY_PICKUP)", value: "READY_PICKUP" },
              { label: "جاري التحضير (PREPARING)", value: "PREPARING" },
              { label: "مرفوض (REJECTED)", value: "REJECTED" },
              { label: "ملغى (CANCELLED)", value: "CANCELLED" }
            ]
          }
        ]}
      />
    </div>
  );
}
