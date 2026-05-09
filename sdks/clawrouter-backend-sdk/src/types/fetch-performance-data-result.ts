import type { OpsMetricSnapshotRecord } from './ops-metric-snapshot-record';

export interface FetchPerformanceDataResult {
  /** Business response code. */
  code: string;
  data?: OpsMetricSnapshotRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
