/** Commerce payment statement record schema exposed by Claw Router. */
export interface CommercePaymentStatementRecord {
  /** Created at field on commerce payment statement record. */
  created_at: string;
  /** Download status field on commerce payment statement record. */
  download_status: string;
  /** Downloaded at field on commerce payment statement record. */
  downloaded_at?: string;
  /** Fee amount field on commerce payment statement record. */
  fee_amount: string;
  /** File digest field on commerce payment statement record. */
  file_digest?: string;
  /** File ref field on commerce payment statement record. */
  file_ref?: string;
  /** Id field on commerce payment statement record. */
  id?: string;
  /** Idempotency key field on commerce payment statement record. */
  idempotency_key: string;
  /** Net amount field on commerce payment statement record. */
  net_amount: string;
  /** Organization id field on commerce payment statement record. */
  organization_id?: string;
  /** Parse status field on commerce payment statement record. */
  parse_status: string;
  /** Parsed at field on commerce payment statement record. */
  parsed_at?: string;
  /** Period end field on commerce payment statement record. */
  period_end: string;
  /** Period start field on commerce payment statement record. */
  period_start: string;
  /** Provider account id field on commerce payment statement record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment statement record. */
  provider_code: string;
  /** Provider statement id field on commerce payment statement record. */
  provider_statement_id?: string;
  /** Request no field on commerce payment statement record. */
  request_no: string;
  /** Row count field on commerce payment statement record. */
  row_count: string;
  /** Settlement currency field on commerce payment statement record. */
  settlement_currency: string;
  /** Statement no field on commerce payment statement record. */
  statement_no: string;
  /** Statement type field on commerce payment statement record. */
  statement_type: string;
  /** Tenant id field on commerce payment statement record. */
  tenant_id: string;
  /** Total amount field on commerce payment statement record. */
  total_amount: string;
  /** Updated at field on commerce payment statement record. */
  updated_at: string;
}
