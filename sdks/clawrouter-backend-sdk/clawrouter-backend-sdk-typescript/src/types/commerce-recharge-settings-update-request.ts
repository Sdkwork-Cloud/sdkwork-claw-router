/** Commerce recharge settings update request schema exposed by Claw Router. */
export interface CommerceRechargeSettingsUpdateRequest {
  /** Base currency code field on commerce recharge settings update request. */
  baseCurrencyCode: string;
  /** Base points per cny field on commerce recharge settings update request. */
  basePointsPerCny: string;
  /** Currency to cny rates field on commerce recharge settings update request. */
  currencyToCnyRates: Record<string, string>;
}
