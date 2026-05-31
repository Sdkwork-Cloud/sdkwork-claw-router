/** Commerce recharge settings response schema exposed by Claw Router. */
export interface CommerceRechargeSettingsResponse {
  /** Base currency code field on commerce recharge settings response. */
  baseCurrencyCode: string;
  /** Base points per cny field on commerce recharge settings response. */
  basePointsPerCny: string;
  /** Currency to cny rates field on commerce recharge settings response. */
  currencyToCnyRates: Record<string, string>;
  /** Preview examples field on commerce recharge settings response. */
  previewExamples?: Record<string, Record<string, Record<string, unknown>>>;
}
