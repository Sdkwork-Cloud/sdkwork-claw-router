import type { StorageUsageLedgerListResponse } from './storage-usage-ledger-list-response';

/** Oss usage ledger list result schema exposed by Claw Router. */
export interface OssUsageLedgerListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss usage ledger list result. */
  data?: StorageUsageLedgerListResponse;
  /** Human-readable response message. */
  msg?: string;
}
