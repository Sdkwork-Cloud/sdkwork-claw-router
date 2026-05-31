import type { JsonValue } from './json-value';

/** Commerce payment statement item record schema exposed by Claw Router. */
export interface CommercePaymentStatementItemRecord {
  /** Created at field on commerce payment statement item record. */
  created_at: string;
  /** Currency code field on commerce payment statement item record. */
  currency_code: string;
  /** Fee amount field on commerce payment statement item record. */
  fee_amount: string;
  /** Gross amount field on commerce payment statement item record. */
  gross_amount: string;
  /** Metadata json field on commerce payment statement item record. */
  metadata_json?: Record<string, JsonValue>;
  /** Native order no field on commerce payment statement item record. */
  native_order_no?: string;
  /** Native refund id field on commerce payment statement item record. */
  native_refund_id?: string;
  /** Native trade id field on commerce payment statement item record. */
  native_trade_id?: string;
  /** Net amount field on commerce payment statement item record. */
  net_amount: string;
  /** Occurred at field on commerce payment statement item record. */
  occurred_at: string;
  /** Organization id field on commerce payment statement item record. */
  organization_id?: string;
  /** Provider account id field on commerce payment statement item record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment statement item record. */
  provider_code: string;
  /** Provider status field on commerce payment statement item record. */
  provider_status?: string;
  /** Raw row digest field on commerce payment statement item record. */
  raw_row_digest: string;
  /** Row no field on commerce payment statement item record. */
  row_no: string;
  /** Sdkwork out refund no field on commerce payment statement item record. */
  sdkwork_out_refund_no?: string;
  /** Sdkwork out trade no field on commerce payment statement item record. */
  sdkwork_out_trade_no?: string;
  /** Settled at field on commerce payment statement item record. */
  settled_at?: string;
  /** Statement id field on commerce payment statement item record. */
  statement_id: string;
  /** Tenant id field on commerce payment statement item record. */
  tenant_id: string;
  /** Transaction type field on commerce payment statement item record. */
  transaction_type: string;
}
