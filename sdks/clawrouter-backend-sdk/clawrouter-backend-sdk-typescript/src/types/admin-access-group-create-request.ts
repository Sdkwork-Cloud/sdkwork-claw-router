/** Admin access group create request schema exposed by Claw Router. */
export interface AdminAccessGroupCreateRequest {
  /** Billing contract attached to the access group. */
  billingType?: 'standard' | 'subscription';
  /** Capacity field on admin access group create request. */
  capacity?: Record<string, unknown>;
  /** Access group display name. */
  name: string;
  /** Normalized upstream platform code. */
  platform?: string;
  /** Customer rate multiplier rounded to six decimals. */
  rateMultiplier?: number;
  /** Status field on admin access group create request. */
  status?: 'active' | 'disabled';
  /** Access group allocation mode. */
  type?: 'public' | 'dedicated';
}
