import type { CommercePaymentRouteRuleListResponse } from './commerce-payment-route-rule-list-response';

/** Payments route rules list result schema exposed by Claw Router. */
export interface PaymentsRouteRulesListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments route rules list result. */
  data?: CommercePaymentRouteRuleListResponse;
  /** Human-readable response message. */
  msg?: string;
}
