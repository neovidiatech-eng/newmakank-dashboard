import { fetchData } from "@/api/global/fetchData";
import DateCol from "@/components/common/table/columns/date.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import AddressInfo from "@/components/pages/_orders/AddressInfo";
import AssignOrderDeliveryDialog from "@/components/pages/_orders/AssignOrderDeliveryDialog";
import ComplaintsList from "@/components/pages/_orders/ComplaintsList";
import CustomerInfo from "@/components/pages/_orders/CustomerInfo";
import DeliveryInfo from "@/components/pages/_orders/DeliveryInfo";
import InvoiceCustomDeliveryInfo from "@/components/pages/_orders/InvoiceCustomDeliveryInfo";
import NoteForDeliveryDialog from "@/components/pages/_orders/NoteForDeliveryDialog";
import OrderItemsList from "@/components/pages/_orders/OrderItemsList";
import OrderStatusSelect from "@/components/pages/_orders/OrderStatusSelect";
import CopyOrderButton from "@/components/pages/_orders/CopyOrderButton";
import StoreInfo from "@/components/pages/_orders/StoreInfo";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { ApiResponse } from "../types";

const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${import.meta.env.VITE_API_IMG_URL || ""}${path}`;
};

async function page({ params }: { params: Params }): Promise<JSX.Element> {
  const t = await getTranslations();
  const id = (await params).id;

  const response = await fetchData(["orders", Number(id)]);
  const data = response?.data as ApiResponse;
  if (!data)
    return <div className="p-8 text-center text-muted-foreground">{t("No Data Available")}</div>;
  const customDeliveryStations = (data as any)?.Stations ?? (data as any)?.stations ?? [];
  const hasCustomDeliveryInfo =
    data?.invoice?.customDelivery ||
    customDeliveryStations.length > 0 ||
    (data as any)?.customDeliveryProgress;
  const combinedDiscount = Number((data as any)?.discountValue ?? data?.discountAmount ?? 0);
  const priceAfterDiscount = (data as any)?.priceAfterDiscount;
  const priceAfterTax = (data as any)?.priceAfterTax;
  const totalPrice = (data as any)?.totalPrice ?? data?.totalPriceAfterDiscount;
  const rewardId = (data as any)?.rewardId ?? (data as any)?.fortuneRewardId;
  const hasFreeDeliveryReward = Boolean(
    (data as any)?.freeDeliveryReward ||
    (data as any)?.isFreeDeliveryReward ||
    (data as any)?.rewardType === "FREE_DELIVERY"
  );
  return (
    <div className="container mx-auto py-8 max-w-6xl px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {t("Order Details")} #{data?.id}
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 flex items-center gap-1.5">
            {t("Created on")} <DateCol date={data?.createdAt} />
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <CopyOrderButton orderId={data?.id} items={data?.OrderItems || []} storeCommission={data?.storeCommission} />
          <div className="flex gap-2">
            <TableStatusBadge status={data?.status} />
            <TableStatusBadge status={data?.paymentStatus} />
          </div>
          <OrderStatusSelect orderId={data?.id} status={data?.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Main Column */}
        <div className="lg:col-span-8 print:col-span-12 space-y-8">
          {/* Order Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("Order Items")}
            </h2>
            {data?.OrderItems && data?.OrderItems.length > 0 ? (
              <OrderItemsList items={data?.OrderItems} storeCommission={data?.storeCommission} />
            ) : (
              <div className="text-center text-muted-foreground py-6 border border-dashed rounded-lg bg-muted/10">
                {t("No items in this order")}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:hidden">
              {t("Payment Details")}
            </h2>
            <div className="bg-muted/30 dark:bg-muted/10 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3.5 text-sm print:hidden">
              <div className="flex justify-between">
                <span className="text-muted-foreground">- {t("productsPriceWithCommission") || "سعر المنتجات بالعمولة"}</span>
                <span className="font-medium">
                  <PriceAmount value={data?.price || 0} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- {t("productsPriceWithoutCommission") || "سعر المنتجات من غير العمولة"}</span>
                <span className="font-medium">
                  <PriceAmount value={Math.max(0, (data?.price || 0) - (data?.storeCommission || 0))} />
                </span>
              </div>
              {priceAfterDiscount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Price After Discount")}</span>
                  <span className="font-medium">
                    <PriceAmount value={priceAfterDiscount} />
                  </span>
                </div>
              )}
              {priceAfterTax !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Price After Tax")}</span>
                  <span className="font-medium">
                    <PriceAmount value={priceAfterTax} />
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  <span className="text-muted-foreground">- {t("Shipping")}</span>
                  {hasFreeDeliveryReward && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {t("freeDeliveryRewardKeepsTip")}
                    </p>
                  )}
                </div>
                <div className="text-end">
                  {hasFreeDeliveryReward && (
                    <Badge variant="success" className="mb-1">{t("Free delivery reward")}</Badge>
                  )}
                  <div className="font-medium">
                    <PriceAmount value={data?.shipping} />
                  </div>
                </div>
              </div>
              {data?.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Tax")}</span>
                  <span className="font-medium">
                    <PriceAmount value={data?.tax} />
                  </span>
                </div>
              )}
              {combinedDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-500 font-medium">
                  <div>
                    <span>- {t("Combined Discount")}</span>
                    <p className="text-xs font-normal text-muted-foreground">
                      {t("combinedDiscountHelper")}
                    </p>
                  </div>
                  <span>
                    - <PriceAmount value={combinedDiscount} />
                  </span>
                </div>
              )}
              {(data as any)?.globalCommission > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Platform Fee")}</span>
                  <span className="font-medium">
                    <PriceAmount value={(data as any)?.globalCommission} />
                  </span>
                </div>
              )}
              {(data as any)?.storeCommission > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Store Commission")}</span>
                  <span className="font-medium">
                    <PriceAmount value={(data as any)?.storeCommission} />
                  </span>
                </div>
              )}

              <Separator className="my-3 bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-slate-50">
                <span>{t("Total")}</span>
                <span>
                  <PriceAmount value={totalPrice} />
                </span>
              </div>
              <Separator className="my-3 bg-slate-200 dark:bg-slate-800" />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">- {t("Paid with Wallet")}</span>
                <Badge variant={data?.paidWithWallet ? "default" : "outline"} className="font-medium">
                  {data?.paidWithWallet ? t("Yes") : t("No")}
                </Badge>
              </div>
              {data?.adminCommission > 0 && (
                <div className="flex justify-between">
                  <div>
                    <span className="text-muted-foreground block">- {t("Admin Commission")}</span>
                    <span className="text-[11px] text-muted-foreground/70">
                      ({t("Platform Fee")} + {t("Store Commission")})
                    </span>
                  </div>
                  <span className="font-medium">
                    <PriceAmount value={data?.adminCommission} />
                  </span>
                </div>
              )}
              {data?.couponId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Coupon ID")}</span>
                  <span className="font-mono">#{data?.couponId}</span>
                </div>
              )}
              {rewardId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">- {t("Fortune Reward ID")}</span>
                  <Badge variant="outline" className="font-mono">
                    #{rewardId} · {t("reward applied")}
                  </Badge>
                </div>
              )}
              {(data?.transferNumer || data?.transferImage) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t("Bank Transfer Verification")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {(
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">{t("Reference Number")}</span>
                        <div className="font-mono text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-md select-all text-slate-800 dark:text-slate-200">
                          {data?.transferNumer ?? '-'}
                        </div>
                      </div>
                    )}
                    {data?.transferImage && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">{t("Receipt Image")}</span>
                        <a
                          href={getImageUrl(data?.transferImage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block relative border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-950/20 aspect-video hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-zoom-in"
                        >
                          <Image
                            src={getImageUrl(data?.transferImage)}
                            alt="Bank Transfer Receipt"
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                            <span className="text-xs font-semibold text-white bg-black/70 px-2.5 py-1.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                              {t("View Full Receipt")}
                            </span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Delivery Info */}
          {hasCustomDeliveryInfo && (
            <div className="space-y-4 print:hidden">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t("Custom Delivery Info")}
              </h2>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 bg-slate-50/50 dark:bg-slate-950/20">
                <InvoiceCustomDeliveryInfo
                  customDelivery={data?.invoice?.customDelivery}
                  stations={customDeliveryStations}
                  progress={(data as any)?.customDeliveryProgress}
                />
              </div>
            </div>
          )}

          {/* Complaints */}
          <div className="space-y-4 print:hidden">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t("Complaints")}
            </h2>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5">
              <ComplaintsList complaints={data?.Complaints} />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 lg:border-l lg:pl-8 border-slate-200 dark:border-slate-800 space-y-6 print:hidden">
          {/* Customer Info */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t("Customer Info")}
            </div>
            <CustomerInfo customer={data?.Customer} />
          </div>

          {/* Store Info */}
          {(data?.Branch || data?.invoice?.store) && (
            <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("Store Info")}
              </div>
              <StoreInfo branch={data?.Branch} invoice={data?.invoice} />
            </div>
          )}

          {/* Delivery Info */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {t("Delivery Info")}
              </div>
              <AssignOrderDeliveryDialog
                orderId={data?.id}
                currentDeliveryId={data?.Delivery?.User?.id}
                triggerLabel={t("Assign")}
                triggerVariant="outline"
                triggerSize="sm"
                disabled={!!data?.Delivery?.User?.id}
              />
            </div>
            <DeliveryInfo delivery={data?.Delivery} />

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground">{t("Note for Delivery")}</div>
                <NoteForDeliveryDialog
                  orderId={data?.id}
                  initialNote={data?.noteForDelivery}
                  triggerVariant="ghost"
                />
              </div>
              {data?.noteForDelivery ? (
                <div className="text-sm p-3 rounded-md bg-amber-50/50 dark:bg-amber-950/10 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-900/30 whitespace-pre-wrap">
                  {data?.noteForDelivery}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  {t("No delivery notes added yet.")}
                </div>
              )}
            </div>
          </div>

          {/* Address Info */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t("Address Info")}
            </div>
            <AddressInfo address={data?.Address} />
          </div>

          {/* Order Properties */}
          <div className="space-y-4">
            <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t("Order Details")}
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs mb-0.5">{t("Date")}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  <DateCol date={data?.date} />
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-0.5">{t("Type")}</span>
                <Badge variant="outline" className="font-normal capitalize mt-0.5">
                  {t(data?.type) || data?.type}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-0.5">{t("Payment Method")}</span>
                <Badge variant="secondary" className="font-normal capitalize mt-0.5">
                  {t(data?.paymentMethod) || data?.paymentMethod}
                </Badge>
              </div>
              {data?.estimatedArrivalMinutes > 0 && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-0.5">{t("Estimated Arrival")}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {data?.estimatedArrivalMinutes} {t("min")}
                  </span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block text-xs mb-0.5">{t("Can Deliver")}</span>
                <Badge variant={data?.canDeliver ? "default" : "destructive"} className="font-normal mt-0.5">
                  {data?.canDeliver ? t("Yes") : t("No")}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-0.5">{t("Rated")}</span>
                <Badge variant={data?.rated ? "default" : "outline"} className="font-normal mt-0.5">
                  {data?.rated ? t("Yes") : t("No")}
                </Badge>
              </div>
            </div>

            {data?.note && (
              <div className="pt-2">
                <span className="text-muted-foreground block text-xs mb-1">{t("Note")}</span>
                <div className="text-sm border border-slate-200 dark:border-slate-800 p-2.5 rounded bg-muted/20 text-slate-700 dark:text-slate-300">
                  {data?.note}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
