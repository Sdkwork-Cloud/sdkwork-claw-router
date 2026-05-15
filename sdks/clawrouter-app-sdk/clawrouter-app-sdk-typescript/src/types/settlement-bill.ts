import type { SettlementBillBreakdown } from './settlement-bill-breakdown';

/** Settlement bill schema exposed by Claw Router. */
export interface SettlementBill {
  /** Breakdown field on settlement bill. */
  breakdown: SettlementBillBreakdown;
  /** End date field on settlement bill. */
  endDate: string;
  /** Id field on settlement bill. */
  id: string;
  /** Period field on settlement bill. */
  period: string;
  /** Start date field on settlement bill. */
  startDate: string;
  /** Status field on settlement bill. */
  status: string;
  /** Total cost field on settlement bill. */
  totalCost: string;
  /** Total tokens field on settlement bill. */
  totalTokens: string;
}
