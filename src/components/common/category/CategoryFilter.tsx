import { cn } from "@/lib/utils";
import { ORDER_STATUS_OPTIONS, type OrderStatus } from "@/utils/options/orderStatusOptions";
import { motion } from "framer-motion";
import {
  Bike,
  CheckCircle2,
  Clock,
  CreditCard,
  LayoutGrid,
  PackageSearch,
  Store,
  ThumbsDown,
  Wallet,
  XCircle
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation";
import { useCallback } from "react";

const STATUS_CONFIG: Record<
  OrderStatus | "ALL",
  { color: string; icon: React.ElementType; label: string }
> = {
  ALL: { color: "bg-slate-500", icon: LayoutGrid, label: "All" },
  PENDING: { color: "bg-amber-500", icon: Clock, label: "Pending" },
  PREPARING: { color: "bg-blue-500", icon: PackageSearch, label: "Preparing" },
  READY_PICKUP: { color: "bg-emerald-500", icon: Store, label: "Ready Pickup" },
  ON_THE_WAY: { color: "bg-violet-500", icon: Bike, label: "On The Way" },
  DELIVERED: { color: "bg-green-600", icon: CheckCircle2, label: "Delivered" },
  CANCELLED: { color: "bg-rose-500", icon: XCircle, label: "Cancelled" },
  REJECTED: { color: "bg-red-500", icon: ThumbsDown, label: "Rejected" },
  PAYMENT_FAILD: { color: "bg-orange-500", icon: CreditCard, label: "Payment Failed" },
  PENDING_PAYMENT: { color: "bg-yellow-500", icon: Wallet, label: "Pending Payment" }
};

export interface StatusOption {
  key: string;
  label: string;
  icon?: React.ElementType;
  color?: string;
}

interface CategoryFilterProps {
  className?: string;
  filterKey?: string;
  options?: StatusOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

const DEFAULT_OPTIONS: StatusOption[] = [
  { key: "ALL", label: "All", icon: LayoutGrid, color: "bg-slate-500" },
  ...ORDER_STATUS_OPTIONS.map(status => ({
    key: status,
    label: status,
    icon: STATUS_CONFIG[status].icon,
    color: STATUS_CONFIG[status].color
  }))
];

export default function CategoryFilter({
  className,
  value: controlledValue,
  onValueChange,
  filterKey = "status",
  options = DEFAULT_OPTIONS
}: CategoryFilterProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = controlledValue ?? (searchParams.get(filterKey) || "ALL");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleStatusChange = (status: string) => {
    if (onValueChange) {
      onValueChange(status);
    } else {
      router.push(pathname + "?" + createQueryString(filterKey, status), { scroll: false });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1",
        className
      )}
    >
      {options.map(option => {
        const Icon = option.icon;
        const color = option.color || "bg-primary";
        const isActive = currentStatus === option.key;

        return (
          <button
            key={option.key}
            onClick={() => handleStatusChange(option.key)}
            className={cn(
              "group relative flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 border",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105 z-10"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
          >
            {Icon && (
              <div
                className={cn(
                  "p-1 rounded-full transition-colors duration-300",
                  isActive ? "bg-white/20" : cn("bg-opacity-10", color.replace("bg-", "bg-"))
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-white" : color.replace("bg-", "text-")
                  )}
                />
              </div>
            )}
            <span className="text-sm font-medium tracking-tight">{t(option.label)}</span>

            {isActive && (
              <motion.div
                layoutId="activeStatus"
                className="absolute inset-0 rounded-full bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
