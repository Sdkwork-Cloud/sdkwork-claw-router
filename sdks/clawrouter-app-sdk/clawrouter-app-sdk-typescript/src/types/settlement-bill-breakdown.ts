import type { SettlementBillBreakdownItem } from './settlement-bill-breakdown-item';

/** Settlement bill breakdown schema exposed by Claw Router. */
export interface SettlementBillBreakdown {
  /** Audio field on settlement bill breakdown. */
  audio: SettlementBillBreakdownItem;
  /** Image field on settlement bill breakdown. */
  image: SettlementBillBreakdownItem;
  /** Music field on settlement bill breakdown. */
  music: SettlementBillBreakdownItem;
  /** Text field on settlement bill breakdown. */
  text: SettlementBillBreakdownItem;
  /** Video field on settlement bill breakdown. */
  video: SettlementBillBreakdownItem;
}
