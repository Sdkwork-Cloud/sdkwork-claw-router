import type { OpsAlertEventRecord } from './ops-alert-event-record';

export interface FetchAlertsResult {
  /** Business response code. */
  code: string;
  data?: OpsAlertEventRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
