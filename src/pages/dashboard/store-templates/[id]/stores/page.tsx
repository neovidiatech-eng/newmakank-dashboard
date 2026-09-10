import { useEffect, useState, useMemo } from "react";
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link, useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  RotateCcw,
  Save,
  Search,
  Store,
  Sparkles
} from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { getEnv } from "@/lib/env";

const imgUrl = getEnv("VITE_API_IMG_URL") || "";

interface StoreItem {
  id: number;
  storeId: number;
  templateId: number;
  order: number;
  appliedAt: string;
  store: {
    id: number;
    name: { ar?: string; en?: string } | string;
    logo?: string | null;
    cover?: string | null;
    cityId?: number | null;
    cityName?: { ar?: string; en?: string } | string | null;
    branch?: {
      id: number;
      address?: string | null;
      phone?: string | null;
      isActive?: boolean;
      closed?: boolean;
    } | null;
  };
}

interface TemplateDetails {
  id: number;
  name: { ar?: string; en?: string } | string;
  image?: string | null;
  moduleType?: string | null;
}

export default function SectionStoresPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const templateId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const resolveText = (val?: { ar?: string; en?: string } | string | null): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[locale as "ar" | "en"] || val.ar || val.en || "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [templateRes, storesRes] = await Promise.all([
        fetchHelper<TemplateDetails>({
          endPoint: ["storeTemplates", templateId],
          redirectOnUnauthorized: false
        }),
        fetchHelper<StoreItem[]>({
          endPoint: ["storeTemplates", templateId, "templateStores"],
          redirectOnUnauthorized: false
        })
      ]);

      if (templateRes?.data) {
        setTemplate(templateRes.data);
      }

      if (storesRes?.data && Array.isArray(storesRes.data)) {
        setStores(storesRes.data);
        const map: Record<number, number> = {};
        for (const item of storesRes.data) {
          map[item.storeId] = item.order ?? 0;
        }
        setOrderMap(map);
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "فشل في تحميل البيانات" : "Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) {
      loadData();
    }
  }, [templateId]);

  const handleOrderChange = (storeId: number, value: string) => {
    const num = parseInt(value, 10);
    setOrderMap((prev) => ({
      ...prev,
      [storeId]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const moveOrder = (storeId: number, delta: number) => {
    setOrderMap((prev) => {
      const current = prev[storeId] ?? 0;
      return {
        ...prev,
        [storeId]: Math.max(0, current + delta)
      };
    });
  };

  const autoNumberFiltered = () => {
    const updated = { ...orderMap };
    filteredStores.forEach((item, index) => {
      updated[item.storeId] = index + 1;
    });
    setOrderMap(updated);
    toast.info(isRtl ? "تم الترقيم التلقائي (1, 2, 3...)" : "Auto-numbered sequentially");
  };

  const resetAllToZero = () => {
    const updated = { ...orderMap };
    stores.forEach((item) => {
      updated[item.storeId] = 0;
    });
    setOrderMap(updated);
    toast.info(isRtl ? "تم تصفير جميع الترتيبات" : "Reset all orders to 0");
  };

  const hasChanges = useMemo(() => {
    for (const item of stores) {
      if ((orderMap[item.storeId] ?? 0) !== (item.order ?? 0)) {
        return true;
      }
    }
    return false;
  }, [stores, orderMap]);

  const saveOrders = async () => {
    setSaving(true);
    try {
      const orders = Object.entries(orderMap).map(([storeId, order]) => ({
        storeId: Number(storeId),
        order: Number(order)
      }));

      const res = await fetchHelper({
        endPoint: ["storeTemplates", templateId, "templateStores", "templateStoresOrder"],
        method: "PATCH",
        body: { orders },
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تم حفظ ترتيب المتاجر بنجاح" : "Store orders saved successfully");
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل حفظ الترتيب" : "Failed to save orders"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ غير متوقع" : "Unexpected error occurred"));
    } finally {
      setSaving(false);
    }
  };

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase().trim();
    return stores.filter((item) => {
      const nameAr = typeof item.store.name === "object" ? item.store.name?.ar?.toLowerCase() : "";
      const nameEn = typeof item.store.name === "object" ? item.store.name?.en?.toLowerCase() : "";
      const rawName = typeof item.store.name === "string" ? item.store.name.toLowerCase() : "";
      const idStr = String(item.storeId);
      return (
        idStr.includes(q) ||
        (nameAr && nameAr.includes(q)) ||
        (nameEn && nameEn.includes(q)) ||
        (rawName && rawName.includes(q))
      );
    });
  }, [stores, searchQuery]);

  return (
    <>
      <CustomHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/store-templates")}
              title={isRtl ? "رجوع للأقسام" : "Back to templates"}
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {isRtl ? "إدارة وترتيب متاجر القسم" : "Manage & Order Section Stores"}
                </h1>
                {template && (
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {resolveText(template.name)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRtl
                  ? "حدد أولوية ظهور المتاجر داخل هذا القسم فقط. المتاجر ذات الترتيب (1, 2, 3...) تظهر أولاً، بينما الترتيب (0) يظهر في النهاية."
                  : "Set custom store ordering for this section. Stores with order > 0 appear first, 0 appears at the end."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={saveOrders}
              disabled={saving || !hasChanges}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isRtl ? "حفظ الترتيب" : "Save Order"}</span>
              {hasChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {/* Action Controls & Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={isRtl ? "البحث بالاسم أو الرقم التعريفي للمتجر..." : "Search by name or store ID..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoNumberFiltered}
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{isRtl ? "ترقيم تلقائي (1, 2, 3...)" : "Auto-number"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllToZero}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isRtl ? "تصفير الكل (0)" : "Reset all"}</span>
                </Button>

                <Badge variant="outline" className="px-3 py-1 text-xs">
                  {isRtl
                    ? `إجمالي المتاجر: ${stores.length}`
                    : `Total Stores: ${stores.length}`}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "جاري تحميل متاجر القسم..." : "Loading section stores..."}
                </p>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Store className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-base font-medium">
                  {searchQuery
                    ? (isRtl ? "لا توجد نتائج تطابق بحثك" : "No stores match your search")
                    : (isRtl ? "لا توجد متاجر مضافة لهذا القسم حتى الآن" : "No stores applied to this section yet")}
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isRtl
                    ? "يمكنك تطبيق هذا القسم على المتاجر من خلال صفحة المتاجر أو تطبيق القوالب."
                    : "You can apply this section template to stores from the Stores page."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-24 text-center font-bold">
                        {isRtl ? "الترتيب" : "Order"}
                      </TableHead>
                      <TableHead className="w-16 text-center">
                        {isRtl ? "الشعار" : "Logo"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "اسم المتجر" : "Store Name"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "المدينة" : "City"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "حالة المتجر" : "Status"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "تاريخ الإضافة" : "Applied At"}
                      </TableHead>
                      <TableHead className="w-20 text-center">
                        {isRtl ? "عرض" : "View"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((item) => {
                      const currentOrder = orderMap[item.storeId] ?? 0;
                      const hasChanged = currentOrder !== (item.order ?? 0);
                      const isRanked = currentOrder > 0;
                      const store = item.store;
                      const branch = store.branch;
                      const isClosed = branch?.closed || false;
                      const isActive = branch?.isActive ?? true;

                      return (
                        <TableRow
                          key={item.storeId}
                          className={hasChanged ? "bg-amber-50/50 dark:bg-amber-950/20" : undefined}
                        >
                          {/* Order Input */}
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                value={currentOrder}
                                onChange={(e) => handleOrderChange(item.storeId, e.target.value)}
                                className={`w-20 h-9 text-center font-bold ${
                                  isRanked
                                    ? "border-primary text-primary bg-primary/5"
                                    : "text-muted-foreground border-dashed"
                                }`}
                              />
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => moveOrder(item.storeId, 1)}
                                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                  title={isRtl ? "زيادة الترتيب" : "Increase order"}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveOrder(item.storeId, -1)}
                                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                  title={isRtl ? "إنقاص الترتيب" : "Decrease order"}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </TableCell>

                          {/* Logo */}
                          <TableCell className="text-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border mx-auto bg-muted/20 flex items-center justify-center">
                              {store.logo ? (
                                <img
                                  src={imgUrl + store.logo}
                                  alt={resolveText(store.name)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Store className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>

                          {/* Store Name & ID */}
                          <TableCell>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-2">
                                <span>{resolveText(store.name)}</span>
                                {isRanked ? (
                                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[10px] px-1.5 py-0.5">
                                    {isRtl ? `المركز #${currentOrder}` : `Rank #${currentOrder}`}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] text-muted-foreground px-1.5 py-0.5 border-dashed">
                                    {isRtl ? "افتراضي (0)" : "Default (0)"}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ID: #{store.id}
                              </span>
                            </div>
                          </TableCell>

                          {/* City */}
                          <TableCell>
                            <span className="text-sm">
                              {resolveText(store.cityName) || (isRtl ? "غير محدد" : "Unspecified")}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            {isClosed ? (
                              <Badge variant="destructive" className="text-xs font-normal">
                                {isRtl ? "مغلق" : "Closed"}
                              </Badge>
                            ) : !isActive ? (
                              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                {isRtl ? "معطل" : "Inactive"}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs font-normal bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                {isRtl ? "مفتوح ومفعل" : "Open & Active"}
                              </Badge>
                            )}
                          </TableCell>

                          {/* Applied At */}
                          <TableCell className="text-xs text-muted-foreground">
                            {item.appliedAt ? new Date(item.appliedAt).toLocaleDateString(isRtl ? "ar-EG" : "en-US") : "—"}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="text-center">
                            <Link
                              href={`/stores/${store.id}`}
                              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title={isRtl ? "عرض تفاصيل المتجر" : "View store details"}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
