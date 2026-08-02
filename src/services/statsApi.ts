import { apiFetch } from './apiClient';

export type RevenuePeriod = 'day' | 'week' | 'month' | 'year';

export interface RevenueBucket {
  key: string;
  label: string;
  accredited: number;
  pending: number;
  order_count: number;
}

export interface RevenueStats {
  period: RevenuePeriod;
  buckets: RevenueBucket[];
  totals: {
    accredited: number;
    pending: number;
    order_count: number;
  };
}

export const statsApi = {
  revenue: (period: RevenuePeriod) => apiFetch<RevenueStats>(`/admin/stats/revenue?period=${period}`),
};
