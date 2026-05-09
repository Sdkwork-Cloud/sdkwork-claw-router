import type { DashboardAnnouncement } from './dashboard-announcement';
import type { DashboardChartPoint } from './dashboard-chart-point';
import type { DashboardOverviewSummary } from './dashboard-overview-summary';
import type { DashboardSparklinePoint } from './dashboard-sparkline-point';
import type { DashboardTopModel } from './dashboard-top-model';

export interface DashboardOverviewResponse {
  announcements: DashboardAnnouncement[];
  chartData: DashboardChartPoint[];
  multimodalSparkline: DashboardSparklinePoint[];
  performanceSparkline: DashboardSparklinePoint[];
  requestSparkline: DashboardSparklinePoint[];
  summary: DashboardOverviewSummary;
  topModels: DashboardTopModel[];
  warnings: string[];
}
