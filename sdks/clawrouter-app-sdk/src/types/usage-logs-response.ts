import type { UsageLogItem } from './usage-log-item';

export interface UsageLogsResponse {
  logs: UsageLogItem[];
  pageNo: number;
  pageSize: number;
  total: number;
}
