import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeftRight,
  BadgeDollarSign,
  Banknote,
  Building2,
  CheckCircle2,
  ChefHat,
  Clock,
  Coins,
  CreditCard,
  Hourglass,
  Package,
  PackageCheck,
  ShieldAlert,
  ShoppingBag,
  Store,
  Ticket,
  Truck,
  UserPlus,
  Users,
  Wallet,
  XCircle
} from "lucide-react";

import type { DashboardStatistics, FundStatistic, OrdersStatisticsData } from "@/features/dashboard/types";

export const DASHBOARD_CARD_MOTION = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

export const FUND_ICONS: LucideIcon[] = [Coins, Wallet, CreditCard, Banknote, ArrowLeftRight];

interface StatCardConfig {
  title: string;
  value: number;
  icon: LucideIcon;
  className: string;
}

export function getOverviewStatCards(stats: DashboardStatistics): StatCardConfig[] {
  return [
    {
      title: "dashboard.totalCustomers",
      value: stats.totalCustomers ?? 0,
      icon: Users,
      className: "bg-sky-100 text-sky-600"
    },
    {
      title: "dashboard.totalStores",
      value: stats.totalStores ?? 0,
      icon: Store,
      className: "bg-violet-100 text-violet-600"
    },
    {
      title: "dashboard.totalOrders",
      value: stats.totalOrders ?? 0,
      icon: ShoppingBag,
      className: "bg-amber-100 text-amber-600"
    },
    {
      title: "dashboard.totalCoupons",
      value: stats.totalCoupons ?? 0,
      icon: Ticket,
      className: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "dashboard.newCustomers",
      value: stats.groupByCustomers?.[0]?._count?._all ?? 0,
      icon: UserPlus,
      className: "bg-sky-50 text-sky-600"
    },
    {
      title: "dashboard.newStores",
      value: stats.groupByStores?.[0]?._count?._all ?? 0,
      icon: Building2,
      className: "bg-violet-50 text-violet-600"
    }
  ];
}

export function getOrderStatCards(ordersStats: OrdersStatisticsData): StatCardConfig[] {
  return [
    {
      title: "dashboard.allOrders",
      value: ordersStats.allOrders,
      icon: Package,
      className: "bg-purple-100 text-purple-600"
    },
    {
      title: "dashboard.pendingOrders",
      value: ordersStats.PENDING,
      icon: Clock,
      className: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "dashboard.preparingOrders",
      value: ordersStats.PREPARING,
      icon: ChefHat,
      className: "bg-orange-100 text-orange-600"
    },
    {
      title: "dashboard.readyForPickup",
      value: ordersStats.READY_PICKUP,
      icon: PackageCheck,
      className: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "dashboard.onTheWay",
      value: ordersStats.ON_THE_WAY,
      icon: Truck,
      className: "bg-teal-100 text-teal-600"
    },
    {
      title: "dashboard.deliveredOrders",
      value: ordersStats.DELIVERED,
      icon: CheckCircle2,
      className: "bg-green-100 text-green-600"
    },
    {
      title: "dashboard.cancelledOrders",
      value: ordersStats.CANCELLED,
      icon: XCircle,
      className: "bg-red-100 text-red-600"
    },
    {
      title: "dashboard.rejectedOrders",
      value: ordersStats.REJECTED,
      icon: ShieldAlert,
      className: "bg-gray-100 text-gray-600"
    },
    {
      title: "dashboard.paymentFailed",
      value: ordersStats.PAYMENT_FAILD,
      icon: AlertTriangle,
      className: "bg-red-100 text-red-600"
    },
    {
      title: "dashboard.pendingPayment",
      value: ordersStats.PENDING_PAYMENT,
      icon: Hourglass,
      className: "bg-yellow-100 text-yellow-600"
    }
  ];
}

export function getFundStatCards(fundStats: FundStatistic[]): StatCardConfig[] {
  return fundStats.map((stat, index) => ({
    title: stat.type,
    value: stat.totalCredit,
    icon: FUND_ICONS[index % FUND_ICONS.length],
    className: "bg-blue-100 text-blue-600"
  }));
}

export const TRANSACTION_TOTAL_CARDS = [
  {
    title: "dashboard.totalCredit",
    sumKey: "credit",
    icon: BadgeDollarSign,
    className: "bg-green-100 text-green-600"
  },
  {
    title: "dashboard.totalDebit",
    sumKey: "debit",
    icon: CreditCard,
    className: "bg-red-100 text-red-600"
  }
] as const;
