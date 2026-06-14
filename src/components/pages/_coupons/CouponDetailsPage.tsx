import { CouponsType } from "./coupons.schema";
import { CouponDetails } from "./details/CouponDetails";
import { CouponHero } from "./details/CouponHero";
import { CouponSidebar } from "./details/CouponSidebar";
import { CouponStats } from "./details/CouponStats";

interface CouponDetailsPageProps {
    data: CouponsType & {
        id: number;
        createdAt: string;
        UserCoupons?: any[];
        StoreCoupons?: any[];
        CouponZones?: any[];
        ZoneCoupons?: any[];
        ModuleCoupons?: any[];
    };
}

export default function CouponDetailsPage({ data }: CouponDetailsPageProps) {
    return (
        <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
            <CouponHero data={data as any} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <CouponStats data={data as any} />
                    <CouponDetails data={data as any} />
                </div>

                <div className="space-y-6">
                    <CouponSidebar data={data as any} />
                </div>
            </div>
        </div>
    );
}
