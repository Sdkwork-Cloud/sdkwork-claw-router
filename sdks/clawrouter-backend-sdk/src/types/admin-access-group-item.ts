import type { AdminCapacityPair } from './admin-capacity-pair';
import type { AdminCountPair } from './admin-count-pair';
import type { AdminUsagePair } from './admin-usage-pair';

/** Persisted access group snapshot returned by the backend. */
export interface AdminAccessGroupItem {
  accountCount: AdminCountPair;
  billingType: 'standard' | 'subscription';
  capacity: AdminCapacityPair;
  id: string;
  name: string;
  platform: string;
  rateMultiplier: number;
  status: 'active' | 'disabled';
  type: 'public' | 'dedicated';
  usage: AdminUsagePair;
}
