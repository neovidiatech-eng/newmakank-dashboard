"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Store, Wallet, TrendingUp, Percent, Banknote, CreditCard,
  Search, Calendar, RefreshCw, Loader2, Handshake, Eye, ArrowUpRight, CheckCircle2
} from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import { apiClient } from "@/lib/axios";
import { Link } from "@/lib/navigation";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";
import { toast } from "sonner";

const imgUrl = getEnv("VITE_API_IMG_URL");

interface SettlementSummary {
  totalPartnerStores: number;
  totalOrdersCount: number;
  totalSales: number;
  totalPlatformCommission: number;
  totalStoreEarnings: number;
  totalCashCollectedByDrivers: number;
  offlinePartnerTotal: number;
  onlinePartnerTotal: number;
}

interface PartnerStoreSettlement {
  storeId: number;
  storeName: { ar: string; en: string } | string;
  storeLogo?: string;
  totalOrdersCount: number;
  totalSales: number;
  totalPlatformCommission: number;
  totalStoreEarnings: number;
  totalCashCollectedByDrivers: number;
  offlinePartnerTotal: number;
  onlinePartnerTotal: number;
  storeWalletBalance: number;
}

export default function PartnerSettlementsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [stores, setStores] = useState<PartnerStoreSettlement[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSettlements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/stores/partner-settlements", {
        params: {
          search: search || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          page,
          limit: 20
        }
      });

      const responseData = response?.data?.data ?? response?.data ?? {};
      const summaryData = responseData.summary ?? null;
      const storesData = Array.isArray(responseData.stores) ? responseData.stores : [];
      
      const normalizedSummary: SettlementSummary | null = summaryData ? {
        totalPartnerStores: Number(summaryData.totalPartnerStores ?? 0),
        totalOrdersCount: Number(summaryData.totalOrdersCount ?? summaryData.totalDeliveredOrders ?? 0),
        totalSales: Number(summaryData.totalSales ?? summaryData.totalProductsValue ?? 0),
        totalPlatformCommission: Number(summaryData.totalPlatformCommission ?? summaryData.totalAdminCommission ?? 0),
        totalStoreEarnings: Number(summaryData.totalStoreEarnings ?? summaryData.netTotalPayableToStores ?? 0),
        totalCashCollectedByDrivers: Number(summaryData.totalCashCollectedByDrivers ?? 0),
        offlinePartnerTotal: Number(summaryData.offlinePartnerTotal ?? 0),
        onlinePartnerTotal: Number(summaryData.onlinePartnerTotal ?? 0),
      } : null;

      const normalizedStores: PartnerStoreSettlement[] = storesData.map((item: any) => ({
        storeId: Number(item.storeId ?? item.id ?? 0),
        storeName: item.storeName ?? item.name ?? "—",
        storeLogo: item.storeLogo ?? item.logo ?? "",
        totalOrdersCount: Number(item.totalOrdersCount ?? item.totalDeliveredOrders ?? 0),
        totalSales: Number(item.totalSales ?? item.totalProductsPrice ?? 0),
        totalPlatformCommission: Number(item.totalPlatformCommission ?? item.totalAdminCommission ?? 0),
        totalStoreEarnings: Number(item.totalStoreEarnings ?? item.netAmountDueToStore ?? 0),
        totalCashCollectedByDrivers: Number(item.totalCashCollectedByDrivers ?? 0),
        offlinePartnerTotal: Number(item.offlinePartnerTotal ?? 0),
        onlinePartnerTotal: Number(item.onlinePartnerTotal ?? 0),
        storeWalletBalance: Number(item.storeWalletBalance ?? item.walletBalance ?? 0)
      }));

      setSummary(normalizedSummary);
      setStores(normalizedStores);
      setTotalCount(response?.data?.meta?.total ?? normalizedStores.length);
    } catch (error: any) {
      console.error("Failed to fetch partner settlements:", error);
      toast.error(error?.response?.data?.message || error?.message || "فشل جلب تقارير تسويات الشركاء");
    } finally {
      setIsLoading(false);
    }
  }, [search, fromDate, toDate, page]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  const getLocalizedStoreName = (name: { ar: string; en: string } | string) => {
    if (!name) return "—";
    if (typeof name === "string") return name;
    return name[locale as "ar" | "en"] || name.ar || name.en || "—";
  };

  return (
    <>
      <CustomHeader />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Handshake className="h-5 w-5" />
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {t("Partner Stores Settlements") || "تقارير وتسويات المطاعم الشريكة"}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("partnerSettlementsDesc") || "متابعة المبيعات الكلية، الصافي المالي للمطاعم الشريكة، عمولات المنصة، وتوزيعات الكاش والأونلاين."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSettlements}
              disabled={isLoading}
              className="gap-2 text-xs border-amber-500/30 hover:bg-amber-500/10"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              {t("Refresh") || "تحديث البيانات"}
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <Card className="border border-border/80 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
              
              {/* Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Search className="h-3.5 w-3.5" />
                  <span>{t("Search Store") || "البحث باسم المطعم"}</span>
                </label>
                <Input
                  type="text"
                  placeholder={t("Enter store name...") || "ابحث باسم المطعم..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("From Date") || "من تاريخ"}</span>
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("To Date") || "إلى تاريخ"}</span>
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={fetchSettlements}
                  size="sm"
                  className="w-full text-xs h-9 gap-1.5 shadow-sm"
                >
                  <Search className="h-3.5 w-3.5" />
                  {t("Apply Filter") || "تطبيق الفلتر"}
                </Button>
                {(search || fromDate || toDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setFromDate("");
                      setToDate("");
                    }}
                    className="text-xs h-9"
                  >
                    {t("Reset") || "إلغاء"}
                  </Button>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Partner Stores */}
          <Card className="border border-border/80 shadow-sm bg-gradient-to-br from-card to-slate-50/50 dark:to-slate-900/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-semibold">{t("Partner Stores") || "المطاعم الشريكة"}</span>
                <Store className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {isLoading ? "—" : summary?.totalPartnerStores ?? stores.length ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {summary?.totalOrdersCount ?? 0} {t("Delivered Orders") || "طلب مكتمل"}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Sales */}
          <Card className="border border-border/80 shadow-sm bg-gradient-to-br from-card to-slate-50/50 dark:to-slate-900/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-semibold">{t("Total Partner Sales") || "إجمالي مبيعات الشركاء"}</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {isLoading ? "—" : `${formatMoney(summary?.totalSales ?? 0)} ج.م`}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  كاش: {formatMoney(summary?.offlinePartnerTotal ?? 0)}
                </span>
                <span>|</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  أونلاين: {formatMoney(summary?.onlinePartnerTotal ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Net Store Earnings (HIGH PRIORITY GREEN) */}
          <Card className="border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-300">
                <span className="text-xs font-bold">{t("Net Store Earnings") || "مستحقات الشركاء (الصافي)"}</span>
                <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {isLoading ? "—" : `${formatMoney(summary?.totalStoreEarnings ?? 0)} ج.م`}
              </p>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80">
                صافي مستحقات المتاجر بعد الخصم والعمولة
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Platform Commission */}
          <Card className="border border-border/80 shadow-sm bg-gradient-to-br from-card to-slate-50/50 dark:to-slate-900/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-semibold">{t("Platform Commission") || "عمولة المنصة"}</span>
                <Percent className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                {isLoading ? "—" : `${formatMoney(summary?.totalPlatformCommission ?? 0)} ج.م`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                أرباح التطبيق المستحقة من مبيعات الشركاء
              </p>
            </CardContent>
          </Card>

          {/* Card 5: Cash Collected By Drivers */}
          <Card className="border border-border/80 shadow-sm bg-gradient-to-br from-card to-slate-50/50 dark:to-slate-900/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-semibold">{t("Cash With Drivers") || "الكاش المحصل مع المندوبين"}</span>
                <Banknote className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {isLoading ? "—" : `${formatMoney(summary?.totalCashCollectedByDrivers ?? 0)} ج.م`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                عهدة الكاش لدى المندوبين للتسوية مع الشركاء
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Detailed Settlements Table */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="p-4 md:p-5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                {t("Partner Stores Settlements List") || "جدول تسويات المطاعم الشريكة التفصيلي"}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {t("Click store details to inspect wallet or settle balances.") || "تفاصيل المبيعات والمستحقات لكل مطعم شريك."}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-semibold text-xs bg-card">
              {stores.length} {t("Stores") || "مطاعم شريكة"}
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100/70 dark:bg-slate-900/80">
                  <TableRow className="text-xs">
                    <TableHead className="py-3">{t("Store") || "المطعم الشريك"}</TableHead>
                    <TableHead className="text-center py-3">{t("Orders Count") || "الطلبات"}</TableHead>
                    <TableHead className="text-right py-3">{t("Total Sales") || "إجمالي المبيعات"}</TableHead>
                    <TableHead className="text-right py-3">{t("Platform Commission") || "عمولة المنصة"}</TableHead>
                    <TableHead className="text-right py-3 text-emerald-700 dark:text-emerald-400 font-bold">{t("Net Earnings") || "صافي المستحقات"}</TableHead>
                    <TableHead className="text-right py-3">{t("Cash Collected") || "كاش مع المندوب"}</TableHead>
                    <TableHead className="text-right py-3">{t("Offline / Online") || "كاش / أونلاين"}</TableHead>
                    <TableHead className="text-right py-3">{t("Wallet Balance") || "رصيد المحفظة"}</TableHead>
                    <TableHead className="text-center py-3">{t("Actions") || "إجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-xs">{t("Loading partner settlements...") || "جاري تحميل بيانات وتسويات الشركاء..."}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : stores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                        {t("No partner store settlements found for the selected criteria.") || "لا توجد سجلات تسوية للمطاعم الشريكة مطابقة للبحث الحالي."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    stores.map((store) => {
                      const name = getLocalizedStoreName(store.storeName);
                      return (
                        <TableRow key={store.storeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                          {/* Store Info */}
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-border/60 flex items-center justify-center">
                                {store.storeLogo ? (
                                  <Image
                                    src={store.storeLogo.startsWith("http") ? store.storeLogo : imgUrl + store.storeLogo}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <Store className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                  {name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="w-fit text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/50 gap-0.5 mt-0.5"
                                >
                                  <Handshake className="h-2.5 w-2.5" />
                                  شريك (# {store.storeId})
                                </Badge>
                              </div>
                            </div>
                          </TableCell>

                          {/* Orders Count */}
                          <TableCell className="text-center font-bold text-slate-700 dark:text-slate-300">
                            {store.totalOrdersCount}
                          </TableCell>

                          {/* Total Sales */}
                          <TableCell className="text-right font-semibold text-slate-900 dark:text-slate-100">
                            {formatMoney(store.totalSales)} ج.م
                          </TableCell>

                          {/* Platform Commission */}
                          <TableCell className="text-right font-semibold text-purple-600 dark:text-purple-400">
                            {formatMoney(store.totalPlatformCommission)} ج.م
                          </TableCell>

                          {/* Net Earnings */}
                          <TableCell className="text-right font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 px-2">
                            {formatMoney(store.totalStoreEarnings)} ج.م
                          </TableCell>

                          {/* Cash Collected */}
                          <TableCell className="text-right font-semibold text-amber-600 dark:text-amber-400">
                            {formatMoney(store.totalCashCollectedByDrivers)} ج.م
                          </TableCell>

                          {/* Offline / Online */}
                          <TableCell className="text-right">
                            <div className="flex flex-col text-[11px] leading-tight">
                              <span className="text-emerald-600 dark:text-emerald-400">
                                💵 {formatMoney(store.offlinePartnerTotal)}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                💳 {formatMoney(store.onlinePartnerTotal)}
                              </span>
                            </div>
                          </TableCell>

                          {/* Wallet Balance */}
                          <TableCell className="text-right font-bold text-slate-800 dark:text-slate-200">
                            {formatMoney(store.storeWalletBalance)} ج.م
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link href={`/stores/${store.storeId}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] gap-1"
                                  title="عرض صفحة المتجر"
                                >
                                  <Eye className="h-3 w-3" />
                                  تفاصيل
                                </Button>
                              </Link>
                              <Link href={`/fund`}>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] gap-1 shadow-xs"
                                  title="صرف وتسوية المستحقات"
                                >
                                  <ArrowUpRight className="h-3 w-3" />
                                  تسوية
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
