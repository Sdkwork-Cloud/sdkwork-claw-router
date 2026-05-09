export interface AdminUserBalanceAdjustmentRequest {
  /** Positive balance adjustment amount. */
  amount: number;
  /** Balance adjustment direction. */
  type: 'recharge' | 'refund';
}
