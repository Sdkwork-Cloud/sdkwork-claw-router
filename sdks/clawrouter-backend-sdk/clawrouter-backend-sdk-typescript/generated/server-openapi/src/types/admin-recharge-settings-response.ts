/** Admin recharge settings response schema exposed by Claw Router. */
export interface AdminRechargeSettingsResponse {
  /** Base currency code field on admin recharge settings response. */
  baseCurrencyCode: string;
  /** Base points per cny field on admin recharge settings response. */
  basePointsPerCny: string;
  /** Currency to cny rates field on admin recharge settings response. */
  currencyToCnyRates: Record<string, string>;
}
