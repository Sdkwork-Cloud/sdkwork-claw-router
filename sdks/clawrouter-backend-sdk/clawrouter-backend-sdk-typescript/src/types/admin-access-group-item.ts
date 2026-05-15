import type { AdminCapacityPair } from './admin-capacity-pair';
import type { AdminCountPair } from './admin-count-pair';
import type { AdminUsagePair } from './admin-usage-pair';

/** Persisted access group snapshot returned by the backend. */
export interface AdminAccessGroupItem {
  /** Account count field on admin access group item. */
  accountCount: AdminCountPair;
  /** Billing type field on admin access group item. */
  billingType: 'standard' | 'subscription';
  /** Capacity field on admin access group item. */
  capacity: AdminCapacityPair;
  /** Id field on admin access group item. */
  id: string;
  /** Name field on admin access group item. */
  name: string;
  /** Platform field on admin access group item. */
  platform: string;
  /** Rate multiplier field on admin access group item. */
  rateMultiplier: number;
  /** Status field on admin access group item. */
  status: 'active' | 'disabled';
  /** Type field on admin access group item. */
  type: 'public' | 'dedicated';
  /** Usage field on admin access group item. */
  usage: AdminUsagePair;
}
