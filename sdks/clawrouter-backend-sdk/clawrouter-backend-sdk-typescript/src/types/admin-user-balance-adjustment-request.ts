/** Admin user balance adjustment request schema exposed by Claw Router. */
export interface AdminUserBalanceAdjustmentRequest {
  /** Positive balance adjustment amount. */
  amount: number;
  /** Balance adjustment direction. */
  type: 'recharge' | 'refund';
}
