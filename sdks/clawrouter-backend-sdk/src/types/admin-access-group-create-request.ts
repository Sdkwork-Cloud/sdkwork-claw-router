export interface AdminAccessGroupCreateRequest {
  /** Billing contract attached to the access group. */
  billingType?: 'standard' | 'subscription';
  capacity?: Record<string, unknown>;
  /** Access group display name. */
  name: string;
  /** Normalized upstream platform code. */
  platform?: string;
  /** Customer rate multiplier rounded to six decimals. */
  rateMultiplier?: number;
  status?: 'active' | 'disabled';
  /** Access group allocation mode. */
  type?: 'public' | 'dedicated';
}
