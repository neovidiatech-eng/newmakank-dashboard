import { fetchData } from "@/api/global/fetchData";
import DateCol from "@/components/common/table/columns/date.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import AddressInfo from "@/components/pages/_orders/AddressInfo";
import CustomerInfo from "@/components/pages/_orders/CustomerInfo";
import OrderItemsList from "@/components/pages/_orders/OrderItemsList";
import StoreInfo from "@/components/pages/_orders/StoreInfo";
import PrintOrderButton from "@/components/pages/_orders/PrintOrderButton";
import RealizeOrderButton from "@/components/pages/_orders/RealizeOrderButton";
import { CalendarClock, ArrowLeft, ArrowRight } from "lucide-react";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTranslations, getLocale } from "@/lib/i18n";
import Link from "@/lib/Link";
import { ApiResponse } from "../../types";

export default async function ArchivedOrderPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<JSX.Element> {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRtl = locale === "ar";
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [response] = await Promise.all([
    fetchData(["ordersArchived", Number(id)]).catch(async () => {
      return fetchData(["orders", Number(id)]).catch(() => null);
    })
  ]);

  const data = (response?.data as ApiResponse) || null;

  if (!data) {
    return (
      <div className="container mx-auto py-12 max-w-4xl px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t("No Data Available")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("The requested archived order could not be found.") || "لم يتم العثور على الطلب المؤرشف المطلوب."}
        </p>
        <Button asChild variant="outline">
          <Link href="/orders/archived">
            {isRtl ? <ArrowRight className="h-4 w-4 ml-2" /> : <ArrowLeft className="h-4 w-4 mr-2" />}
            {t("Archived Orders")}
          </Link>
        </Button>
      </div>
    );
  }

  const items = (data?.OrderItems || (data as any)?.ArchivedOrderItems || []) as any[];
  const invoice = data?.invoice || {
    store: data?.Branch?.Store || (data as any)?.Store,
    branch: data?.Branch,
    summary: {
      total: data?.totalPriceAfterDiscount || data?.price,
      subtotal: data?.price,
      shipping: data?.shipping || 0,
      tax: data?.tax || 0,
      totalDiscount: data?.discountAmount || 0
    },
    tip: data?.tip || 0
  };

  const totalPrice = Number(data?.totalPriceAfterDiscount || data?.totalPrice || invoice?.summary?.total || 0);
  const subtotal = Number(data?.price || invoice?.summary?.subtotal || 0);
  const shipping = Number(data?.shipping || invoice?.summary?.shipping || 0);
  const discount = Number(data?.discountAmount || invoice?.summary?.totalDiscount || 0);
  const tax = Number(data?.tax || invoice?.summary?.tax || 0);
  const tip = Number(data?.tip || invoice?.tip || 0);

  return (
    <div className="container mx-auto py-8 max-w-6xl px-4 lg:px-6 print:hidden space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/orders/archived">
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {t("Archived Orders")}
            </Link>
          </Button>
          <div className="flex items-center gap-2 print:hidden">
            <PrintOrderButton />
            <RealizeOrderButton orderId={Number(id)} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {t("Archived Order Details") || "تفاصيل الطلب المؤرشف"} #{data?.id}
              </h1>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">
                <CalendarClock className="h-3.5 w-3.5 mr-1 ml-1" />
                {t("Scheduled Order") || "طلب مجدول"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1.5 flex items-center gap-1.5">
              {t("Created on")} <DateCol date={data?.createdAt} />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TableStatusBadge status="SCHEDULED" />
            <TableStatusBadge status={data?.paymentStatus || "PENDING"} />
          </div>
        </div>
      </div>

      {/* Scheduled Time & Activation Alert */}
      <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-5 dark:border-violet-900/50 dark:from-violet-950/20 dark:to-purple-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-violet-600 text-white shadow-sm">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-violet-950 dark:text-violet-100 text-base">
              {t("This order is scheduled and archived until") || "طلب مجدول ومؤرشف للتنفيذ في:"}
            </h3>
            <p className="text-sm font-medium text-violet-800 dark:text-violet-300 mt-0.5">
              {data?.scheduledAt ? <DateCol date={data.scheduledAt} /> : "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <RealizeOrderButton orderId={Number(id)} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items and Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* Order Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("Order Items")}
            </h2>
            {items && items.length > 0 ? (
              <OrderItemsList items={items} storeCommission={data?.storeCommission} />
            ) : (
              <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg bg-muted/10">
                {t("No items in this order")}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("Payment Details")}
            </h2>
            <div className="bg-muted/30 dark:bg-muted/10 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>- {t("Subtotal") || "المجموع الفرعي"}</span>
                <span className="font-medium text-foreground">
                  <PriceAmount value={subtotal} />
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-medium">
                  <span>- {t("DiscountAmount") || "الخصم"}</span>
                  <span>- <PriceAmount value={discount} /></span>
                </div>
              )}

              {shipping > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>- {t("Shipping") || "رسوم التوصيل"}</span>
                  <span className="font-medium text-foreground">
                    <PriceAmount value={shipping} />
                  </span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>- {t("Tax") || "الضريبة والرسوم"}</span>
                  <span className="font-medium text-foreground">
                    <PriceAmount value={tax} />
                  </span>
                </div>
              )}

              {tip > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                  <span>- {t("Tip") || "إكرامية المندوب"}</span>
                  <span>+ <PriceAmount value={tip} /></span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                <span>{t("Total") || "الإجمالي المطلوب"}</span>
                <span className="text-primary text-lg">
                  <PriceAmount value={totalPrice} />
                </span>
              </div>

              <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>{t("Payment Method") || "طريقة الدفع"}:</span>
                <span className="font-medium text-foreground">{t(data?.paymentMethod || "CASH")}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data?.note && (
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-muted/20 space-y-1">
              <h4 className="font-semibold text-sm">{t("Note")}:</h4>
              <p className="text-sm text-muted-foreground">{data.note}</p>
            </div>
          )}
        </div>

        {/* Right Column: Customer, Address, Store */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{t("Customer")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerInfo customer={data?.Customer} />
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{t("Address")}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressInfo address={data?.Address} zoneId={(data as any)?.zoneId} />
            </CardContent>
          </Card>

          {/* Store / Branch Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{t("Store")}</CardTitle>
            </CardHeader>
            <CardContent>
              <StoreInfo branch={data?.Branch} invoice={invoice as any} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
