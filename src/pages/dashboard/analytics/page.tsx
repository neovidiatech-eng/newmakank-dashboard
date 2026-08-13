"use client";

import React, { useState } from "react";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import UsersColumns from "../users/UsersColumns";
import StoresColumns from "../stores/StoresColumns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Bike, 
  ShoppingBag, 
  Users, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Calendar as CalendarIcon,
  RotateCcw,
  Clock
} from "lucide-react";
import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import { PriceAmount } from "@/components/PriceAmount";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useTranslations } from "@/lib/i18n";
import { useSearchParams, useRouter, usePathname } from "@/lib/navigation";

export default function AnalyticsPage(): JSX.Element {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlTab = searchParams.get("tab") as "drivers" | "stores" | "customers" | null;
  const [activeTabState, setActiveTabState] = useState<"drivers" | "stores" | "customers">("drivers");
  const activeTab = (urlTab === "drivers" || urlTab === "stores" || urlTab === "customers") ? urlTab : activeTabState;

  const handleTabChange = (newTab: "drivers" | "stores" | "customers") => {
    setActiveTabState(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Date Range Filtering state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [datePreset, setDatePreset] = useState<string>("ALL"); // 'TODAY', 'WEEK', 'MONTH', 'ALL', 'CUSTOM'

  // Date preset handler
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

  // Build extraParams with includeStats and optional date range
  const dateParams: Record<string, unknown> = {
    includeStats: true
  };
  if (startDate) {
    dateParams.fromDate = startDate;
    dateParams.clientStartDate = startDate;
  }
  if (endDate) {
    dateParams.toDate = endDate;
    dateParams.clientEndDate = endDate;
  }

  // Fetch driver summary statistics safely via hook
  const { data: driverRes } = useApiQuery({
    queryKey: ["deliverySummaryData"],
    endPoint: ["delivery"],
    params: { limit: 1, includeStats: true }
  });

  const driverSummary = driverRes?.data?.summary || driverRes?.summary || null;

  // Columns definition for Driver Analytics
  const driverColumns = [
    {
      id: "driverInfo",
      header: () => <IconHeader columnKey="Driver" />,
      cell: ({ row }: any) => (
        <EntityInfoCell
          image={row.original.image as string}
          name={row.original.name as string}
          email={row.original.email as string}
          phone={row.original.phone as string}
        />
      )
    },
    {
      id: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row }: any) => {
        const isOnShift = Boolean(row.original.isOnShift);
        const isActive = Boolean(row.original.isActive ?? row.original.active);
        const isAvailable = Boolean(row.original.isAvailable ?? row.original.availableNow);
        return (
          <div className="flex flex-col gap-1 items-start">
            {isOnShift ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("On Shift") || "على الشيفت"}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {t("Off Shift") || "خارج الشيفت"}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>{isActive ? "✓ نشط" : "✗ معطل"}</span>
              <span>•</span>
              <span>{isAvailable ? "متاح" : "مشغول"}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: "activeOrders",
      header: () => <IconHeader columnKey="Active Orders" />,
      cell: ({ row }: any) => {
        const stats = row.original.orderStats;
        const active = stats?.activeOrders ?? 0;
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant={active > 0 ? "default" : "secondary"} className="font-bold text-xs px-2 py-0.5">
              {active} {t("Orders") || "طلبات"}
            </Badge>
          </div>
        );
      }
    },
    {
      id: "deliveries",
      header: () => <IconHeader columnKey="Deliveries" />,
      cell: ({ row }: any) => {
        const stats = row.original.orderStats;
        if (!stats) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-0.5 text-xs py-1">
            <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t("Today") || "اليوم"}: {stats.todayDelivered ?? 0}</span>
            </div>
            <div className="text-muted-foreground text-[11px]">
              {t("Total") || "الكلي"}: {stats.totalDelivered ?? 0}
            </div>
          </div>
        );
      }
    },
    {
      id: "earnings",
      header: () => <IconHeader columnKey="Earnings" />,
      cell: ({ row }: any) => {
        const stats = row.original.orderStats;
        if (!stats) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-0.5 text-xs py-1">
            <div className="font-bold text-amber-600 dark:text-amber-400">
              <PriceAmount value={stats.todayEarnings ?? 0} /> <span className="text-[10px] font-normal">{t("Today") || "اليوم"}</span>
            </div>
            <div className="text-muted-foreground text-[11px]">
              {t("Total") || "الكلي"}: <PriceAmount value={stats.totalEarnings ?? 0} />
            </div>
          </div>
        );
      }
    },
    {
      id: "rejected",
      header: () => <IconHeader columnKey="Rejected" />,
      cell: ({ row }: any) => {
        const stats = row.original.orderStats;
        const rejected = stats?.rejectedAssignments ?? 0;
        return (
          <span className={`text-xs font-semibold ${rejected > 0 ? "text-rose-500" : "text-muted-foreground"}`}>
            {rejected} {t("Rejected") || "مرفوض"}
          </span>
        );
      }
    }
  ];

  return (
    <>
      <CustomHeader />
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-primary" />
              {t("activityAnalytics") || "تحليلات النشاط الشاملة 📊"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              مركز موحد لمتابعة الأكثر والأقل نشاطاً والإلغاءات والمبيعات للعملاء والمتاجر والمناديب.
            </p>
          </div>
        </div>

        {/* Date Filter Control Bar */}
        <Card className="border-border bg-card shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 me-2">
                <CalendarIcon className="h-4 w-4" />
                تصفية بالتاريخ:
              </span>
              <Button
                variant={datePreset === "TODAY" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handlePresetChange("TODAY")}
              >
                اليوم
              </Button>
              <Button
                variant={datePreset === "WEEK" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handlePresetChange("WEEK")}
              >
                آخر 7 أيام
              </Button>
              <Button
                variant={datePreset === "MONTH" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handlePresetChange("MONTH")}
              >
                آخر 30 يوم
              </Button>
              <Button
                variant={datePreset === "ALL" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => handlePresetChange("ALL")}
              >
                الكل (All Time)
              </Button>
            </div>

            {/* Custom Date Pickers */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">من:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset("CUSTOM");
                  }}
                  className="h-8 w-36 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">إلى:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset("CUSTOM");
                  }}
                  className="h-8 w-36 text-xs"
                />
              </div>

              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleResetDates}
                >
                  <RotateCcw className="h-3.5 w-3.5 me-1" />
                  إعادة ضبط
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Driver Top Summary KPI Cards */}
        {driverSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">المناديب على الشيفت الآن</p>
                  <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                    {driverSummary.onShiftDrivers ?? 0} <span className="text-xs font-normal text-muted-foreground">/ {driverSummary.totalDrivers ?? 0}</span>
                  </h3>
                </div>
                <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
                  <Zap className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-sky-200 dark:border-sky-950 bg-sky-50/50 dark:bg-sky-950/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-sky-800 dark:text-sky-300">توصيلات اليوم الإجمالية</p>
                  <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100 mt-1">
                    {driverSummary.todayTotalDelivered ?? 0}
                  </h3>
                </div>
                <div className="p-3 bg-sky-500/20 text-sky-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">أرباح التوصيل اليوم</p>
                  <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                    <PriceAmount value={driverSummary.todayTotalEarnings ?? 0} />
                  </h3>
                </div>
                <div className="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
                  <DollarSign className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">إجمالي المناديب المسجلين</p>
                  <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                    {driverSummary.totalDrivers ?? 0}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-500/20 text-indigo-600 rounded-xl">
                  <Bike className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => handleTabChange("drivers")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "drivers"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Bike className="h-4 w-4" />
            <span>تحليلات المناديب (Drivers)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("stores")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "stores"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>تحليلات المتاجر (Stores)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("customers")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "customers"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>تحليلات العملاء (Customers)</span>
          </button>
        </div>

        {/* Tab 1: DRIVERS ANALYTICS */}
        {activeTab === "drivers" && (
          <TableWithQuery
            endPoint={["delivery"]}
            columns={driverColumns as any}
            cardHeader="تحليلات ونشاط المناديب"
            extraParams={dateParams}
            omitParams={["tab"]}
            tableActions={{
              onInfo: "/delivery",
              fixedActions: true
            }}
            filters={[
              { name: "name", type: "text", width: 3 },
              {
                name: "orderFilter",
                type: "select",
                width: 3,
                label: "ترتيب حسب النشاط",
                options: [
                  { label: "الأكثر توصيلاً اليوم 🔥", value: "MOST_TODAY" },
                  { label: "الأكثر توصيلاً كلياً 🏆", value: "MOST_DELIVERED" },
                  { label: "الأعلى أرباحاً اليوم 💰", value: "MOST_EARNINGS" },
                  { label: "الأقل توصيلاً 📉", value: "LEAST_DELIVERED" },
                  { label: "بدون توصيلات (0 أوردر) 🚫", value: "ZERO_DELIVERED" },
                  { label: "الأكثر رفضاً للطلبات ⚠️", value: "MOST_REJECTED" }
                ]
              },
              {
                name: "onShiftOnly",
                type: "select",
                width: 3,
                label: "على الشيفت فقط",
                options: [
                  { label: "نعم (On Shift)", value: "true" },
                  { label: "الكل", value: "false" }
                ]
              },
              {
                name: "zeroOrdersOnly",
                type: "select",
                width: 3,
                label: "بدون أوردرات فقط",
                options: [
                  { label: "نعم", value: "true" },
                  { label: "لا", value: "false" }
                ]
              }
            ]}
          />
        )}

        {/* Tab 2: STORES ANALYTICS */}
        {activeTab === "stores" && (
          <TableWithQuery
            endPoint={["stores"]}
            columns={StoresColumns as any}
            cardHeader="تحليلات ونشاط المتاجر والمطاعم"
            extraParams={dateParams}
            omitParams={["tab"]}
            tableActions={{
              onInfo: "/stores",
              fixedActions: true
            }}
            filters={[
              { name: "name", type: "text", width: 3 },
              {
                name: "orderFilter",
                type: "select",
                width: 3,
                label: "ترتيب حسب المبيعات والطلبات",
                options: [
                  { label: "الأكثر أوردرات 🔥", value: "MOST_ORDERS" },
                  { label: "الأعلى مبيعات ودخلاً 💰", value: "MOST_REVENUE" },
                  { label: "الأقل أوردرات 📉", value: "LEAST_ORDERS" },
                  { label: "بدون أوردرات (0 أوردر) 🚫", value: "ZERO_ORDERS" },
                  { label: "الأكثر إلغاءً/رفضاً ⚠️", value: "MOST_CANCELLED" }
                ]
              },
              {
                name: "zeroOrdersOnly",
                type: "select",
                width: 3,
                label: "بدون أوردرات فقط",
                options: [
                  { label: "نعم", value: "true" },
                  { label: "لا", value: "false" }
                ]
              }
            ]}
          />
        )}

        {/* Tab 3: CUSTOMERS ANALYTICS */}
        {activeTab === "customers" && (
          <TableWithQuery
            endPoint={["users"]}
            columns={UsersColumns as any}
            cardHeader="تحليلات ونشاط العملاء"
            extraParams={{ ...dateParams, roleKey: "CUSTOMER" }}
            omitParams={["tab"]}
            tableActions={{
              onInfo: "/users",
              fixedActions: true
            }}
            filters={[
              { name: "name", type: "text", width: 3 },
              {
                name: "orderFilter",
                type: "select",
                width: 3,
                label: "ترتيب حسب طلبيات العميل",
                options: [
                  { label: "الأكثر طلباً 🔥", value: "MOST_ORDERS" },
                  { label: "الأقل طلباً 📉", value: "LEAST_ORDERS" },
                  { label: "اللي مطلبوش خالص (0 طلب) 🚫", value: "ZERO_ORDERS" },
                  { label: "الأكثر إلغاءً للطلبات ⚠️", value: "MOST_CANCELLED" }
                ]
              },
              {
                name: "zeroOrdersOnly",
                type: "select",
                width: 3,
                label: "بدون طلبات فقط",
                options: [
                  { label: "نعم", value: "true" },
                  { label: "لا", value: "false" }
                ]
              }
            ]}
          />
        )}
      </div>
    </>
  );
}
