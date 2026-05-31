/** Commerce payment route decision record schema exposed by Claw Router. */
export interface CommercePaymentRouteDecisionRecord {
  /** Amount field on commerce payment route decision record. */
  amount: string;
  /** Channel id field on commerce payment route decision record. */
  channel_id: string;
  /** Country code field on commerce payment route decision record. */
  country_code?: string;
  /** Created at field on commerce payment route decision record. */
  created_at: string;
  /** Currency code field on commerce payment route decision record. */
  currency_code: string;
  /** Decision reason field on commerce payment route decision record. */
  decision_reason?: string;
  /** Fallback from channel id field on commerce payment route decision record. */
  fallback_from_channel_id?: string;
  /** Method code field on commerce payment route decision record. */
  method_code: string;
  /** Organization id field on commerce payment route decision record. */
  organization_id?: string;
  /** Payment attempt id field on commerce payment route decision record. */
  payment_attempt_id: string;
  /** Payment intent id field on commerce payment route decision record. */
  payment_intent_id: string;
  /** Provider account id field on commerce payment route decision record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment route decision record. */
  provider_code: string;
  /** Risk level field on commerce payment route decision record. */
  risk_level?: string;
  /** Route rule id field on commerce payment route decision record. */
  route_rule_id?: string;
  /** Scene code field on commerce payment route decision record. */
  scene_code: string;
  /** Tenant id field on commerce payment route decision record. */
  tenant_id: string;
}
