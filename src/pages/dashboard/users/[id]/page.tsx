import React from "react";
import { fetchData } from "@/api/global/fetchData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { Link } from "@/lib/navigation";

type Params = Promise<{ id: string }>;

export default async function UserDetailsPage({ params }: { params: Params }): Promise<JSX.Element> {
  const t = await getTranslations();
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const response = await fetchData(["users", Number(userId)]);
  const user = response?.data as any;

  if (!user) {
    return (
      <>
        <CustomHeader />
        <div className="container mx-auto py-12 text-center text-muted-foreground">
          {t("User not found") || "لم يتم العثور على المستخدم"}
        </div>
      </>
    );
  }

  const stats = user.orderStats || {
    totalOrders: user.Orders?.length ?? 0,
    completedOrders: user.Orders?.filter((o: any) => o.status === "DELIVERED").length ?? 0,
    cancelledOrders: user.Orders?.filter((o: any) => o.status === "CANCELLED" || o.status === "REJECTED").length ?? 0,
    totalSpent: user.Orders?.reduce((acc: number, o: any) => acc + (Number(o.totalPrice) || 0), 0) ?? 0
  };

  const addresses = user.Addresses || user.addresses || [];
  const orders = user.Orders || user.orders || [];

  return (
    <>
      <CustomHeader />
      <div className="container mx-auto py-6 max-w-6xl px-4 space-y-6">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/analytics?tab=customers"
              className="p-2 rounded-lg border hover:bg-muted transition-colors text-muted-foreground"
            >
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {user.name || "تفاصيل العميل"} #{user.id}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                تاريخ التسجيل: <DateCol date={user.createdAt} />
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <ShieldCheck className="h-4 w-4 me-1.5 text-emerald-500" />
            {user.roleKey || "Customer"}
          </Badge>
        </div>

        {/* User Card Header */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center min-w-24">
                {user.image ? (
                  <ImageCell cell={user.image} />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-2 text-center md:text-start">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-primary" />
                      <span dir="ltr">{user.phone}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">إجمالي الطلبات</p>
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                  {stats.totalOrders ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-indigo-500/20 text-indigo-600 rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">الطلبات المسلمة</p>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                  {stats.completedOrders ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-rose-800 dark:text-rose-300">الطلبات المكنسلة</p>
                <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-1">
                  {stats.cancelledOrders ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-rose-500/20 text-rose-600 rounded-xl">
                <XCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">إجمالي الإنفاق</p>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                  <PriceAmount value={stats.totalSpent ?? 0} />
                </h3>
              </div>
              <div className="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Addresses */}
        {addresses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                عناوين المسجلة للعميل ({addresses.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {addresses.map((addr: any, idx: number) => (
                <div key={addr.id || idx} className="p-3 rounded-lg border bg-muted/30 text-sm flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{addr.title || addr.adress || "عنوان"}</p>
                    {addr.adress && <p className="text-xs text-muted-foreground mt-0.5">{addr.adress}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Customer Orders History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              سجل الطلبيات السابقة ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">لا توجد طلبات سابقة للعميل حتى الآن.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground text-xs">
                      <th className="p-3 text-start">رقم الطلب</th>
                      <th className="p-3 text-start">التاريخ</th>
                      <th className="p-3 text-start">الحالة</th>
                      <th className="p-3 text-start">الإجمالي</th>
                      <th className="p-3 text-end">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-semibold">#{order.id}</td>
                        <td className="p-3"><DateCol date={order.createdAt} /></td>
                        <td className="p-3"><TableStatusBadge status={order.status} /></td>
                        <td className="p-3 font-semibold"><PriceAmount value={order.totalPrice ?? order.totalPriceAfterDiscount} /></td>
                        <td className="p-3 text-end">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            عرض الطلب ←
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
