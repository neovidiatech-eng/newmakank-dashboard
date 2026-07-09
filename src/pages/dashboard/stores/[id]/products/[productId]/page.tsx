
import { fetchData } from "@/api/global/fetchData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { getTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";

async function Page({ params }: { params: Promise<{ id: string, productId: string, locale: string }> }): Promise<JSX.Element> {
    const t = await getTranslations();
    const { id, productId, locale } = await params;
    const response = await fetchData(["services", Number(productId)]);
    const data = response?.data as ServicesEntity | undefined;

    if (!data) {
        return <div>{t("Service not found")}</div>;
    }

    const currentLocale = locale || "en";
    const title = data?.name?.[currentLocale] ?? data?.name?.en ?? "Service";
    const description = data?.description?.[currentLocale] ?? data?.description?.en ?? "";

    const storeName = typeof data?.Store?.name === 'object'
        ? (data?.Store?.name?.[currentLocale as keyof ApiResponseName] || data?.Store?.name?.en)
        : data?.Store?.name;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="overflow-hidden border-none shadow-md">
                        <div className="relative h-80 w-full group">
                            {data?.image ? (
                                <Image src={getEnv("VITE_API_IMG_URL") + data?.image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                                    {t("No image")}
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {data?.bestRated && (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 border-none px-3 py-1">
                                        {t("Best Rated")}
                                    </Badge>
                                )}
                                {data?.mostSeller && (
                                    <Badge className="bg-orange-500 hover:bg-orange-600 border-none px-3 py-1">
                                        {t("Most Seller")}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <CardTitle className="text-3xl font-bold mb-2">{title}</CardTitle>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Badge variant="outline" className="rounded-full">
                                            {data?.Category?.name}
                                        </Badge>
                                        <span>•</span>
                                        <span className="text-sm">{data?.Module?.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">
                                        {data?.priceWithDefaultOptions || data?.price} EGP
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {t("Starting from")}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y my-6 border-muted/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase">{t("Status")}</span>
                                    <Badge className="w-fit" variant={data?.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {data?.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase">{t("Duration")}</span>
                                    <span className="font-semibold">{data?.durationMinutes} {t("minutes")}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase">{t("Orders")}</span>
                                    <span className="font-semibold text-primary">{data?.totalOrders}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase">{t("Rating")}</span>
                                    <div className="flex items-center gap-1 font-semibold text-yellow-500">
                                        {data?.rating} <span className="text-muted-foreground text-xs font-normal">({data?.review})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{t("Description")}</h3>
                                <div className="text-muted-foreground leading-relaxed">
                                    {description || t("No description provided")}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-muted/50">
                                {/* Sizes Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        {t("Sizes")}
                                        <Badge variant="outline" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                                            {data?.Sizes?.length || 0}
                                        </Badge>
                                    </h3>
                                    {data?.Sizes && data.Sizes.length > 0 ? (
                                        <div className="space-y-2">
                                            {data.Sizes.map((size: any) => (
                                                <div key={size.id} className={`flex justify-between items-center p-3 rounded-lg border \${size.isDefault ? 'bg-primary/5 border-primary/20' : 'border-muted/30'}`}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">
                                                            {size.name?.[currentLocale] || size.name?.en}
                                                        </span>
                                                        {size.isDefault && (
                                                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                                                {t("Default")}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-primary">+{size.price} EGP</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">{t("No sizes available")}</div>
                                    )}
                                </div>

                                {/* Addons Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        {t("Addons")}
                                        <Badge variant="outline" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                                            {data?.Addons?.length || 0}
                                        </Badge>
                                    </h3>
                                    {data?.Addons && data.Addons.length > 0 ? (
                                        <div className="space-y-2">
                                            {data.Addons.map((addon: any) => (
                                                <div key={addon.id} className="flex justify-between items-center p-3 rounded-lg border border-muted/30 hover:border-muted-foreground/20 transition-colors">
                                                    <span className="font-medium text-sm">
                                                        {addon.name?.[currentLocale] || addon.name?.en}
                                                    </span>
                                                    <span className="font-bold text-primary">+{addon.price} EGP</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">{t("No addons available")}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <Link href={`/stores/${id}`} className="flex-1">
                                    <Button variant="outline" className="w-full h-11">
                                        {t("Back to Store")}
                                    </Button>
                                </Link>
                                <Link href={`/stores/${id}/products/${productId}/edit`} className="flex-1">
                                    <Button className="w-full h-11">
                                        {t("Edit Product")}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className="space-y-6">
                    <Card className="overflow-hidden border-none shadow-md">
                        <div className="relative h-32 w-full">
                            {data?.Store?.cover ? (
                                <Image src={data?.Store.cover} alt={String(storeName || "")} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full bg-primary/10" />
                            )}
                        </div>
                        <CardContent className="px-6 pb-6 pt-0 relative">
                            <div className="relative -mt-10 mb-4 flex justify-center">
                                <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-lg ring-4 ring-background overflow-hidden">
                                    {data?.Store?.logo ? (
                                        <div className="relative h-full w-full rounded-lg overflow-hidden">
                                            <Image
                                                src={data?.Store.logo}
                                                alt={String(storeName || "")}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full w-full bg-muted flex items-center justify-center font-bold text-2xl text-primary">
                                            {String(storeName || "?").charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <CardTitle className="text-xl">
                                    {storeName}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                    <span className="flex items-center text-yellow-500">★ {data?.Store?.rating}</span>
                                    <span>•</span>
                                    <span>{data?.Store?.review} {t("reviews")}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-muted/50 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("Address")}</div>
                                    <div className="text-sm leading-snug">{data?.Store?.address || t("No address available")}</div>
                                </div>

                                <Link href={`/stores/${id}`}>
                                    <Button variant="ghost" className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/5">
                                        {t("Visit Store Page")}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {t("Statistics")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("Total Sales")}</span>
                                <span className="font-bold">{data?.totalAmountSold} EGP</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t("Sales Growth")}</span>
                                <span className="text-green-500 font-medium">↑ 12%</span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

export default Page;

interface ApiResponseName {
    ar: string;
    en: string;
}

interface ApiResponseDescription {
    ar: string;
    en: string;
}

interface ApiResponseStore {
    id: number;
    name: ApiResponseName | string;
    logo: string;
    cover: string;
    rating: number;
    review: number;
    address: string;
}

interface CategoryEntity {
    id: number;
    name: string;
}

interface ModuleEntity {
    id: number;
    name: string;
}

interface ServicesEntity {
    id: number;
    name: ApiResponseName;
    description: ApiResponseDescription;
    price: number;
    priceWithDefaultOptions: number;
    image: string;
    status: string;
    bestRated: boolean;
    mostSeller: boolean;
    durationMinutes: number;
    totalOrders: number;
    rating: number;
    review: number;
    totalAmountSold: number;
    Category: CategoryEntity;
    Module: ModuleEntity;
    Store: ApiResponseStore;
    Sizes: any[];
    Addons: any[];
}
