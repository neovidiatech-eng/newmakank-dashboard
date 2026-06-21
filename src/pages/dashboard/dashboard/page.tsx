import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Link, useSearchParams } from "react-router-dom";
import { Banknote, Users, Store, Bike, Receipt, BadgePercent, Coins, HandCoins, Truck, Info } from "lucide-react";
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
  
  const { data: statsResponse } = useApiQuery({
    queryKey: ["statistics"],
    endPoint: ["statistics"]
  });


  const { data: ordersResponse } = useApiQuery({
    queryKey: ["orders", { limit, page }],
    endPoint: ["orders"],
    params: { limit, page }
  });

  const { data: allOrdersResponse } = useApiQuery({
    queryKey: ["orders_all_for_stats"],
    endPoint: ["orders"],
    params: { limit: 100000, page: 1 }
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

  const stats = (statsResponse?.data ?? {}) as any;

  const orders = (ordersResponse?.data?.data ?? ordersResponse?.data ?? []) as any[];
  const allOrdersForStats = (allOrdersResponse?.data?.data ?? allOrdersResponse?.data ?? []) as any[];

  // Data aggregations (defensive fallback)
  const totalCustomers = stats.totalCustomers ?? 0;
  const totalStores = stats.totalStores ?? 0;
  
  // Directly fetching correct counts
  const totalDelivery = deliveryResponse?.total ?? deliveryResponse?.data?.length ?? deliveryResponse?.data?.data?.length ?? stats.totalDelivery ?? 0;
  const openStores = openStoresResponse?.total ?? openStoresResponse?.data?.length ?? openStoresResponse?.data?.data?.length ?? 0;

  // Financials calculated from ALL orders
  const financialData = {
    totalAmount: allOrdersForStats.reduce((sum, order) => sum + Number(order?.invoice?.summary?.total ?? order?.price ?? 0), 0),
    productPrice: allOrdersForStats.reduce((sum, order) => sum + Number(order?.price ?? 0), 0),
    storeCommission: allOrdersForStats.reduce((sum, order) => sum + Number(order?.storeCommission ?? 0), 0),
    globalCommission: allOrdersForStats.reduce((sum, order) => sum + Number(order?.globalCommission ?? 0), 0),
    taxes: allOrdersForStats.reduce((sum, order) => sum + Number(order?.tax ?? 0), 0),
    deliveryPrice: allOrdersForStats.reduce((sum, order) => sum + Number(order?.shipping ?? 0), 0),
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto px-4 py-6 defer-paint">
      
      {/* 1. First Row: Overview Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to={`/${locale}/customers`} className="block transition-transform hover:scale-[1.02]">
          <Card className="border-border/60 shadow-sm bg-sky-50 dark:bg-sky-950/20 hover:border-sky-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">إجمالي العملاء</p>
                <h3 className="text-3xl font-bold text-sky-900 dark:text-sky-100 mt-2">{totalCustomers}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/${locale}/delivery`} className="block transition-transform hover:scale-[1.02]">
          <Card className="border-border/60 shadow-sm bg-violet-50 dark:bg-violet-950/20 hover:border-violet-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">إجمالي المناديب</p>
                <h3 className="text-3xl font-bold text-violet-900 dark:text-violet-100 mt-2">{totalDelivery}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Bike className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/${locale}/stores`} className="block transition-transform hover:scale-[1.02]">
          <Card className="border-border/60 shadow-sm bg-amber-50 dark:bg-amber-950/20 hover:border-amber-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">إجمالي المتاجر</p>
                <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">{openStores}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Store className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 2. Second Row: Financials */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary" />
            الماليات
          </h2>
          <p className="text-sm text-muted-foreground pr-8">
            إجمالي الحسابات لجميع الطلبات في النظام
          </p>
        </div>
        
        {/* Main Total Amount Card */}
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm mb-4">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-emerald-800 dark:text-emerald-300">إجمالي مبالغ الطلبات</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">يشمل (سعر المنتجات + عمولة المتجر + عمولة المنصة + الضرائب + التوصيل)</p>
              <h3 className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                {formatMoney(financialData.totalAmount, locale)}
              </h3>
            </div>
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Banknote className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">سعر المنتجات الأصلي</p>
                <p className="font-bold">{formatMoney(financialData.productPrice, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">عمولة المتجر</p>
                <p className="font-bold">{formatMoney(financialData.storeCommission, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العمولة العامة</p>
                <p className="font-bold">{formatMoney(financialData.globalCommission, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/50">
                <BadgePercent className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الضرائب</p>
                <p className="font-bold">{formatMoney(financialData.taxes, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">التوصيل</p>
                <p className="font-bold">{formatMoney(financialData.deliveryPrice, locale)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Table: Recent Orders */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>الطلبات الحديثة</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-center font-bold">رقم الطلب</TableHead>
                <TableHead className="text-center font-bold">المندوب</TableHead>
                <TableHead className="text-center font-bold">السعر الإجمالي</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">سعر المنتج الأصلي</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">عمولة المتجر</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">العمولة العامة</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">الضريبة</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">سعر التوصيل</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">التفاصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    لا توجد طلبات متاحة حالياً
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const deliveryName = order?.Delivery?.User?.name || order?.Delivery?.name || order?.delivery?.name || "—";
                  const productPrice = order?.price || 0;
                  const storeCommission = order?.storeCommission || 0;
                  const globalCommission = order?.globalCommission || 0;
                  const tax = order?.tax || 0;
                  const deliveryPrice = order?.shipping || 0;
                  const total = order?.invoice?.summary?.total ?? order?.price ?? 0;

                  return (
                    <TableRow key={order.id} className="hover:bg-muted/30">
                      <TableCell className="text-center font-medium">
                        <Link to={`/${locale}/orders/${order.id}`} className="text-primary hover:underline">
                          #{order.id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {deliveryName !== "—" ? (
                          <Badge variant="outline" className="bg-violet-50 text-violet-700">{deliveryName}</Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-center font-bold text-emerald-600">
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
                  )
                })
              )}
            </TableBody>
          </Table>

          {ordersResponse?.total !== undefined && orders.length > 0 && (
            <div className="mt-4 pb-2">
              <TablePagination pagination={{ total: ordersResponse.total }} />
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
