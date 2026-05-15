import type { SettlementBill } from './settlement-bill';
import type { SettlementChartPoint } from './settlement-chart-point';

/** Settlement dashboard response schema exposed by Claw Router. */
export interface SettlementDashboardResponse {
  /** Bills field on settlement dashboard response. */
  bills: SettlementBill[];
  /** Chart data field on settlement dashboard response. */
  chartData: SettlementChartPoint[];
}
