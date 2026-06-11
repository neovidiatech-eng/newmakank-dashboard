export interface FundStatistic {
  type: string;
  totalCredit: number;
}

export interface DashboardStatistics {
  totalCustomers?: number;
  totalStores?: number;
  totalOrders?: number;
  totalCoupons?: number;
  groupByCustomers?: Array<{ _count?: { _all?: number } }>;
  groupByStores?: Array<{ _count?: { _all?: number } }>;
}

export interface OrdersStatisticsData {
  allOrders: number;
  PENDING: number;
  PREPARING: number;
  READY_PICKUP: number;
  ON_THE_WAY: number;
  DELIVERED: number;
  CANCELLED: number;
  REJECTED: number;
  PAYMENT_FAILD: number;
  PENDING_PAYMENT: number;
}

export interface TransactionsStatisticsData {
  FundStatistics?: FundStatistic[];
  AllStatistic?: {
    _sum?: {
      credit?: number;
      debit?: number;
    };
  };
}

export interface DashboardData {
  stats: DashboardStatistics;
  hasStats: boolean;
  fundStats: FundStatistic[];
  allTransactionSums: { credit?: number; debit?: number };
  hasTransactions: boolean;
  ordersStats: OrdersStatisticsData;
  hasOrders: boolean;
}
