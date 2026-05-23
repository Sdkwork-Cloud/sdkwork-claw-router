/** Commerce exchange rule record schema exposed by Claw Router. */
export interface CommerceExchangeRuleRecord {
  /** Created at field on commerce exchange rule record. */
  created_at: string;
  /** Idempotency key field on commerce exchange rule record. */
  idempotency_key: string;
  /** Organization id field on commerce exchange rule record. */
  organization_id?: string;
  /** Rate field on commerce exchange rule record. */
  rate: string;
  /** Remark field on commerce exchange rule record. */
  remark?: string;
  /** Request no field on commerce exchange rule record. */
  request_no: string;
  /** Rule no field on commerce exchange rule record. */
  rule_no: string;
  /** Source asset type field on commerce exchange rule record. */
  source_asset_type: string;
  /** Status field on commerce exchange rule record. */
  status: string;
  /** Target asset type field on commerce exchange rule record. */
  target_asset_type: string;
  /** Tenant id field on commerce exchange rule record. */
  tenant_id: string;
  /** Updated at field on commerce exchange rule record. */
  updated_at: string;
}
