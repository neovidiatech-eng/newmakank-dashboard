import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Link, useSearchParams } from "react-router-dom";
import { Users, Store, Bike, Receipt, Info } from "lucide-react";
import { useTranslations, useLocale } from "@/lib/i18n";
import { TablePagination } from "@/components/common/table/tableHelperComponents/TablePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatMoney(value: number | string | null | undefined, locale: string) {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 2
  }).format(Number.isFinite(numberValue) ? numberValue : 0);
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // 1. Overview API Calls
  const { data: statsResponse } = useApiQuery({
    queryKey: ["statistics"],
    endPoint: ["statistics"]
  });

  const { data: ordersResponse } = useApiQuery({
    queryKey: ["orders", { limit, page }],
    endPoint: ["orders"],
    params: { limit, page }
  });

  const { data: deliveryResponse } = useApiQuery({
    queryKey: ["delivery", { limit: 1 }],
    endPoint: ["delivery"],
    params: { limit: 1 }
  });

  const { data: openStoresResponse } = useApiQuery({
    queryKey: ["stores", { limit: 1 }],
    endPoint: ["stores"],
    params: { limit: 1 }
  });

  // Data mapping for Overview
  const stats = (statsResponse?.data ?? {}) as any;
  const rawOrders = (ordersResponse?.data?.data ?? ordersResponse?.data ?? []) as any[];
  const todayStr = new Date().toISOString().split("T")[0];
  const orders = rawOrders.filter(order => {
    const orderDateStr = order.createdAt || order.date;
    if (!orderDateStr) return true;
    return new Date(orderDateStr).toISOString().split("T")[0] === todayStr;
  });
  const totalCustomers = stats.totalCustomers ?? 0;
  const totalDelivery = deliveryResponse?.total ?? deliveryResponse?.data?.length ?? deliveryResponse?.data?.data?.length ?? stats.totalDelivery ?? 0;
  const openStores = openStoresResponse?.total ?? openStoresResponse?.data?.length ?? openStoresResponse?.data?.data?.length ?? 0;

  return (
    <div className="flex flex-col gap-8 w-full mx-auto px-4 py-6 defer-paint">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200/80 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("Overview") || "نظرة عامة"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("Overview description") || "نظرة عامة على أداء المتجر والطلبات والعملاء والمناديب."}
          </p>
        </div>
      </div>

      {/* OVERVIEW CONTENT */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={`/${locale}/customers`} className="block transition-transform hover:scale-[1.02]">
            <Card className="border-border/60 shadow-sm bg-sky-50 dark:bg-sky-950/20 hover:border-sky-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{t("Total Customers")}</p>
                  <h3 className="text-3xl font-bold text-sky-900 dark:text-sky-100 mt-2">{totalCustomers}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/${locale}/delivery`} className="block transition-transform hover:scale-[1.02]">
            <Card className="border-border/60 shadow-sm bg-purple-50 dark:bg-purple-950/20 hover:border-purple-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("Total Delivery")}</p>
                  <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{totalDelivery}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Bike className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={`/${locale}/stores`} className="block transition-transform hover:scale-[1.02]">
            <Card className="border-border/60 shadow-sm bg-amber-50 dark:bg-amber-950/20 hover:border-amber-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t("Total Stores")}</p>
                  <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">{openStores}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Store className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today Orders Table */}
        <Card className="overflow-hidden border-border/50 shadow-sm bg-white dark:bg-slate-950">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>{t("Recent Orders") || "طلبات اليوم (Today Orders)"}</span>
            </CardTitle>
            <Link
              to={`/${locale}/analytics`}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              عرض تحليلات النشاط الكاملة ←
            </Link>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t("Order Number") || "رقم الطلب"}</TableHead>
                  <TableHead className="text-center">{t("Delivery Name") || "اسم المندوب"}</TableHead>
                  <TableHead className="text-center">{t("Total Amount") || "إجمالي المبالغ"}</TableHead>
                  <TableHead className="text-center">{t("Product Price") || "سعر المنتج"}</TableHead>
                  <TableHead className="text-center">{t("Store Commission") || "عمولة المتجر"}</TableHead>
                  <TableHead className="text-center">{t("General Commission") || "العمولة العامة"}</TableHead>
                  <TableHead className="text-center">{t("Taxes") || "الضرائب"}</TableHead>
                  <TableHead className="text-center">{t("Fixed Delivery Price") || "سعر التوصيل الثابت (اختياري)"}</TableHead>
                  <TableHead className="text-center">{t("Details") || "التفاصيل"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                      {t("No Data Available")}
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => {
                    const total = Number(order.totalPriceAfterDiscount ?? order.totalPrice ?? 0);
                    const storeCommission = Number(order.storeCommission ?? order.store_commission ?? 0);
                    const globalCommission = Number(order.adminCommission ?? order.globalCommission ?? order.admin_commission ?? 0);
                    const tax = Number(order.tax ?? 0);
                    const deliveryPrice = Number(order.shipping ?? order.deliveryPrice ?? order.fixedDeliveryPrice ?? 0);

                    // Product price logic: check explicit price fields, or compute from OrderItems, or total minus fees
                    let productPrice = Number(order.price ?? order.productPrice ?? order.productsPrice ?? order.subTotal ?? 0);
                    if (!productPrice && Array.isArray(order.OrderItems) && order.OrderItems.length > 0) {
                      productPrice = order.OrderItems.reduce((sum: number, item: any) => {
                        const itemPrice = Number(item.price ?? item.totalPrice ?? item.unitPrice ?? 0);
                        const qty = Number(item.quantity ?? 1);
                        return sum + (itemPrice * qty);
                      }, 0);
                    }
                    if (!productPrice && total > 0) {
                      productPrice = Math.max(0, total - deliveryPrice - tax);
                    }

                    const deliveryName =
                      order.Delivery?.User?.name ||
                      order.delivery?.User?.name ||
                      order.delivery?.user?.name ||
                      order.Delivery?.user?.name ||
                      order.delivery?.name ||
                      "—";

                    return (
                      <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <TableCell className="text-center font-medium">
                          <Link to={`/${locale}/orders/${order.id}`} className="text-primary hover:underline font-bold">
                            #{order.id}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          {deliveryName !== "—" ? (
                            <Badge variant="outline" className="bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">{deliveryName}</Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {formatMoney(total, locale)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatMoney(productPrice, locale)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatMoney(storeCommission, locale)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatMoney(globalCommission, locale)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatMoney(tax, locale)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {formatMoney(deliveryPrice, locale)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link to={`/${locale}/orders/${order.id}`} className="text-muted-foreground hover:text-primary transition-colors flex justify-center">
                            <Info className="h-5 w-5" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {ordersResponse?.total !== undefined && orders.length > 0 && (
              <div className="p-4 border-t border-border/50">
                <TablePagination pagination={{ total: ordersResponse.total }} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
