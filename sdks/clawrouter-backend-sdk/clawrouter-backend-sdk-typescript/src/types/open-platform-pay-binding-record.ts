import type { JsonValue } from './json-value';

/** Open platform pay binding record schema exposed by Claw Router. */
export interface OpenPlatformPayBindingRecord {
  /** Account id field on open platform pay binding record. */
  account_id?: string;
  /** Created at field on open platform pay binding record. */
  created_at?: string;
  /** Data scope field on open platform pay binding record. */
  data_scope?: string;
  /** Deleted at field on open platform pay binding record. */
  deleted_at?: string;
  /** Deleted by field on open platform pay binding record. */
  deleted_by?: string;
  /** Id field on open platform pay binding record. */
  id?: string;
  /** Metadata field on open platform pay binding record. */
  metadata?: Record<string, JsonValue>;
  /** Mode field on open platform pay binding record. */
  mode?: string;
  /** Organization id field on open platform pay binding record. */
  organization_id?: string;
  /** Payment account id field on open platform pay binding record. */
  payment_account_id?: string;
  /** Payment channel id field on open platform pay binding record. */
  payment_channel_id?: string;
  /** Scene field on open platform pay binding record. */
  scene?: string;
  /** Status field on open platform pay binding record. */
  status?: string;
  /** Tenant id field on open platform pay binding record. */
  tenant_id?: string;
  /** Updated at field on open platform pay binding record. */
  updated_at?: string;
  /** Uuid field on open platform pay binding record. */
  uuid?: string;
  /** Version field on open platform pay binding record. */
  version?: string;
}
