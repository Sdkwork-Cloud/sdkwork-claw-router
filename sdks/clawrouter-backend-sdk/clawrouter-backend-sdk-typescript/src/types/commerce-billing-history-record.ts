import type { JsonValue } from './json-value';

/** Commerce billing history record schema exposed by Claw Router. */
export interface CommerceBillingHistoryRecord {
  /** Asset type field on commerce billing history record. */
  asset_type: string;
  /** Created at field on commerce billing history record. */
  created_at: string;
  /** Currency code field on commerce billing history record. */
  currency_code?: string;
  /** Direction field on commerce billing history record. */
  direction: string;
  /** History no field on commerce billing history record. */
  history_no: string;
  /** History type field on commerce billing history record. */
  history_type: string;
  /** Metadata json field on commerce billing history record. */
  metadata_json?: Record<string, JsonValue>;
  /** Occurred at field on commerce billing history record. */
  occurred_at: string;
  /** Organization id field on commerce billing history record. */
  organization_id?: string;
  /** Owner user id field on commerce billing history record. */
  owner_user_id: string;
  /** Payment method field on commerce billing history record. */
  payment_method?: string;
  /** Reference no field on commerce billing history record. */
  reference_no?: string;
  /** Related order id field on commerce billing history record. */
  related_order_id?: string;
  /** Related order no field on commerce billing history record. */
  related_order_no?: string;
  /** Source id field on commerce billing history record. */
  source_id: string;
  /** Source type field on commerce billing history record. */
  source_type: string;
  /** Status field on commerce billing history record. */
  status: string;
  /** Tenant id field on commerce billing history record. */
  tenant_id: string;
  /** Title field on commerce billing history record. */
  title: string;
  /** Updated at field on commerce billing history record. */
  updated_at: string;
}
