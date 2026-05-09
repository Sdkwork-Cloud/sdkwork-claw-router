import type { SettlementBill } from './settlement-bill';
import type { SettlementChartPoint } from './settlement-chart-point';

export interface SettlementDashboardResponse {
  bills: SettlementBill[];
  chartData: SettlementChartPoint[];
}
