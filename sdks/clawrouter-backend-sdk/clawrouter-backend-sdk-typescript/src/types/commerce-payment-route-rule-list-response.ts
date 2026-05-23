import type { CommercePaymentRouteRuleItem } from './commerce-payment-route-rule-item';

/** Commerce payment route rule list response schema exposed by Claw Router. */
export interface CommercePaymentRouteRuleListResponse {
  /** Items field on commerce payment route rule list response. */
  items: CommercePaymentRouteRuleItem[];
  /** Page field on commerce payment route rule list response. */
  page: number;
  /** Page size field on commerce payment route rule list response. */
  pageSize: number;
  /** Total field on commerce payment route rule list response. */
  total: number;
}
