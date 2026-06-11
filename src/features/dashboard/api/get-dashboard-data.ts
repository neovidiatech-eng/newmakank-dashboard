import { fetchHelper } from "@/api/fetch";
import {
  type DashboardData,
  type DashboardStatistics,
  type OrdersStatisticsData,
  type TransactionsStatisticsData
} from "@/features/dashboard/types";

const DEFAULT_ORDERS_STATS: OrdersStatisticsData = {
  allOrders: 0,
  PENDING: 0,
  PREPARING: 0,
  READY_PICKUP: 0,
  ON_THE_WAY: 0,
  DELIVERED: 0,
  CANCELLED: 0,
  REJECTED: 0,
  PAYMENT_FAILD: 0,
  PENDING_PAYMENT: 0
};

export async function getDashboardData(): Promise<DashboardData> {
  const [transactionsStatistics, ordersStatistics, statistics] = await Promise.all([
    fetchHelper({ endPoint: ["transactionsStatistics"] }).catch(() => null),
    fetchHelper({ endPoint: ["ordersStatistics"] }).catch(() => null),
    fetchHelper({ endPoint: ["statistics"] }).catch(() => null)
  ]);

  const stats = (statistics?.data ?? {}) as DashboardStatistics;
  const transactionsData = (transactionsStatistics?.data ?? {}) as TransactionsStatisticsData;

  return {
    stats,
    hasStats: Boolean(statistics?.data),
    fundStats: transactionsData.FundStatistics ?? [],
    allTransactionSums: transactionsData.AllStatistic?._sum ?? {},
    hasTransactions: Boolean(transactionsStatistics?.data),
    ordersStats: (ordersStatistics?.data as OrdersStatisticsData) ?? DEFAULT_ORDERS_STATS,
    hasOrders: Boolean(ordersStatistics?.data)
  };
}
