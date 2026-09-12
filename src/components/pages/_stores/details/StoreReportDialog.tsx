import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { fetchHelper } from "@/api/fetch";
import { FileText, Printer, Download, Loader2, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";

interface StoreReportDialogProps {
  store?: Record<string, any>;
  storeId?: number;
  triggerButton?: React.ReactNode;
}

export function StoreReportDialog({
  store,
  storeId: propStoreId,
  triggerButton
}: StoreReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any>(store || null);

  // Filters
  const [periodPreset, setPeriodPreset] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const effectiveStoreId = Number(propStoreId || store?.id || 0);

  // Fetch store details if not fully provided
  useEffect(() => {
    if (isOpen && effectiveStoreId && (!storeData || !storeData.name)) {
      fetchHelper({
        endPoint: ["stores", effectiveStoreId] as any,
        method: "GET"
      }).then((res: any) => {
        if (res?.data) {
          setStoreData(res.data);
        }
      });
    }
  }, [isOpen, effectiveStoreId, storeData]);

  // Commission % resolution
  const commissionRate = useMemo(() => {
    const rawComm = Number(storeData?.commission ?? storeData?.commotion ?? 5);
    return isNaN(rawComm) || rawComm <= 0 ? 5 : rawComm;
  }, [storeData]);

  const [customCommission, setCustomCommission] = useState<number>(commissionRate);

  useEffect(() => {
    setCustomCommission(commissionRate);
  }, [commissionRate]);

  // Load all orders for store
  const loadOrders = async () => {
    if (!effectiveStoreId) return;
    setLoading(true);
    try {
      const params: Record<string, any> = {
        storeId: effectiveStoreId,
        limit: -1 // Handled by backend to return all orders without pagination cap
      };

      if (periodPreset === "today") {
        const today = new Date().toISOString().split("T")[0];
        params.fromDate = `${today}T00:00:00.000Z`;
        params.toDate = `${today}T23:59:59.999Z`;
      } else if (periodPreset === "week") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        params.fromDate = d.toISOString();
      } else if (periodPreset === "month") {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        params.fromDate = d.toISOString();
      } else if (periodPreset === "custom") {
        if (startDate) params.fromDate = new Date(startDate).toISOString();
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          params.toDate = end.toISOString();
        }
      }

      const res: any = await fetchHelper({
        endPoint: ["orders"],
        method: "GET",
        params
      });

      let fetchedOrders = Array.isArray(res?.data) ? res.data : [];

      // Fallback: If backend returned paginated data (e.g. older server version)
      if (res?.total && fetchedOrders.length < res.total && fetchedOrders.length > 0) {
        const total = res.total;
        const pageSize = fetchedOrders.length;
        const totalPages = Math.ceil(total / pageSize);
        const remainingPages = [];

        for (let p = 2; p <= totalPages; p++) {
          remainingPages.push(
            fetchHelper({
              endPoint: ["orders"],
              method: "GET",
              params: { ...params, page: p, limit: pageSize }
            })
          );
        }

        const extraResults: any[] = await Promise.all(remainingPages);
        for (const pageRes of extraResults) {
          if (Array.isArray(pageRes?.data)) {
            fetchedOrders = fetchedOrders.concat(pageRes.data);
          }
        }
      }

      // Deduplicate orders by id to match Flutter ordersMap behavior exactly
      const uniqueMap = new Map();
      for (const o of fetchedOrders) {
        if (o?.id != null) {
          uniqueMap.set(o.id, o);
        }
      }
      const finalOrders = uniqueMap.size > 0 ? Array.from(uniqueMap.values()) : fetchedOrders;

      setOrders(finalOrders);
    } catch (err) {
      console.error("Error loading store orders for report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen, periodPreset, startDate, endDate, effectiveStoreId]);

  // Resolve Store Name
  const storeName = useMemo(() => {
    const raw = storeData?.name;
    if (!raw) return "المتجر";
    if (typeof raw === "string") return raw;
    return raw.ar || raw.en || "المتجر";
  }, [storeData]);

  // Financial calculation helpers matching Flutter makank_restaurant store_performance_report_screen.dart
  const getOrderNet = useCallback((o: any): number => {
    const direct = Number(
      o.financialBreakdown?.storeNetEarnings ??
      o.storeNetEarnings ??
      0
    );
    if (direct > 0) return direct;

    const rawVal = Number(
      o.financialBreakdown?.productSubtotal ??
      o.productSubtotal ??
      o.price ??
      o.totalPriceAfterDiscount ??
      o.totalPrice ??
      0
    );
    const commFee = Number(
      o.financialBreakdown?.adminCommission ??
      o.financialBreakdown?.storeCommission ??
      o.adminCommission ??
      o.commissionFee ??
      0
    );
    const comm = commFee > 0
      ? commFee
      : +(rawVal * (customCommission / 100)).toFixed(2);
    return Math.max(0, +(rawVal - comm).toFixed(2));
  }, [customCommission]);

  const getOrderCommission = useCallback((o: any): number => {
    const fee = Number(
      o.financialBreakdown?.adminCommission ??
      o.financialBreakdown?.storeCommission ??
      o.adminCommission ??
      o.commissionFee ??
      0
    );
    if (fee > 0) return fee;

    const rawVal = Number(
      o.financialBreakdown?.productSubtotal ??
      o.productSubtotal ??
      o.price ??
      o.totalPriceAfterDiscount ??
      o.totalPrice ??
      0
    );
    const net = getOrderNet(o);
    if (rawVal > net) {
      return +(rawVal - net).toFixed(2);
    }
    return +(rawVal * (customCommission / 100)).toFixed(2);
  }, [customCommission, getOrderNet]);

  const getOrderValue = useCallback((o: any): number => {
    const net = getOrderNet(o);
    const comm = getOrderCommission(o);
    const rawVal = Number(
      o.financialBreakdown?.productSubtotal ??
      o.productSubtotal ??
      o.price ??
      0
    );
    if (rawVal >= net + comm && rawVal > 0) {
      return rawVal;
    }
    return +(net + comm).toFixed(2);
  }, [getOrderNet, getOrderCommission]);

  // Metrics calculation
  const reportMetrics = useMemo(() => {
    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      o => o.status === "DELIVERED" || o.status === "COMPLETED"
    );
    const cancelledOrders = orders.filter(
      o => o.status === "CANCELLED" || o.status === "REJECTED"
    );
    const inProgressOrders = orders.filter(o =>
      ["PENDING", "PREPARING", "READY_PICKUP", "ON_THE_WAY"].includes(o.status)
    );
    const rejectedByStoreOrders = orders.filter(
      o => o.status === "REJECTED" || o.rejectedByUserId != null
    );

    const cashOrders = orders.filter(
      o => o.paymentMethod === "CASH" || !o.paymentMethod
    );
    const visaOrders = orders.filter(
      o => o.paymentMethod && o.paymentMethod !== "CASH"
    );

    const completionRate =
      totalOrders > 0 ? ((completedOrders.length / totalOrders) * 100).toFixed(1) : "0";
    const cancellationRate =
      totalOrders > 0 ? ((cancelledOrders.length / totalOrders) * 100).toFixed(1) : "0";
    const visaRate =
      totalOrders > 0 ? ((visaOrders.length / totalOrders) * 100).toFixed(1) : "0";
    const cashRate =
      totalOrders > 0 ? ((cashOrders.length / totalOrders) * 100).toFixed(1) : "0";

    // Financials matching Flutter app
    const totalCompletedValue = +(
      completedOrders.reduce((sum, o) => sum + getOrderValue(o), 0)
    ).toFixed(2);

    const totalVisaCompletedValue = +(
      completedOrders
        .filter(o => o.paymentMethod && o.paymentMethod !== "CASH")
        .reduce((sum, o) => sum + getOrderValue(o), 0)
    ).toFixed(2);

    const totalCashCompletedValue = +(
      completedOrders
        .filter(o => o.paymentMethod === "CASH" || !o.paymentMethod)
        .reduce((sum, o) => sum + getOrderValue(o), 0)
    ).toFixed(2);

    const netStoreEntitlement = +(
      completedOrders.reduce((sum, o) => sum + getOrderNet(o), 0)
    ).toFixed(2);

    const appCommissionValue = +(
      completedOrders.reduce((sum, o) => sum + getOrderCommission(o), 0)
    ).toFixed(2);

    const avgOrderValue =
      completedOrders.length > 0
        ? (totalCompletedValue / completedOrders.length).toFixed(2)
        : "0.00";

    // Earliest and latest order date for report period display
    let minDate = "";
    let maxDate = "";
    if (orders.length > 0) {
      const timestamps = orders
        .map(o => new Date(o.createdAt || o.date).getTime())
        .filter(t => !isNaN(t));
      if (timestamps.length > 0) {
        minDate = new Date(Math.min(...timestamps)).toLocaleDateString("ar-EG");
        maxDate = new Date(Math.max(...timestamps)).toLocaleDateString("ar-EG");
      }
    }

    return {
      totalOrders,
      completedOrders,
      cancelledOrders,
      inProgressOrders,
      rejectedByStoreOrders,
      cashOrders,
      visaOrders,
      completionRate,
      cancellationRate,
      visaRate,
      cashRate,
      totalCompletedValue,
      totalVisaCompletedValue,
      totalCashCompletedValue,
      appCommissionValue,
      netStoreEntitlement,
      avgOrderValue,
      minDate,
      maxDate
    };
  }, [orders, customCommission, getOrderValue, getOrderCommission, getOrderNet]);

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Export structured Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: الملخص
    const summaryData = [
      [`تقرير أداء مطعم ${storeName}`],
      ["من خلال تطبيق مكانك لتوصيل الطلبات"],
      [
        `الفترة: من ${reportMetrics.minDate || "البداية"} إلى ${reportMetrics.maxDate || "الآن"}`
      ],
      [],
      ["أولاً: ملخص الطلبات"],
      ["البيان", "العدد"],
      ["إجمالي الطلبات", `${reportMetrics.totalOrders} طلب`],
      ["الطلبات المكتملة", `${reportMetrics.completedOrders.length} طلب`],
      ["الطلبات الملغاة", `${reportMetrics.cancelledOrders.length} طلب`],
      ["الطلبات المدفوعة نقداً", `${reportMetrics.cashOrders.length} طلب`],
      ["الطلبات المدفوعة بالفيزا", `${reportMetrics.visaOrders.length} طلب`],
      ["الطلبات قيد التنفيذ", `${reportMetrics.inProgressOrders.length} طلب`],
      [
        "الطلبات المرفوضة من المطعم",
        `${reportMetrics.rejectedByStoreOrders.length} طلب`
      ],
      [],
      ["نسب الطلبات"],
      ["نسبة إتمام الطلبات", `${reportMetrics.completionRate}%`],
      ["نسبة إلغاء الطلبات", `${reportMetrics.cancellationRate}%`],
      ["نسبة الدفع بالفيزا", `${reportMetrics.visaRate}%`],
      ["نسبة الدفع النقدي", `${reportMetrics.cashRate}%`],
      [],
      ["ثانياً: الحسابات المالية"],
      ["إجمالي قيمة الطلبات المكتملة", `${reportMetrics.totalCompletedValue} جنيه`],
      [
        "إجمالي قيمة الطلبات المدفوعة بالفيزا",
        `${reportMetrics.totalVisaCompletedValue} جنيه`
      ],
      [
        "إجمالي قيمة الطلبات المدفوعة نقداً",
        `${reportMetrics.totalCashCompletedValue} جنيه`
      ],
      ["نسبة تطبيق مكانك", `${customCommission}%`],
      ["إجمالي عمولة مكانك", `${reportMetrics.appCommissionValue} جنيه`],
      ["صافي مستحق المطعم بعد خصم العمولة", `${reportMetrics.netStoreEntitlement} جنيه`],
      [],
      ["خامساً: تحليل الطلبات"],
      ["متوسط قيمة الطلب", `${reportMetrics.avgOrderValue} جنيه`]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "ملخص التقرير والماليات");

    // Sheet 2: جميع الطلبات
    const allOrdersRows = [
      [
        "رقم الطلب",
        "التاريخ",
        "الوقت",
        "قيمة الطلب (جنيه)",
        "طريقة الدفع",
        "حالة الطلب",
        `قيمة العمولة (${customCommission}%)`,
        "صافي مستحق المطعم (جنيه)"
      ],
      ...orders.map(o => {
        const orderDate = new Date(o.createdAt || o.date);
        const isCompleted = o.status === "DELIVERED" || o.status === "COMPLETED";
        const val = getOrderValue(o);
        const comm = isCompleted ? getOrderCommission(o) : 0;
        const net = isCompleted ? getOrderNet(o) : 0;

        return [
          o.id,
          isNaN(orderDate.getTime()) ? "-" : orderDate.toLocaleDateString("ar-EG"),
          isNaN(orderDate.getTime())
            ? "-"
            : orderDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          val,
          o.paymentMethod && o.paymentMethod !== "CASH" ? "فيزا / إلكتروني" : "نقدي",
          formatStatus(o.status),
          isCompleted ? comm : "-",
          isCompleted ? net : "-"
        ];
      })
    ];
    const wsAllOrders = XLSX.utils.aoa_to_sheet(allOrdersRows);
    XLSX.utils.book_append_sheet(wb, wsAllOrders, "جميع الطلبات");

    // Sheet 3: الطلبات الملغاة
    const cancelledOrdersRows = [
      [
        "رقم الطلب",
        "التاريخ",
        "الوقت",
        "قيمة الطلب (جنيه)",
        "سبب الإلغاء",
        "المسؤول عن الإلغاء"
      ],
      ...reportMetrics.cancelledOrders.map(o => {
        const orderDate = new Date(o.createdAt || o.date);
        const val = Number(o.price ?? o.totalPriceAfterDiscount ?? o.totalPrice ?? 0);
        const reason =
          o.adminNote || o.note || "عدم توفر صنف من الأصناف / إلغاء العميل";
        const responsible =
          o.status === "REJECTED" || o.rejectedByUserId != null
            ? "المطعم"
            : o.Complaints?.length
            ? "العميل"
            : "العميل / التطبيق";

        return [
          o.id,
          isNaN(orderDate.getTime()) ? "-" : orderDate.toLocaleDateString("ar-EG"),
          isNaN(orderDate.getTime())
            ? "-"
            : orderDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          val,
          reason,
          responsible
        ];
      })
    ];
    const wsCancelled = XLSX.utils.aoa_to_sheet(cancelledOrdersRows);
    XLSX.utils.book_append_sheet(wb, wsCancelled, "الطلبات الملغاة");

    // Trigger download
    const cleanStoreName = storeName.replace(/[\\/:*?"<>|]/g, "_");
    XLSX.writeFile(wb, `تقرير_أداء_${cleanStoreName}.xlsx`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 text-primary font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>تقرير أداء وحسابات المتجر</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-background text-foreground">
        {/* Top Action & Filter Bar (Hidden in Print) */}
        <div className="p-4 border-b bg-muted/30 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <DialogTitle className="text-lg font-bold">
                تقرير أداء وحسابات: {storeName}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                إجمالي الطلبات المسحوبة: {orders.length} طلب
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Period Selector */}
            <Select value={periodPreset} onValueChange={setPeriodPreset}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الطلبات</SelectItem>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">آخر 7 أيام</SelectItem>
                <SelectItem value="month">هذا الشهر</SelectItem>
                <SelectItem value="custom">فترة مخصصة</SelectItem>
              </SelectContent>
            </Select>

            {periodPreset === "custom" && (
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  className="h-9 text-xs w-32"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
                <span className="text-xs text-muted-foreground">إلى</span>
                <Input
                  type="date"
                  className="h-9 text-xs w-32"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            )}

            {/* Custom Commission Input */}
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded border">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                العمولة %:
              </span>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="h-7 w-16 text-xs p-1 text-center"
                value={customCommission}
                onChange={e => setCustomCommission(Number(e.target.value))}
              />
            </div>

            {/* Reload button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={loadOrders}
              disabled={loading}
              className="h-9 px-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* Print button */}
            <Button
              size="sm"
              onClick={handlePrint}
              disabled={loading || orders.length === 0}
              className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </Button>

            {/* Excel export */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportExcel}
              disabled={loading || orders.length === 0}
              className="h-9 gap-1.5 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            >
              <Download className="w-4 h-4" />
              <span>تصدير Excel منسق</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Printable Report Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white text-gray-900 printable-document-root">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">جاري جلب تفاصيل جميع الطلبات والحسابات...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground space-y-2">
              <FileText className="w-12 h-12 mx-auto opacity-40" />
              <h4 className="text-base font-semibold">لا توجد طلبات في هذه الفترة</h4>
              <p className="text-xs">
                جرب تغيير الفترة الزمنية لاختيار "كل الطلبات" لسحب كامل الأوردرات.
              </p>
            </div>
          ) : (
            <div id="printable-store-report" className="space-y-8 font-sans max-w-3xl mx-auto text-right" dir="rtl">
              {/* Document Header */}
              <div className="text-center space-y-2 pb-4 border-b-2 border-gray-300">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  تقرير أداء مطعم {storeName}
                </h1>
                <p className="text-base font-medium text-gray-700">
                  من خلال تطبيق مكانك لتوصيل الطلبات
                </p>
                <p className="text-sm text-gray-500">
                  الفترة: من {reportMetrics.minDate || "البداية"} إلى {reportMetrics.maxDate || "الآن"}
                </p>
              </div>

              {/* أولاً: ملخص الطلبات */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                  أولاً: ملخص الطلبات
                </h2>

                <div className="overflow-hidden border border-gray-300 rounded-md">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                        <th className="py-2.5 px-4">البيان</th>
                        <th className="py-2.5 px-4 text-center w-40">العدد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-4 font-semibold">إجمالي الطلبات</td>
                        <td className="py-2 px-4 text-center font-bold">{reportMetrics.totalOrders} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات المكتملة</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.completedOrders.length} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات الملغاة</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.cancelledOrders.length} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات المدفوعة نقداً</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.cashOrders.length} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات المدفوعة بالفيزا</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.visaOrders.length} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات قيد التنفيذ</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.inProgressOrders.length} طلب</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">الطلبات المرفوضة من المطعم</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.rejectedByStoreOrders.length} طلب</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-1.5 pt-2 text-sm text-gray-800">
                  <h3 className="font-bold text-base text-gray-900 mb-2">نسب الطلبات</h3>
                  <p className="flex justify-between max-w-sm border-b border-dashed border-gray-200 pb-1">
                    <span>نسبة إتمام الطلبات:</span>
                    <span className="font-bold">{reportMetrics.completionRate}%</span>
                  </p>
                  <p className="flex justify-between max-w-sm border-b border-dashed border-gray-200 pb-1">
                    <span>نسبة إلغاء الطلبات:</span>
                    <span className="font-bold">{reportMetrics.cancellationRate}%</span>
                  </p>
                  <p className="flex justify-between max-w-sm border-b border-dashed border-gray-200 pb-1">
                    <span>نسبة الدفع بالفيزا:</span>
                    <span className="font-bold">{reportMetrics.visaRate}%</span>
                  </p>
                  <p className="flex justify-between max-w-sm border-b border-dashed border-gray-200 pb-1">
                    <span>نسبة الدفع النقدي:</span>
                    <span className="font-bold">{reportMetrics.cashRate}%</span>
                  </p>
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* ثانياً: الحسابات المالية */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                  ثانياً: الحسابات المالية
                </h2>

                <div className="space-y-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span>إجمالي قيمة الطلبات المكتملة:</span>
                    <span className="font-bold text-base">{reportMetrics.totalCompletedValue} جنيه</span>
                  </p>
                  <p className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span>إجمالي قيمة الطلبات المدفوعة بالفيزا:</span>
                    <span className="font-bold">{reportMetrics.totalVisaCompletedValue} جنيه</span>
                  </p>
                  <p className="flex justify-between border-b border-gray-200 pb-1.5">
                    <span>إجمالي قيمة الطلبات المدفوعة نقداً:</span>
                    <span className="font-bold">{reportMetrics.totalCashCompletedValue} جنيه</span>
                  </p>

                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900">عمولة تطبيق مكانك</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      نسبة التطبيق: <span className="font-bold text-gray-900">%{customCommission}</span>
                    </p>
                    <p className="mt-1">
                      إجمالي عمولة مكانك:{" "}
                      <span className="font-bold text-gray-900">{reportMetrics.appCommissionValue} جنيه</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center">
                    <span className="font-bold text-base text-gray-900">
                      صافي مستحق مطعم {storeName} بعد خصم نسبة التطبيق:
                    </span>
                    <span className="font-extrabold text-lg text-emerald-800">
                      {reportMetrics.netStoreEntitlement} جنيه
                    </span>
                  </div>
                </div>
              </section>

              <hr className="border-gray-300 page-break-after" />

              {/* ثالثاً: تفاصيل جميع الطلبات */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                    ثالثاً: تفاصيل جميع الطلبات ({orders.length} طلب)
                  </h2>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-md">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-800">
                        <th className="py-2 px-2 text-center">رقم الطلب</th>
                        <th className="py-2 px-2 text-center">التاريخ</th>
                        <th className="py-2 px-2 text-center">الوقت</th>
                        <th className="py-2 px-2 text-center">قيمة الطلب</th>
                        <th className="py-2 px-2 text-center">طريقة الدفع</th>
                        <th className="py-2 px-2 text-center">حالة الطلب</th>
                        <th className="py-2 px-2 text-center">قيمة العمولة ({customCommission}%)</th>
                        <th className="py-2 px-2 text-center font-bold">صافي المطعم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((o, idx) => {
                        const orderDate = new Date(o.createdAt || o.date);
                        const isCompleted = o.status === "DELIVERED" || o.status === "COMPLETED";
                        const isCancelled = o.status === "CANCELLED" || o.status === "REJECTED";
                        const val = getOrderValue(o);
                        const comm = isCompleted ? getOrderCommission(o) : 0;
                        const net = isCompleted ? getOrderNet(o) : 0;

                        return (
                          <tr key={o.id || idx} className={isCancelled ? "bg-red-50/40 text-gray-500" : ""}>
                            <td className="py-1.5 px-2 text-center font-mono font-medium">#{o.id}</td>
                            <td className="py-1.5 px-2 text-center">
                              {isNaN(orderDate.getTime()) ? "-" : orderDate.toLocaleDateString("ar-EG")}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              {isNaN(orderDate.getTime())
                                ? "-"
                                : orderDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-1.5 px-2 text-center font-semibold">{val} ج</td>
                            <td className="py-1.5 px-2 text-center">
                              {o.paymentMethod && o.paymentMethod !== "CASH" ? "فيزا" : "نقدي"}
                            </td>
                            <td className="py-1.5 px-2 text-center font-medium">
                              {formatStatus(o.status)}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              {isCompleted ? `${comm} ج` : "—"}
                            </td>
                            <td className="py-1.5 px-2 text-center font-bold text-gray-900">
                              {isCompleted ? `${net} ج` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                        <td colSpan={3} className="py-2 px-3 text-right">
                          الإجمالي للمكتمل ({reportMetrics.completedOrders.length} طلب):
                        </td>
                        <td className="py-2 px-2 text-center">{reportMetrics.totalCompletedValue} ج</td>
                        <td colSpan={2}></td>
                        <td className="py-2 px-2 text-center">{reportMetrics.appCommissionValue} ج</td>
                        <td className="py-2 px-2 text-center text-emerald-800">{reportMetrics.netStoreEntitlement} ج</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* رابعاً: تفاصيل الطلبات الملغاة */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                  رابعاً: تفاصيل الطلبات الملغاة ({reportMetrics.cancelledOrders.length} طلب)
                </h2>

                {reportMetrics.cancelledOrders.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">لا توجد طلبات ملغاة خلال هذه الفترة.</p>
                ) : (
                  <div className="overflow-x-auto border border-gray-300 rounded-md">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-800">
                          <th className="py-2 px-3 text-center">رقم الطلب</th>
                          <th className="py-2 px-3 text-center">التاريخ</th>
                          <th className="py-2 px-3 text-center">الوقت</th>
                          <th className="py-2 px-3 text-center">قيمة الطلب</th>
                          <th className="py-2 px-4">سبب الإلغاء</th>
                          <th className="py-2 px-3 text-center">المسؤول عن الإلغاء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportMetrics.cancelledOrders.map((o, idx) => {
                          const orderDate = new Date(o.createdAt || o.date);
                          const val = Number(o.price ?? o.totalPriceAfterDiscount ?? o.totalPrice ?? 0);
                          const reason =
                            o.adminNote || o.note || "عدم توفر صنف من الأصناف / إلغاء العميل";
                          const responsible =
                            o.status === "REJECTED" || o.rejectedByUserId != null
                              ? "المطعم"
                              : o.Complaints?.length
                              ? "العميل"
                              : "العميل / التطبيق";

                          return (
                            <tr key={o.id || idx}>
                              <td className="py-1.5 px-3 text-center font-mono font-medium">#{o.id}</td>
                              <td className="py-1.5 px-3 text-center">
                                {isNaN(orderDate.getTime()) ? "-" : orderDate.toLocaleDateString("ar-EG")}
                              </td>
                              <td className="py-1.5 px-3 text-center">
                                {isNaN(orderDate.getTime())
                                  ? "-"
                                  : orderDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td className="py-1.5 px-3 text-center font-medium">{val} ج</td>
                              <td className="py-1.5 px-4">{reason}</td>
                              <td className="py-1.5 px-3 text-center font-semibold">{responsible}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="pt-2 text-sm text-gray-700 space-y-1">
                  <h3 className="font-bold text-gray-900">أسباب الإلغاء المعتادة:</h3>
                  <ul className="list-disc list-inside text-xs space-y-1 text-gray-600 pr-2">
                    <li>عدم توافر صنف من الأصناف</li>
                    <li>المطعم لم يقبل الطلب أو تأخر في التأكيد</li>
                    <li>العميل قام بإلغاء الطلب قبل التجهيز</li>
                    <li>عدم إمكانية الوصول للعميل أو إغلاق الهاتف</li>
                    <li>تأخر تجهيز الطلب في أوقات الذروة</li>
                    <li>مشكلة في الدفع أو فشل التحويل الإلكتروني</li>
                    <li>عدم توفر مندوب توصيل في المنطقة</li>
                    <li>خطأ في إدخال تفاصيل الطلب أو العنوان</li>
                  </ul>
                </div>
              </section>

              <hr className="border-gray-300 page-break-after" />

              {/* خامساً: تحليل الطلبات */}
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                  خامساً: تحليل الطلبات
                </h2>

                <div className="space-y-1.5 text-sm text-gray-800">
                  <p className="font-bold text-base">إجمالي الطلبات: {reportMetrics.totalOrders} طلب</p>
                  <p className="pr-2">
                    • مكتمل: <span className="font-semibold">{reportMetrics.completedOrders.length} طلب</span> بنسبة{" "}
                    <span className="font-bold">%{reportMetrics.completionRate}</span>
                  </p>
                  <p className="pr-2">
                    • ملغي: <span className="font-semibold">{reportMetrics.cancelledOrders.length} طلب</span> بنسبة{" "}
                    <span className="font-bold">%{reportMetrics.cancellationRate}</span>
                  </p>
                  <p className="pr-2">
                    • فيزا: <span className="font-semibold">{reportMetrics.visaOrders.length} طلب</span> بنسبة{" "}
                    <span className="font-bold">%{reportMetrics.visaRate}</span>
                  </p>
                  <p className="pr-2">
                    • نقدي: <span className="font-semibold">{reportMetrics.cashOrders.length} طلب</span> بنسبة{" "}
                    <span className="font-bold">%{reportMetrics.cashRate}</span>
                  </p>

                  <div className="pt-3">
                    <h3 className="font-bold text-gray-900">متوسط قيمة الطلب</h3>
                    <p className="text-xs text-gray-600">
                      إجمالي قيمة الطلبات المكتملة ÷ عدد الطلبات المكتملة
                    </p>
                    <p className="font-bold text-base text-gray-900 mt-1">
                      متوسط قيمة الطلب = {reportMetrics.avgOrderValue} جنيه
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-gray-300" />

              {/* سادساً: ملخص مالي نهائي */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 border-r-4 border-black pr-2">
                  سادساً: ملخص مالي نهائي
                </h2>

                <div className="overflow-hidden border border-gray-300 rounded-md max-w-lg">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                        <th className="py-2.5 px-4">البيان</th>
                        <th className="py-2.5 px-4 text-center">القيمة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 px-4 font-semibold">إجمالي قيمة الطلبات المكتملة</td>
                        <td className="py-2 px-4 text-center font-bold">{reportMetrics.totalCompletedValue} جنيه</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">عمولة مكانك %{customCommission}</td>
                        <td className="py-2 px-4 text-center font-semibold">{reportMetrics.appCommissionValue} جنيه</td>
                      </tr>
                      <tr className="bg-emerald-50/50">
                        <td className="py-2.5 px-4 font-bold text-emerald-950">صافي مستحق مطعم {storeName}</td>
                        <td className="py-2.5 px-4 text-center font-extrabold text-emerald-800 text-base">
                          {reportMetrics.netStoreEntitlement} جنيه
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">إجمالي قيمة طلبات الفيزا</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.totalVisaCompletedValue} جنيه</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">إجمالي قيمة الطلبات النقدية</td>
                        <td className="py-2 px-4 text-center">{reportMetrics.totalCashCompletedValue} جنيه</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ملاحظات التقرير */}
              <section className="pt-4 border-t border-gray-300 space-y-2 text-xs text-gray-600">
                <h3 className="font-bold text-sm text-gray-900">ملاحظات التقرير</h3>
                <p className="leading-relaxed">
                  يهدف هذا التقرير إلى توضيح أداء مطعم <span className="font-bold text-gray-900">{storeName}</span> على تطبيق{" "}
                  <span className="font-bold text-gray-900">مكانك</span> خلال الفترة المحددة، مع بيان إجمالي الطلبات وحالاتها
                  وطرق الدفع، بالإضافة إلى تفاصيل الطلبات الملغاة وأسباب الإلغاء، واحتساب نسبة تطبيق مكانك البالغة{" "}
                  <span className="font-bold text-gray-900">%{customCommission}</span> من قيمة الطلبات المكتملة.
                </p>

                <div className="pt-3 flex justify-between items-end text-xs text-gray-700 font-medium">
                  <div>
                    <p>إعداد: تطبيق مكانك</p>
                    <p>المطعم: {storeName}</p>
                    <p>نسبة التطبيق: %{customCommission}</p>
                  </div>
                  <div className="text-left font-mono text-[11px] text-gray-500">
                    تاريخ الاستخراج: {new Date().toLocaleString("ar-EG")}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 12mm 15mm 12mm;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-store-report, #printable-store-report * {
            visibility: visible !important;
          }
          #printable-store-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
            line-height: 1.4 !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }
          table {
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        }
      `}} />
    </Dialog>
  );
}

function formatStatus(status: string) {
  switch (status) {
    case "DELIVERED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    case "REJECTED":
      return "مرفوض";
    case "PREPARING":
      return "قيد التجهيز";
    case "READY_PICKUP":
      return "جاهز للاستلام";
    case "ON_THE_WAY":
      return "في الطريق";
    case "PENDING":
      return "معلق";
    default:
      return status || "معلق";
  }
}
