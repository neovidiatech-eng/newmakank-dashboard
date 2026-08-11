"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchParams, usePathname } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";

interface DeliveryDateFilterToolbarProps {
  currentFromDate?: string;
  currentToDate?: string;
  currentDate?: string;
}

export default function DeliveryDateFilterToolbar({
  currentFromDate,
  currentToDate,
  currentDate
}: DeliveryDateFilterToolbarProps): JSX.Element {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  const pathname = usePathname();

  const [fromDate, setFromDate] = useState<string>(currentFromDate || currentDate || "");
  const [toDate, setToDate] = useState<string>(currentToDate || currentDate || "");
  const [activePreset, setActivePreset] = useState<string>(
    currentFromDate || currentToDate || currentDate ? "CUSTOM" : "TODAY"
  );

  const todayStr = new Date().toISOString().split("T")[0];

  const updateRangeParams = (fromVal: string, toVal: string, presetName: string) => {
    setActivePreset(presetName);
    setFromDate(fromVal);
    setToDate(toVal);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("date");

    if (fromVal) {
      params.set("fromDate", fromVal);
    } else {
      params.delete("fromDate");
    }

    if (toVal) {
      params.set("toDate", toVal);
    } else {
      params.delete("toDate");
    }

    navigate(`${pathname}?${params.toString()}`);
  };

  const handleToday = () => {
    updateRangeParams(todayStr, todayStr, "TODAY");
  };

  const handleLast7Days = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const startStr = d.toISOString().split("T")[0];
    updateRangeParams(startStr, todayStr, "WEEK");
  };

  const handleLast30Days = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    const startStr = d.toISOString().split("T")[0];
    updateRangeParams(startStr, todayStr, "MONTH");
  };

  const handleAllTime = () => {
    updateRangeParams("", "", "ALL");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRangeParams(fromDate, toDate, "CUSTOM");
  };

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>تصفية إحصائيات وحسابات المندوب (من وإلى)</span>
          </div>
          {(fromDate || toDate || activePreset !== "TODAY") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة ضبط لليوم
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={activePreset === "TODAY" ? "default" : "outline"}
            onClick={handleToday}
            className="text-xs h-8"
          >
            اليوم (Today)
          </Button>
          <Button
            size="sm"
            variant={activePreset === "WEEK" ? "default" : "outline"}
            onClick={handleLast7Days}
            className="text-xs h-8"
          >
            آخر 7 أيام
          </Button>
          <Button
            size="sm"
            variant={activePreset === "MONTH" ? "default" : "outline"}
            onClick={handleLast30Days}
            className="text-xs h-8"
          >
            آخر 30 يوم
          </Button>
          <Button
            size="sm"
            variant={activePreset === "ALL" ? "default" : "outline"}
            onClick={handleAllTime}
            className="text-xs h-8"
          >
            الكل (All Time)
          </Button>
        </div>

        {/* Custom Date Range Inputs (من - إلى) */}
        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">من يوم:</span>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 text-xs w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">إلى يوم:</span>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 text-xs w-40"
            />
          </div>
          <Button type="submit" size="sm" className="h-9 text-xs gap-1.5">
            <Search className="h-3.5 w-3.5" />
            تطبيق الفلتر
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
